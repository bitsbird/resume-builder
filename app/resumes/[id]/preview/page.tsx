import { notFound } from 'next/navigation';

import { getDb } from '@/lib/db';
import { getJobSeeker } from '@/lib/job-seeker';
import { getResumeWithData } from '@/lib/resumes';
import { TEMPLATES, defaultTemplateId } from '@/lib/templates';

import PreviewHeader from './_components/preview-header';

interface PreviewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ templateId?: string }>;
}

export default async function PreviewPage({ params, searchParams }: PreviewPageProps) {
  const { id } = await params;
  const { templateId = defaultTemplateId } = await searchParams;

  const resumeId = parseInt(id, 10);
  if (isNaN(resumeId)) notFound();

  const template = TEMPLATES[templateId];
  if (!template) notFound();

  const db = getDb();
  const resume = getResumeWithData(db, resumeId);
  if (!resume) notFound();
  const jobSeeker = getJobSeeker(db);

  const TemplateComponent = await template.load();

  return (
    <div>
      <PreviewHeader templateLabel={template.label} resumeId={resumeId} templateId={templateId} />
      <TemplateComponent resume={resume} jobSeeker={jobSeeker} />
    </div>
  );
}
