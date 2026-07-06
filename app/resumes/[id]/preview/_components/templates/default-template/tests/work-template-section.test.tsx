import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import WorkTemplateSection from '@/app/resumes/[id]/preview/_components/templates/default-template/work-template-section';
import type { WorkExperienceWithAccomplishments } from '@/lib/resumes';

const fullWorkExperiences: WorkExperienceWithAccomplishments[] = [
  {
    id: 1,
    employer: 'Acme Corp',
    role: 'Staff Engineer',
    startDate: '2022-01',
    endDate: null,
    location: 'Berlin',
    header: null,
    accomplishments: [{ id: 1, weId: 1, content: 'Led the platform migration' }],
  },
  {
    id: 2,
    employer: 'Globex',
    role: 'Software Engineer',
    startDate: '2019-03',
    endDate: '2021-12',
    location: 'Remote',
    header: null,
    accomplishments: [],
  },
];

describe('WorkTemplateSection', () => {
  it('renders every work experience with role, employer, dates, and accomplishments', () => {
    render(<WorkTemplateSection title="Work Experience" workExperiences={fullWorkExperiences} />);

    expect(screen.getByText('Staff Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('2022-01 - Present')).toBeInTheDocument();
    expect(screen.getByText('Led the platform migration')).toBeInTheDocument();

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('2019-03 - 2021-12')).toBeInTheDocument();
  });

  it('renders only the title, with no rows, when there are no work experiences', () => {
    render(<WorkTemplateSection title="Work Experience" workExperiences={[]} />);
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.queryByText(/Acme|Globex/)).not.toBeInTheDocument();
  });
});
