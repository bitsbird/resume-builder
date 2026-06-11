'use client';

import { updateResumeWithDataAction } from '@/app/actions';
import type { Resume } from '@/lib/resumes';
import type { Skill } from '@/lib/skills';
import type { EditorEducation, EditorSkillSection, EditorWorkExperience } from '../../../_components/editor-types';
import { toActionInput, toEducationActionInput, toSkillSectionsActionInput } from '../../../_components/editor-utils';
import type { ResumeFormData } from '../../../_components/resume-editor-form';
import { ResumeEditorForm } from '../../../_components/resume-editor-form';

interface EditResumeEditorProps {
  resume: Resume;
  initialWorkExperiences: EditorWorkExperience[];
  initialSkillSections: EditorSkillSection[];
  initialEducation: EditorEducation[];
  allSkills: Skill[];
}

export function EditResumeEditor({ resume, initialWorkExperiences, initialSkillSections, initialEducation, allSkills }: EditResumeEditorProps) {
  async function handleSave(data: ResumeFormData) {
    return updateResumeWithDataAction({
      resumeId: resume.id,
      title: data.title,
      targetRole: data.targetRole,
      targetCompany: data.targetCompany,
      workExperiences: toActionInput(data.workExperiences),
      skillSections: toSkillSectionsActionInput(data.skillSections),
      education: toEducationActionInput(data.education),
      accomplishmentsToDelete: data.accomplishmentsToDelete,
    });
  }

  return (
    <ResumeEditorForm
      initialTitle={resume.title}
      initialTargetRole={resume.targetRole}
      initialTargetCompany={resume.targetCompany}
      initialWorkExperiences={initialWorkExperiences}
      initialSkillSections={initialSkillSections}
      initialEducation={initialEducation}
      resumeId={resume.id}
      allSkills={allSkills}
      onSave={handleSave}
      saveTestId="edit-resume-save"
    />
  );
}
