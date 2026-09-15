'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  profileSummary: string;
  onProfileSummaryChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  address: string;
  onAddressChange: (value: string) => void;
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
  profileSummary,
  onProfileSummaryChange,
  name,
  onNameChange,
  email,
  onEmailChange,
  phone,
  onPhoneChange,
  address,
  onAddressChange,
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
        <div className="flex flex-col gap-1">
          <Label>Profile summary</Label>
          <Textarea
            data-testid="resume-profile-summary-input"
            value={profileSummary}
            onChange={(e) => onProfileSummaryChange(e.target.value)}
            placeholder="A short, tailored summary highlighting your relevant skills"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label>Name</Label>
          <Input
            data-testid="job-seeker-name-input"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Jane Doe"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Email</Label>
          <Input
            data-testid="job-seeker-email-input"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="e.g. jane.doe@example.com"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Phone</Label>
          <Input
            data-testid="job-seeker-phone-input"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="e.g. +1 555 123 4567"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>Address</Label>
          <Input
            data-testid="job-seeker-address-input"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="e.g. 123 Main St, Springfield"
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
