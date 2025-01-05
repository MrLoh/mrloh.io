import { listSlugs } from '../repo';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { default: Post } = await import(`@/blog/${slug}.mdx`);
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="prose prose-invert mx-8 my-8 w-full max-w-120">
        <Post />
      </div>
    </main>
  );
}

export async function generateStaticParams() {
  return await listSlugs().then((slugs) => slugs.map((slug) => ({ slug })));
}

export const dynamicParams = false;
