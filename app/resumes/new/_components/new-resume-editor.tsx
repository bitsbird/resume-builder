'use client';

import { createResumeWithDataAction } from '@/app/actions';
import type { Skill } from '@/lib/skills';
import type { ResumeFormData } from '../../_components/resume-editor-form';
import { ResumeEditorForm } from '../../_components/resume-editor-form';
import { toActionInput, toEducationActionInput, toSkillSectionsActionInput } from '../../_components/editor-utils';

interface NewResumeEditorProps {
  allSkills: Skill[];
}

export function NewResumeEditor({ allSkills }: NewResumeEditorProps) {
  async function handleSave(data: ResumeFormData) {
    return createResumeWithDataAction({
      title: data.title,
      targetRole: data.targetRole,
      targetCompany: data.targetCompany,
      workExperiences: toActionInput(data.workExperiences),
      skillSections: toSkillSectionsActionInput(data.skillSections),
      education: toEducationActionInput(data.education),
    });
  }

  return <ResumeEditorForm allSkills={allSkills} onSave={handleSave} saveTestId="new-resume-save" />;
}
