'use client';

import { useState } from 'react';
import type { Resume } from '@/lib/resumes';
import { createResumeAction } from '@/app/actions';
import { ResumeForm } from '@/app/_components/resume-form';
import { ResumePreview } from '@/app/_components/resume-preview';

export function CreateResumeForm() {
  const [resume, setResume] = useState<Partial<Resume>>({});
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);
    const result = await createResumeAction({
      title: resume.title ?? '',
      targetRole: resume.targetRole ?? '',
      targetCompany: resume.targetCompany ?? '',
    });
    if (result && 'error' in result) setError(result.error);
  }

  return (
    <div className="grid grid-cols-2 gap-8 h-full">
      <ResumeForm resume={resume} onChange={setResume} onSubmit={handleSubmit} error={error} />
      <ResumePreview resume={resume} />
    </div>
  );
}
