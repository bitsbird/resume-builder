import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SkillSectionItem } from '@/app/resumes/_components/skill-section-item';
import type { EditorSkill, EditorSkillSection } from '@/app/resumes/_components/editor-types';

const existingSkill: EditorSkill = { type: 'existing', localId: 'skill-1', id: 10, name: 'React' };
const newSkill: EditorSkill = { type: 'new', localId: 'skill-2', name: 'Node.js' };

const fullSection: EditorSkillSection = {
  type: 'existing',
  localId: 'section-1',
  id: 5,
  title: 'Tech Skills',
  skills: [existingSkill, newSkill],
};

const emptySection: EditorSkillSection = {
  type: 'new',
  localId: 'section-2',
  title: '',
  skills: [],
};

describe('SkillSectionItem', () => {
  it('renders title and skill chips when fully populated', () => {
    render(
      <SkillSectionItem
        section={fullSection}
        onChange={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.getByDisplayValue('Tech Skills')).toBeInTheDocument();
    expect(screen.getByTestId('skill-chip-skill-1')).toHaveTextContent('React');
    expect(screen.getByTestId('skill-chip-skill-2')).toHaveTextContent('Node.js');
  });

  it('renders without error when skills array is empty (boundary)', () => {
    render(
      <SkillSectionItem
        section={emptySection}
        onChange={vi.fn()}
        onRemove={vi.fn()}
      />,
    );
    expect(screen.queryAllByTestId(/^skill-chip-/)).toHaveLength(0);
    expect(screen.getByTestId('skill-section-delete')).toBeInTheDocument();
  });

  it('calls onRemove when the delete button is clicked', () => {
    const onRemove = vi.fn();
    render(
      <SkillSectionItem section={fullSection} onChange={vi.fn()} onRemove={onRemove} />,
    );
    fireEvent.click(screen.getByTestId('skill-section-delete'));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('calls onChange with updated title when title input changes', () => {
    const onChange = vi.fn();
    render(
      <SkillSectionItem section={fullSection} onChange={onChange} onRemove={vi.fn()} />,
    );
    fireEvent.change(screen.getByTestId('skill-section-title'), {
      target: { value: 'Updated Title' },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Updated Title' }),
    );
  });

  it('calls onAddSkill with the trimmed name when a valid skill is submitted', () => {
    const onChange = vi.fn();
    render(
      <SkillSectionItem section={emptySection} onChange={onChange} onRemove={vi.fn()} />,
    );
    fireEvent.change(screen.getByTestId('skill-name-input'), {
      target: { value: '  TypeScript  ' },
    });
    fireEvent.click(screen.getByTestId('skill-add'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        skills: expect.arrayContaining([
          expect.objectContaining({ type: 'new', name: 'TypeScript' }),
        ]),
      }),
    );
  });

  it('shows a validation error and does not call onChange when skill name has more than 2 words', () => {
    const onChange = vi.fn();
    render(
      <SkillSectionItem section={emptySection} onChange={onChange} onRemove={vi.fn()} />,
    );
    fireEvent.change(screen.getByTestId('skill-name-input'), {
      target: { value: 'too many words here' },
    });
    fireEvent.click(screen.getByTestId('skill-add'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId('skill-name-error')).toBeInTheDocument();
  });

  it('calls onChange without the removed skill when a chip remove button is clicked', () => {
    const onChange = vi.fn();
    render(
      <SkillSectionItem section={fullSection} onChange={onChange} onRemove={vi.fn()} />,
    );
    fireEvent.click(screen.getByTestId('skill-remove-skill-1'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        skills: expect.not.arrayContaining([expect.objectContaining({ localId: 'skill-1' })]),
      }),
    );
  });
});
