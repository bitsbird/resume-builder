import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { WorkExperienceItem } from '@/app/resumes/_components/work-experience-item';
import type { EditorWorkExperience } from '@/app/resumes/_components/editor-types';

const fullWe: EditorWorkExperience = {
  type: 'existing',
  localId: 'local-1',
  id: 1,
  data: {
    employer: 'Acme Corp',
    role: 'Senior Engineer',
    startDate: '2020-01',
    endDate: '2023-06',
    location: 'Remote',
    header: 'Engineering',
  },
};

const minimalWe: EditorWorkExperience = {
  type: 'new',
  localId: 'local-2',
  data: {
    employer: '',
    role: '',
    startDate: '',
    endDate: null,
    location: '',
    header: null,
  },
};

describe('WorkExperienceItem', () => {
  it('renders all fields when fully populated', () => {
    render(
      <WorkExperienceItem
        we={fullWe}
        isFirst={false}
        isLast={false}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Senior Engineer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2020-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023-06')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Remote')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Engineering')).toBeInTheDocument();
  });

  it('renders with all nullable fields null and empty string fields', () => {
    render(
      <WorkExperienceItem
        we={minimalWe}
        isFirst={true}
        isLast={true}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />,
    );
    expect(screen.getByTestId('we-item')).toBeInTheDocument();
  });

  it('disables move-up button when isFirst is true', () => {
    render(
      <WorkExperienceItem
        we={fullWe}
        isFirst={true}
        isLast={false}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />,
    );
    expect(screen.getByTestId('we-move-up')).toBeDisabled();
  });

  it('disables move-down button when isLast is true', () => {
    render(
      <WorkExperienceItem
        we={fullWe}
        isFirst={false}
        isLast={true}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />,
    );
    expect(screen.getByTestId('we-move-down')).toBeDisabled();
  });

  it('calls onRemove when the remove button is clicked', () => {
    const onRemove = vi.fn();
    render(
      <WorkExperienceItem
        we={fullWe}
        isFirst={false}
        isLast={false}
        onChange={vi.fn()}
        onRemove={onRemove}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('we-remove'));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('calls onMoveUp when the move-up button is clicked', () => {
    const onMoveUp = vi.fn();
    render(
      <WorkExperienceItem
        we={fullWe}
        isFirst={false}
        isLast={false}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={onMoveUp}
        onMoveDown={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByTestId('we-move-up'));
    expect(onMoveUp).toHaveBeenCalledOnce();
  });

  it('calls onChange with updated employer when the employer input changes', () => {
    const onChange = vi.fn();
    render(
      <WorkExperienceItem
        we={fullWe}
        isFirst={false}
        isLast={false}
        onChange={onChange}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByDisplayValue('Acme Corp'), { target: { value: 'Beta Inc' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ employer: 'Beta Inc' }));
  });
});
