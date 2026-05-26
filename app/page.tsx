import Link from 'next/link';
import { getResumes } from '@/app/actions';

export const dynamic = 'force-dynamic';
import { ResumeCard } from '@/app/_components/resume-card';

export default async function Home() {
  const resumes = await getResumes();

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <Link href="/resumes/new" data-testid="new-resume">New Resume</Link>
      </div>
      {resumes.length === 0 ? (
        <p className="text-muted-foreground">No resumes yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}
