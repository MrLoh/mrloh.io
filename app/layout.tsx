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
      <body className={twJoin('flow-root min-h-screen antialiased', 'bg-zinc-50 dark:bg-black')}>
        <Providers>
          <div className="fixed inset-0 flex justify-center sm:px-8">
            <div className="flex w-full max-w-7xl lg:px-8">
              <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
            </div>
          </div>
          <div className="relative flex min-h-screen w-full flex-col">
            <Header
              links={[
                { href: '/about', name: 'About' },
                { href: '/blog', name: 'Blog' },
                { href: '/projects', name: 'Projects' },
              ]}
            />
            <main className="flex flex-auto flex-col">{children}</main>
            <Footer
              links={[
                { href: '/', name: 'Home' },
                { href: '/blog', name: 'Blog' },
                { href: '/about', name: 'About' },
                { href: '/projects', name: 'Projects' },
                { href: '/colophon', name: 'Colophon' },
              ]}
            />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
