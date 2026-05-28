import { notFound } from 'next/navigation';

import { getDb } from '@/lib/db';
import { getResumeWithData } from '@/lib/resumes';
import { generateId } from '@/lib/utils';
import type { EditorAccomplishment, EditorWorkExperience } from '../../_components/editor-types';
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
    const { id, accomplishments, ...data } = we;
    const editorAccomplishments: EditorAccomplishment[] = accomplishments.map((acc) => ({
      type: 'existing',
      localId: generateId(),
      id: acc.id,
      content: acc.content,
    }));
    return { type: 'existing', localId: generateId(), id, data, accomplishments: editorAccomplishments };
  });

  return (
    <main className="h-full">
      <EditResumeEditor resume={resume} initialWorkExperiences={initialWorkExperiences} />
    </main>
  );
}
