import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getJobSeeker } from '@/lib/job-seeker';
import { getResumeWithData } from '@/lib/resumes';
import ResumePage from '@/app/resumes/[id]/page';

vi.mock('@/lib/resumes', () => ({
  getResumeWithData: vi.fn(),
}));

vi.mock('@/lib/job-seeker', () => ({
  getJobSeeker: vi.fn(),
}));

const mockJobSeeker = {
  name: 'James Sommers',
  email: 'james.sommers@example.com',
  phone: '+49 160 1234567',
  address: 'Karl Liebknecht Strasse 104, Berlin, Germany',
};

const mockResume = {
  id: 1,
  title: 'Senior Engineer CV',
  targetRole: 'Staff Engineer',
  targetCompany: 'Acme Corp',
  createdAt: '2024-06-01T12:00:00.000Z',
  templateId: 'default',
  profileSummary: 'Experienced engineer.',
  workExperiences: [],
  skillSections: [],
  education: [],
};

beforeEach(() => {
  vi.mocked(getResumeWithData).mockReset();
  vi.mocked(getJobSeeker).mockReset();
  vi.mocked(getJobSeeker).mockReturnValue(mockJobSeeker);
});

describe('/resumes/[id] page', () => {
  it('renders resume title and target role in the preview', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByText('Senior Engineer CV')).toBeInTheDocument();
    expect(screen.getByText('Staff Engineer')).toBeInTheDocument();
  });

  it('renders the job seeker contacts', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    const contacts = screen.getByTestId('contacts-section');
    expect(contacts).toHaveTextContent(mockJobSeeker.name);
    expect(contacts).toHaveTextContent(mockJobSeeker.email);
    expect(contacts).toHaveTextContent(mockJobSeeker.phone);
    expect(contacts).toHaveTextContent(mockJobSeeker.address);
  });

  it('renders the contacts section with empty values when job seeker contacts are unset', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    vi.mocked(getJobSeeker).mockReturnValue({ name: '', email: '', phone: '', address: '' });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByTestId('contacts-section')).toBeInTheDocument();
  });

  it('renders the profile summary', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByTestId('profile-section')).toHaveTextContent(mockResume.profileSummary);
  });

  it('does not render the profile section when the profile summary is empty', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({ ...mockResume, profileSummary: '' });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.queryByTestId('profile-section')).not.toBeInTheDocument();
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

  it('renders skill sections with their title and skills', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({
      ...mockResume,
      skillSections: [
        { id: 1, resumeId: 1, title: 'Languages', position: 0, skills: [{ id: 10, name: 'TypeScript' }, { id: 11, name: 'Rust' }] },
      ],
    });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByTestId('skill-section-title')).toHaveTextContent('Languages');
    expect(screen.getByTestId('skill-section-skills')).toHaveTextContent('TypeScript, Rust');
  });

  it('renders multiple skill sections in position order', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({
      ...mockResume,
      skillSections: [
        { id: 1, resumeId: 1, title: 'Languages', position: 0, skills: [{ id: 10, name: 'TypeScript' }, { id: 11, name: 'Rust' }] },
        { id: 2, resumeId: 1, title: 'Tools', position: 1, skills: [{ id: 20, name: 'Docker' }] },
      ],
    });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    const titles = screen.getAllByTestId('skill-section-title');
    expect(titles[0]).toHaveTextContent('Languages');
    expect(titles[1]).toHaveTextContent('Tools');
    const skillLists = screen.getAllByTestId('skill-section-skills');
    expect(skillLists[0]).toHaveTextContent('TypeScript, Rust');
    expect(skillLists[1]).toHaveTextContent('Docker');
  });

  it('renders education entries in the preview', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({
      ...mockResume,
      education: [
        { id: 1, degree: 'BSc Computer Science', institution: 'MIT', startDate: '2015-09', endDate: '2019-06' },
        { id: 2, degree: 'MSc Software Engineering', institution: 'Stanford', startDate: '2019-09', endDate: null },
      ],
    });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByTestId('education-section')).toBeInTheDocument();
    expect(screen.getByText('BSc Computer Science')).toBeInTheDocument();
    expect(screen.getByText('MIT')).toBeInTheDocument();
    expect(screen.getByText('MSc Software Engineering')).toBeInTheDocument();
  });

  it('does not render the education section when no entries are linked', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({ ...mockResume, education: [] });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.queryByTestId('education-section')).not.toBeInTheDocument();
  });

  it('does not render skill sections that have no skills', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({
      ...mockResume,
      skillSections: [
        { id: 1, resumeId: 1, title: 'Empty Section', position: 0, skills: [] },
        { id: 2, resumeId: 1, title: 'Languages', position: 1, skills: [{ id: 10, name: 'TypeScript' }] },
      ],
    });
    render(await ResumePage({ params: Promise.resolve({ id: '1' }) }));
    const titles = screen.getAllByTestId('skill-section-title');
    expect(titles).toHaveLength(1);
    expect(titles[0]).toHaveTextContent('Languages');
  });
});
