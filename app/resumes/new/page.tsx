import { getDb } from '@/lib/db';
import { getJobSeeker } from '@/lib/job-seeker';
import { getAllSkills } from '@/lib/skills';
import { NewResumeEditor } from './_components/new-resume-editor';

export default async function NewResumePage() {
  const db = getDb();
  const allSkills = getAllSkills(db);
  const jobSeeker = getJobSeeker(db);

  return (
    <main className="h-full">
      <NewResumeEditor allSkills={allSkills} jobSeeker={jobSeeker} />
    </main>
  );
}
