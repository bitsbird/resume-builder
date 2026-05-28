import type Database from 'better-sqlite3';
import { beforeEach, describe, expect, it } from 'vitest';

import { initDb } from '@/lib/db';
import { createResume } from '@/lib/resumes';
import { createWorkExperience, addWorkExperienceToResume } from '@/lib/work-experiences';
import {
  createAccomplishment,
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
