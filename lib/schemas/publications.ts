import { z } from "zod";
import { assetPathSchema, idSchema } from "./common";

const publicationSchema = z.object({
  /** Unique id used for cross-references, e.g. "guzman-2019-omis" */
  id: idSchema,
  title: z.string().min(1),
  /** Author names in publication order, e.g. ["A. S. Author", "B. Author"] */
  authors: z.array(z.string().min(1)).min(1),
  year: z.number().int().gte(1900).lte(2100),
  /** Journal or conference name */
  venue: z.string().min(1),
  /** Volume / issue / pages / article number, e.g. "vol. 58, 072003" */
  volumePages: z.string().optional(),
  /** DOI only (no URL prefix), e.g. "10.1364/AO.58.000072" */
  doi: z.string().optional(),
  /** Full arXiv URL, e.g. "https://arxiv.org/abs/2104.01234" */
  arxiv: z.string().url().optional(),
  /** Direct PDF: a path under public/ or an external URL */
  pdf: assetPathSchema.optional(),
  /** Any other link (publisher page etc.) */
  url: z.string().url().optional(),
  /** Topic tags matching project tags where possible */
  tags: z.array(z.string().min(1)).default([]),
  /** Featured publications appear on the homepage */
  featured: z.boolean().default(false),
  /** Optional preformatted citation text */
  citation: z.string().optional(),
});

/** Schema for content/publications.yaml */
export const publicationsSchema = z.object({
  publications: z.array(publicationSchema).min(1),
});

export type Publication = z.infer<typeof publicationSchema>;
export type Publications = z.infer<typeof publicationsSchema>;
