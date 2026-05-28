import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getResumeWithData } from '@/lib/resumes';
import ResumePage from '@/app/resumes/[id]/page';

vi.mock('@/lib/resumes', () => ({
  getResumeWithData: vi.fn(),
}));

const mockResume = {
  id: 1,
  title: 'Senior Engineer CV',
  targetRole: 'Staff Engineer',
  targetCompany: 'Acme Corp',
  createdAt: '2024-06-01T12:00:00.000Z',
  templateId: 'default',
  profileSummary: 'Experienced engineer.',
  workExperiences: [],
};

beforeEach(() => {
  vi.mocked(getResumeWithData).mockReset();
});

describe('/resumes/[id] page', () => {
  it('renders resume title and target role in the preview', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByText('Senior Engineer CV')).toBeInTheDocument();
    expect(screen.getByText('Staff Engineer')).toBeInTheDocument();
  });

  it('renders an Edit link pointing to the edit route', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByTestId('resume-edit-link')).toHaveAttribute('href', '/resumes/1/edit');
  });

  it('renders work experiences in the preview', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({
      ...mockResume,
      workExperiences: [
        { id: 1, employer: 'Beta Industries', role: 'Engineer', startDate: '2020-01', endDate: null, location: 'Remote', header: null, accomplishments: [] },
      ],
    });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByText('Beta Industries')).toBeInTheDocument();
  });

  it('renders accomplishments under their work experience', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({
      ...mockResume,
      workExperiences: [
        {
          id: 1,
          employer: 'Beta Industries',
          role: 'Engineer',
          startDate: '2020-01',
          endDate: null,
          location: 'Remote',
          header: null,
          accomplishments: [
            { id: 101, weId: 1, content: 'Shipped feature X' },
            { id: 102, weId: 1, content: 'Reduced latency by 40%' },
          ],
        },
      ],
    });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
    expect(screen.getByText('Reduced latency by 40%')).toBeInTheDocument();
  });

  it('renders no accomplishment list when a WE has none', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({
      ...mockResume,
      workExperiences: [
        { id: 1, employer: 'Beta Industries', role: 'Engineer', startDate: '2020-01', endDate: null, location: 'Remote', header: null, accomplishments: [] },
      ],
    });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.queryAllByTestId('we-accomplishment')).toHaveLength(0);
  });
});
