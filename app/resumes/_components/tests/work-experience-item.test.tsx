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
  accomplishments: [
    { type: 'existing', localId: 'acc-1', id: 101, content: 'Shipped feature X' },
    { type: 'existing', localId: 'acc-2', id: 102, content: 'Reduced latency by 40%' },
  ],
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
  accomplishments: [],
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
        onAddAccomplishment={vi.fn()}
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
        onAddAccomplishment={vi.fn()}
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
        onAddAccomplishment={vi.fn()}
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
        onAddAccomplishment={vi.fn()}
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
        onAddAccomplishment={vi.fn()}
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
        onAddAccomplishment={vi.fn()}
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
        onAddAccomplishment={vi.fn()}
      />,
    );
    fireEvent.change(screen.getByDisplayValue('Acme Corp'), { target: { value: 'Beta Inc' } });
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ employer: 'Beta Inc' }));
  });

  it('renders the accomplishments list when accomplishments are present', () => {
    render(
      <WorkExperienceItem
        we={fullWe}
        isFirst={false}
        isLast={false}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
        onAddAccomplishment={vi.fn()}
      />,
    );
    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
    expect(screen.getByText('Reduced latency by 40%')).toBeInTheDocument();
  });

  it('renders no accomplishment items when the list is empty', () => {
    render(
      <WorkExperienceItem
        we={minimalWe}
        isFirst={true}
        isLast={true}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
        onAddAccomplishment={vi.fn()}
      />,
    );
    expect(screen.queryAllByTestId('accomplishment-item')).toHaveLength(0);
  });

  it('calls onAddAccomplishment with the typed content when the add button is clicked', () => {
    const onAddAccomplishment = vi.fn();
    render(
      <WorkExperienceItem
        we={minimalWe}
        isFirst={true}
        isLast={true}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
        onAddAccomplishment={onAddAccomplishment}
      />,
    );
    fireEvent.change(screen.getByTestId('accomplishment-input'), {
      target: { value: 'Launched new product' },
    });
    fireEvent.click(screen.getByTestId('accomplishment-add'));
    expect(onAddAccomplishment).toHaveBeenCalledWith('Launched new product');
  });

  it('clears the input after adding an accomplishment', () => {
    render(
      <WorkExperienceItem
        we={minimalWe}
        isFirst={true}
        isLast={true}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
        onAddAccomplishment={vi.fn()}
      />,
    );
    const input = screen.getByTestId('accomplishment-input');
    fireEvent.change(input, { target: { value: 'Something great' } });
    fireEvent.click(screen.getByTestId('accomplishment-add'));
    expect(input).toHaveValue('');
  });

  it('shows the Browse accomplishments button for an existing WE and calls onOpenAccomplishmentLookup when clicked', () => {
    const onOpenAccomplishmentLookup = vi.fn();
    render(
      <WorkExperienceItem
        we={fullWe}
        isFirst={false}
        isLast={false}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
        onAddAccomplishment={vi.fn()}
        onOpenAccomplishmentLookup={onOpenAccomplishmentLookup}
      />,
    );
    const browseBtn = screen.getByTestId('acc-lookup-trigger');
    expect(browseBtn).toBeInTheDocument();
    fireEvent.click(browseBtn);
    expect(onOpenAccomplishmentLookup).toHaveBeenCalledOnce();
  });

  it('does not show the Browse accomplishments button for a new WE', () => {
    render(
      <WorkExperienceItem
        we={minimalWe}
        isFirst={true}
        isLast={true}
        onChange={vi.fn()}
        onRemove={vi.fn()}
        onMoveUp={vi.fn()}
        onMoveDown={vi.fn()}
        onAddAccomplishment={vi.fn()}
      />,
    );
    expect(screen.queryByTestId('acc-lookup-trigger')).not.toBeInTheDocument();
  });
});
