import { twJoin } from 'tailwind-merge';

import { getMeta, listSlugs } from '../repo';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { title, date } = await getMeta(slug);
  const { default: Post } = await import(`@/blog/${slug}.mdx`);
  return (
    <article
      className={twJoin('prose font-prose dark:prose-invert mx-8 mt-6 w-full max-w-160 px-6')}
    >
      <time className="font-sans text-sm font-bold text-zinc-500 uppercase">
        {date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </time>
      <h1 className="mt-2 mb-8 font-sans text-3xl text-zinc-700 italic dark:text-zinc-300">
        {title}
      </h1>
      <Post />
    </article>
  );
}

export async function generateStaticParams() {
  return await listSlugs().then((slugs) => slugs.map((slug) => ({ slug })));
}

export const dynamicParams = false;
