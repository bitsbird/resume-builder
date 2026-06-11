'use client';

import { useRouter } from 'next/navigation';

import { createResumeWithDataAction } from '@/app/actions';
import type { Skill } from '@/lib/skills';
import { toActionInput, toEducationActionInput, toSkillSectionsActionInput } from '../../_components/editor-utils';
import { PersistentFormWrapper } from '../../_components/persistent-form-wrapper';
import { ResumeEditorForm } from '../../_components/resume-editor-form';
import { useResumeEditorForm } from '../../_components/use-resume-editor-form';

interface NewResumeEditorProps {
  allSkills: Skill[];
}

export function NewResumeEditor({ allSkills }: NewResumeEditorProps) {
  const router = useRouter();
  const {
    title, setTitle,
    targetRole, setTargetRole,
    targetCompany, setTargetCompany,
    workExperiences, setWorkExperiences,
    skillSections, setSkillSections,
    education, setEducation,
    setAccomplishmentsToDelete,
    error, setError,
  } = useResumeEditorForm();

  async function onSave() {
    setError(null);
    const result = await createResumeWithDataAction({
      title,
      targetRole,
      targetCompany,
      workExperiences: toActionInput(workExperiences),
      skillSections: toSkillSectionsActionInput(skillSections),
      education: toEducationActionInput(education),
    });
    if (result && 'error' in result) setError(result.error);
  }

  return (
    <PersistentFormWrapper
      onSave={onSave}
      onCancel={() => router.push('/')}
      saveTestId="new-resume-save"
      cancelTestId="new-resume-cancel"
    >
      <ResumeEditorForm
        title={title}
        onTitleChange={setTitle}
        targetRole={targetRole}
        onTargetRoleChange={setTargetRole}
        targetCompany={targetCompany}
        onTargetCompanyChange={setTargetCompany}
        workExperiences={workExperiences}
        onWorkExperiencesChange={setWorkExperiences}
        onAccomplishmentsToDeleteChange={setAccomplishmentsToDelete}
        skillSections={skillSections}
        onSkillSectionsChange={setSkillSections}
        education={education}
        onEducationChange={setEducation}
        allSkills={allSkills}
        error={error}
      />
    </PersistentFormWrapper>
  );
}
