'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Skill } from '@/lib/skills';
import type { EditorEducation, EditorSkillSection, EditorWorkExperience } from './editor-types';
import { EducationSection } from './education-section';
import { SkillSectionsArea } from './skill-sections-area';
import { WorkExperienceSection } from './work-experience-section';

interface ResumeEditorFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  targetRole: string;
  onTargetRoleChange: (value: string) => void;
  targetCompany: string;
  onTargetCompanyChange: (value: string) => void;
  workExperiences: EditorWorkExperience[];
  onWorkExperiencesChange: (value: EditorWorkExperience[]) => void;
  onAccomplishmentsToDeleteChange: (value: number[]) => void;
  skillSections: EditorSkillSection[];
  onSkillSectionsChange: (value: EditorSkillSection[]) => void;
  education: EditorEducation[];
  onEducationChange: (value: EditorEducation[]) => void;
  resumeId?: number;
  allSkills: Skill[];
  error?: string | null;
}

export function ResumeEditorForm({
  title,
  onTitleChange,
  targetRole,
  onTargetRoleChange,
  targetCompany,
  onTargetCompanyChange,
  workExperiences,
  onWorkExperiencesChange,
  onAccomplishmentsToDeleteChange,
  skillSections,
  onSkillSectionsChange,
  education,
  onEducationChange,
  resumeId,
  allSkills,
  error,
}: ResumeEditorFormProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label>Title</Label>
          <Input
            data-testid="resume-title-input"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Resume title"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Target role</Label>
          <Input
            data-testid="resume-role-input"
            value={targetRole}
            onChange={(e) => onTargetRoleChange(e.target.value)}
            placeholder="e.g. Staff Engineer"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Target company</Label>
          <Input
            data-testid="resume-company-input"
            value={targetCompany}
            onChange={(e) => onTargetCompanyChange(e.target.value)}
            placeholder="e.g. Acme Corp"
          />
        </div>
      </div>

      <WorkExperienceSection
        workExperiences={workExperiences}
        resumeId={resumeId}
        onChange={onWorkExperiencesChange}
        onAccomplishmentsToDeleteChange={onAccomplishmentsToDeleteChange}
      />

      <SkillSectionsArea sections={skillSections} allSkills={allSkills} onChange={onSkillSectionsChange} />

      <EducationSection education={education} onChange={onEducationChange} />

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
