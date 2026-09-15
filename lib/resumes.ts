import type Database from 'better-sqlite3';

import { getAccomplishmentsForResumeWe } from './accomplishments';
import type { Accomplishment } from './accomplishments';
import { getEducationForResume } from './educations';
import type { Education } from './educations';
import { getSkillSectionsForResume } from './skills';
import type { SkillSectionWithSkills } from './skills';
import { getWorkExperiencesForResume } from './work-experiences';
import type { WorkExperience } from './work-experiences';

type DbResume = {
  id: number;
  title: string;
  target_role: string;
  target_company: string;
  created_at: string;
  template_id: string;
  profile_summary: string;
};

export type Resume = {
  id: number;
  title: string;
  targetRole: string;
  targetCompany: string;
  createdAt: string;
  templateId: string;
  profileSummary: string;
};

function toResume(row: DbResume): Resume {
  return {
    id: row.id,
    title: row.title,
    targetRole: row.target_role,
    targetCompany: row.target_company,
    createdAt: row.created_at,
    templateId: row.template_id,
    profileSummary: row.profile_summary,
  };
}

export type CreateResumeInput = {
  title: string;
  targetRole: string;
  targetCompany: string;
  profileSummary?: string;
};

export function createResume(
  db: Database.Database,
  input: CreateResumeInput,
): { id: number } | { error: string } {
  if (!input.title.trim()) {
    return { error: 'Title is required.' };
  }
  try {
    const result = db
      .prepare(
        'INSERT INTO resumes (title, target_role, target_company, template_id, profile_summary) VALUES (?, ?, ?, ?, ?)',
      )
      .run(input.title, input.targetRole, input.targetCompany, 'default', input.profileSummary ?? '');
    return { id: result.lastInsertRowid as number };
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes('UNIQUE constraint failed: resumes.title')) {
      return { error: 'A resume with this title already exists.' };
    }
    throw e;
  }
}

export function listResumes(db: Database.Database): Resume[] {
  return (db.prepare('SELECT * FROM resumes ORDER BY created_at DESC').all() as DbResume[]).map(
    toResume,
  );
}

export function getResume(db: Database.Database, id: number): Resume | null {
  const row = db.prepare('SELECT * FROM resumes WHERE id = ?').get(id) as DbResume | undefined;
  return row ? toResume(row) : null;
}

export type WorkExperienceWithAccomplishments = WorkExperience & { accomplishments: Accomplishment[] };

export type ResumeWithData = Resume & {
  workExperiences: WorkExperienceWithAccomplishments[];
  skillSections: SkillSectionWithSkills[];
  education: Education[];
};

export function getResumeWithData(db: Database.Database, id: number): ResumeWithData | null {
  return db.transaction(() => {
    const resume = getResume(db, id);
    if (!resume) return null;
    const workExperiences = getWorkExperiencesForResume(db, id).map((we) => ({
      ...we,
      accomplishments: getAccomplishmentsForResumeWe(db, id, we.id),
    }));
    const skillSections = getSkillSectionsForResume(db, id);
    const education = getEducationForResume(db, id);
    return { ...resume, workExperiences, skillSections, education };
  })();
}

export type UpdateResumeInput = {
  title: string;
  targetRole: string;
  targetCompany: string;
  profileSummary: string;
};

export function updateResume(
  db: Database.Database,
  id: number,
  input: UpdateResumeInput,
): { error: string } | void {
  if (!input.title.trim()) return { error: 'Title is required.' };
  try {
    db.prepare(
      'UPDATE resumes SET title = ?, target_role = ?, target_company = ?, profile_summary = ? WHERE id = ?',
    ).run(input.title, input.targetRole, input.targetCompany, input.profileSummary, id);
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes('UNIQUE constraint failed: resumes.title')) {
      return { error: 'A resume with this title already exists.' };
    }
    throw e;
  }
}
