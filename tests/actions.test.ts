import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initDb } from '@/lib/db';

vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@/lib/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/db')>();
  return { ...actual, getDb: vi.fn() };
});

import { redirect } from 'next/navigation';
import { getDb } from '@/lib/db';
import { createResumeAction } from '@/app/actions';

beforeEach(() => {
  vi.mocked(getDb).mockReturnValue(initDb(':memory:'));
  vi.mocked(redirect).mockReset();
});

describe('createResumeAction', () => {
  it('redirects to the new resume page on success', async () => {
    await createResumeAction({ title: 'Senior Engineer CV', targetRole: 'Staff Engineer', targetCompany: 'Acme Corp' });
    expect(redirect).toHaveBeenCalledWith(expect.stringMatching(/^\/resumes\/\d+$/));
  });

  it('returns an error when title is a duplicate', async () => {
    const input = { title: 'Senior Engineer CV', targetRole: 'Staff Engineer', targetCompany: 'Acme Corp' };
    await createResumeAction(input);
    const result = await createResumeAction(input);
    expect(result).toMatchObject({ error: expect.any(String) });
  });

  it('returns an error when title is empty', async () => {
    const result = await createResumeAction({ title: '', targetRole: 'Staff Engineer', targetCompany: 'Acme Corp' });
    expect(result).toMatchObject({ error: expect.any(String) });
  });
});
