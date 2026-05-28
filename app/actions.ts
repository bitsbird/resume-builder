'use server';

import { redirect } from 'next/navigation';

import {
  createAccomplishment,
  linkAccomplishmentToResumeWe,
  listAccomplishmentsForWe,
} from '@/lib/accomplishments';
import { getDb } from '@/lib/db';
import { createResume, listResumes, updateResume } from '@/lib/resumes';
import type { CreateResumeInput, Resume, WorkExperienceWithAccomplishments } from '@/lib/resumes';
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

  redirect(`/resumes/${resumeId}`);
}

export type UpdateResumeWithDataInput = {
  resumeId: number;
  title: string;
  targetRole: string;
  targetCompany: string;
  workExperiences: WorkExperienceEntry[];
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

  redirect(`/resumes/${resumeId}`);
}
