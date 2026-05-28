import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const endorsementSchema = z.object({
  name: z.string(),
  title: z.string(),
  relationship: z.string(),
  quote: z.string(),
  linkedin: z.string().url(),
  image: z.string(),
  text: z.string(),
});

export async function getEndorsements() {
  const file = path.join(process.cwd(), 'app/about/endorsements.yml');
  const entries = parseYaml(fs.readFileSync(file, 'utf8')) as unknown[];

  return Promise.all(
    entries.map(async (entry) => {
      const { image, ...rest } = endorsementSchema.parse(entry);
      return { ...rest, image: (await import(`./resources/${image}`)).default.src as string };
    }),
  );
}
