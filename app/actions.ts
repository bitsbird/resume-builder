'use server';

import { redirect } from 'next/navigation';

import {
  countAccomplishmentLinks,
  createAccomplishment,
  linkAccomplishmentToResumeWe,
  listAccomplishmentsForWe,
} from '@/lib/accomplishments';
import type { Accomplishment } from '@/lib/accomplishments';
import { getDb } from '@/lib/db';
import {
  addEducationToResume,
  createEducation,
  getEducationForResume,
  listAllEducation,
  removeEducationFromResume,
  updateEducation,
} from '@/lib/educations';
import type { Education } from '@/lib/educations';
import { createResume, listResumes, updateResume } from '@/lib/resumes';
import type { CreateResumeInput, Resume, WorkExperienceWithAccomplishments } from '@/lib/resumes';
import {
  addSkillToSection,
  createSkill,
  createSkillSection,
  deleteSkillSection,
  getSkillSectionsForResume,
} from '@/lib/skills';
import {
  addWorkExperienceToResume,
  createWorkExperience,
  listAllWorkExperiences,
  removeWorkExperienceFromResume,
  updateWorkExperience,
} from '@/lib/work-experiences';
import type { CreateWorkExperienceInput } from '@/lib/work-experiences';

export async function getResumes(): Promise<Resume[]> {
  return listResumes(getDb());
}

export async function listAccomplishmentsForWeAction(weId: number): Promise<Accomplishment[]> {
  return listAccomplishmentsForWe(getDb(), weId);
}

export async function checkAccomplishmentIsOrphanedAction(accId: number, resumeId?: number): Promise<boolean> {
  if (resumeId === undefined) return false;
  return countAccomplishmentLinks(getDb(), accId, resumeId) === 0;
}

export async function listAllEducationAction(): Promise<Education[]> {
  return listAllEducation(getDb());
}

export async function listAllWorkExperiencesAction(): Promise<WorkExperienceWithAccomplishments[]> {
  const db = getDb();
  return listAllWorkExperiences(db).map((we) => ({
    ...we,
    accomplishments: listAccomplishmentsForWe(db, we.id),
  }));
}

export async function createResumeAction(
  input: CreateResumeInput,
): Promise<{ error: string } | void> {
  const result = createResume(getDb(), input);
  if ('error' in result) return { error: result.error };
  redirect(`/resumes/${result.id}`);
}

type AccomplishmentEntry =
  | { type: 'new'; content: string }
  | { type: 'existing'; id: number; content: string };

type WorkExperienceEntry =
  | { type: 'new'; data: CreateWorkExperienceInput; accomplishments: AccomplishmentEntry[] }
  | { type: 'existing'; id: number; data: CreateWorkExperienceInput; accomplishments: AccomplishmentEntry[] };

export type CreateResumeWithDataInput = {
  title: string;
  targetRole: string;
  targetCompany: string;
  workExperiences: WorkExperienceEntry[];
  skillSections?: SkillSectionEntry[];
  education?: EducationEntry[];
};

function linkAccomplishments(
  db: ReturnType<typeof getDb>,
  resumeId: number,
  weId: number,
  accomplishments: AccomplishmentEntry[],
): void {
  accomplishments.forEach((acc) => {
    const accId = acc.type === 'new' ? createAccomplishment(db, { weId, content: acc.content }).id : acc.id;
    linkAccomplishmentToResumeWe(db, resumeId, weId, accId);
  });
}

export async function createResumeWithDataAction(
  input: CreateResumeWithDataInput,
): Promise<{ error: string } | void> {
  const db = getDb();

  const resumeResult = createResume(db, {
    title: input.title,
    targetRole: input.targetRole,
    targetCompany: input.targetCompany,
  });

  if ('error' in resumeResult) return { error: resumeResult.error };

  const resumeId = resumeResult.id;

  try {
    input.workExperiences.forEach((we) => {
      const weId = we.type === 'new' ? createWorkExperience(db, we.data).id : we.id;
      addWorkExperienceToResume(db, resumeId, weId);
      linkAccomplishments(db, resumeId, weId, we.accomplishments);
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save accomplishments' };
  }

  if (input.skillSections) {
    input.skillSections.forEach((section, idx) => {
      const sectionId =
        section.type === 'new'
          ? createSkillSection(db, { resumeId, title: section.title }).id
          : (() => {
              db.prepare('UPDATE skill_sections SET title = ?, position = ? WHERE id = ?').run(
                section.title,
                idx,
                section.id,
              );
              return section.id;
            })();
      section.skills.forEach((skill) => {
        const skillId = skill.type === 'new' ? createSkill(db, { name: skill.name }).id : skill.id;
        addSkillToSection(db, sectionId, skillId);
      });
    });
  }

  if (input.education) {
    input.education.forEach((e) => {
      const eduId = e.type === 'new' ? createEducation(db, e.data).id : e.id;
      addEducationToResume(db, resumeId, eduId);
    });
  }

  redirect(`/resumes/${resumeId}`);
}

type SkillEntry =
  | { type: 'new'; name: string }
  | { type: 'existing'; id: number; name: string };

type SkillSectionEntry =
  | { type: 'new'; title: string; skills: SkillEntry[] }
  | { type: 'existing'; id: number; title: string; skills: SkillEntry[] };

type EducationEntry =
  | { type: 'new'; data: { degree: string; institution: string; startDate: string; endDate: string | null } }
  | { type: 'existing'; id: number; data: { degree: string; institution: string; startDate: string; endDate: string | null } };

export type UpdateResumeWithDataInput = {
  resumeId: number;
  title: string;
  targetRole: string;
  targetCompany: string;
  workExperiences: WorkExperienceEntry[];
  skillSections?: SkillSectionEntry[];
  accomplishmentsToDelete?: number[];
  education?: EducationEntry[];
};

export async function updateResumeWithDataAction(
  input: UpdateResumeWithDataInput,
): Promise<{ error: string } | void> {
  const db = getDb();
  const { resumeId, title, targetRole, targetCompany, workExperiences } = input;

  const resumeError = updateResume(db, resumeId, { title, targetRole, targetCompany });
  if (resumeError) return resumeError;

  const existingEntries = workExperiences.filter(
    (we): we is Extract<WorkExperienceEntry, { type: 'existing' }> => we.type === 'existing',
  );
  const keptIds = new Set(existingEntries.map((we) => we.id));

  const currentLinks = db
    .prepare('SELECT we_id FROM resume_work_experiences WHERE resume_id = ?')
    .all(resumeId) as { we_id: number }[];

  currentLinks
    .filter(({ we_id }) => !keptIds.has(we_id))
    .forEach(({ we_id }) => removeWorkExperienceFromResume(db, resumeId, we_id));

  existingEntries.forEach((we) => updateWorkExperience(db, we.id, we.data));

  // Remove all remaining links so we can re-insert in correct order
  db.prepare('DELETE FROM resume_work_experience_accomplishments WHERE resume_id = ?').run(resumeId);
  db.prepare('DELETE FROM resume_work_experiences WHERE resume_id = ?').run(resumeId);

  try {
    workExperiences.forEach((we) => {
      const weId = we.type === 'new' ? createWorkExperience(db, we.data).id : we.id;
      addWorkExperienceToResume(db, resumeId, weId);
      linkAccomplishments(db, resumeId, weId, we.accomplishments);
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save accomplishments' };
  }

  if (input.accomplishmentsToDelete && input.accomplishmentsToDelete.length > 0) {
    const placeholders = input.accomplishmentsToDelete.map(() => '?').join(',');
    db.prepare(`DELETE FROM accomplishments WHERE id IN (${placeholders})`).run(...input.accomplishmentsToDelete);
  }

  if (input.skillSections !== undefined) {
    const currentSections = getSkillSectionsForResume(db, resumeId);
    const keptSectionIds = new Set(
      input.skillSections
        .filter((s): s is Extract<SkillSectionEntry, { type: 'existing' }> => s.type === 'existing')
        .map((s) => s.id),
    );
    currentSections
      .filter((s) => !keptSectionIds.has(s.id))
      .forEach((s) => deleteSkillSection(db, s.id));

    // Re-insert all sections in order (delete existing links + re-add preserves order)
    keptSectionIds.forEach((id) => {
      db.prepare('DELETE FROM skill_section_skills WHERE section_id = ?').run(id);
      db.prepare('UPDATE skill_sections SET position = -1 WHERE id = ?').run(id);
    });
    db.prepare('DELETE FROM skill_sections WHERE resume_id = ? AND position >= 0').run(resumeId);

    input.skillSections.forEach((section, idx) => {
      const sectionId =
        section.type === 'new'
          ? createSkillSection(db, { resumeId, title: section.title }).id
          : (() => {
              db.prepare('UPDATE skill_sections SET title = ?, position = ? WHERE id = ?').run(
                section.title,
                idx,
                section.id,
              );
              return section.id;
            })();

      section.skills.forEach((skill) => {
        const skillId = skill.type === 'new' ? createSkill(db, { name: skill.name }).id : skill.id;
        addSkillToSection(db, sectionId, skillId);
      });
    });
  }

  if (input.education !== undefined) {
    const keptEduIds = new Set(
      input.education
        .filter((e): e is Extract<EducationEntry, { type: 'existing' }> => e.type === 'existing')
        .map((e) => e.id),
    );

    getEducationForResume(db, resumeId)
      .filter((e) => !keptEduIds.has(e.id))
      .forEach((e) => removeEducationFromResume(db, resumeId, e.id));

    input.education
      .filter((e): e is Extract<EducationEntry, { type: 'existing' }> => e.type === 'existing')
      .forEach((e) => {
        updateEducation(db, e.id, e.data);
        addEducationToResume(db, resumeId, e.id);
      });

    input.education
      .filter((e): e is Extract<EducationEntry, { type: 'new' }> => e.type === 'new')
      .forEach((e) => {
        const { id } = createEducation(db, e.data);
        addEducationToResume(db, resumeId, id);
      });
  }

  redirect(`/resumes/${resumeId}`);
}
