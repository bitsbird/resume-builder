'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Skill } from '@/lib/skills';
import type { EditorEducation, EditorSkillSection, EditorWorkExperience } from './editor-types';
import { EducationSection } from './education-section';
import { SkillSectionsArea } from './skill-sections-area';
import { WorkExperienceSection } from './work-experience-section';

export interface ResumeFormData {
  title: string;
  targetRole: string;
  targetCompany: string;
  workExperiences: EditorWorkExperience[];
  skillSections: EditorSkillSection[];
  education: EditorEducation[];
  accomplishmentsToDelete: number[];
}

interface ResumeEditorFormProps {
  initialTitle?: string;
  initialTargetRole?: string;
  initialTargetCompany?: string;
  initialWorkExperiences?: EditorWorkExperience[];
  initialSkillSections?: EditorSkillSection[];
  initialEducation?: EditorEducation[];
  resumeId?: number;
  allSkills: Skill[];
  onSave: (data: ResumeFormData) => Promise<{ error: string } | void>;
  saveTestId?: string;
}

export function ResumeEditorForm({
  initialTitle = '',
  initialTargetRole = '',
  initialTargetCompany = '',
  initialWorkExperiences = [],
  initialSkillSections = [],
  initialEducation = [],
  resumeId,
  allSkills,
  onSave,
  saveTestId,
}: ResumeEditorFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [targetCompany, setTargetCompany] = useState(initialTargetCompany);
  const [workExperiences, setWorkExperiences] = useState<EditorWorkExperience[]>(initialWorkExperiences);
  const [skillSections, setSkillSections] = useState<EditorSkillSection[]>(initialSkillSections);
  const [education, setEducation] = useState<EditorEducation[]>(initialEducation);
  const [accomplishmentsToDelete, setAccomplishmentsToDelete] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setError(null);
    const result = await onSave({
      title,
      targetRole,
      targetCompany,
      workExperiences,
      skillSections,
      education,
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
        resumeId={resumeId}
        onChange={setWorkExperiences}
        onAccomplishmentsToDeleteChange={setAccomplishmentsToDelete}
      />

      <SkillSectionsArea sections={skillSections} allSkills={allSkills} onChange={setSkillSections} />

      <EducationSection education={education} onChange={setEducation} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="button" data-testid={saveTestId} onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
