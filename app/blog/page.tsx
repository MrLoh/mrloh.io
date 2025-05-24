import type { Temporal } from '@js-temporal/polyfill';
import Link from 'next/link';
import { twJoin } from 'tailwind-merge';

import { listMetas } from './repo';

function Post({
  title,
  date,
  description,
  slug,
}: {
  title: string;
  date: Temporal.PlainDate;
  description: string;
  slug: string;
}) {
  return (
    <Link
      href={`/blog/${slug}`}
      className={twJoin(
        'group mb-4 flex flex-col',
        'rounded-lg px-4 py-3 transition-all',
        'hover:bg-zinc-100 focus:bg-zinc-100',
        'dark:hover:bg-zinc-800/50 dark:focus:bg-zinc-800/50',
        'outline-teal-500',
      )}
    >
      <h2
        className={twJoin(
          'mt-0.5 mb-1 text-xl font-extrabold text-zinc-800 italic transition-all dark:text-zinc-200',
          'group-hover:text-teal-500 group-focus:text-teal-500',
          'dark:group-hover:text-teal-400 dark:group-focus:text-teal-400',
        )}
      >
        {title}
      </h2>
      <time
        className={twJoin(
          'order-first mb-1 text-xs font-bold text-zinc-500 uppercase transition-all dark:text-zinc-400',
          'group-hover:text-teal-800 group-focus:text-teal-800',
          'dark:group-hover:text-teal-200 dark:group-focus:text-teal-200',
        )}
      >
        {date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>
      <p
        className={twJoin(
          'text-sm text-zinc-700 transition-all dark:text-zinc-300',
          'group-hover:text-teal-900 group-focus:text-teal-900',
          'dark:group-hover:text-teal-50 dark:group-focus:text-teal-50',
        )}
      >
        {description}
      </p>
    </Link>
  );
}

export default async function BlogHomePage() {
  const blogPosts = await listMetas();
  return (
    <div className="flex max-w-2xl flex-col">
      <p className="mx-4 mt-4 mb-6 border-b border-zinc-300 pb-6 text-center text-sm text-zinc-400 italic dark:border-zinc-600 dark:text-zinc-500">
        thoughts on software engineering, product design, startups, business, and life
      </p>
      {blogPosts.map((post) => (
        <Post key={post.slug} {...post} />
      ))}
      <p className="mx-4 mt-4 border-t border-zinc-300 pt-6 text-center text-sm text-zinc-400 italic dark:border-zinc-600 dark:text-zinc-500">
        more posts coming soon
      </p>
    </div>
  );
}
