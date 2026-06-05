'use client';

import { useState } from 'react';

import { updateResumeWithDataAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Resume } from '@/lib/resumes';
import type { Skill } from '@/lib/skills';
import type { EditorSkillSection, EditorWorkExperience } from '../../../_components/editor-types';
import { toActionInput, toSkillSectionsActionInput } from '../../../_components/editor-utils';
import { SkillSectionsArea } from '../../../_components/skill-sections-area';
import { WorkExperienceSection } from '../../../_components/work-experience-section';

interface EditResumeEditorProps {
  resume: Resume;
  initialWorkExperiences: EditorWorkExperience[];
  initialSkillSections: EditorSkillSection[];
  allSkills: Skill[];
}

export function EditResumeEditor({ resume, initialWorkExperiences, initialSkillSections, allSkills }: EditResumeEditorProps) {
  const [title, setTitle] = useState(resume.title);
  const [targetRole, setTargetRole] = useState(resume.targetRole);
  const [targetCompany, setTargetCompany] = useState(resume.targetCompany);
  const [workExperiences, setWorkExperiences] = useState<EditorWorkExperience[]>(initialWorkExperiences);
  const [skillSections, setSkillSections] = useState<EditorSkillSection[]>(initialSkillSections);
  const [accomplishmentsToDelete, setAccomplishmentsToDelete] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    const result = await updateResumeWithDataAction({
      resumeId: resume.id,
      title,
      targetRole,
      targetCompany,
      workExperiences: toActionInput(workExperiences),
      skillSections: toSkillSectionsActionInput(skillSections),
      accomplishmentsToDelete,
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

      <WorkExperienceSection
        workExperiences={workExperiences}
        resumeId={resume.id}
        onChange={setWorkExperiences}
        onAccomplishmentsToDeleteChange={setAccomplishmentsToDelete}
      />

      <SkillSectionsArea sections={skillSections} allSkills={allSkills} onChange={setSkillSections} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="button" data-testid="edit-resume-save" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
