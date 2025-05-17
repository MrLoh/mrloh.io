import fs from 'fs/promises';
import path from 'path';
import { Temporal } from '@js-temporal/polyfill';
import { Feed } from 'feed';
import { NextResponse } from 'next/server';
import rehypeStringify from 'rehype-stringify';
import { remark } from 'remark';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

import { SITE_URL } from '@/config';

import { listMetas } from '../repo';

const getHtmlContent = async (slug: string): Promise<string> => {
  const filePath = path.join(process.cwd(), 'blog', `${slug}.mdx`);
  const content = await fs.readFile(filePath, 'utf-8');
  const result = await remark()
    .use(remarkGfm)
    .use(remarkFrontmatter)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
  return result.toString();
};

export const dynamic = 'force-static';

export async function GET() {
  const feed = new Feed({
    title: 'MrLoh.io Blog',
    description: 'Thoughts on software engineering, product design, startups, business, and life',
    id: SITE_URL,
    link: SITE_URL,
    language: 'en',
    favicon: `${SITE_URL}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} Tobias Lohse`,
    feedLinks: { rss: `${SITE_URL}/blog/feed.xml` },
    author: { name: 'Tobias Lohse', link: SITE_URL },
  });

  const posts = await listMetas();
  posts.sort((a, b) => Temporal.PlainDate.compare(b.date, a.date));
  await Promise.all(
    posts.map(async (post) => {
      feed.addItem({
        title: post.title,
        id: `${SITE_URL}/blog/${post.slug}`,
        link: `${SITE_URL}/blog/${post.slug}`,
        description: post.description,
        date: new Date(post.date.toPlainDateTime('12:00').toZonedDateTime('UTC').epochMilliseconds),
        content: await getHtmlContent(post.slug),
      });
    }),
  );

  return new NextResponse(feed.rss2(), { headers: { 'Content-Type': 'application/rss+xml' } });
}
