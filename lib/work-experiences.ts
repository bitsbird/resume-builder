import type Database from 'better-sqlite3';

type DbWorkExperience = {
  id: number;
  employer: string;
  role: string;
  start_date: string;
  end_date: string | null;
  location: string;
  header: string | null;
};

export type WorkExperience = {
  id: number;
  employer: string;
  role: string;
  startDate: string;
  endDate: string | null;
  location: string;
  header: string | null;
};

export type CreateWorkExperienceInput = {
  employer: string;
  role: string;
  startDate: string;
  endDate: string | null;
  location: string;
  header: string | null;
};

function toWorkExperience(row: DbWorkExperience): WorkExperience {
  return {
    id: row.id,
    employer: row.employer,
    role: row.role,
    startDate: row.start_date,
    endDate: row.end_date,
    location: row.location,
    header: row.header,
  };
}

export function createWorkExperience(
  db: Database.Database,
  input: CreateWorkExperienceInput,
): { id: number } {
  const result = db
    .prepare(
      'INSERT INTO work_experiences (employer, role, start_date, end_date, location, header) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .run(input.employer, input.role, input.startDate, input.endDate, input.location, input.header);
  return { id: result.lastInsertRowid as number };
}

export function updateWorkExperience(
  db: Database.Database,
  id: number,
  input: CreateWorkExperienceInput,
): void {
  db
    .prepare(
      'UPDATE work_experiences SET employer = ?, role = ?, start_date = ?, end_date = ?, location = ?, header = ? WHERE id = ?',
    )
    .run(input.employer, input.role, input.startDate, input.endDate, input.location, input.header, id);
}

export function listAllWorkExperiences(db: Database.Database): WorkExperience[] {
  return (
    db.prepare('SELECT * FROM work_experiences').all() as DbWorkExperience[]
  ).map(toWorkExperience);
}

export function getWorkExperiencesForResume(
  db: Database.Database,
  resumeId: number,
): WorkExperience[] {
  return (
    db
      .prepare(
        `SELECT we.* FROM work_experiences we
         JOIN resume_work_experiences rwe ON rwe.we_id = we.id
         WHERE rwe.resume_id = ?
         ORDER BY rwe.position ASC`,
      )
      .all(resumeId) as DbWorkExperience[]
  ).map(toWorkExperience);
}

export function addWorkExperienceToResume(
  db: Database.Database,
  resumeId: number,
  weId: number,
): void {
  const row = db
    .prepare('SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM resume_work_experiences WHERE resume_id = ?')
    .get(resumeId) as { next_pos: number };
  db.prepare('INSERT INTO resume_work_experiences (resume_id, we_id, position) VALUES (?, ?, ?)').run(
    resumeId,
    weId,
    row.next_pos,
  );
}

export function removeWorkExperienceFromResume(
  db: Database.Database,
  resumeId: number,
  weId: number,
): void {
  db.prepare('DELETE FROM resume_work_experiences WHERE resume_id = ? AND we_id = ?').run(
    resumeId,
    weId,
  );
  const ref = db
    .prepare('SELECT COUNT(*) AS count FROM resume_work_experiences WHERE we_id = ?')
    .get(weId) as { count: number };
  if (ref.count === 0) {
    db.prepare('DELETE FROM work_experiences WHERE id = ?').run(weId);
  }
}

export function reorderWorkExperience(
  db: Database.Database,
  resumeId: number,
  weId: number,
  direction: 'up' | 'down',
): void {
  const rows = db
    .prepare(
      'SELECT we_id, position FROM resume_work_experiences WHERE resume_id = ? ORDER BY position ASC',
    )
    .all(resumeId) as { we_id: number; position: number }[];

  const idx = rows.findIndex((r) => r.we_id === weId);
  if (idx === -1) return;

  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= rows.length) return;

  const current = rows[idx];
  const swap = rows[swapIdx];

  db.prepare(
    'UPDATE resume_work_experiences SET position = ? WHERE resume_id = ? AND we_id = ?',
  ).run(swap.position, resumeId, current.we_id);
  db.prepare(
    'UPDATE resume_work_experiences SET position = ? WHERE resume_id = ? AND we_id = ?',
  ).run(current.position, resumeId, swap.we_id);
}
