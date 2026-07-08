import { z } from "zod";
import { assetPathSchema, dateSchema, idSchema } from "./common";

const newsItemSchema = z.object({
  /** URL slug: the post will live at /news/<slug> */
  slug: idSchema,
  title: z.string().min(1),
  date: dateSchema,
  /** One–two sentence summary shown on cards */
  summary: z.string().min(1),
  /**
   * Full post body. Separate paragraphs with a blank line. Supports
   * **bold**, *italics*, and [links](https://...).
   */
  body: z.string().min(1),
  /** Optional image under public/, e.g. "/images/news/lisa-award.jpg" */
  image: assetPathSchema.optional(),
  /** Ids of related people (must exist in people.yaml) */
  people: z.array(idSchema).default([]),
  /** Slugs of related projects (must exist in projects.yaml) */
  projects: z.array(idSchema).default([]),
  /** Ids of related media items (must exist in media.yaml) */
  media: z.array(idSchema).default([]),
  tags: z.array(z.string().min(1)).default([]),
});

/** Schema for content/news.yaml */
export const newsSchema = z.object({
  items: z.array(newsItemSchema).min(1),
});

export type NewsItem = z.infer<typeof newsItemSchema>;
export type News = z.infer<typeof newsSchema>;
