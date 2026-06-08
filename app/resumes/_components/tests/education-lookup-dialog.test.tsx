import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EducationLookupDialog } from '@/app/resumes/_components/education-lookup-dialog';
import type { Education } from '@/lib/educations';

const edu: Education = {
  id: 1,
  degree: 'BSc Computer Science',
  institution: 'MIT',
  startDate: '2015-09',
  endDate: '2019-06',
};

describe('EducationLookupDialog', () => {
  it('renders saved education entries', () => {
    render(
      <EducationLookupDialog
        isOpen={true}
        savedEducation={[edu]}
        onAdd={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText('BSc Computer Science')).toBeInTheDocument();
    expect(screen.getByText('MIT')).toBeInTheDocument();
  });

  it('shows empty state when no saved entries', () => {
    render(
      <EducationLookupDialog
        isOpen={true}
        savedEducation={[]}
        onAdd={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByTestId('edu-lookup-empty')).toBeInTheDocument();
  });

  it('calls onAdd with the education entry when the add button is clicked', () => {
    const onAdd = vi.fn();
    render(
      <EducationLookupDialog
        isOpen={true}
        savedEducation={[edu]}
        onAdd={onAdd}
        onClose={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('edu-lookup-add'));
    expect(onAdd).toHaveBeenCalledWith(edu);
  });

  it('does not render when closed', () => {
    render(
      <EducationLookupDialog
        isOpen={false}
        savedEducation={[edu]}
        onAdd={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByText('BSc Computer Science')).not.toBeInTheDocument();
  });
});
