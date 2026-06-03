import { NextResponse } from 'next/server';

import { getContent } from '@/app/about/repo';
import { formatYearMonth } from '@/utils/formatting';

// A clean, single-source-of-truth Markdown resume rendered from about.yml, for
// agents (and as a lossless companion to the binary /resume.pdf).
export async function getResumeMarkdown(): Promise<string> {
  const { location, intro, experiences, education, openSource, endorsements } = await getContent();
  const lines: string[] = [
    `# Tobias Lohse`,
    '',
    `> Software Engineer · ${location}`,
    '',
    intro.trim(),
  ];

  lines.push('', '## Experience');
  for (const { company, linkedin, location, positions, summary, details, skills } of experiences) {
    const name = linkedin ? `[${company}](${linkedin})` : company;
    lines.push('', `### ${name} — ${location}`);
    for (const { title, start, end } of positions) {
      const range = `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : 'Present'}`;
      lines.push(`- **${title}** · ${range}`);
    }
    lines.push('', summary.trim());
    if (details?.length) lines.push('', ...details.map((detail) => `- ${detail}`));
    if (skills?.length) lines.push('', `**Skills:** ${skills.join(', ')}`);
  }

  lines.push('', '## Education', '', education.summary.trim(), '');
  for (const { name, url, description } of education.institutions) {
    lines.push(`- **[${name}](${url})** — ${description}`);
  }

  lines.push('', '## Open Source', '', openSource.trim());

  lines.push('', '## What People Say');
  for (const { quote, text, name, title, relationship } of endorsements) {
    const paragraphs = text
      .split('\n')
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    const blockquote = [`**${quote}**`, ...paragraphs, `— **${name}**, ${title} (${relationship})`]
      .map((line) => `> ${line}`)
      .join('\n>\n');
    lines.push('', blockquote);
  }

  return `${lines.join('\n')}\n`;
}

export const dynamic = 'force-static';

export async function GET() {
  const markdown = await getResumeMarkdown();
  return new NextResponse(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
