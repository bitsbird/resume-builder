import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ResumeWithData } from '@/lib/resumes';
import { getResumeWithData } from '@/lib/resumes';
import PreviewPage from '@/app/resumes/[id]/preview/page';

vi.mock('@/lib/resumes', () => ({
  getResumeWithData: vi.fn(),
}));

const mockResume: ResumeWithData = {
  id: 7,
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

describe('/resumes/[id]/preview page', () => {
  it('wires the resume id and template id into the export link', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);

    render(
      await PreviewPage({
        params: Promise.resolve({ id: '7' }),
        searchParams: Promise.resolve({ templateId: 'default' }),
      }),
    );

    const exportLink = screen.getByRole('link', { name: 'Export to PDF' });
    expect(exportLink).toHaveAttribute('href', '/resumes/7/preview/export?templateId=default');
  });
});
