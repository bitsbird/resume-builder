import { notFound } from 'next/navigation';

import { getDb } from '@/lib/db';
import { getResumeWithData } from '@/lib/resumes';
import { defaultTemplateId, TEMPLATES } from '@/lib/templates';

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

  const resume = getResumeWithData(getDb(), resumeId);
  if (!resume) notFound();

  const TemplateComponent = await template.load();

  return <TemplateComponent resume={resume} />;
}
