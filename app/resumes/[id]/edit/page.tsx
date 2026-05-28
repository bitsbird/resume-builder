import { notFound } from 'next/navigation';

import { getDb } from '@/lib/db';
import { getResumeWithData } from '@/lib/resumes';
import { generateId } from '@/lib/utils';
import type { EditorWorkExperience } from '../../_components/editor-types';
import { EditResumeEditor } from './_components/edit-resume-editor';

interface ResumeEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumeEditPage({ params }: ResumeEditPageProps) {
  const { id } = await params;
  const resumeId = parseInt(id, 10);

  if (isNaN(resumeId)) {
    notFound();
  }

  const resume = getResumeWithData(getDb(), resumeId);

  if (!resume) {
    notFound();
  }

  const initialWorkExperiences: EditorWorkExperience[] = resume.workExperiences.map((we) => {
    const { id, ...data } = we;
    return { type: 'existing', localId: generateId(), id, data, accomplishments: [] };
  });

  return (
    <main className="h-full">
      <EditResumeEditor resume={resume} initialWorkExperiences={initialWorkExperiences} />
    </main>
  );
}
