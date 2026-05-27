import { notFound } from 'next/navigation';

import { getDb } from '@/lib/db';
import { getResume } from '@/lib/resumes';
import { EditorPanel } from './_components/editor-panel';
import { PreviewPanel } from './_components/preview-panel';

interface ResumPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumePage({ params }: ResumPageProps) {
  const { id } = await params;
  const resumeId = parseInt(id, 10);

  if (isNaN(resumeId)) {
    notFound();
  }

  const db = getDb();
  const resume = getResume(db, resumeId);

  if (!resume) {
    notFound();
  }

  return (
    <main data-slot="split-view" className="flex h-screen overflow-hidden">
      <div className="w-1/3 overflow-auto">
        <EditorPanel resume={resume} />
      </div>
      <div className="w-2/3 overflow-auto">
        <PreviewPanel resume={resume} />
      </div>
    </main>
  );
}
