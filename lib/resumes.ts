import type Database from 'better-sqlite3';

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
        'INSERT INTO resumes (title, target_role, target_company, template_id) VALUES (?, ?, ?, ?)',
      )
      .run(input.title, input.targetRole, input.targetCompany, 'default');
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
