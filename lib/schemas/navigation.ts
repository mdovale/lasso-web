import { z } from "zod";

const navItemSchema = z.object({
  label: z.string().min(1),
  /** Internal path ("/research") or external URL */
  href: z.string().min(1),
});

/** Schema for content/navigation.yaml — header and footer link lists. */
export const navigationSchema = z.object({
  /** Main header navigation, in display order */
  main: z.array(navItemSchema).min(1),
  /** Prominent call-to-action button in the header (e.g. "Join Us") */
  cta: navItemSchema.optional(),
  /** Footer link columns */
  footer: z
    .array(
      z.object({
        title: z.string().min(1),
        items: z.array(navItemSchema).min(1),
      }),
    )
    .default([]),
});

export type Navigation = z.infer<typeof navigationSchema>;
export type NavItem = z.infer<typeof navItemSchema>;
