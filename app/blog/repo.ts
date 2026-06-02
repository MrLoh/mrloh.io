import 'server-only';

import fs from 'fs/promises';
import { Temporal } from 'temporal-polyfill-lite';
import { z } from 'zod';

const blogPostFrontmatterSchema = z.object({
  title: z.string(),
  date: z
    .string()
    .date()
    .transform((date) => Temporal.PlainDate.from(date)),
  description: z.string(),
  blueskyId: z.string().optional(),
});

type BlogPostMeta = z.infer<typeof blogPostFrontmatterSchema> & { slug: string };

export async function listSlugs(): Promise<string[]> {
  const files = await fs.readdir('./blog');
  return files.filter((file) => file.endsWith('.mdx')).map((file) => file.replace(/\.mdx$/, ''));
}

export async function getMeta(slug: string): Promise<BlogPostMeta> {
  const { frontmatter } = await import(`@/blog/${slug}.mdx`);
  const parsedFrontmatter = blogPostFrontmatterSchema.parse(frontmatter);
  return { slug, ...parsedFrontmatter };
}

export async function listMetas(): Promise<BlogPostMeta[]> {
  const slugs = await listSlugs();
  const metas = await Promise.all(slugs.map(getMeta));
  return metas.sort((a, b) => Temporal.PlainDate.compare(b.date, a.date));
}
