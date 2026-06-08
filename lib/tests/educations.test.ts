import type Database from 'better-sqlite3';
import { beforeEach, describe, expect, it } from 'vitest';

import { initDb } from '@/lib/db';
import { createResume } from '@/lib/resumes';
import {
  addEducationToResume,
  createEducation,
  deleteEducation,
  getEducationForResume,
  listAllEducation,
  removeEducationFromResume,
  updateEducation,
} from '@/lib/educations';

let db: Database.Database;

const eduInput = {
  degree: 'BSc Computer Science',
  institution: 'MIT',
  startDate: '2015-09',
  endDate: '2019-06',
};

function seedResume(title = 'My Resume') {
  const result = createResume(db, { title, targetRole: 'Engineer', targetCompany: 'Acme' });
  return (result as { id: number }).id;
}

beforeEach(() => {
  db = initDb(':memory:');
});

describe('createEducation', () => {
  it('inserts an education entry and returns its id', () => {
    const result = createEducation(db, eduInput);
    expect(result).toMatchObject({ id: expect.any(Number) });
  });

  it('stores nullable endDate as null', () => {
    const { id } = createEducation(db, { ...eduInput, endDate: null });
    const all = listAllEducation(db);
    expect(all.find((e) => e.id === id)?.endDate).toBeNull();
  });
});

describe('updateEducation', () => {
  it('updates all fields of an existing education entry', () => {
    const { id } = createEducation(db, eduInput);

    updateEducation(db, id, {
      degree: 'MSc Software Engineering',
      institution: 'Stanford',
      startDate: '2019-09',
      endDate: '2021-06',
    });

    const all = listAllEducation(db);
    expect(all[0]).toMatchObject({
      id,
      degree: 'MSc Software Engineering',
      institution: 'Stanford',
      startDate: '2019-09',
      endDate: '2021-06',
    });
  });
});

describe('listAllEducation', () => {
  it('returns an empty array when none exist', () => {
    expect(listAllEducation(db)).toEqual([]);
  });

  it('returns all created education entries', () => {
    createEducation(db, eduInput);
    createEducation(db, { ...eduInput, degree: 'MBA' });
    expect(listAllEducation(db)).toHaveLength(2);
  });
});

describe('deleteEducation', () => {
  it('removes the education entry from the global pool', () => {
    const { id } = createEducation(db, eduInput);
    deleteEducation(db, id);
    expect(listAllEducation(db)).toHaveLength(0);
  });
});

describe('addEducationToResume + getEducationForResume', () => {
  it('links an education entry to a resume and returns it', () => {
    const resumeId = seedResume();
    const { id: eduId } = createEducation(db, eduInput);

    addEducationToResume(db, resumeId, eduId);

    const entries = getEducationForResume(db, resumeId);
    expect(entries).toHaveLength(1);
    expect(entries[0].id).toBe(eduId);
    expect(entries[0].degree).toBe('BSc Computer Science');
  });

  it('returns entries ordered by endDate descending (null first)', () => {
    const resumeId = seedResume();
    const { id: currentId } = createEducation(db, { ...eduInput, endDate: null });
    const { id: olderId } = createEducation(db, { ...eduInput, endDate: '2015-06' });
    const { id: newerId } = createEducation(db, { ...eduInput, endDate: '2019-06' });

    addEducationToResume(db, resumeId, currentId);
    addEducationToResume(db, resumeId, olderId);
    addEducationToResume(db, resumeId, newerId);

    const entries = getEducationForResume(db, resumeId);
    expect(entries[0].id).toBe(currentId);
    expect(entries[1].id).toBe(newerId);
    expect(entries[2].id).toBe(olderId);
  });

  it('returns an empty array for a resume with no education entries', () => {
    const resumeId = seedResume();
    expect(getEducationForResume(db, resumeId)).toEqual([]);
  });
});

describe('removeEducationFromResume', () => {
  it('unlinks an education entry from a resume', () => {
    const resumeId = seedResume();
    const { id: eduId } = createEducation(db, eduInput);
    addEducationToResume(db, resumeId, eduId);

    removeEducationFromResume(db, resumeId, eduId);

    expect(getEducationForResume(db, resumeId)).toHaveLength(0);
  });

  it('deletes the entry when it is not linked to any other resume', () => {
    const resumeId = seedResume();
    const { id: eduId } = createEducation(db, eduInput);
    addEducationToResume(db, resumeId, eduId);

    removeEducationFromResume(db, resumeId, eduId);

    expect(listAllEducation(db)).toHaveLength(0);
  });

  it('keeps the entry when it is still linked to another resume', () => {
    const resumeId1 = seedResume('Resume 1');
    const resumeId2 = seedResume('Resume 2');
    const { id: eduId } = createEducation(db, eduInput);
    addEducationToResume(db, resumeId1, eduId);
    addEducationToResume(db, resumeId2, eduId);

    removeEducationFromResume(db, resumeId1, eduId);

    expect(listAllEducation(db)).toHaveLength(1);
    expect(getEducationForResume(db, resumeId2)).toHaveLength(1);
  });
});
