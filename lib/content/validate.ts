import fs from "node:fs";
import path from "node:path";
import {
  getMediaData,
  getNavigation,
  getNewsData,
  getPages,
  getPeopleData,
  getProjectsData,
  getPublicationsData,
  getSite,
} from "./index";

export interface ValidationProblem {
  file: string;
  message: string;
}

/**
 * Checks that span multiple files: cross-references between people, projects,
 * publications, news, and media, plus existence of referenced local assets.
 * Schema validation itself happens in the loaders.
 */
export function validateCrossReferences(): ValidationProblem[] {
  const problems: ValidationProblem[] = [];
  const publicDir = path.join(process.cwd(), "public");

  const people = getPeopleData();
  const projects = getProjectsData().projects;
  const publications = getPublicationsData().publications;
  const news = getNewsData().items;
  const media = getMediaData().items;

  const personIds = new Set(people.people.map((p) => p.id));
  const groupIds = new Set(people.groups.map((g) => g.id));
  const projectSlugs = new Set(projects.map((p) => p.slug));
  const publicationIds = new Set(publications.map((p) => p.id));
  const mediaIds = new Set(media.map((m) => m.id));

  const checkUnique = (file: string, kind: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) {
        problems.push({ file, message: `duplicate ${kind} "${id}"` });
      }
      seen.add(id);
    }
  };

  checkUnique(
    "people.yaml",
    "person id",
    people.people.map((p) => p.id),
  );
  checkUnique(
    "projects.yaml",
    "project slug",
    projects.map((p) => p.slug),
  );
  checkUnique(
    "publications.yaml",
    "publication id",
    publications.map((p) => p.id),
  );
  checkUnique(
    "news.yaml",
    "news slug",
    news.map((n) => n.slug),
  );
  checkUnique(
    "media.yaml",
    "media id",
    media.map((m) => m.id),
  );

  const checkAsset = (file: string, owner: string, asset?: string) => {
    if (!asset || !asset.startsWith("/")) return; // external URLs not checked
    if (!fs.existsSync(path.join(publicDir, asset))) {
      problems.push({
        file,
        message: `${owner}: file "${asset}" does not exist under public/`,
      });
    }
  };

  for (const person of people.people) {
    if (!groupIds.has(person.group)) {
      problems.push({
        file: "people.yaml",
        message: `person "${person.id}": unknown group "${person.group}" (add it to the groups list)`,
      });
    }
    checkAsset("people.yaml", `person "${person.id}"`, person.headshot);
  }

  for (const project of projects) {
    for (const pid of project.people) {
      if (!personIds.has(pid)) {
        problems.push({
          file: "projects.yaml",
          message: `project "${project.slug}": unknown person "${pid}"`,
        });
      }
    }
    for (const pub of project.publications) {
      if (!publicationIds.has(pub)) {
        problems.push({
          file: "projects.yaml",
          message: `project "${project.slug}": unknown publication "${pub}"`,
        });
      }
    }
    for (const m of project.media) {
      if (!mediaIds.has(m)) {
        problems.push({
          file: "projects.yaml",
          message: `project "${project.slug}": unknown media item "${m}"`,
        });
      }
    }
    checkAsset("projects.yaml", `project "${project.slug}"`, project.image);
  }

  for (const item of news) {
    for (const pid of item.people) {
      if (!personIds.has(pid)) {
        problems.push({
          file: "news.yaml",
          message: `news "${item.slug}": unknown person "${pid}"`,
        });
      }
    }
    for (const slug of item.projects) {
      if (!projectSlugs.has(slug)) {
        problems.push({
          file: "news.yaml",
          message: `news "${item.slug}": unknown project "${slug}"`,
        });
      }
    }
    for (const m of item.media) {
      if (!mediaIds.has(m)) {
        problems.push({
          file: "news.yaml",
          message: `news "${item.slug}": unknown media item "${m}"`,
        });
      }
    }
    checkAsset("news.yaml", `news "${item.slug}"`, item.image);
  }

  for (const item of media) {
    if (item.project && !projectSlugs.has(item.project)) {
      problems.push({
        file: "media.yaml",
        message: `media "${item.id}": unknown project "${item.project}"`,
      });
    }
    checkAsset("media.yaml", `media "${item.id}"`, item.src);
    checkAsset("media.yaml", `media "${item.id}"`, item.thumbnail);
  }

  for (const pub of publications) {
    checkAsset("publications.yaml", `publication "${pub.id}"`, pub.pdf);
  }

  // Internal navigation links must point at real routes.
  const nav = getNavigation();
  const knownRoutes = new Set([
    "/",
    "/research",
    "/publications",
    "/people",
    "/news",
    "/media",
    "/join",
    "/contact",
  ]);
  const navItems = [
    ...nav.main,
    ...(nav.cta ? [nav.cta] : []),
    ...nav.footer.flatMap((col) => col.items),
  ];
  for (const item of navItems) {
    if (item.href.startsWith("/") && !knownRoutes.has(item.href)) {
      const isDetail =
        /^\/(research|news)\/[a-z0-9-]+$/.test(item.href) &&
        (projectSlugs.has(item.href.split("/")[2]) ||
          news.some((n) => n.slug === item.href.split("/")[2]));
      if (!isDetail) {
        problems.push({
          file: "navigation.yaml",
          message: `link "${item.label}" points to unknown page "${item.href}"`,
        });
      }
    }
  }

  // Touch the remaining files so schema errors surface here too.
  getSite();
  getPages();

  return problems;
}
