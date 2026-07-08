import { z } from "zod";
import { assetPathSchema, idSchema } from "./common";

export const mediaTypeSchema = z.enum([
  "image", // ordinary photograph or figure
  "video", // local .mp4 under public/media, or a YouTube/Vimeo URL
  "animation", // animated render or simulation clip
  "generated", // computer-generated graphic / visualization
  "lab-photo", // photo taken in the lab
  "render", // CAD or optical render
]);

const mediaItemSchema = z.object({
  /** Unique id used for cross-references, e.g. "omis-resonator-photo" */
  id: idSchema,
  title: z.string().min(1),
  type: mediaTypeSchema,
  /**
   * File under public/ (e.g. "/media/resonator.jpg") or an external URL.
   * For videos, YouTube and Vimeo URLs are embedded automatically.
   */
  src: assetPathSchema,
  /** Poster/thumbnail image for videos */
  thumbnail: assetPathSchema.optional(),
  caption: z.string().optional(),
  /** Alt text for screen readers — please always provide it for images */
  alt: z.string().min(1),
  /** Photographer / creator credit */
  credit: z.string().optional(),
  /** Slug of the related project (must exist in projects.yaml) */
  project: idSchema.optional(),
  /** Featured items appear first in the gallery */
  featured: z.boolean().default(false),
});

/** Schema for content/media.yaml */
export const mediaSchema = z.object({
  items: z.array(mediaItemSchema).min(1),
});

export type MediaType = z.infer<typeof mediaTypeSchema>;
export type MediaItem = z.infer<typeof mediaItemSchema>;
export type Media = z.infer<typeof mediaSchema>;
