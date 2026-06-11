'use client';

import { useRouter } from 'next/navigation';

import { updateResumeWithDataAction } from '@/app/actions';
import type { Resume } from '@/lib/resumes';
import type { Skill } from '@/lib/skills';
import type { EditorEducation, EditorSkillSection, EditorWorkExperience } from '../../../_components/editor-types';
import { toActionInput, toEducationActionInput, toSkillSectionsActionInput } from '../../../_components/editor-utils';
import { PersistentFormWrapper } from '../../../_components/persistent-form-wrapper';
import { ResumeEditorForm } from '../../../_components/resume-editor-form';
import { useResumeEditorForm } from '../../../_components/use-resume-editor-form';

interface EditResumeEditorProps {
  resume: Resume;
  initialWorkExperiences: EditorWorkExperience[];
  initialSkillSections: EditorSkillSection[];
  initialEducation: EditorEducation[];
  allSkills: Skill[];
}

export function EditResumeEditor({ resume, initialWorkExperiences, initialSkillSections, initialEducation, allSkills }: EditResumeEditorProps) {
  const router = useRouter();
  const {
    title, setTitle,
    targetRole, setTargetRole,
    targetCompany, setTargetCompany,
    workExperiences, setWorkExperiences,
    skillSections, setSkillSections,
    education, setEducation,
    accomplishmentsToDelete, setAccomplishmentsToDelete,
    error, setError,
  } = useResumeEditorForm({
    title: resume.title,
    targetRole: resume.targetRole,
    targetCompany: resume.targetCompany,
    workExperiences: initialWorkExperiences,
    skillSections: initialSkillSections,
    education: initialEducation,
  });

  async function onSave() {
    setError(null);
    const result = await updateResumeWithDataAction({
      resumeId: resume.id,
      title,
      targetRole,
      targetCompany,
      workExperiences: toActionInput(workExperiences),
      skillSections: toSkillSectionsActionInput(skillSections),
      education: toEducationActionInput(education),
      accomplishmentsToDelete,
    });
    if (result && 'error' in result) setError(result.error);
  }

  return (
    <PersistentFormWrapper
      onSave={onSave}
      onCancel={() => router.push(`/resumes/${resume.id}`)}
      saveTestId="edit-resume-save"
      cancelTestId="edit-resume-cancel"
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
        resumeId={resume.id}
        allSkills={allSkills}
        error={error}
      />
    </PersistentFormWrapper>
  );
}
