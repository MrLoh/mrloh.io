import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'MrLoh.io',
  description: 'Tobias Lohse - Software Engineer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/kik7per.css" />
      </head>
      <body className="bg-background font-sans text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
