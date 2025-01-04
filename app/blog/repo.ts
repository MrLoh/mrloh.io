import 'server-only';

import fs from 'fs/promises';
import { z } from 'zod';

const blogPostFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string().date(),
});

type BlogPostMeta = z.infer<typeof blogPostFrontmatterSchema> & {
  slug: string;
};

export async function listSlugs(): Promise<string[]> {
  const files = await fs.readdir('./blog');
  return files.map((file) => file.replace('.mdx', ''));
}

export async function getMeta(slug: string): Promise<BlogPostMeta> {
  const { frontmatter } = await import(`@/blog/${slug}.mdx`);
  const parsedFrontmatter = blogPostFrontmatterSchema.parse(frontmatter);
  return { slug, ...parsedFrontmatter };
}

export async function listMetas(): Promise<BlogPostMeta[]> {
  const files = await fs.readdir('./blog');
  return Promise.all(files.map(async (file) => getMeta(file.replace('.mdx', ''))));
}
