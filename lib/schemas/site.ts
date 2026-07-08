import { z } from "zod";
import { linkSchema } from "./common";

/** Schema for content/site.yaml — global site identity, SEO, and contact details. */
export const siteSchema = z.object({
  /** Full group name, e.g. "Laboratory of Space Systems and Optomechanics" */
  name: z.string().min(1),
  /** Short name / acronym used in the header, e.g. "LASSO" */
  shortName: z.string().min(1),
  /** One-line tagline shown on the homepage hero */
  tagline: z.string().min(1),
  /** 1–2 sentence description used for SEO and social previews */
  description: z.string().min(1),
  /** Canonical production URL (no trailing slash), used for sitemap + Open Graph */
  url: z.string().url(),
  university: z.string().min(1),
  department: z.string().min(1),
  /** Optional path to a social-preview image under public/ */
  ogImage: z.string().optional(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    addressLines: z.array(z.string()).min(1),
    /** Link to an external map (Google Maps etc.) */
    mapUrl: z.string().url().optional(),
  }),
  /** Social / external profiles listed in the footer */
  social: z.array(linkSchema).default([]),
  footer: z.object({
    /** Short blurb shown in the footer next to the group name */
    blurb: z.string().min(1),
    /** Funding / acknowledgement line, e.g. sponsors */
    acknowledgement: z.string().optional(),
  }),
});

export type Site = z.infer<typeof siteSchema>;
