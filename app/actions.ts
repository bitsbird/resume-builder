'use server';

import { redirect } from 'next/navigation';

import { getDb } from '@/lib/db';
import { createResume, listResumes, updateResume } from '@/lib/resumes';
import type { CreateResumeInput, Resume } from '@/lib/resumes';
import {
  addWorkExperienceToResume,
  createWorkExperience,
  listAllWorkExperiences,
  removeWorkExperienceFromResume,
} from '@/lib/work-experiences';
import type { CreateWorkExperienceInput, WorkExperience } from '@/lib/work-experiences';

export async function getResumes(): Promise<Resume[]> {
  return listResumes(getDb());
}

export async function listAllWorkExperiencesAction(): Promise<WorkExperience[]> {
  return listAllWorkExperiences(getDb());
}

export async function createResumeAction(
  input: CreateResumeInput,
): Promise<{ error: string } | void> {
  const result = createResume(getDb(), input);
  if ('error' in result) return { error: result.error };
  redirect(`/resumes/${result.id}`);
}

type WorkExperienceEntry =
  | { type: 'new'; data: CreateWorkExperienceInput }
  | { type: 'existing'; id: number };

export type CreateResumeWithDataInput = {
  title: string;
  targetRole: string;
  targetCompany: string;
  workExperiences: WorkExperienceEntry[];
};

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

  input.workExperiences.forEach((we) => {
    const weId = we.type === 'new' ? createWorkExperience(db, we.data).id : we.id;
    addWorkExperienceToResume(db, resumeId, weId);
  });

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

  const keptIds = new Set(
    workExperiences
      .filter((we): we is { type: 'existing'; id: number } => we.type === 'existing')
      .map((we) => we.id),
  );

  const currentLinks = db
    .prepare('SELECT we_id FROM resume_work_experiences WHERE resume_id = ?')
    .all(resumeId) as { we_id: number }[];

  currentLinks
    .filter(({ we_id }) => !keptIds.has(we_id))
    .forEach(({ we_id }) => removeWorkExperienceFromResume(db, resumeId, we_id));

  // Remove all remaining links so we can re-insert in correct order
  db.prepare('DELETE FROM resume_work_experiences WHERE resume_id = ?').run(resumeId);

  workExperiences.forEach((we) => {
    const weId = we.type === 'new' ? createWorkExperience(db, we.data).id : we.id;
    addWorkExperienceToResume(db, resumeId, weId);
  });

  redirect(`/resumes/${resumeId}`);
}
