import { z } from "zod";

/** A labelled hyperlink, e.g. { label: "Google Scholar", url: "https://..." } */
export const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
});

export type Link = z.infer<typeof linkSchema>;

/** Slug/id used for cross-references between content files: lowercase, digits, hyphens. */
export const idSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "must be a lowercase slug (letters, numbers, hyphens), e.g. 'felipe-guzman'",
  );

/** Calendar date written as YYYY-MM-DD. */
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be a date in YYYY-MM-DD format, e.g. '2026-03-14'");

/**
 * Path to a file under `public/` (must start with "/"), or a full https URL.
 * Example: "/images/people/jane-doe.jpg"
 */
export const assetPathSchema = z
  .string()
  .refine(
    (v) => v.startsWith("/") || v.startsWith("https://") || v.startsWith("http://"),
    "must start with '/' (a file under public/) or be a full URL",
  );
