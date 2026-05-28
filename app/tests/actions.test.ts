import { redirect } from 'next/navigation';

import { beforeEach, describe, expect, it } from 'vitest';

import { createResumeAction, createResumeWithDataAction, updateResumeWithDataAction } from '@/app/actions';
import { initDb } from '@/lib/db';
import { getDb } from '@/lib/db';
import { getWorkExperiencesForResume, listAllWorkExperiences } from '@/lib/work-experiences';
import { listResumes } from '@/lib/resumes';

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@/lib/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/db')>();
  return { ...actual, getDb: vi.fn() };
});

import { vi } from 'vitest';

let db: ReturnType<typeof initDb>;

beforeEach(() => {
  db = initDb(':memory:');
  vi.mocked(getDb).mockReturnValue(db);
  vi.mocked(redirect).mockReset();
});

describe('createResumeAction', () => {
  it('redirects to the new resume page on success', async () => {
    await createResumeAction({
      title: 'Senior Engineer CV',
      targetRole: 'Staff Engineer',
      targetCompany: 'Acme Corp',
    });
    expect(redirect).toHaveBeenCalledWith(expect.stringMatching(/^\/resumes\/\d+$/));
  });

  it('returns an error when title is a duplicate', async () => {
    const input = {
      title: 'Senior Engineer CV',
      targetRole: 'Staff Engineer',
      targetCompany: 'Acme Corp',
    };
    await createResumeAction(input);
    const result = await createResumeAction(input);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  it('returns an error when title is empty', async () => {
    const result = await createResumeAction({
      title: '',
      targetRole: 'Staff Engineer',
      targetCompany: 'Acme Corp',
    });
    expect(result).toMatchObject({ error: expect.any(String) });
  });
});

describe('createResumeWithDataAction', () => {
  it('creates the resume and redirects to its page', async () => {
    await createResumeWithDataAction({
      title: 'My Resume',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
      workExperiences: [],
    });
    expect(redirect).toHaveBeenCalledWith(expect.stringMatching(/^\/resumes\/\d+$/));
    expect(listResumes(db)).toHaveLength(1);
  });

  it('creates new work experiences and links them atomically', async () => {
    await createResumeWithDataAction({
      title: 'My Resume',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
      workExperiences: [
        { type: 'new', data: { employer: 'Acme', role: 'Eng', startDate: '2020-01', endDate: null, location: 'Remote', header: null } },
        { type: 'new', data: { employer: 'Beta', role: 'PM', startDate: '2022-01', endDate: '2023-01', location: 'NYC', header: null } },
      ],
    });

    const resumes = listResumes(db);
    expect(resumes).toHaveLength(1);
    const wes = getWorkExperiencesForResume(db, resumes[0].id);
    expect(wes).toHaveLength(2);
    expect(wes[0].employer).toBe('Acme');
    expect(wes[1].employer).toBe('Beta');
  });

  it('links existing work experiences', async () => {
    // pre-create a WE
    db.prepare('INSERT INTO work_experiences (employer, role, start_date, end_date, location, header) VALUES (?, ?, ?, ?, ?, ?)').run('Existing Co', 'Dev', '2019-01', null, 'LA', null);
    const existingWeId = (db.prepare('SELECT id FROM work_experiences').get() as { id: number }).id;

    await createResumeWithDataAction({
      title: 'My Resume',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
      workExperiences: [{ type: 'existing', id: existingWeId }],
    });

    const resumes = listResumes(db);
    const wes = getWorkExperiencesForResume(db, resumes[0].id);
    expect(wes).toHaveLength(1);
    expect(wes[0].id).toBe(existingWeId);
  });

  it('returns an error when title is empty', async () => {
    const result = await createResumeWithDataAction({
      title: '',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
      workExperiences: [],
    });
    expect(result).toMatchObject({ error: expect.any(String) });
    expect(listResumes(db)).toHaveLength(0);
  });
});

describe('updateResumeWithDataAction', () => {
  const baseFields = { title: 'My Resume', targetRole: 'Engineer', targetCompany: 'Acme' };

  async function seedResume() {
    await createResumeWithDataAction({ ...baseFields, workExperiences: [] });
    return listResumes(db)[0].id;
  }

  it('updates the resume title, targetRole and targetCompany', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      title: 'Updated Resume',
      targetRole: 'Staff Engineer',
      targetCompany: 'Beta Corp',
      workExperiences: [],
    });

    const resume = listResumes(db)[0];
    expect(resume).toMatchObject({ title: 'Updated Resume', targetRole: 'Staff Engineer', targetCompany: 'Beta Corp' });
  });

  it('returns an error when the new title is empty', async () => {
    const resumeId = await seedResume();

    const result = await updateResumeWithDataAction({
      resumeId,
      title: '',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
      workExperiences: [],
    });

    expect(result).toMatchObject({ error: expect.any(String) });
    expect(listResumes(db)[0].title).toBe('My Resume');
  });

  it('replaces work experiences with the new list', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [
        { type: 'new', data: { employer: 'New Co', role: 'Lead', startDate: '2023-01', endDate: null, location: 'SF', header: null } },
      ],
    });

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes).toHaveLength(1);
    expect(wes[0].employer).toBe('New Co');
  });

  it('preserves existing WEs that are kept in the new list', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [
        { type: 'new', data: { employer: 'Kept Co', role: 'Dev', startDate: '2020-01', endDate: null, location: 'Remote', header: null } },
      ],
    });

    const weId = getWorkExperiencesForResume(db, resumeId)[0].id;

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [{ type: 'existing', id: weId }],
    });

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes).toHaveLength(1);
    expect(wes[0].id).toBe(weId);
    expect(listAllWorkExperiences(db)).toHaveLength(1);
  });

  it('deletes orphaned WEs removed from the list', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [
        { type: 'new', data: { employer: 'Gone Co', role: 'Dev', startDate: '2020-01', endDate: null, location: 'Remote', header: null } },
      ],
    });

    await updateResumeWithDataAction({ resumeId, ...baseFields, workExperiences: [] });

    expect(getWorkExperiencesForResume(db, resumeId)).toHaveLength(0);
    expect(listAllWorkExperiences(db)).toHaveLength(0);
  });

  it('redirects to the resume view page', async () => {
    const resumeId = await seedResume();
    vi.mocked(redirect).mockReset();

    await updateResumeWithDataAction({ resumeId, ...baseFields, workExperiences: [] });

    expect(redirect).toHaveBeenCalledWith(`/resumes/${resumeId}`);
  });
});
