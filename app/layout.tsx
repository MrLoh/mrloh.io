import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { twJoin } from 'tailwind-merge';

import './globals.css';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

import Providers from './Providers';

export const metadata: Metadata = {
  title: 'MrLoh.io',
  description: 'Tobias Lohse - Software Engineer',
  alternates: { types: { 'application/rss+xml': 'https://mrloh.io/blog/feed.xml' } },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning id="root">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/kik7per.css" />
      </head>
      <body className="bg-white antialiased sm:bg-zinc-50 dark:bg-zinc-900 sm:dark:bg-black">
        <Providers>
          <div className="layout min-h-dvh">
            <div className="layout-7xl">
              <div
                className={twJoin(
                  'flex min-h-dvh w-full flex-col',
                  'bg-white ring-1 ring-zinc-100',
                  'dark:bg-zinc-900 dark:ring-zinc-300/20',
                )}
              >
                <Header
                  links={[
                    { href: '/blog', name: 'Blog' },
                    { href: '/about', name: 'About' },
                    // { href: '/projects', name: 'Projects' },
                  ]}
                />
                <main className="flex flex-auto flex-col">{children}</main>
                <Footer
                  links={[
                    // { href: '/', name: 'Home' },
                    { href: '/blog', name: 'Blog' },
                    { href: '/about', name: 'About' },
                    // { href: '/projects', name: 'Projects' },
                    { href: '/colophon', name: 'Colophon' },
                  ]}
                />
              </div>
            </div>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
