import { getComponent, listPosts } from '../repo';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const Post = await getComponent(slug);

  return (
    <div className="prose prose-headings:mt-8 prose-headings:font-semibold prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg dark:prose-headings:text-white">
      <Post />
    </div>
  );
}

export async function generateStaticParams() {
  const blogPosts = await listPosts();
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;
