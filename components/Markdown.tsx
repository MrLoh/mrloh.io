import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { Fragment } from 'react';
import { jsx, jsxs } from 'react/jsx-runtime';
import rehypeReact from 'rehype-react';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import { twMerge } from 'tailwind-merge';

const MarkdownLink = ({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) =>
  href.startsWith('/') || href.startsWith('#') ? (
    <Link href={href} {...props} />
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
  );

export async function Markdown({ source, className }: { source: string; className?: string }) {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeReact, { Fragment, jsx, jsxs, components: { a: MarkdownLink } })
    .process(source);

  return (
    <div
      className={twMerge(
        'space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300',
        '[&_a]:font-medium [&_a]:text-zinc-800 [&_a]:underline [&_a]:decoration-zinc-300 [&_a]:underline-offset-2',
        '[&_a]:transition [&_a:hover]:decoration-teal-500',
        'dark:[&_a]:text-zinc-200 dark:[&_a]:decoration-zinc-600 dark:[&_a:hover]:decoration-teal-400',
        className,
      )}
    >
      {file.result as ReactElement}
    </div>
  );
}
