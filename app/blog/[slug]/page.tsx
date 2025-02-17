import { getMeta, listSlugs } from '../repo';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { title, date } = await getMeta(slug);
  const { default: Post } = await import(`@/blog/${slug}.mdx`);
  return (
    <main className="flex flex-col items-center justify-center">
      <article className="prose dark:prose-invert mx-8 my-8 w-full max-w-120">
        <time className="order-first mb-1 text-sm text-zinc-500">
          {date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        <h1>{title}</h1>
        <Post />
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  return await listSlugs().then((slugs) => slugs.map((slug) => ({ slug })));
}

export const dynamicParams = false;
