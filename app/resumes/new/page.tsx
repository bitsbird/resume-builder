import { getDb } from '@/lib/db';
import { getAllSkills } from '@/lib/skills';
import { NewResumeEditor } from './_components/new-resume-editor';

export default async function NewResumePage() {
  const db = getDb();
  const allSkills = getAllSkills(db);

  return (
    <main className="h-full">
      <NewResumeEditor allSkills={allSkills} />
    </main>
  );
}
