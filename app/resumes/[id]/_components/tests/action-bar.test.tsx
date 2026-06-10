import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ActionBar } from '@/app/resumes/[id]/_components/action-bar';

describe('ActionBar', () => {
  it('renders edit link pointing to the correct edit route', () => {
    render(<ActionBar resumeId={42} />);
    expect(screen.getByTestId('resume-edit-link')).toHaveAttribute('href', '/resumes/42/edit');
  });

  it('renders close link pointing to the home route', () => {
    render(<ActionBar resumeId={1} />);
    expect(screen.getByTestId('resume-close-link')).toHaveAttribute('href', '/');
  });
});
