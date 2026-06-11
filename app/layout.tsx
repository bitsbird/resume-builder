import { Geist, Geist_Mono, Inter } from 'next/font/google';

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
      <body className="dark flex h-screen flex-col">
        <div className="flex h-full flex-col">
          <header className="flex shrink-0 flex-row border-b p-8">
            <IconAddressBook className="mr-1 h-full self-center" />
            <H1 className="">Resume Builder</H1>
          </header>
          <main className="min-h-0 flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
