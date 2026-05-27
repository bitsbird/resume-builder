import type Database from 'better-sqlite3';
import { beforeEach, describe, expect, it } from 'vitest';

import { initDb } from '@/lib/db';
import { createResume, getResume, listResumes } from '@/lib/resumes';

let db: Database.Database;

beforeEach(() => {
  db = initDb(':memory:');
});

describe('createResume', () => {
  it('inserts a resume and returns its id', () => {
    const result = createResume(db, {
      title: 'Senior Engineer CV',
      targetRole: 'Staff Engineer',
      targetCompany: 'Acme Corp',
    });
    expect(result).toMatchObject({ id: expect.any(Number) });
    expect(listResumes(db)).toHaveLength(1);
  });

  it('returns an error when title is empty', () => {
    const result = createResume(db, { title: '', targetRole: 'Engineer', targetCompany: 'Acme' });
    expect(result).toMatchObject({ error: expect.any(String) });
    expect(listResumes(db)).toHaveLength(0);
  });

  it('returns an error when title is a duplicate', () => {
    const input = {
      title: 'Senior Engineer CV',
      targetRole: 'Staff Engineer',
      targetCompany: 'Acme Corp',
    };
    createResume(db, input);
    const result = createResume(db, input);
    expect(result).toMatchObject({ error: expect.any(String) });
    expect(listResumes(db)).toHaveLength(1);
  });
});

describe('listResumes', () => {
  it('returns an empty array when no resumes exist', () => {
    expect(listResumes(db)).toEqual([]);
  });

  it('returns resumes ordered newest first', () => {
    db.prepare(
      `INSERT INTO resumes (title, created_at) VALUES ('Resume Jan 2024', '2024-01-01 00:00:00'), ('Resume Jun 2024', '2024-06-01 00:00:00')`,
    ).run();
    const results = listResumes(db);
    expect(results[0].title).toBe('Resume Jun 2024');
    expect(results[1].title).toBe('Resume Jan 2024');
  });
});

describe('getResume', () => {
  it('fetches a resume by id and returns all fields', () => {
    const created = createResume(db, {
      title: 'Senior Engineer CV',
      targetRole: 'Staff Engineer',
      targetCompany: 'Acme Corp',
    });
    expect(created).toMatchObject({ id: expect.any(Number) });

    const resume = getResume(db, (created as { id: number }).id);
    expect(resume).toMatchObject({
      id: expect.any(Number),
      title: 'Senior Engineer CV',
      targetRole: 'Staff Engineer',
      targetCompany: 'Acme Corp',
      createdAt: expect.any(String),
      templateId: 'default',
      profileSummary: '',
    });
  });

  it('returns null when resume does not exist', () => {
    const resume = getResume(db, 999);
    expect(resume).toBeNull();
  });
});
