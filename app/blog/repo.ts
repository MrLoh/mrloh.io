import 'server-only';

import fs from 'fs/promises';
import { z } from 'zod';

const blogPostFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string().date(),
});

type BlogPostFrontmatter = z.infer<typeof blogPostFrontmatterSchema>;

type BlogPostMeta = BlogPostFrontmatter & {
  slug: string;
};

export function getPath(slug: string) {
  return `@/blog/${slug}.mdx`;
}

export async function listPosts(): Promise<BlogPostMeta[]> {
  const files = await fs.readdir('./blog');
  return Promise.all(
    files.map(async (file) => {
      const slug = file.replace('.mdx', '');
      const path = getPath(slug);
      const { frontmatter } = await import(path);
      const parsedFrontmatter = blogPostFrontmatterSchema.parse(frontmatter);
      return { slug, ...parsedFrontmatter };
    }),
  );
}

export async function getComponent(slug: string): Promise<React.ComponentType> {
  const path = getPath(slug);
  const { default: Component } = await import(path);
  return Component;
}

export async function getPost(slug: string): Promise<BlogPostMeta> {
  const path = getPath(slug);
  const { frontmatter } = await import(path);
  const parsedFrontmatter = blogPostFrontmatterSchema.parse(frontmatter);
  return { slug, ...parsedFrontmatter };
}
