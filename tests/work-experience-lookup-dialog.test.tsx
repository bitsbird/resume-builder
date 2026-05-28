import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { WorkExperienceLookupDialog } from '@/app/resumes/_components/work-experience-lookup-dialog';
import type { WorkExperience } from '@/lib/work-experiences';

const available: WorkExperience[] = [
  { id: 1, employer: 'Acme Corp', role: 'Engineer', startDate: '2020-01', endDate: '2023-06', location: 'Remote', header: null },
  { id: 2, employer: 'Beta Inc', role: 'PM', startDate: '2019-03', endDate: null, location: 'NYC', header: 'Product' },
];

describe('WorkExperienceLookupDialog', () => {
  it('shows available work experiences as cards when open', () => {
    render(
      <WorkExperienceLookupDialog
        isOpen={true}
        available={available}
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
        available={[]}
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
        available={available}
        onAdd={onAdd}
        onClose={vi.fn()}
      />,
    );
    fireEvent.click(screen.getAllByTestId('we-lookup-add')[0]);
    expect(onAdd).toHaveBeenCalledWith(available[0]);
  });

  it('calls onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <WorkExperienceLookupDialog
        isOpen={true}
        available={available}
        onAdd={vi.fn()}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByTestId('we-lookup-close'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
