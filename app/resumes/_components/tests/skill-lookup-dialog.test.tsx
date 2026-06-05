import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SkillLookupDialog } from '@/app/resumes/_components/skill-lookup-dialog';
import type { Skill } from '@/lib/skills';

const skillA: Skill = { id: 1, name: 'React' };
const skillB: Skill = { id: 2, name: 'TypeScript' };

const defaultProps = {
  isOpen: true,
  availableSkills: [skillA, skillB],
  onLink: vi.fn(),
  onClose: vi.fn(),
};

describe('SkillLookupDialog', () => {
  it('renders each available skill as a button', () => {
    render(<SkillLookupDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'TypeScript' })).toBeInTheDocument();
  });

  it('renders an empty state when there are no available skills', () => {
    render(<SkillLookupDialog {...defaultProps} availableSkills={[]} />);
    expect(screen.getByTestId('skill-lookup-empty')).toBeInTheDocument();
  });

  it('calls onLink with the skill when a skill button is clicked', () => {
    const onLink = vi.fn();
    render(<SkillLookupDialog {...defaultProps} onLink={onLink} />);
    fireEvent.click(screen.getByRole('button', { name: 'React' }));
    expect(onLink).toHaveBeenCalledWith(skillA);
  });

  it('calls onClose when the dialog is closed without selecting', () => {
    const onClose = vi.fn();
    render(<SkillLookupDialog {...defaultProps} onClose={onClose} />);
    // Trigger dialog close via escape key on the dialog's close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
