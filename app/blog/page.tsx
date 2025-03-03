import Link from 'next/link';
import { twJoin } from 'tailwind-merge';

import { listMetas } from './repo';

export default async function BlogHomePage() {
  const blogPosts = await listMetas();
  return (
    <div className="flex max-w-160 flex-col">
      <div className="mx-4 mt-6 mb-2">
        <p className="text-sm text-zinc-500/85 italic">
          This is a collection of my thoughts on software development, design, and other topics. I
          mostly write this for myself, but you may find something useful.
        </p>
      </div>
      <div className="relative mx-4 my-8">
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-300 dark:border-zinc-600" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-xs text-zinc-500/85 italic dark:bg-zinc-900">
            posts
          </span>
        </div>
      </div>
      {blogPosts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
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
            {post.title}
          </h2>
          <time
            className={twJoin(
              'order-first mb-1 font-sans text-xs font-bold text-zinc-500 uppercase transition-all dark:text-zinc-400',
              'group-hover:text-teal-800 group-focus:text-teal-800',
              'dark:group-hover:text-teal-200 dark:group-focus:text-teal-200',
            )}
          >
            {post.date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
          <p
            className={twJoin(
              'line-clamp-2 text-sm text-ellipsis text-zinc-700 transition-all dark:text-zinc-300',
              'group-hover:text-teal-900 group-focus:text-teal-900',
              'dark:group-hover:text-teal-50 dark:group-focus:text-teal-50',
            )}
          >
            {post.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
