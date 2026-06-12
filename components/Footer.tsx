import Link from 'next/link';
import { twJoin } from 'tailwind-merge';

import { EMAIL } from '@/config';

import { Bluesky, Email, Github, LinkedIn, Rss } from './SocialIcons';

export function Footer({ links }: { links: { href: string; name: string }[] }) {
  return (
    <footer
      className={twJoin(
        'mt-12 w-full flex-none border-t border-zinc-100 pt-10 pb-16',
        'dark:border-zinc-700/40',
      )}
    >
      <div
        className={twJoin(
          'prose-wrap',
          'relative flex flex-col items-center justify-between gap-6 sm:flex-row',
        )}
      >
        <div
          className={twJoin(
            'flex flex-wrap justify-center gap-x-6 gap-y-1',
            'text-sm font-medium text-zinc-800 dark:text-zinc-200',
          )}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={twJoin(
                'text-zinc-600 lowercase italic dark:text-zinc-400',
                'transition hover:text-teal-500 dark:hover:text-teal-400',
                'outline-teal-500 focus:text-teal-500 dark:focus:text-teal-400',
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <div className="mx-1 flex gap-3">
            {[
              { Icon: Bluesky, href: 'https://bsky.app/profile/mrloh.io' },
              { Icon: Github, href: 'https://github.com/mrloh' },
              { Icon: LinkedIn, href: 'http://linkedin.com/in/tobiaslohse' },
              { Icon: Rss, href: '/blog/feed.xml' },
              { Icon: Email, href: `mailto:${EMAIL}` },
            ].map(({ Icon, href }) => (
              <a
                href={href}
                key={href}
                className="group outline-teal-500"
                target={!href.startsWith('mailto') ? '_blank' : undefined}
              >
                <Icon className="size-4 text-zinc-500 transition-all group-hover:text-teal-500 group-focus:text-teal-500" />
              </a>
            ))}
          </div>
          <p className="mt-1 -mb-6 text-xs text-zinc-400 dark:text-zinc-600">
            &copy; {new Date().getFullYear()} Tobias Lohse
          </p>
        </div>
      </div>
    </footer>
  );
}
