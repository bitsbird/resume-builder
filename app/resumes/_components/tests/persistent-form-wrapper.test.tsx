import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PersistentFormWrapper } from '@/app/resumes/_components/persistent-form-wrapper';

describe('PersistentFormWrapper', () => {
  it('renders children and both buttons with all props fully populated', () => {
    const onSave = vi.fn();
    const onCancel = vi.fn();

    render(
      <PersistentFormWrapper
        onSave={onSave}
        onCancel={onCancel}
        saveTestId="save-btn"
        cancelTestId="cancel-btn"
      >
        <div data-testid="child-content">Form content</div>
      </PersistentFormWrapper>,
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByTestId('save-btn')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument();
  });

  it('renders children and both buttons without optional testId props', () => {
    render(
      <PersistentFormWrapper onSave={vi.fn()} onCancel={vi.fn()}>
        <div data-testid="child-content" />
      </PersistentFormWrapper>,
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('calls onSave when Save button is clicked', () => {
    const onSave = vi.fn();

    render(
      <PersistentFormWrapper onSave={onSave} onCancel={vi.fn()} saveTestId="save-btn">
        <div />
      </PersistentFormWrapper>,
    );

    fireEvent.click(screen.getByTestId('save-btn'));

    expect(onSave).toHaveBeenCalledOnce();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn();

    render(
      <PersistentFormWrapper onSave={vi.fn()} onCancel={onCancel} cancelTestId="cancel-btn">
        <div />
      </PersistentFormWrapper>,
    );

    fireEvent.click(screen.getByTestId('cancel-btn'));

    expect(onCancel).toHaveBeenCalledOnce();
  });
});
