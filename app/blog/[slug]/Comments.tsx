'use client';

import { RichText } from '@atproto/api';
import { Heart, MessageSquareText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { z } from 'zod/v4';

import { Bluesky } from '@/components/SocialIcons';
import { DOMAIN } from '@/config';
import { formatRelativeTimeAgo } from '@/utils/formatting';

const postSchema = z.object({
  uri: z.string(),
  likeCount: z.number(),
  replyCount: z.number(),
  repostCount: z.number(),
  record: z.object({
    text: z.string(),
    facets: z.array(z.any()).optional(),
    createdAt: z.string(),
  }),
  author: z.object({
    did: z.string(),
    handle: z.string(),
    displayName: z.string(),
    avatar: z.string(),
  }),
});

const repliesSchema = z.array(
  z.object({
    post: postSchema,
    get replies() {
      return repliesSchema;
    },
  }),
);

type Replies = z.infer<typeof repliesSchema>;
type Post = z.infer<typeof postSchema>;
type Thread = { replies: Replies; post: Post };

const getThread = async (rid: string): Promise<Thread | null> => {
  const uri = encodeURIComponent(`at://${DOMAIN}/app.bsky.feed.post/${rid}`);
  try {
    const res = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${uri}`,
      { method: 'GET', headers: { Accept: 'application/json' }, cache: 'no-store' },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      post: postSchema.parse(data.thread.post),
      replies: repliesSchema.parse(data.thread.replies),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
};

const Comment = ({ post, replies }: { post: Post; replies: Replies }) => (
  <>
    <div className="mb-6">
      <div className="mb-1.5 flex items-end">
        <a
          href={`https://bsky.app/profile/${post.author.handle}`}
          className={twJoin(
            'mr-1 flex items-center rounded-full pr-2',
            'border border-transparent text-xs text-zinc-700 dark:text-zinc-300',
            'hover:border-teal-500/20 hover:bg-teal-100/30 dark:hover:bg-teal-800/30',
            'hover:text-teal-600 dark:hover:text-teal-500',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.author.avatar}
            alt={post.author.displayName}
            className="mr-2 size-5 rounded-full"
          />
          <strong className="text-sm font-extrabold uppercase" title={'@' + post.author.handle}>
            {post.author.displayName}
          </strong>
        </a>
        <time
          title={new Date(post.record.createdAt).toLocaleString()}
          className="mb-0.5 text-xs text-zinc-500"
        >
          {formatRelativeTimeAgo(post.record.createdAt)}
        </time>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {Array.from(new RichText(post.record).segments()).map((segment) =>
          segment.link ? (
            <a
              key={segment.text}
              className="underline hover:text-teal-500"
              href={segment.link?.uri}
            >
              {segment.text}
            </a>
          ) : segment.mention ? (
            <a
              key={segment.text}
              className="font-semibold hover:text-teal-500"
              href={`https://bsky.app/profile/${segment.mention?.did}`}
            >
              {segment.text}
            </a>
          ) : (
            segment.text
          ),
        )}
      </p>
      <div className="mt-1.5 -ml-1 flex items-center gap-1">
        <a
          href={`https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`}
          className={twJoin(
            'group flex items-center gap-1',
            'rounded border border-transparent px-1.5 py-0.5 text-xs text-zinc-500 italic',
            'hover:border-teal-500/20 hover:bg-teal-100/30 dark:hover:bg-teal-800/30',
            'hover:text-teal-600 dark:hover:text-teal-500',
          )}
        >
          <Heart
            className={twJoin(
              'mt-px size-3 fill-zinc-200 dark:fill-zinc-800',
              'group-hover:fill-teal-500/15',
            )}
          />{' '}
          {post.likeCount} like
          {post.likeCount === 1 ? '' : 's'}
        </a>
        <a
          href={`https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`}
          className={twJoin(
            'group ml-2 flex items-center gap-1',
            'rounded border border-transparent px-1.5 py-0.5 text-xs text-zinc-500 italic',
            'hover:border-teal-500/20 hover:bg-teal-100/30 dark:hover:bg-teal-800/30',
            'hover:text-teal-600 dark:hover:text-teal-500',
          )}
        >
          <MessageSquareText
            className={twJoin(
              'mt-0.5 size-3 fill-zinc-200 dark:fill-zinc-800',
              'group-hover:fill-teal-500/15',
            )}
          />{' '}
          reply
        </a>
      </div>
    </div>
    <div className="ml-1.5 border-l-3 border-zinc-100/75 pl-5 dark:border-zinc-700/40">
      {replies.map(({ post, replies }) => (
        <Comment key={post.uri} post={post} replies={replies} />
      ))}
    </div>
  </>
);

const flattenReplies = (replies: Replies): Replies => {
  if (replies.length === 1) {
    // walk down the single‐child chain
    const chain: Replies = [];
    let curr = replies[0];
    while (curr.replies.length === 1) {
      chain.push({ ...curr, replies: [] });
      curr = curr.replies[0];
    }
    // last node may have 0 or >1 replies; recurse into its replies
    chain.push({ ...curr, replies: flattenReplies(curr.replies) });
    return chain;
  }
  // multiple replies → recurse individually
  return replies.map((n) => ({ ...n, replies: flattenReplies(n.replies) }));
};

export default function Comments({ blueskyId }: { blueskyId?: string }) {
  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    (async () => {
      if (!blueskyId) return;
      setThread(await getThread(blueskyId));
    })();
  }, [blueskyId]);

  const totalReplyCount = useMemo(() => {
    if (!thread) return 0;
    const countReplies = (replies: Replies): number =>
      replies.reduce((sum, { replies }) => sum + countReplies(replies), replies.length);
    return countReplies(thread.replies);
  }, [thread]);

  if (!thread) return null;
  const { post, replies } = thread;
  const { likeCount } = post;

  const postUrl = `https://bsky.app/profile/${DOMAIN}/post/${blueskyId || post.uri.split('/').pop()!}`;

  return (
    <section className="mt-12 -mb-10 flex w-full flex-col items-center">
      <div className="mb-1 flex w-full max-w-2xl flex-1 flex-wrap justify-center gap-x-8 px-6 text-sm min-[30rem]:justify-between">
        <span className="mb-2 flex items-center gap-3 font-extrabold text-zinc-600 uppercase dark:text-zinc-300">
          <a
            href={postUrl}
            rel="noopener noreferrer"
            className={twJoin(
              '-ml-1.5 flex items-center',
              'group rounded border border-transparent px-1.5 py-0.5',
              'hover:border-teal-500/30 hover:bg-teal-100/30 dark:hover:bg-teal-800/30',
              'hover:text-teal-600 dark:hover:text-teal-500',
            )}
          >
            <MessageSquareText
              className={twJoin(
                'mt-0.5 mr-1.5 size-4 fill-zinc-100 dark:fill-zinc-800',
                'group-hover:fill-teal-500/30',
              )}
            />
            {totalReplyCount} comment{totalReplyCount === 1 ? '' : 's'}
          </a>
          •
          <a
            href={postUrl}
            rel="noopener noreferrer"
            className={twJoin(
              'flex items-center',
              'group rounded border border-transparent px-1.5 py-0.5',
              'hover:border-teal-500/30 hover:bg-teal-100/30 dark:hover:bg-teal-800/30',
              'hover:text-teal-600 dark:hover:text-teal-500',
            )}
          >
            <Heart
              className={twJoin(
                'mt-0.5 mr-1.5 ml-0.5 size-4 fill-zinc-100 dark:fill-zinc-800',
                'group-hover:fill-teal-500/30',
              )}
            />
            {likeCount} like
            {likeCount === 1 ? '' : 's'}
          </a>
        </span>
        <span className="mb-2 flex items-center text-right text-xs text-zinc-400 italic dark:text-zinc-600">
          powered by bluesky{' '}
          <Bluesky className="mt-0.5 ml-2 size-3 text-zinc-300 dark:text-zinc-700" />
        </span>
      </div>
      <hr className="w-full border-t border-zinc-100 dark:border-zinc-700/40" />
      <div className="w-full max-w-2xl px-6 pt-5">
        {replies.length === 0 ? (
          <a
            href={postUrl}
            className="mt-6 mb-10 block text-zinc-400 italic hover:text-teal-500 dark:text-zinc-600"
          >
            Your chance to leave the first comment!
          </a>
        ) : (
          replies.map(({ post, replies }) => (
            <Comment key={post.uri} post={post} replies={flattenReplies(replies)} />
          ))
        )}
      </div>
    </section>
  );
}
