import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import type { StaticImageData } from 'next/image';
import { Temporal } from 'temporal-polyfill-lite';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => Temporal.PlainDate.from(value));

const experienceSchema = z.object({
  company: z.string(),
  logo: z.string().optional(),
  linkedin: z.string().url().optional(),
  location: z.string(),
  positions: z
    .array(z.object({ title: z.string(), start: dateSchema, end: dateSchema.optional() }))
    .min(1),
  summary: z.string(),
  details: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});
export type Experience = z.infer<typeof experienceSchema>;

const endorsementSchema = z.object({
  name: z.string(),
  title: z.string(),
  relationship: z.string(),
  quote: z.string(),
  linkedin: z.string().url(),
  image: z.string(),
  text: z.string(),
});
export type Endorsement = z.infer<typeof endorsementSchema>;

const skillsSchema = z.object({
  intro: z.string(),
  areas: z.array(
    z.object({
      name: z.string(),
      since: dateSchema,
      description: z.string(),
      technologies: z.array(z.string()),
    }),
  ),
});

const educationSchema = z.object({
  summary: z.string(),
  institutions: z
    .array(
      z.object({
        name: z.string(),
        logo: z.string(),
        url: z.string().url(),
        description: z.string(),
      }),
    )
    .min(1),
});

const importImage = async (path: string) => {
  const { default: image } = await import(`./resources/${path}`);
  return image as StaticImageData;
};

export async function getContent() {
  const file = path.join(process.cwd(), 'app/about/about.yml');
  const { location, intro, personal, experiences, skills, education, openSource, endorsements } = z
    .object({
      location: z.string(),
      intro: z.string(),
      personal: z.string(),
      experiences: z.array(experienceSchema),
      skills: skillsSchema,
      education: educationSchema,
      openSource: z.string(),
      endorsements: z.array(endorsementSchema),
    })
    .parse(parseYaml(fs.readFileSync(file, 'utf8')));

  return {
    location,
    intro,
    personal,
    experiences: await Promise.all(
      experiences.map(async ({ logo, ...rest }) => ({
        ...rest,
        logo: logo ? await importImage(logo) : undefined,
      })),
    ),
    skills: {
      intro: skills.intro,
      areas: skills.areas.map(({ since, ...skill }) => ({
        ...skill,
        duration: since.until(Temporal.Now.plainDateISO(), {
          smallestUnit: 'years',
          largestUnit: 'years',
          roundingMode: 'halfExpand',
        }),
      })),
    },
    education: {
      summary: education.summary,
      institutions: await Promise.all(
        education.institutions.map(async ({ logo, ...rest }) => ({
          ...rest,
          logo: await importImage(logo),
        })),
      ),
    },
    openSource,
    endorsements: await Promise.all(
      endorsements.map(async ({ image, ...rest }) => ({
        ...rest,
        image: await importImage(image),
      })),
    ),
  };
}

export type Content = Awaited<ReturnType<typeof getContent>>;
