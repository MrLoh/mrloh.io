import Link from 'next/link';

import { listMetas } from './repo';

export default async function BlogHomePage() {
  const blogPosts = await listMetas();

  return (
    <main className="flex flex-col items-center justify-center">
      <ul className="m-8 space-y-4">
        {blogPosts.map((post) => (
          <li key={post.slug} className="text-center hover:underline">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
