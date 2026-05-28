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
