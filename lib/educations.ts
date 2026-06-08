import type Database from 'better-sqlite3';

type DbEducation = {
  id: number;
  degree: string;
  institution: string;
  start_date: string;
  end_date: string | null;
};

export type Education = {
  id: number;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string | null;
};

export type CreateEducationInput = {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string | null;
};

function toEducation(row: DbEducation): Education {
  return {
    id: row.id,
    degree: row.degree,
    institution: row.institution,
    startDate: row.start_date,
    endDate: row.end_date,
  };
}

export function createEducation(
  db: Database.Database,
  input: CreateEducationInput,
): { id: number } {
  const result = db
    .prepare(
      'INSERT INTO educations (degree, institution, start_date, end_date) VALUES (?, ?, ?, ?)',
    )
    .run(input.degree, input.institution, input.startDate, input.endDate);
  return { id: result.lastInsertRowid as number };
}

export function updateEducation(
  db: Database.Database,
  id: number,
  input: CreateEducationInput,
): void {
  db
    .prepare(
      'UPDATE educations SET degree = ?, institution = ?, start_date = ?, end_date = ? WHERE id = ?',
    )
    .run(input.degree, input.institution, input.startDate, input.endDate, id);
}

export function listAllEducation(db: Database.Database): Education[] {
  return (db.prepare('SELECT * FROM educations').all() as DbEducation[]).map(toEducation);
}

export function deleteEducation(db: Database.Database, id: number): void {
  db.prepare('DELETE FROM educations WHERE id = ?').run(id);
}

export function addEducationToResume(
  db: Database.Database,
  resumeId: number,
  eduId: number,
): void {
  db
    .prepare('INSERT OR IGNORE INTO resume_educations (resume_id, edu_id) VALUES (?, ?)')
    .run(resumeId, eduId);
}

export function getEducationForResume(
  db: Database.Database,
  resumeId: number,
): Education[] {
  return (
    db
      .prepare(
        `SELECT e.* FROM educations e
         JOIN resume_educations re ON re.edu_id = e.id
         WHERE re.resume_id = ?
         ORDER BY COALESCE(e.end_date, '9999') DESC`,
      )
      .all(resumeId) as DbEducation[]
  ).map(toEducation);
}

export function removeEducationFromResume(
  db: Database.Database,
  resumeId: number,
  eduId: number,
): void {
  db.prepare('DELETE FROM resume_educations WHERE resume_id = ? AND edu_id = ?').run(resumeId, eduId);
  const ref = db
    .prepare('SELECT COUNT(*) AS count FROM resume_educations WHERE edu_id = ?')
    .get(eduId) as { count: number };
  if (ref.count === 0) {
    db.prepare('DELETE FROM educations WHERE id = ?').run(eduId);
  }
}
