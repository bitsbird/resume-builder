import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('@/app/actions', () => ({ createResumeAction: vi.fn() }));

import { createResumeAction } from '@/app/actions';
import { CreateResumeForm } from '@/app/_components/create-resume-form';

beforeEach(() => {
  vi.mocked(createResumeAction).mockReset();
});

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/title\s*\*/i), 'Senior Engineer CV');
  await user.type(screen.getByLabelText(/target role\s*\*/i), 'Staff Engineer');
  await user.type(screen.getByLabelText(/target company\s*\*/i), 'Acme Corp');
  await user.click(screen.getByTestId('submit'));
}

describe('CreateResumeForm', () => {
  it('calls createResumeAction with form values on submit', async () => {
    const user = userEvent.setup();
    vi.mocked(createResumeAction).mockResolvedValue(undefined);
    render(<CreateResumeForm />);
    await fillAndSubmit(user);
    expect(createResumeAction).toHaveBeenCalledWith({
      title: 'Senior Engineer CV',
      targetRole: 'Staff Engineer',
      targetCompany: 'Acme Corp',
    });
  });

  it('shows a server error when action returns a duplicate title error', async () => {
    const user = userEvent.setup();
    vi.mocked(createResumeAction).mockResolvedValue({ error: 'A resume with this title already exists.' });
    render(<CreateResumeForm />);
    await fillAndSubmit(user);
    expect(screen.getByRole('alert')).toHaveTextContent('A resume with this title already exists.');
  });

  it('preserves form values after submission to keep the preview in sync', async () => {
    const user = userEvent.setup();
    vi.mocked(createResumeAction).mockResolvedValue(undefined);
    render(<CreateResumeForm />);
    await fillAndSubmit(user);
    expect(screen.getByLabelText(/title\s*\*/i)).toHaveValue('Senior Engineer CV');
    expect(screen.getByLabelText(/target role\s*\*/i)).toHaveValue('Staff Engineer');
    expect(screen.getByLabelText(/target company\s*\*/i)).toHaveValue('Acme Corp');
  });
});
