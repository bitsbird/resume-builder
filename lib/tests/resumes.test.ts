import type Database from 'better-sqlite3';
import { beforeEach, describe, expect, it } from 'vitest';

import { initDb } from '@/lib/db';
import { createResume, getResume, getResumeWithData, listResumes, updateResume } from '@/lib/resumes';
import { addWorkExperienceToResume, createWorkExperience } from '@/lib/work-experiences';
import { createAccomplishment, linkAccomplishmentToResumeWe } from '@/lib/accomplishments';

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

describe('updateResume', () => {
  it('updates title, targetRole and targetCompany', () => {
    const { id } = createResume(db, {
      title: 'Old Title',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
    }) as { id: number };

    updateResume(db, id, { title: 'New Title', targetRole: 'Lead', targetCompany: 'Beta' });

    const resume = getResume(db, id);
    expect(resume).toMatchObject({ title: 'New Title', targetRole: 'Lead', targetCompany: 'Beta' });
  });

  it('returns an error when the new title is empty', () => {
    const { id } = createResume(db, {
      title: 'My Resume',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
    }) as { id: number };

    const result = updateResume(db, id, { title: '', targetRole: 'Lead', targetCompany: 'Beta' });

    expect(result).toMatchObject({ error: expect.any(String) });
    expect(getResume(db, id)?.title).toBe('My Resume');
  });

  it('returns an error when the new title is a duplicate of another resume', () => {
    createResume(db, { title: 'Other Resume', targetRole: '', targetCompany: '' });
    const { id } = createResume(db, {
      title: 'My Resume',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
    }) as { id: number };

    const result = updateResume(db, id, {
      title: 'Other Resume',
      targetRole: 'Lead',
      targetCompany: 'Beta',
    });

    expect(result).toMatchObject({ error: expect.any(String) });
    expect(getResume(db, id)?.title).toBe('My Resume');
  });
});

describe('getResumeWithData', () => {
  it('returns the resume together with its work experiences', () => {
    const { id: resumeId } = createResume(db, {
      title: 'My Resume',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
    }) as { id: number };
    const { id: weId } = createWorkExperience(db, {
      employer: 'Acme', role: 'Dev', startDate: '2020-01', endDate: null, location: 'Remote', header: null,
    });
    addWorkExperienceToResume(db, resumeId, weId);

    const result = getResumeWithData(db, resumeId);

    expect(result).toMatchObject({ id: resumeId, title: 'My Resume' });
    expect(result?.workExperiences).toHaveLength(1);
    expect(result?.workExperiences[0].employer).toBe('Acme');
  });

  it('includes accomplishments linked to each WE in position order', () => {
    const { id: resumeId } = createResume(db, {
      title: 'My Resume',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
    }) as { id: number };
    const { id: weId } = createWorkExperience(db, {
      employer: 'Acme', role: 'Dev', startDate: '2020-01', endDate: null, location: 'Remote', header: null,
    }) as { id: number };
    addWorkExperienceToResume(db, resumeId, weId);
    const { id: acc1Id } = createAccomplishment(db, { weId, content: 'First' }) as { id: number };
    const { id: acc2Id } = createAccomplishment(db, { weId, content: 'Second' }) as { id: number };
    linkAccomplishmentToResumeWe(db, resumeId, weId, acc1Id);
    linkAccomplishmentToResumeWe(db, resumeId, weId, acc2Id);

    const result = getResumeWithData(db, resumeId);

    expect(result?.workExperiences[0].accomplishments).toHaveLength(2);
    expect(result?.workExperiences[0].accomplishments[0]).toMatchObject({ id: acc1Id, weId, content: 'First' });
    expect(result?.workExperiences[0].accomplishments[1]).toMatchObject({ id: acc2Id, weId, content: 'Second' });
  });

  it('returns an empty accomplishments array for a WE with no linked accomplishments', () => {
    const { id: resumeId } = createResume(db, {
      title: 'My Resume',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
    }) as { id: number };
    const { id: weId } = createWorkExperience(db, {
      employer: 'Acme', role: 'Dev', startDate: '2020-01', endDate: null, location: 'Remote', header: null,
    }) as { id: number };
    addWorkExperienceToResume(db, resumeId, weId);

    const result = getResumeWithData(db, resumeId);

    expect(result?.workExperiences[0].accomplishments).toEqual([]);
  });

  it('returns null when the resume does not exist', () => {
    expect(getResumeWithData(db, 999)).toBeNull();
  });

  it('returns the resume with an empty workExperiences array when none are linked', () => {
    const { id: resumeId } = createResume(db, {
      title: 'Empty Resume',
      targetRole: '',
      targetCompany: '',
    }) as { id: number };

    const result = getResumeWithData(db, resumeId);

    expect(result?.workExperiences).toEqual([]);
  });
});
