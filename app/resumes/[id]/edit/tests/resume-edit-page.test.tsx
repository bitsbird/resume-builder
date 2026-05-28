import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getResumeWithData } from '@/lib/resumes';
import ResumeEditPage from '@/app/resumes/[id]/edit/page';

vi.mock('@/lib/resumes', () => ({
  getResumeWithData: vi.fn(),
}));

vi.mock('@/app/actions', () => ({
  updateResumeWithDataAction: vi.fn(),
  listAllWorkExperiencesAction: vi.fn(),
}));

const mockResume = {
  id: 1,
  title: 'Senior Engineer CV',
  targetRole: 'Staff Engineer',
  targetCompany: 'Acme Corp',
  createdAt: '2024-06-01T12:00:00.000Z',
  templateId: 'default',
  profileSummary: '',
  workExperiences: [],
};

beforeEach(() => {
  vi.mocked(getResumeWithData).mockReset();
});

describe('/resumes/[id]/edit page', () => {
  it('renders the work experience section and save button', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    render(await ResumeEditPage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByTestId('we-add-new')).toBeInTheDocument();
    expect(screen.getByTestId('we-lookup-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('edit-resume-save')).toBeInTheDocument();
  });

  it('pre-populates editable resume fields with the current resume data', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    render(await ResumeEditPage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByTestId('resume-title-input')).toHaveValue('Senior Engineer CV');
    expect(screen.getByTestId('resume-role-input')).toHaveValue('Staff Engineer');
    expect(screen.getByTestId('resume-company-input')).toHaveValue('Acme Corp');
  });

  it('pre-populates the editor with the resume existing work experiences', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({
      ...mockResume,
      workExperiences: [
        { id: 5, employer: 'Beta Inc', role: 'Lead', startDate: '2021-03', endDate: null, location: 'SF', header: null },
      ],
    });
    render(await ResumeEditPage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByDisplayValue('Beta Inc')).toBeInTheDocument();
  });
});
