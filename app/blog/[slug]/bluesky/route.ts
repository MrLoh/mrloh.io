import { AtpAgent } from '@atproto/api';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import { DOMAIN } from '@/config';
import { BLUESKY_APP_PASSWORD } from '@/secrets';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const agent = new AtpAgent({ service: 'https://bsky.social' });
  await agent.login({ identifier: DOMAIN, password: BLUESKY_APP_PASSWORD });
  const res = await agent.app.bsky.feed.searchPosts({
    q: '*',
    url: `https://${DOMAIN}/blog/${slug}`,
    author: DOMAIN,
    sort: 'top',
    limit: 1,
  });
  if (!res.success) return new Response('Not found', { status: 404 });
  const postId = res.data.posts[0].uri.split('/').pop();
  if (!postId) return new Response('Not found', { status: 404 });

  if (req.nextUrl.searchParams.get('return') === null) {
    redirect(`https://bsky.app/profile/${DOMAIN}/post/${postId}`);
  } else {
    return new Response(postId, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }
}
