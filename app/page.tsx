// import { getResumes } from '@/app/actions';
import { getMockResumes } from '@/lib/resumes';

export const dynamic = 'force-dynamic';
import { ResumeCard } from '@/app/_components/resume-card';

export default async function Home() {
  const resumes = getMockResumes(); // TODO: replace with getResumes()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Resumes</h1>
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
