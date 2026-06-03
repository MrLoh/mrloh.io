import { NextResponse } from 'next/server';

import { listMetas } from '@/app/blog/repo';
import { DOMAIN } from '@/config';

export const dynamic = 'force-static';

export async function GET() {
  const base = `https://${DOMAIN}`;
  const posts = await listMetas();
  const lines = [
    '# Tobias Lohse',
    '',
    '> Software engineer with 10+ years turning AI capabilities into production systems — from ML models and agentic AI to data-intensive backends and web apps. This is the personal site of Tobias Lohse (mrloh.io), with a blog and resume.',
    '',
    '## About',
    '',
    `- [Resume (Markdown)](${base}/resume.md): Full resume — experience, skills, education, and recommendations.`,
    `- [About page](${base}/about): The same content as a web page.`,
    '',
    '## Blog',
    '',
    ...posts.map((post) => `- [${post.title}](${base}/blog/${post.slug}.md): ${post.description}`),
    '',
    '## Optional',
    '',
    `- [RSS feed](${base}/blog/feed.xml): Blog posts as RSS.`,
    '',
  ];
  return new NextResponse(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
