import { z } from "zod";
import { linkSchema } from "./common";

/**
 * Schema for content/pages.yaml — editable copy for pages that are mostly
 * text (home intro, join us, contact) so no prose lives inside components.
 * Fields marked "rich text" support **bold**, *italics*, [links](url), and
 * blank lines between paragraphs.
 */
export const pagesSchema = z.object({
  home: z.object({
    /** Small label above the hero headline, e.g. "University of Arizona" */
    eyebrow: z.string().min(1),
    /** Hero headline. Use a newline to control the line break. */
    headline: z.string().min(1),
    /** Sub-headline paragraph under the hero headline */
    intro: z.string().min(1),
    /** Headline metrics, e.g. picometer sensitivity — keep to 3–4 items */
    stats: z
      .array(
        z.object({
          value: z.string().min(1),
          label: z.string().min(1),
        }),
      )
      .default([]),
    /** Section heading + text introducing the research areas */
    researchIntro: z.object({
      title: z.string().min(1),
      text: z.string().min(1),
    }),
    /** Closing call-to-action band */
    callout: z.object({
      title: z.string().min(1),
      text: z.string().min(1),
      button: linkSchema,
    }),
  }),
  research: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  publications: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  people: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  news: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  media: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
  }),
  join: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
    /** Rich text describing why to join the group */
    body: z.string().min(1),
    /** Open positions; keep the list current or empty */
    openings: z
      .array(
        z.object({
          title: z.string().min(1),
          type: z.string().min(1), // e.g. "PhD position", "Postdoc"
          description: z.string().min(1),
          applyUrl: z.string().url().optional(),
        }),
      )
      .default([]),
    /** How-to-apply instructions (rich text) */
    howToApply: z.string().min(1),
  }),
  contact: z.object({
    title: z.string().min(1),
    intro: z.string().min(1),
    /** Extra directions, parking info, etc. (rich text) */
    visitNotes: z.string().optional(),
  }),
});

export type Pages = z.infer<typeof pagesSchema>;
