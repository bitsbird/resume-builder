'use client';

import { useState } from 'react';

import { updateResumeWithDataAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Resume } from '@/lib/resumes';
import type { EditorWorkExperience } from '../../../_components/editor-types';
import { toActionInput } from '../../../_components/editor-utils';
import { WorkExperienceSection } from '../../../_components/work-experience-section';

interface EditResumeEditorProps {
  resume: Resume;
  initialWorkExperiences: EditorWorkExperience[];
}

export function EditResumeEditor({ resume, initialWorkExperiences }: EditResumeEditorProps) {
  const [title, setTitle] = useState(resume.title);
  const [targetRole, setTargetRole] = useState(resume.targetRole);
  const [targetCompany, setTargetCompany] = useState(resume.targetCompany);
  const [workExperiences, setWorkExperiences] = useState<EditorWorkExperience[]>(initialWorkExperiences);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    const result = await updateResumeWithDataAction({
      resumeId: resume.id,
      title,
      targetRole,
      targetCompany,
      workExperiences: toActionInput(workExperiences),
    });
    if (result && 'error' in result) setError(result.error);
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label>Title</Label>
          <Input
            data-testid="resume-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resume title"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Target role</Label>
          <Input
            data-testid="resume-role-input"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Staff Engineer"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Target company</Label>
          <Input
            data-testid="resume-company-input"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="e.g. Acme Corp"
          />
        </div>
      </div>

      <WorkExperienceSection workExperiences={workExperiences} onChange={setWorkExperiences} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="button" data-testid="edit-resume-save" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
