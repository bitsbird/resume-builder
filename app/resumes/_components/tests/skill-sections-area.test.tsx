import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SkillSectionsArea } from '@/app/resumes/_components/skill-sections-area';
import type { EditorSkillSection } from '@/app/resumes/_components/editor-types';

const existingSection: EditorSkillSection = {
  type: 'existing',
  localId: 'section-1',
  id: 5,
  title: 'Tech Skills',
  skills: [{ type: 'existing', localId: 'skill-1', id: 10, name: 'React' }],
};

describe('SkillSectionsArea', () => {
  it('renders only the + Add section button when sections is empty', () => {
    render(<SkillSectionsArea sections={[]} allSkills={[]} onChange={vi.fn()} />);
    expect(screen.getByTestId('skill-section-add')).toBeInTheDocument();
    expect(screen.queryAllByTestId('skill-section-item')).toHaveLength(0);
  });

  it('renders all sections when populated', () => {
    render(<SkillSectionsArea sections={[existingSection]} allSkills={[]} onChange={vi.fn()} />);
    expect(screen.getAllByTestId('skill-section-item')).toHaveLength(1);
    expect(screen.getByDisplayValue('Tech Skills')).toBeInTheDocument();
  });

  it('calls onChange with a new type:new section appended when + Add section is clicked', () => {
    const onChange = vi.fn();
    render(<SkillSectionsArea sections={[]} allSkills={[]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('skill-section-add'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ type: 'new', title: '', skills: [] }),
      ]),
    );
  });

  it('propagates child section changes up via onChange', () => {
    const onChange = vi.fn();
    render(<SkillSectionsArea sections={[existingSection]} allSkills={[]} onChange={onChange} />);
    fireEvent.change(screen.getByTestId('skill-section-title'), {
      target: { value: 'Soft Skills' },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ localId: 'section-1', title: 'Soft Skills' }),
      ]),
    );
  });
});
