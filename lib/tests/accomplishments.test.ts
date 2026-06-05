import type Database from 'better-sqlite3';
import { beforeEach, describe, expect, it } from 'vitest';

import { initDb } from '@/lib/db';
import { createResume } from '@/lib/resumes';
import { createWorkExperience, addWorkExperienceToResume } from '@/lib/work-experiences';
import {
  createAccomplishment,
  countAccomplishmentLinks,
  linkAccomplishmentToResumeWe,
  getAccomplishmentsForResumeWe,
  listAccomplishmentsForWe,
} from '@/lib/accomplishments';

let db: Database.Database;

const weInput = {
  employer: 'Acme Corp',
  role: 'Engineer',
  startDate: '2020-01',
  endDate: null,
  location: 'Remote',
  header: null,
};

function seedResumeAndWe() {
  const resumeResult = createResume(db, {
    title: 'My Resume',
    targetRole: 'Engineer',
    targetCompany: 'Acme',
  });
  const resumeId = (resumeResult as { id: number }).id;
  const { id: weId } = createWorkExperience(db, weInput) as { id: number };
  addWorkExperienceToResume(db, resumeId, weId);
  return { resumeId, weId };
}

beforeEach(() => {
  db = initDb(':memory:');
});

describe('createAccomplishment', () => {
  it('inserts an accomplishment and returns its id', () => {
    const { weId } = seedResumeAndWe();
    const result = createAccomplishment(db, { weId, content: 'Shipped feature X' });
    expect(result).toMatchObject({ id: expect.any(Number) });
  });

  it('stores the content and weId correctly', () => {
    const { weId } = seedResumeAndWe();
    const { id } = createAccomplishment(db, { weId, content: 'Reduced latency by 40%' }) as { id: number };
    const row = db.prepare('SELECT * FROM accomplishments WHERE id = ?').get(id) as {
      id: number;
      we_id: number;
      content: string;
    };
    expect(row).toMatchObject({ id, we_id: weId, content: 'Reduced latency by 40%' });
  });
});

describe('linkAccomplishmentToResumeWe + getAccomplishmentsForResumeWe', () => {
  it('links an accomplishment and returns it in position order', () => {
    const { resumeId, weId } = seedResumeAndWe();
    const { id: accId } = createAccomplishment(db, { weId, content: 'First accomplishment' }) as { id: number };

    linkAccomplishmentToResumeWe(db, resumeId, weId, accId);

    const accs = getAccomplishmentsForResumeWe(db, resumeId, weId);
    expect(accs).toHaveLength(1);
    expect(accs[0]).toMatchObject({ id: accId, weId, content: 'First accomplishment' });
  });

  it('returns multiple accomplishments in insertion order', () => {
    const { resumeId, weId } = seedResumeAndWe();
    const { id: accId1 } = createAccomplishment(db, { weId, content: 'First' }) as { id: number };
    const { id: accId2 } = createAccomplishment(db, { weId, content: 'Second' }) as { id: number };

    linkAccomplishmentToResumeWe(db, resumeId, weId, accId1);
    linkAccomplishmentToResumeWe(db, resumeId, weId, accId2);

    const accs = getAccomplishmentsForResumeWe(db, resumeId, weId);
    expect(accs[0].id).toBe(accId1);
    expect(accs[1].id).toBe(accId2);
  });

  it('returns an empty array when no accomplishments are linked', () => {
    const { resumeId, weId } = seedResumeAndWe();
    expect(getAccomplishmentsForResumeWe(db, resumeId, weId)).toEqual([]);
  });
});

describe('listAccomplishmentsForWe', () => {
  it('returns all accomplishments created for a WE', () => {
    const { weId } = seedResumeAndWe();
    const { id: accId1 } = createAccomplishment(db, { weId, content: 'First' }) as { id: number };
    const { id: accId2 } = createAccomplishment(db, { weId, content: 'Second' }) as { id: number };

    const accs = listAccomplishmentsForWe(db, weId);
    expect(accs).toHaveLength(2);
    expect(accs[0]).toMatchObject({ id: accId1, weId, content: 'First' });
    expect(accs[1]).toMatchObject({ id: accId2, weId, content: 'Second' });
  });

  it('returns an empty array when a WE has no accomplishments', () => {
    const { weId } = seedResumeAndWe();
    expect(listAccomplishmentsForWe(db, weId)).toEqual([]);
  });
});

describe('countAccomplishmentLinks', () => {
  it('returns 0 when the accomplishment is not linked to any resume', () => {
    const { weId } = seedResumeAndWe();
    const { id: accId } = createAccomplishment(db, { weId, content: 'Orphan' }) as { id: number };
    expect(countAccomplishmentLinks(db, accId)).toBe(0);
  });

  it('returns 1 when the accomplishment is linked to exactly one resume/WE', () => {
    const { resumeId, weId } = seedResumeAndWe();
    const { id: accId } = createAccomplishment(db, { weId, content: 'Linked once' }) as { id: number };
    linkAccomplishmentToResumeWe(db, resumeId, weId, accId);
    expect(countAccomplishmentLinks(db, accId)).toBe(1);
  });

  it('returns 2 when the accomplishment is linked to two different resumes', () => {
    const { resumeId: resumeId1, weId } = seedResumeAndWe();
    const resumeResult2 = createResume(db, { title: 'R2', targetRole: 'Eng', targetCompany: 'B' });
    const resumeId2 = (resumeResult2 as { id: number }).id;
    addWorkExperienceToResume(db, resumeId2, weId);
    const { id: accId } = createAccomplishment(db, { weId, content: 'Shared' }) as { id: number };
    linkAccomplishmentToResumeWe(db, resumeId1, weId, accId);
    linkAccomplishmentToResumeWe(db, resumeId2, weId, accId);
    expect(countAccomplishmentLinks(db, accId)).toBe(2);
  });

  it('excludes the specified resume when excludeResumeId is provided', () => {
    const { resumeId, weId } = seedResumeAndWe();
    const { id: accId } = createAccomplishment(db, { weId, content: 'Shared' }) as { id: number };
    linkAccomplishmentToResumeWe(db, resumeId, weId, accId);
    // count excluding this resume = 0 (orphaned if removed from this resume)
    expect(countAccomplishmentLinks(db, accId, resumeId)).toBe(0);
  });

  it('returns the count from other resumes when excludeResumeId is provided', () => {
    const { resumeId: resumeId1, weId } = seedResumeAndWe();
    const resumeResult2 = createResume(db, { title: 'R2', targetRole: 'Eng', targetCompany: 'B' });
    const resumeId2 = (resumeResult2 as { id: number }).id;
    addWorkExperienceToResume(db, resumeId2, weId);
    const { id: accId } = createAccomplishment(db, { weId, content: 'Shared' }) as { id: number };
    linkAccomplishmentToResumeWe(db, resumeId1, weId, accId);
    linkAccomplishmentToResumeWe(db, resumeId2, weId, accId);
    // excluding resumeId1: still 1 link from resumeId2 → not orphaned
    expect(countAccomplishmentLinks(db, accId, resumeId1)).toBe(1);
  });
});

describe('permanent deletion', () => {
  it('deletes the accomplishment row when its id is removed from the accomplishments table', () => {
    const { weId } = seedResumeAndWe();
    const { id: accId } = createAccomplishment(db, { weId, content: 'To be deleted' }) as { id: number };

    const before = listAccomplishmentsForWe(db, weId);
    expect(before).toHaveLength(1);

    db.prepare('DELETE FROM accomplishments WHERE id = ?').run(accId);

    const after = listAccomplishmentsForWe(db, weId);
    expect(after).toHaveLength(0);
  });
});

describe('re-linking after clearing all links', () => {
  it('allows re-linking a subset of accomplishments after clearing (regression: UNIQUE constraint on update)', () => {
    const { resumeId, weId } = seedResumeAndWe();
    const { id: accId1 } = createAccomplishment(db, { weId, content: 'First' }) as { id: number };
    const { id: accId2 } = createAccomplishment(db, { weId, content: 'Second' }) as { id: number };

    linkAccomplishmentToResumeWe(db, resumeId, weId, accId1);
    linkAccomplishmentToResumeWe(db, resumeId, weId, accId2);

    // Simulate the clear-and-reinsert pattern used on save
    db.prepare('DELETE FROM resume_work_experience_accomplishments WHERE resume_id = ?').run(resumeId);
    db.prepare('DELETE FROM resume_work_experiences WHERE resume_id = ?').run(resumeId);

    addWorkExperienceToResume(db, resumeId, weId);
    expect(() => linkAccomplishmentToResumeWe(db, resumeId, weId, accId1)).not.toThrow();

    const accs = getAccomplishmentsForResumeWe(db, resumeId, weId);
    expect(accs).toHaveLength(1);
    expect(accs[0]).toMatchObject({ id: accId1, content: 'First' });
  });
});

describe('max-5-per-WE enforcement', () => {
  it('throws when linking a 6th accomplishment to the same resume/WE', () => {
    const { resumeId, weId } = seedResumeAndWe();

    for (let i = 1; i <= 5; i++) {
      const { id } = createAccomplishment(db, { weId, content: `Accomplishment ${i}` }) as { id: number };
      linkAccomplishmentToResumeWe(db, resumeId, weId, id);
    }

    const { id: sixthId } = createAccomplishment(db, { weId, content: 'Sixth' }) as { id: number };
    expect(() => linkAccomplishmentToResumeWe(db, resumeId, weId, sixthId)).toThrow();
  });

  it('allows a 5th accomplishment', () => {
    const { resumeId, weId } = seedResumeAndWe();

    for (let i = 1; i <= 4; i++) {
      const { id } = createAccomplishment(db, { weId, content: `Accomplishment ${i}` }) as { id: number };
      linkAccomplishmentToResumeWe(db, resumeId, weId, id);
    }

    const { id: fifthId } = createAccomplishment(db, { weId, content: 'Fifth' }) as { id: number };
    expect(() => linkAccomplishmentToResumeWe(db, resumeId, weId, fifthId)).not.toThrow();
    expect(getAccomplishmentsForResumeWe(db, resumeId, weId)).toHaveLength(5);
  });
});
