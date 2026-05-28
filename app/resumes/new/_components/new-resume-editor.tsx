'use client';

import { useState } from 'react';

import { createResumeWithDataAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EditorWorkExperience } from '../../_components/editor-types';
import { toActionInput } from '../../_components/editor-utils';
import { WorkExperienceSection } from '../../_components/work-experience-section';

export function NewResumeEditor() {
  const [title, setTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [workExperiences, setWorkExperiences] = useState<EditorWorkExperience[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    const result = await createResumeWithDataAction({
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
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="e.g. Acme Corp"
          />
        </div>
      </div>

      <WorkExperienceSection workExperiences={workExperiences} onChange={setWorkExperiences} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="button" data-testid="new-resume-save" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
