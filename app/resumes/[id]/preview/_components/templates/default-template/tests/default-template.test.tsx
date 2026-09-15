import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DefaultTemplate } from '@/app/resumes/[id]/preview/_components/templates/default-template/default-template';
import type { JobSeeker } from '@/lib/job-seeker';
import type { ResumeWithData } from '@/lib/resumes';

const fullJobSeeker: JobSeeker = {
  name: 'James Sommers',
  email: 'james.sommers@example.com',
  phone: '+49 160 1234567',
  address: 'Karl Liebknecht Strasse 104, Berlin, Germany',
};

const minimalJobSeeker: JobSeeker = { name: '', email: '', phone: '', address: '' };

const fullResume: ResumeWithData = {
  id: 1,
  title: 'Senior Engineer CV',
  targetRole: 'Staff Software Engineer',
  targetCompany: 'Acme Corp',
  createdAt: '2024-06-01T12:00:00.000Z',
  templateId: 'default',
  profileSummary: 'Building reliable backend systems for five years.',
  workExperiences: [
    {
      id: 1,
      employer: 'Acme Corp',
      role: 'Senior Backend Engineer',
      startDate: '2022-01',
      endDate: null,
      location: 'Berlin',
      header: null,
      accomplishments: [{ id: 1, weId: 1, content: 'Led the platform migration' }],
    },
  ],
  skillSections: [
    {
      id: 1,
      resumeId: 1,
      title: 'Tech Skills',
      position: 0,
      skills: [
        { id: 1, name: 'TypeScript' },
        { id: 2, name: 'React' },
      ],
    },
  ],
  education: [
    { id: 1, degree: 'BSc Computer Science', institution: 'TU Berlin', startDate: '2015', endDate: '2019' },
    { id: 2, degree: 'MSc Computer Science', institution: 'TU Munich', startDate: '2019', endDate: null },
  ],
};

const minimalResume: ResumeWithData = {
  id: 2,
  title: '',
  targetRole: '',
  targetCompany: '',
  createdAt: '',
  templateId: '',
  profileSummary: '',
  workExperiences: [],
  skillSections: [],
  education: [],
};

describe('DefaultTemplate', () => {
  it('renders target role, profile summary, skills, work experience, and education', () => {
    render(<DefaultTemplate resume={fullResume} jobSeeker={fullJobSeeker} />);

    expect(screen.getByText(fullJobSeeker.name)).toBeInTheDocument();
    expect(screen.getByText(fullJobSeeker.email)).toBeInTheDocument();
    expect(screen.getByText(fullJobSeeker.phone)).toBeInTheDocument();
    expect(screen.getByText(fullJobSeeker.address)).toBeInTheDocument();
    expect(screen.getByText('Staff Software Engineer')).toBeInTheDocument();
    const hasProfileSummary = (element: Element | null) =>
      element?.textContent?.startsWith(fullResume.profileSummary) ?? false;
    expect(
      screen.getByText(
        (_, element) =>
          hasProfileSummary(element) &&
          Array.from(element?.children ?? []).every((child) => !hasProfileSummary(child)),
      ),
    ).toBeInTheDocument();

    expect(screen.getByText('Tech Skills:')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();

    // Work Experience rendering itself is covered by WorkTemplateSection's own tests;
    // here we only confirm the resume's data actually reaches that section.
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Senior Backend Engineer')).toBeInTheDocument();

    expect(screen.getByText('BSc Computer Science')).toBeInTheDocument();
    expect(screen.getByText('TU Berlin')).toBeInTheDocument();
    expect(screen.getByText('2015 - 2019')).toBeInTheDocument();
    expect(screen.getByText('MSc Computer Science')).toBeInTheDocument();
    expect(screen.getByText('2019 - Present')).toBeInTheDocument();
  });

  it('renders section labels with no content when resume data is empty', () => {
    render(<DefaultTemplate resume={minimalResume} jobSeeker={minimalJobSeeker} />);

    expect(screen.getByText('Contacts')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();

    expect(screen.queryByText('Tech Skills:')).not.toBeInTheDocument();
    expect(screen.queryByText('Senior Backend Engineer')).not.toBeInTheDocument();
    expect(screen.queryByText('BSc Computer Science')).not.toBeInTheDocument();
  });
});
