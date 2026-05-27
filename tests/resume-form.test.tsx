import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ResumeForm } from '@/app/_components/resume-form';
import type { Resume } from '@/lib/resumes';

const fullResume: Partial<Resume> = {
  title: 'Senior Engineer CV',
  targetRole: 'Staff Engineer',
  targetCompany: 'Acme Corp',
};

describe('ResumeForm', () => {
  it('renders title, target role, and target company fields marked as required', () => {
    render(<ResumeForm resume={{}} onChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/title\s*\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target role\s*\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/target company\s*\*/i)).toBeInTheDocument();
  });

  it('submit button is disabled when resume is empty', () => {
    render(<ResumeForm resume={{}} onChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByTestId('submit')).toBeDisabled();
  });

  it('submit button is enabled when all required fields have a value', () => {
    render(<ResumeForm resume={fullResume} onChange={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByTestId('submit')).toBeEnabled();
  });

  it('calls onChange with updated resume when a field changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ResumeForm resume={{}} onChange={onChange} onSubmit={vi.fn()} />);
    await user.type(screen.getByLabelText(/title\s*\*/i), 'A');
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ title: 'A' }));
  });

  it('calls onSubmit when the form is submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ResumeForm resume={fullResume} onChange={vi.fn()} onSubmit={onSubmit} />);
    await user.click(screen.getByTestId('submit'));
    expect(onSubmit).toHaveBeenCalled();
  });

  it('displays the error prop when provided', () => {
    render(
      <ResumeForm
        resume={{}}
        onChange={vi.fn()}
        onSubmit={vi.fn()}
        error="Title already exists."
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Title already exists.');
  });
});
