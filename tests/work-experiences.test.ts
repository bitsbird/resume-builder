import type Database from 'better-sqlite3';
import { beforeEach, describe, expect, it } from 'vitest';

import { initDb } from '@/lib/db';
import { createResume } from '@/lib/resumes';
import {
  addWorkExperienceToResume,
  createWorkExperience,
  getWorkExperiencesForResume,
  listAllWorkExperiences,
  removeWorkExperienceFromResume,
  reorderWorkExperience,
} from '@/lib/work-experiences';

let db: Database.Database;

const weInput = {
  employer: 'Acme Corp',
  role: 'Engineer',
  startDate: '2020-01',
  endDate: null,
  location: 'Remote',
  header: null,
};

function seedResume() {
  const result = createResume(db, {
    title: 'My Resume',
    targetRole: 'Engineer',
    targetCompany: 'Acme',
  });
  return (result as { id: number }).id;
}

beforeEach(() => {
  db = initDb(':memory:');
});

describe('createWorkExperience', () => {
  it('inserts a work experience and returns its id', () => {
    const result = createWorkExperience(db, weInput);
    expect(result).toMatchObject({ id: expect.any(Number) });
  });

  it('stores nullable fields as null', () => {
    const { id } = createWorkExperience(db, weInput) as { id: number };
    const all = listAllWorkExperiences(db);
    const we = all.find((w) => w.id === id);
    expect(we?.endDate).toBeNull();
    expect(we?.header).toBeNull();
  });
});

describe('listAllWorkExperiences', () => {
  it('returns an empty array when none exist', () => {
    expect(listAllWorkExperiences(db)).toEqual([]);
  });

  it('returns all created work experiences', () => {
    createWorkExperience(db, weInput);
    createWorkExperience(db, { ...weInput, employer: 'Beta Inc' });
    expect(listAllWorkExperiences(db)).toHaveLength(2);
  });
});

describe('addWorkExperienceToResume + getWorkExperiencesForResume', () => {
  it('links a WE to a resume and returns it in position order', () => {
    const resumeId = seedResume();
    const { id: weId } = createWorkExperience(db, weInput) as { id: number };

    addWorkExperienceToResume(db, resumeId, weId);

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes).toHaveLength(1);
    expect(wes[0].id).toBe(weId);
    expect(wes[0].employer).toBe('Acme Corp');
  });

  it('appends subsequent WEs after existing ones', () => {
    const resumeId = seedResume();
    const { id: weId1 } = createWorkExperience(db, weInput) as { id: number };
    const { id: weId2 } = createWorkExperience(db, { ...weInput, employer: 'Beta Inc' }) as { id: number };

    addWorkExperienceToResume(db, resumeId, weId1);
    addWorkExperienceToResume(db, resumeId, weId2);

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes[0].id).toBe(weId1);
    expect(wes[1].id).toBe(weId2);
  });

  it('returns an empty array for a resume with no WEs', () => {
    const resumeId = seedResume();
    expect(getWorkExperiencesForResume(db, resumeId)).toEqual([]);
  });
});

describe('removeWorkExperienceFromResume', () => {
  it('unlinks a WE from a resume', () => {
    const resumeId = seedResume();
    const { id: weId } = createWorkExperience(db, weInput) as { id: number };
    addWorkExperienceToResume(db, resumeId, weId);

    removeWorkExperienceFromResume(db, resumeId, weId);

    expect(getWorkExperiencesForResume(db, resumeId)).toHaveLength(0);
  });

  it('deletes the WE when it is not linked to any other resume', () => {
    const resumeId = seedResume();
    const { id: weId } = createWorkExperience(db, weInput) as { id: number };
    addWorkExperienceToResume(db, resumeId, weId);

    removeWorkExperienceFromResume(db, resumeId, weId);

    expect(listAllWorkExperiences(db)).toHaveLength(0);
  });

  it('keeps the WE when it is still linked to another resume', () => {
    const resumeId1 = seedResume();
    const resumeId2 = (
      createResume(db, { title: 'Resume 2', targetRole: 'PM', targetCompany: 'Beta' }) as { id: number }
    ).id;
    const { id: weId } = createWorkExperience(db, weInput) as { id: number };
    addWorkExperienceToResume(db, resumeId1, weId);
    addWorkExperienceToResume(db, resumeId2, weId);

    removeWorkExperienceFromResume(db, resumeId1, weId);

    expect(listAllWorkExperiences(db)).toHaveLength(1);
    expect(getWorkExperiencesForResume(db, resumeId2)).toHaveLength(1);
  });
});

describe('reorderWorkExperience', () => {
  it('moves a WE up by swapping positions with the previous one', () => {
    const resumeId = seedResume();
    const { id: weId1 } = createWorkExperience(db, weInput) as { id: number };
    const { id: weId2 } = createWorkExperience(db, { ...weInput, employer: 'Beta Inc' }) as { id: number };
    addWorkExperienceToResume(db, resumeId, weId1);
    addWorkExperienceToResume(db, resumeId, weId2);

    reorderWorkExperience(db, resumeId, weId2, 'up');

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes[0].id).toBe(weId2);
    expect(wes[1].id).toBe(weId1);
  });

  it('moves a WE down by swapping positions with the next one', () => {
    const resumeId = seedResume();
    const { id: weId1 } = createWorkExperience(db, weInput) as { id: number };
    const { id: weId2 } = createWorkExperience(db, { ...weInput, employer: 'Beta Inc' }) as { id: number };
    addWorkExperienceToResume(db, resumeId, weId1);
    addWorkExperienceToResume(db, resumeId, weId2);

    reorderWorkExperience(db, resumeId, weId1, 'down');

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes[0].id).toBe(weId2);
    expect(wes[1].id).toBe(weId1);
  });

  it('is a no-op when moving the first item up', () => {
    const resumeId = seedResume();
    const { id: weId1 } = createWorkExperience(db, weInput) as { id: number };
    const { id: weId2 } = createWorkExperience(db, { ...weInput, employer: 'Beta Inc' }) as { id: number };
    addWorkExperienceToResume(db, resumeId, weId1);
    addWorkExperienceToResume(db, resumeId, weId2);

    reorderWorkExperience(db, resumeId, weId1, 'up');

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes[0].id).toBe(weId1);
    expect(wes[1].id).toBe(weId2);
  });

  it('is a no-op when moving the last item down', () => {
    const resumeId = seedResume();
    const { id: weId1 } = createWorkExperience(db, weInput) as { id: number };
    const { id: weId2 } = createWorkExperience(db, { ...weInput, employer: 'Beta Inc' }) as { id: number };
    addWorkExperienceToResume(db, resumeId, weId1);
    addWorkExperienceToResume(db, resumeId, weId2);

    reorderWorkExperience(db, resumeId, weId2, 'down');

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes[0].id).toBe(weId1);
    expect(wes[1].id).toBe(weId2);
  });
});
