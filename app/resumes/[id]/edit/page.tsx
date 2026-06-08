import { notFound } from 'next/navigation';

import { getDb } from '@/lib/db';
import { getResumeWithData } from '@/lib/resumes';
import { getAllSkills } from '@/lib/skills';
import { generateId } from '@/lib/utils';
import type { EditorAccomplishment, EditorEducation, EditorSkill, EditorSkillSection, EditorWorkExperience } from '../../_components/editor-types';
import { EditResumeEditor } from './_components/edit-resume-editor';

interface ResumeEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumeEditPage({ params }: ResumeEditPageProps) {
  const { id } = await params;
  const resumeId = parseInt(id, 10);

  if (isNaN(resumeId)) {
    notFound();
  }

  const db = getDb();
  const resume = getResumeWithData(db, resumeId);
  const allSkills = getAllSkills(db);

  if (!resume) {
    notFound();
  }

  const initialWorkExperiences: EditorWorkExperience[] = resume.workExperiences.map((we) => {
    const { id, accomplishments, ...data } = we;
    const editorAccomplishments: EditorAccomplishment[] = accomplishments.map((acc) => ({
      type: 'existing',
      localId: generateId(),
      id: acc.id,
      content: acc.content,
    }));
    return { type: 'existing', localId: generateId(), id, data, accomplishments: editorAccomplishments };
  });

  const initialSkillSections: EditorSkillSection[] = resume.skillSections.map((section) => {
    const skills: EditorSkill[] = section.skills.map((skill) => ({
      type: 'existing',
      localId: generateId(),
      id: skill.id,
      name: skill.name,
    }));
    return { type: 'existing', localId: generateId(), id: section.id, title: section.title, skills };
  });

  const initialEducation: EditorEducation[] = resume.education.map((edu) => ({
    type: 'existing',
    localId: generateId(),
    id: edu.id,
    data: { degree: edu.degree, institution: edu.institution, startDate: edu.startDate, endDate: edu.endDate },
  }));

  return (
    <main className="h-full">
      <EditResumeEditor
        resume={resume}
        initialWorkExperiences={initialWorkExperiences}
        initialSkillSections={initialSkillSections}
        initialEducation={initialEducation}
        allSkills={allSkills}
      />
    </main>
  );
}
