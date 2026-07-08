import { z } from "zod";
import { assetPathSchema, idSchema, linkSchema } from "./common";

const projectSchema = z.object({
  /** URL slug: the project page will live at /research/<slug> */
  slug: idSchema,
  title: z.string().min(1),
  /** One–two sentence teaser shown on cards and the research overview */
  summary: z.string().min(1),
  /**
   * Long description shown on the project page. Separate paragraphs with a
   * blank line. Supports **bold**, *italics*, and [links](https://...).
   */
  description: z.string().min(1),
  status: z.enum(["active", "completed", "planned"]),
  /** Topic tags, e.g. ["interferometry", "space missions"] */
  tags: z.array(z.string().min(1)).default([]),
  /** Ids of people involved (must exist in people.yaml) */
  people: z.array(idSchema).default([]),
  /** Featured image under public/, e.g. "/images/projects/omis.jpg" */
  image: assetPathSchema.optional(),
  /** Ids of related publications (must exist in publications.yaml) */
  publications: z.array(idSchema).default([]),
  /** Ids of related media items (must exist in media.yaml) */
  media: z.array(idSchema).default([]),
  /** External links: mission pages, partner labs, code repositories, ... */
  links: z.array(linkSchema).default([]),
  /** Featured projects appear on the homepage */
  featured: z.boolean().default(false),
  /** Lower numbers appear first (defaults to file order) */
  order: z.number().int().optional(),
});

/** Schema for content/projects.yaml */
export const projectsSchema = z.object({
  projects: z.array(projectSchema).min(1),
});

export type Project = z.infer<typeof projectSchema>;
export type Projects = z.infer<typeof projectsSchema>;
