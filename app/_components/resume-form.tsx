'use client';

import type { Resume } from '@/lib/resumes';

interface ResumeFormProps {
  resume: Partial<Resume>;
  onChange: (resume: Partial<Resume>) => void;
  onSubmit: () => Promise<void>;
  error?: string | null;
}

export function ResumeForm({ resume, onChange, onSubmit, error }: ResumeFormProps) {
  const isValid =
    !!resume.title?.trim() &&
    !!resume.targetRole?.trim() &&
    !!resume.targetCompany?.trim();

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          value={resume.title ?? ''}
          onChange={(e) => onChange({ ...resume, title: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="targetRole">Target Role *</label>
        <input
          id="targetRole"
          value={resume.targetRole ?? ''}
          onChange={(e) => onChange({ ...resume, targetRole: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="targetCompany">Target Company *</label>
        <input
          id="targetCompany"
          value={resume.targetCompany ?? ''}
          onChange={(e) => onChange({ ...resume, targetCompany: e.target.value })}
        />
      </div>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={!isValid} data-testid="submit">
        Create Resume
      </button>
    </form>
  );
}
