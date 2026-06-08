import { Geist, Geist_Mono, Inter } from 'next/font/google';
import Link from 'next/link';

import { IconAddressBook } from '@tabler/icons-react';
import type { Metadata } from 'next';

import { H1 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'resume builder',
  description: 'build your own resume',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        geistSans.variable,
        geistMono.variable,
        'font-sans',
        inter.variable,
      )}
    >
      <body className="dark flex min-h-full flex-col">
        <div className="flex flex-col">
          <header className="flex flex-row border-b p-8">
            <IconAddressBook className="mr-1 h-full self-center" />
            <H1 className="">Resume Builder</H1>
            <div className="flex grow items-center justify-end">
              <Link href="/resumes/new" data-testid="new-resume">
                New Resume
              </Link>
            </div>
          </header>
          <main className="p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
