import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResumeHeading } from '@/app/resumes/[id]/preview/_components/templates/default-template/resume-heading';

describe('ResumeHeading', () => {
  it('renders children as a level-1 heading for size lg', () => {
    render(
      <ResumeHeading size="lg" testId="name">
        James Sommers
      </ResumeHeading>,
    );
    const heading = screen.getByTestId('name');
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveTextContent('James Sommers');
  });

  it('renders as a level-3 heading for size md', () => {
    render(<ResumeHeading size="md">Staff Engineer</ResumeHeading>);
    expect(screen.getByText('Staff Engineer').tagName).toBe('H3');
  });

  it('renders as a level-4 heading for size sm, with no testId or className required', () => {
    render(<ResumeHeading size="sm">Education</ResumeHeading>);
    expect(screen.getByText('Education').tagName).toBe('H4');
  });
});
