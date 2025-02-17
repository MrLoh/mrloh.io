import Link from 'next/link';
import { twJoin } from 'tailwind-merge';

import { listMetas } from './repo';

export default async function BlogHomePage() {
  const blogPosts = await listMetas();

  return (
    <div className="mt-8 flex flex-col items-center justify-center">
      <div className="flex flex-col gap-16">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className={twJoin(
              'flex flex-col',
              'rounded-lg px-4 py-3 hover:bg-zinc-200 dark:hover:bg-zinc-800',
            )}
          >
            <h2 className="mb-2 text-xl font-bold italic">{post.title}</h2>
            <time className="order-first mb-1 text-sm text-zinc-500">
              {post.date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <p className="text-sm text-zinc-500">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
