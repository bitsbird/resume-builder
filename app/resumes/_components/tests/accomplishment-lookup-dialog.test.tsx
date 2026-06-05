import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccomplishmentLookupDialog } from '@/app/resumes/_components/accomplishment-lookup-dialog';
import type { Accomplishment } from '@/lib/accomplishments';
import type { EditorAccomplishment } from '@/app/resumes/_components/editor-types';

const accA: Accomplishment = { id: 1, weId: 10, content: 'Shipped feature X' };
const accB: Accomplishment = { id: 2, weId: 10, content: 'Reduced latency by 40%' };

const selectedA: EditorAccomplishment = { type: 'existing', localId: 'l-1', id: 1, content: 'Shipped feature X' };

const defaultProps = {
  isOpen: true,
  allAccomplishments: [accA, accB],
  selectedAccomplishments: [],
  onLink: vi.fn(),
  onUnlink: vi.fn(),
  onClose: vi.fn(),
};

describe('AccomplishmentLookupDialog', () => {
  it('renders each accomplishment as a labeled checkbox', () => {
    render(<AccomplishmentLookupDialog {...defaultProps} allAccomplishments={[accA, accB]} />);
    expect(screen.getByLabelText('Shipped feature X')).toBeInTheDocument();
    expect(screen.getByLabelText('Reduced latency by 40%')).toBeInTheDocument();
  });

  it('pre-checks accomplishments that are already selected', () => {
    render(
      <AccomplishmentLookupDialog
        {...defaultProps}
        allAccomplishments={[accA, accB]}
        selectedAccomplishments={[selectedA]}
      />,
    );
    const checkboxes = screen.getAllByTestId('acc-lookup-checkbox');
    expect(checkboxes[0]).toHaveAttribute('data-state', 'checked');
    expect(checkboxes[1]).toHaveAttribute('data-state', 'unchecked');
  });

  it('calls onLink with the accomplishment when an unchecked item is checked', () => {
    const onLink = vi.fn();
    render(
      <AccomplishmentLookupDialog
        {...defaultProps}
        allAccomplishments={[accA]}
        selectedAccomplishments={[]}
        onLink={onLink}
      />,
    );
    fireEvent.click(screen.getByLabelText('Shipped feature X'));
    expect(onLink).toHaveBeenCalledWith(accA);
  });

  it('calls onUnlink with the accomplishment id when a checked item is unchecked', () => {
    const onUnlink = vi.fn();
    render(
      <AccomplishmentLookupDialog
        {...defaultProps}
        allAccomplishments={[accA]}
        selectedAccomplishments={[selectedA]}
        onUnlink={onUnlink}
      />,
    );
    fireEvent.click(screen.getByLabelText('Shipped feature X'));
    expect(onUnlink).toHaveBeenCalledWith(accA.id);
  });

  it('shows an inline validation error and does not call onLink when selecting a 6th accomplishment', () => {
    const accSixth: Accomplishment = { id: 99, weId: 10, content: 'Led team of 5 engineers' };
    const fiveSelected: EditorAccomplishment[] = [
      { type: 'existing', localId: 'l-1', id: 1, content: 'A' },
      { type: 'existing', localId: 'l-2', id: 2, content: 'B' },
      { type: 'existing', localId: 'l-3', id: 3, content: 'C' },
      { type: 'existing', localId: 'l-4', id: 4, content: 'D' },
      { type: 'existing', localId: 'l-5', id: 5, content: 'E' },
    ];
    const onLink = vi.fn();
    render(
      <AccomplishmentLookupDialog
        {...defaultProps}
        allAccomplishments={[accSixth]}
        selectedAccomplishments={fiveSelected}
        onLink={onLink}
      />,
    );
    fireEvent.click(screen.getByLabelText('Led team of 5 engineers'));
    expect(screen.getByTestId('acc-lookup-error')).toBeInTheDocument();
    expect(onLink).not.toHaveBeenCalled();
  });

  it('renders an empty state when there are no accomplishments', () => {
    render(<AccomplishmentLookupDialog {...defaultProps} allAccomplishments={[]} />);
    expect(screen.getByTestId('acc-lookup-empty')).toBeInTheDocument();
  });
});
