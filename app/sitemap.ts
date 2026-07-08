import type { MetadataRoute } from "next";
import { getNews, getProjects, getSite } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSite().url;

  const staticPages = [
    "",
    "/research",
    "/publications",
    "/people",
    "/news",
    "/media",
    "/join",
    "/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
  }));

  const projectPages = getProjects().map((project) => ({
    url: `${base}/research/${project.slug}`,
    changeFrequency: "monthly" as const,
  }));

  const newsPages = getNews().map((item) => ({
    url: `${base}/news/${item.slug}`,
    lastModified: new Date(`${item.date}T00:00:00Z`),
    changeFrequency: "yearly" as const,
  }));

  return [...staticPages, ...projectPages, ...newsPages];
}
