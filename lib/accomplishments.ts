import type Database from 'better-sqlite3';

type DbAccomplishment = {
  id: number;
  we_id: number;
  content: string;
};

export type Accomplishment = {
  id: number;
  weId: number;
  content: string;
};

export type CreateAccomplishmentInput = {
  weId: number;
  content: string;
};

function toAccomplishment(row: DbAccomplishment): Accomplishment {
  return { id: row.id, weId: row.we_id, content: row.content };
}

export function createAccomplishment(
  db: Database.Database,
  input: CreateAccomplishmentInput,
): { id: number } {
  const result = db
    .prepare('INSERT INTO accomplishments (we_id, content) VALUES (?, ?)')
    .run(input.weId, input.content);
  return { id: result.lastInsertRowid as number };
}

export function linkAccomplishmentToResumeWe(
  db: Database.Database,
  resumeId: number,
  weId: number,
  accomplishmentId: number,
): void {
  const { count } = db
    .prepare(
      'SELECT COUNT(*) AS count FROM resume_work_experience_accomplishments WHERE resume_id = ? AND we_id = ?',
    )
    .get(resumeId, weId) as { count: number };

  if (count >= 5) {
    throw new Error('Maximum of 5 accomplishments per work experience per resume');
  }

  const { next_pos } = db
    .prepare(
      'SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM resume_work_experience_accomplishments WHERE resume_id = ? AND we_id = ?',
    )
    .get(resumeId, weId) as { next_pos: number };

  db.prepare(
    'INSERT INTO resume_work_experience_accomplishments (resume_id, we_id, accomplishment_id, position) VALUES (?, ?, ?, ?)',
  ).run(resumeId, weId, accomplishmentId, next_pos);
}

export function listAccomplishmentsForWe(
  db: Database.Database,
  weId: number,
): Accomplishment[] {
  return (
    db
      .prepare('SELECT * FROM accomplishments WHERE we_id = ? ORDER BY id ASC')
      .all(weId) as DbAccomplishment[]
  ).map(toAccomplishment);
}

export function getAccomplishmentsForResumeWe(
  db: Database.Database,
  resumeId: number,
  weId: number,
): Accomplishment[] {
  return (
    db
      .prepare(
        `SELECT a.* FROM accomplishments a
         JOIN resume_work_experience_accomplishments rwea ON rwea.accomplishment_id = a.id
         WHERE rwea.resume_id = ? AND rwea.we_id = ?
         ORDER BY rwea.position ASC`,
      )
      .all(resumeId, weId) as DbAccomplishment[]
  ).map(toAccomplishment);
}
