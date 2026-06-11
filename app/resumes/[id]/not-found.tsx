import Link from 'next/link';

import { H1, Lead } from '@/components/ui/typography';

export default function NotFound() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <H1>404</H1>
        <Lead className="mt-4">Resume not found</Lead>
        <Link href="/" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
          Back to home
        </Link>
      </div>
    </main>
  );
}
