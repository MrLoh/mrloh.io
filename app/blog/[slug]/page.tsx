import { twJoin } from 'tailwind-merge';

import { getMeta, listSlugs } from '../repo';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { title, date } = await getMeta(slug);
  const { default: Post } = await import(`@/blog/${slug}.mdx`);
  return (
    <article className={twJoin('prose dark:prose-invert mx-8 mt-6 w-full max-w-2xl px-6')}>
      <time className="text-sm font-semibold text-zinc-500 uppercase">
        {date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>
      <h1>{title}</h1>
      <Post />
    </article>
  );
}

export async function generateStaticParams() {
  return await listSlugs().then((slugs) => slugs.map((slug) => ({ slug })));
}

export const dynamicParams = false;
