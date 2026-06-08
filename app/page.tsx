import { ResumeCard } from '@/app/_components/resume-card';
import { getResumes } from '@/app/actions';
import { H1, H2 } from '@/components/ui/typography';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const resumes = await getResumes();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <H2>My Resumes</H2>
      </div>
      {resumes.length === 0 ? (
        <p className="text-muted-foreground">No resumes yet.</p>
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
