import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

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
    )
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
