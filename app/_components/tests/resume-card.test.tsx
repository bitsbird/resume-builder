import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResumeCard } from '@/app/_components/resume-card';
import type { Resume } from '@/lib/resumes';

const fullResume: Resume = {
  id: 1,
  title: 'Senior Engineer CV',
  targetRole: 'Staff Engineer',
  targetCompany: 'Acme Corp',
  createdAt: '2024-06-01T12:00:00.000Z',
  templateId: 'default',
  profileSummary: 'Experienced engineer.',
};

const minimalResume: Resume = {
  id: 2,
  title: '',
  targetRole: '',
  targetCompany: '',
  createdAt: '',
  templateId: '',
  profileSummary: '',
};

describe('ResumeCard', () => {
  it('renders all fields when all parameters are provided', () => {
    const { container } = render(<ResumeCard resume={fullResume} />);
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    expect(screen.getByText('Senior Engineer CV')).toBeInTheDocument();
    expect(screen.getByText('Staff Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('links to the resume detail page', () => {
    render(<ResumeCard resume={fullResume} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/resumes/1');
  });

  it('renders only the card shell when all parameters are empty', () => {
    const { container } = render(<ResumeCard resume={minimalResume} />);
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
    expect(screen.queryByText('Staff Engineer')).not.toBeInTheDocument();
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
    expect(screen.queryByText(/invalid date/i)).not.toBeInTheDocument();
  });
});
