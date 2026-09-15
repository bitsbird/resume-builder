import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ResumeWithData } from '@/lib/resumes';
import { getResumeWithData } from '@/lib/resumes';

vi.mock('@/lib/resumes', () => ({
  getResumeWithData: vi.fn(),
}));

const mockResume: ResumeWithData = {
  id: 1,
  title: 'Senior Engineer CV',
  targetRole: 'Staff Software Engineer',
  targetCompany: 'Acme Corp',
  createdAt: '2024-06-01T12:00:00.000Z',
  templateId: 'default',
  profileSummary: 'Building reliable backend systems for five years.',
  workExperiences: [],
  skillSections: [],
  education: [],
};

beforeEach(() => {
  vi.mocked(getResumeWithData).mockReset();
});

describe('GET /resumes/[id]/preview/export', () => {
  it('returns a downloadable PDF for a valid resume and template', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    const { GET } = await import('@/app/resumes/[id]/preview/export/route');

    const response = await GET(
      new NextRequest('http://localhost/resumes/1/preview/export?templateId=default'),
      { params: Promise.resolve({ id: '1' }) },
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
    expect(response.headers.get('Content-Disposition')).toContain('attachment');
    const body = Buffer.from(await response.arrayBuffer());
    expect(body.length).toBeGreaterThan(0);
    expect(body.toString('latin1', 0, 5)).toBe('%PDF-');
  });

  it('returns 404 for a non-numeric resume id', async () => {
    const { GET } = await import('@/app/resumes/[id]/preview/export/route');

    const response = await GET(
      new NextRequest('http://localhost/resumes/not-a-number/preview/export?templateId=default'),
      { params: Promise.resolve({ id: 'not-a-number' }) },
    );

    expect(response.status).toBe(404);
    expect(getResumeWithData).not.toHaveBeenCalled();
  });

  it('returns 404 for an unknown template id', async () => {
    const { GET } = await import('@/app/resumes/[id]/preview/export/route');

    const response = await GET(
      new NextRequest('http://localhost/resumes/1/preview/export?templateId=does-not-exist'),
      { params: Promise.resolve({ id: '1' }) },
    );

    expect(response.status).toBe(404);
    expect(getResumeWithData).not.toHaveBeenCalled();
  });

  it('returns 404 when the resume does not exist', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(null);
    const { GET } = await import('@/app/resumes/[id]/preview/export/route');

    const response = await GET(
      new NextRequest('http://localhost/resumes/999/preview/export?templateId=default'),
      { params: Promise.resolve({ id: '999' }) },
    );

    expect(response.status).toBe(404);
  });

  it('defaults to the default template when templateId is omitted', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    const { GET } = await import('@/app/resumes/[id]/preview/export/route');

    const response = await GET(new NextRequest('http://localhost/resumes/1/preview/export'), {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
  });

  it('runs in the Node runtime and is not statically cached', async () => {
    const routeModule = await import('@/app/resumes/[id]/preview/export/route');

    expect(routeModule.runtime).toBe('nodejs');
    expect(routeModule.dynamic).toBe('force-dynamic');
  });

  it('strips double quotes from the resume title when building the filename', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({ ...mockResume, title: 'My "Great" Resume' });
    const { GET } = await import('@/app/resumes/[id]/preview/export/route');

    const response = await GET(new NextRequest('http://localhost/resumes/1/preview/export'), {
      params: Promise.resolve({ id: '1' }),
    });

    expect(response.headers.get('Content-Disposition')).toBe('attachment; filename="My Great Resume.pdf"');
  });
});
