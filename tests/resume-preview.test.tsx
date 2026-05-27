import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResumePreview } from '@/app/_components/resume-preview';
import type { Resume } from '@/lib/resumes';

const fullResume: Partial<Resume> = {
  title: 'Senior Engineer CV',
  targetRole: 'Staff Engineer',
  targetCompany: 'Acme Corp',
};

describe('ResumePreview', () => {
  it('renders the preview area with all fields populated', () => {
    const { container } = render(<ResumePreview resume={fullResume} />);
    expect(container.querySelector('[data-slot="resume-preview"]')).toBeInTheDocument();
    expect(screen.getByText('Senior Engineer CV')).toBeInTheDocument();
    expect(screen.getByText('Staff Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('renders the preview area without breaking when all fields are empty', () => {
    const { container } = render(<ResumePreview resume={{}} />);
    expect(container.querySelector('[data-slot="resume-preview"]')).toBeInTheDocument();
  });
});
