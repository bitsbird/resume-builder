import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export function initDb(dbPath: string): Database.Database {
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS resumes (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      title           TEXT    NOT NULL UNIQUE,
      target_role     TEXT    NOT NULL DEFAULT '',
      target_company  TEXT    NOT NULL DEFAULT '',
      created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
      template_id     TEXT    NOT NULL DEFAULT '',
      profile_summary TEXT    NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS work_experiences (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      employer   TEXT NOT NULL,
      role       TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date   TEXT,
      location   TEXT NOT NULL,
      header     TEXT
    );

    CREATE TABLE IF NOT EXISTS resume_work_experiences (
      resume_id INTEGER NOT NULL REFERENCES resumes(id),
      we_id     INTEGER NOT NULL REFERENCES work_experiences(id),
      position  INTEGER NOT NULL,
      PRIMARY KEY (resume_id, we_id)
    );

    CREATE TABLE IF NOT EXISTS accomplishments (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      we_id   INTEGER NOT NULL REFERENCES work_experiences(id),
      content TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS resume_work_experience_accomplishments (
      resume_id         INTEGER NOT NULL REFERENCES resumes(id),
      we_id             INTEGER NOT NULL REFERENCES work_experiences(id),
      accomplishment_id INTEGER NOT NULL REFERENCES accomplishments(id),
      position          INTEGER NOT NULL,
      PRIMARY KEY (resume_id, we_id, accomplishment_id)
    );

    CREATE TABLE IF NOT EXISTS skills (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skill_sections (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_id INTEGER NOT NULL REFERENCES resumes(id),
      title     TEXT    NOT NULL,
      position  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skill_section_skills (
      section_id INTEGER NOT NULL REFERENCES skill_sections(id),
      skill_id   INTEGER NOT NULL REFERENCES skills(id),
      position   INTEGER NOT NULL,
      PRIMARY KEY (section_id, skill_id)
    );

    CREATE TABLE IF NOT EXISTS educations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      degree      TEXT NOT NULL,
      institution TEXT NOT NULL,
      start_date  TEXT NOT NULL,
      end_date    TEXT
    );

    CREATE TABLE IF NOT EXISTS resume_educations (
      resume_id INTEGER NOT NULL REFERENCES resumes(id),
      edu_id    INTEGER NOT NULL REFERENCES educations(id),
      PRIMARY KEY (resume_id, edu_id)
    );

    CREATE TABLE IF NOT EXISTS job_seeker (
      id      INTEGER PRIMARY KEY CHECK (id = 1),
      name    TEXT NOT NULL DEFAULT '',
      email   TEXT NOT NULL DEFAULT '',
      phone   TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT ''
    );
    INSERT OR IGNORE INTO job_seeker (id) VALUES (1);
  `);
  return db;
}

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    const dataDir = path.join(process.cwd(), 'data');
    fs.mkdirSync(dataDir, { recursive: true });
    _db = initDb(path.join(dataDir, 'resumes.db'));
  }
  return _db;
}
