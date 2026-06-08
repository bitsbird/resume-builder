import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EducationItem } from '@/app/resumes/_components/education-item';
import type { EditorEducation } from '@/app/resumes/_components/editor-types';

const existingEdu: EditorEducation = {
  type: 'existing',
  localId: 'local-1',
  id: 1,
  data: {
    degree: 'BSc Computer Science',
    institution: 'MIT',
    startDate: '2015-09',
    endDate: '2019-06',
  },
};

const newEdu: EditorEducation = {
  type: 'new',
  localId: 'local-2',
  data: {
    degree: '',
    institution: '',
    startDate: '',
    endDate: null,
  },
};

describe('EducationItem', () => {
  it('renders all fields for an existing education entry', () => {
    render(<EducationItem edu={existingEdu} onChange={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByDisplayValue('BSc Computer Science')).toBeInTheDocument();
    expect(screen.getByDisplayValue('MIT')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2015-09')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2019-06')).toBeInTheDocument();
  });

  it('renders with empty fields for a new entry with null endDate', () => {
    render(<EducationItem edu={newEdu} onChange={vi.fn()} onRemove={vi.fn()} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });

  it('calls onChange when the degree field changes', () => {
    const onChange = vi.fn();
    render(<EducationItem edu={existingEdu} onChange={onChange} onRemove={vi.fn()} />);
    fireEvent.change(screen.getByDisplayValue('BSc Computer Science'), {
      target: { value: 'MSc Computer Science' },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ degree: 'MSc Computer Science' }),
    );
  });

  it('calls onRemove when the remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<EducationItem edu={existingEdu} onChange={vi.fn()} onRemove={onRemove} />);
    fireEvent.click(screen.getByTestId('edu-remove'));
    expect(onRemove).toHaveBeenCalled();
  });
});
