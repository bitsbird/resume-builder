import Link from 'next/link';

import { ResumeCard } from '@/app/_components/resume-card';
import { getResumes } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { H2, Muted } from '@/components/ui/typography';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const resumes = await getResumes();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <H2>My Resumes</H2>
        <Button asChild>
          <Link data-testid="new-resume" href="/resumes/new">New Resume</Link>
        </Button>
      </div>
      {resumes.length === 0 ? (
        <Muted>No resumes yet.</Muted>
      ) : (
        <div className="grid h-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </div>
  );
}
