import Link from 'next/link';

import { listPosts } from './repo';

export default async function BlogHomePage() {
  const blogPosts = await listPosts();

  return (
    <div>
      {blogPosts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
      ))}
    </div>
  );
}
