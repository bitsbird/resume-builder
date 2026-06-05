import { redirect } from 'next/navigation';

import { beforeEach, describe, expect, it } from 'vitest';

import { createResumeAction, createResumeWithDataAction, updateResumeWithDataAction } from '@/app/actions';
import { initDb } from '@/lib/db';
import { getDb } from '@/lib/db';
import { getWorkExperiencesForResume, listAllWorkExperiences } from '@/lib/work-experiences';
import { getAccomplishmentsForResumeWe } from '@/lib/accomplishments';
import { listResumes, getResumeWithData } from '@/lib/resumes';
import { getSkillSectionsForResume } from '@/lib/skills';

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
        { type: 'new', data: { employer: 'Acme', role: 'Eng', startDate: '2020-01', endDate: null, location: 'Remote', header: null }, accomplishments: [] },
        { type: 'new', data: { employer: 'Beta', role: 'PM', startDate: '2022-01', endDate: '2023-01', location: 'NYC', header: null }, accomplishments: [] },
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
    db.prepare('INSERT INTO work_experiences (employer, role, start_date, end_date, location, header) VALUES (?, ?, ?, ?, ?, ?)').run('Existing Co', 'Dev', '2019-01', '2022-06', 'LA', 'Frontend team');
    const existingWeId = (db.prepare('SELECT id FROM work_experiences').get() as { id: number }).id;

    await createResumeWithDataAction({
      title: 'My Resume',
      targetRole: 'Engineer',
      targetCompany: 'Acme',
      workExperiences: [{ type: 'existing', id: existingWeId, data: { employer: 'Existing Co', role: 'Dev', startDate: '2019-01', endDate: '2022-06', location: 'LA', header: 'Frontend team' }, accomplishments: [] }],
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
        { type: 'new', data: { employer: 'New Co', role: 'Lead', startDate: '2023-01', endDate: null, location: 'SF', header: null }, accomplishments: [] },
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
        { type: 'new', data: { employer: 'Kept Co', role: 'Dev', startDate: '2020-01', endDate: '2024-03', location: 'Remote', header: 'Platform team' }, accomplishments: [] },
      ],
    });

    const weId = getWorkExperiencesForResume(db, resumeId)[0].id;

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [{ type: 'existing', id: weId, data: { employer: 'Kept Co', role: 'Dev', startDate: '2020-01', endDate: '2024-03', location: 'Remote', header: 'Platform team' }, accomplishments: [] }],
    });

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes).toHaveLength(1);
    expect(wes[0].id).toBe(weId);
    expect(listAllWorkExperiences(db)).toHaveLength(1);
  });

  it('updates the data of an existing WE when saved with modified fields', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [
        { type: 'new', data: { employer: 'Old Co', role: 'Junior Dev', startDate: '2025-01', endDate: '2025-06', location: 'Remote', header: 'Initial header' }, accomplishments: [] },
      ],
    });

    const weId = getWorkExperiencesForResume(db, resumeId)[0].id;

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [{ type: 'existing', id: weId, data: { employer: 'Old Co', role: 'Senior Dev', startDate: '2025-02', endDate: '2025-12', location: 'NYC', header: 'Updated header' }, accomplishments: [] }],
    });

    const wes = getWorkExperiencesForResume(db, resumeId);
    expect(wes).toHaveLength(1);
    expect(wes[0]).toMatchObject({ role: 'Senior Dev', startDate: '2025-02', endDate: '2025-12', location: 'NYC', header: 'Updated header' });
  });

  it('deletes orphaned WEs removed from the list', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [
        { type: 'new', data: { employer: 'Gone Co', role: 'Dev', startDate: '2020-01', endDate: null, location: 'Remote', header: null }, accomplishments: [] },
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

  it('creates and links new accomplishments for a work experience', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [
        {
          type: 'new',
          data: { employer: 'Acme', role: 'Eng', startDate: '2020-01', endDate: null, location: 'Remote', header: null },
          accomplishments: [
            { type: 'new', content: 'Shipped feature X' },
            { type: 'new', content: 'Reduced latency by 40%' },
          ],
        },
      ],
    });

    const wes = getWorkExperiencesForResume(db, resumeId);
    const accs = getAccomplishmentsForResumeWe(db, resumeId, wes[0].id);
    expect(accs).toHaveLength(2);
    expect(accs[0]).toMatchObject({ weId: wes[0].id, content: 'Shipped feature X' });
    expect(accs[1]).toMatchObject({ weId: wes[0].id, content: 'Reduced latency by 40%' });
  });

  it('enforces max-5-per-WE and returns an error when exceeded', async () => {
    const resumeId = await seedResume();

    const result = await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [
        {
          type: 'new',
          data: { employer: 'Acme', role: 'Eng', startDate: '2020-01', endDate: null, location: 'Remote', header: null },
          accomplishments: [
            { type: 'new', content: 'One' },
            { type: 'new', content: 'Two' },
            { type: 'new', content: 'Three' },
            { type: 'new', content: 'Four' },
            { type: 'new', content: 'Five' },
            { type: 'new', content: 'Six' },
          ],
        },
      ],
    });

    expect(result).toMatchObject({ error: expect.any(String) });
  });

  it('creates new skill sections with their skills and returns them via getResumeWithData', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [],
      skillSections: [
        {
          type: 'new',
          title: 'Tech Skills',
          skills: [
            { type: 'new', name: 'React' },
            { type: 'new', name: 'Node.js' },
          ],
        },
        {
          type: 'new',
          title: 'Soft Skills',
          skills: [{ type: 'new', name: 'Leadership' }],
        },
      ],
    });

    const sections = getSkillSectionsForResume(db, resumeId);
    expect(sections).toHaveLength(2);
    expect(sections[0]).toMatchObject({ resumeId, title: 'Tech Skills', position: 0 });
    expect(sections[0].skills).toHaveLength(2);
    expect(sections[0].skills[0]).toMatchObject({ name: 'React' });
    expect(sections[0].skills[1]).toMatchObject({ name: 'Node.js' });
    expect(sections[1]).toMatchObject({ resumeId, title: 'Soft Skills', position: 1 });
    expect(sections[1].skills[0]).toMatchObject({ name: 'Leadership' });
  });

  it('preserves existing skill sections and keeps non-orphaned skills on re-save', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [],
      skillSections: [
        { type: 'new', title: 'Tech Skills', skills: [{ type: 'new', name: 'React' }] },
      ],
    });

    const sectionsBefore = getSkillSectionsForResume(db, resumeId);
    const sectionId = sectionsBefore[0].id;
    const skillId = sectionsBefore[0].skills[0].id;

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [],
      skillSections: [
        {
          type: 'existing',
          id: sectionId,
          title: 'Tech Skills',
          skills: [{ type: 'existing', id: skillId, name: 'React' }],
        },
      ],
    });

    const sectionsAfter = getSkillSectionsForResume(db, resumeId);
    expect(sectionsAfter).toHaveLength(1);
    expect(sectionsAfter[0].id).toBe(sectionId);
    expect(sectionsAfter[0].skills[0].id).toBe(skillId);
  });

  it('includes skill sections when reading resume via getResumeWithData', async () => {
    const resumeId = await seedResume();

    await updateResumeWithDataAction({
      resumeId,
      ...baseFields,
      workExperiences: [],
      skillSections: [
        { type: 'new', title: 'Tech Skills', skills: [{ type: 'new', name: 'TypeScript' }] },
      ],
    });

    const resume = getResumeWithData(db, resumeId);
    expect(resume?.skillSections).toHaveLength(1);
    expect(resume?.skillSections[0]).toMatchObject({ title: 'Tech Skills' });
    expect(resume?.skillSections[0].skills[0]).toMatchObject({ name: 'TypeScript' });
  });
});
