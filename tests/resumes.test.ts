import { describe, it, expect, beforeEach } from 'vitest';
import type Database from 'better-sqlite3';
import { initDb } from '@/lib/db';
import { listResumes } from '@/lib/resumes';

let db: Database.Database;

beforeEach(() => {
  db = initDb(':memory:');
});

describe('listResumes', () => {
  it('returns an empty array when no resumes exist', () => {
    expect(listResumes(db)).toEqual([]);
  });

  it('returns resumes ordered newest first', () => {
    db.prepare(
      `INSERT INTO resumes (title, created_at) VALUES ('Resume Jan 2024', '2024-01-01 00:00:00'), ('Resume Jun 2024', '2024-06-01 00:00:00')`
    ).run();
    const results = listResumes(db);
    expect(results[0].title).toBe('Resume Jun 2024');
    expect(results[1].title).toBe('Resume Jan 2024');
  });
});
