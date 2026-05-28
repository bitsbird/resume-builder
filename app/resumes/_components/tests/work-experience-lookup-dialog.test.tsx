import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { WorkExperienceLookupDialog } from '@/app/resumes/_components/work-experience-lookup-dialog';
import type { WorkExperienceWithAccomplishments } from '@/lib/resumes';

const savedWorkExperiences: WorkExperienceWithAccomplishments[] = [
  { id: 1, employer: 'Acme Corp', role: 'Engineer', startDate: '2020-01', endDate: '2023-06', location: 'Remote', header: null, accomplishments: [] },
  { id: 2, employer: 'Beta Inc', role: 'PM', startDate: '2019-03', endDate: null, location: 'NYC', header: 'Product', accomplishments: [] },
];

describe('WorkExperienceLookupDialog', () => {
  it('shows available work experiences as cards when open', () => {
    render(
      <WorkExperienceLookupDialog
        isOpen={true}
        savedWorkExperiences={savedWorkExperiences}
        onAdd={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Beta Inc')).toBeInTheDocument();
  });

  it('shows empty state message when no WEs are available', () => {
    render(
      <WorkExperienceLookupDialog
        isOpen={true}
        savedWorkExperiences={[]}
        onAdd={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByTestId('we-lookup-empty')).toBeInTheDocument();
  });

  it('calls onAdd with the selected work experience when Add is clicked', () => {
    const onAdd = vi.fn();
    render(
      <WorkExperienceLookupDialog
        isOpen={true}
        savedWorkExperiences={savedWorkExperiences}
        onAdd={onAdd}
        onClose={vi.fn()}
      />,
    );
    fireEvent.click(screen.getAllByTestId('we-lookup-add')[0]);
    expect(onAdd).toHaveBeenCalledWith(savedWorkExperiences[0]);
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <WorkExperienceLookupDialog
        isOpen={true}
        savedWorkExperiences={savedWorkExperiences}
        onAdd={vi.fn()}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByTestId('we-lookup-close'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
