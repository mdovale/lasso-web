import { z } from "zod";
import { assetPathSchema, idSchema, linkSchema } from "./common";

const personSchema = z.object({
  /** Unique id used to reference this person from projects/news, e.g. "felipe-guzman" */
  id: idSchema,
  name: z.string().min(1),
  /** Position title, e.g. "Professor & Principal Investigator" */
  role: z.string().min(1),
  /** Which group section they appear under; must match a group id below */
  group: idSchema,
  affiliation: z.string().optional(),
  /** Short biography (a few sentences; supports **bold** and [links](url)) */
  bio: z.string().optional(),
  /** Path to headshot under public/, e.g. "/images/people/felipe-guzman.jpg" */
  headshot: assetPathSchema.optional(),
  email: z.string().email().optional(),
  /** External profiles: Google Scholar, ORCID, personal site, ... */
  links: z.array(linkSchema).default([]),
  /** e.g. "2021" or "2021–2024"; shown for alumni */
  years: z.string().optional(),
  /** Where an alumnus went next, e.g. "Now at NASA Goddard" */
  currentPosition: z.string().optional(),
  /** Lower numbers appear first within a group (defaults to file order) */
  order: z.number().int().optional(),
});

/** Schema for content/people.yaml — group sections plus every member entry. */
export const peopleSchema = z.object({
  /** Section headings, in display order (e.g. Faculty, Postdocs, Students, Alumni) */
  groups: z
    .array(
      z.object({
        id: idSchema,
        title: z.string().min(1),
      }),
    )
    .min(1),
  people: z.array(personSchema).min(1),
});

export type Person = z.infer<typeof personSchema>;
export type People = z.infer<typeof peopleSchema>;
