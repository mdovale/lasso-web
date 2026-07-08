import {
  mediaSchema,
  navigationSchema,
  newsSchema,
  pagesSchema,
  peopleSchema,
  projectsSchema,
  publicationsSchema,
  siteSchema,
  type MediaItem,
  type NewsItem,
  type Person,
  type Project,
  type Publication,
} from "@/lib/schemas";
import { loadYaml } from "./loader";

/*
 * Typed accessors for every content file. Pages and components must go
 * through these functions — never read YAML or hardcode research content
 * in components.
 */

export const getSite = () => loadYaml("site.yaml", siteSchema);
export const getNavigation = () => loadYaml("navigation.yaml", navigationSchema);
export const getPages = () => loadYaml("pages.yaml", pagesSchema);
export const getPeopleData = () => loadYaml("people.yaml", peopleSchema);
export const getProjectsData = () => loadYaml("projects.yaml", projectsSchema);
export const getPublicationsData = () => loadYaml("publications.yaml", publicationsSchema);
export const getNewsData = () => loadYaml("news.yaml", newsSchema);
export const getMediaData = () => loadYaml("media.yaml", mediaSchema);

/* ---------- Convenience selectors ---------- */

const byOrder = <T extends { order?: number }>(items: T[]): T[] =>
  items
    .map((item, i) => ({ item, i }))
    .sort(
      (a, b) =>
        (a.item.order ?? a.i) - (b.item.order ??  b.i) || a.i - b.i,
    )
    .map(({ item }) => item);

export function getProjects(): Project[] {
  return byOrder(getProjectsData().projects);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

export function getPeople(): Person[] {
  return getPeopleData().people;
}

export function getPersonById(id: string): Person | undefined {
  return getPeople().find((p) => p.id === id);
}

/** People grouped by section (faculty, students, ...) in configured order. */
export function getPeopleByGroup(): { id: string; title: string; people: Person[] }[] {
  const data = getPeopleData();
  return data.groups.map((group) => ({
    ...group,
    people: byOrder(data.people.filter((p) => p.group === group.id)),
  }));
}

/** Publications, newest first (then by file order). */
export function getPublications(): Publication[] {
  return [...getPublicationsData().publications].sort((a, b) => b.year - a.year);
}

export function getPublicationById(id: string): Publication | undefined {
  return getPublicationsData().publications.find((p) => p.id === id);
}

export function getFeaturedPublications(): Publication[] {
  return getPublications().filter((p) => p.featured);
}

/** News items, newest first. */
export function getNews(): NewsItem[] {
  return [...getNewsData().items].sort((a, b) => b.date.localeCompare(a.date));
}

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return getNewsData().items.find((n) => n.slug === slug);
}

/** Media items, featured first. */
export function getMedia(): MediaItem[] {
  return [...getMediaData().items].sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );
}

export function getMediaById(id: string): MediaItem | undefined {
  return getMediaData().items.find((m) => m.id === id);
}
