import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
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
  scopes: z.array(z.string()).min(1),
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

const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  technologies: z.array(z.string()),
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

export async function getContent() {
  const file = path.join(process.cwd(), 'app/about/about.yml');
  const { location, intro, personal, experiences, skills, education, openSource, endorsements } = z
    .object({
      location: z.string(),
      intro: z.string(),
      personal: z.string(),
      experiences: z.array(experienceSchema),
      skills: z.array(skillSchema),
      education: educationSchema,
      openSource: z.string(),
      endorsements: z.array(endorsementSchema),
    })
    .parse(parseYaml(fs.readFileSync(file, 'utf8')));

  const skillYears = Object.fromEntries(
    skills.map(({ id }) => [
      id,
      experiences
        .filter(({ scopes }) => scopes.includes(id))
        .map(({ positions }) =>
          positions.at(0)!.start.until(positions.at(-1)!.end ?? Temporal.Now.plainDateISO()),
        )
        .reduce((acc, range) => acc.add(range), Temporal.Duration.from({ months: 0 })),
    ]),
  );

  return {
    location,
    intro,
    personal,
    experiences: await Promise.all(
      experiences.map(async ({ logo, ...rest }) => ({
        ...rest,
        logo: logo ? ((await import(`./resources/${logo}`)).default.src as string) : undefined,
      })),
    ),
    skills: skills.map((skill) => ({ ...skill, duration: skillYears[skill.id]! })),
    education: {
      summary: education.summary,
      institutions: await Promise.all(
        education.institutions.map(async ({ logo, ...rest }) => ({
          ...rest,
          logo: (await import(`./resources/${logo}`)).default.src as string,
        })),
      ),
    },
    openSource,
    endorsements: await Promise.all(
      endorsements.map(async ({ image, ...rest }) => ({
        ...rest,
        image: (await import(`./resources/${image}`)).default.src as string,
      })),
    ),
  };
}

export type Content = Awaited<ReturnType<typeof getContent>>;
