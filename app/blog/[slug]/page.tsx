import { twJoin } from 'tailwind-merge';

import { getMeta, listSlugs } from '../repo';
import Comments from './Comments';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { title, date, blueskyId } = await getMeta(slug);
  const { default: Post } = await import(`@/blog/${slug}.mdx`);
  return (
    <div className="mx-8 flex w-full max-w-7xl flex-col items-center sm:px-8">
      <article
        className={twJoin('prose prose-zinc dark:prose-invert mx-8 mt-6 w-full max-w-2xl px-6')}
      >
        <time className="text-sm font-semibold text-zinc-500 uppercase">
          {date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        <h1>{title}</h1>
        <Post />
      </article>
      <Comments blueskyId={blueskyId} />
    </div>
  );
}

export async function generateStaticParams() {
  return await listSlugs().then((slugs) => slugs.map((slug) => ({ slug })));
}

export const dynamicParams = false;
