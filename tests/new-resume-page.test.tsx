import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/actions', () => ({ createResumeAction: vi.fn() }));

import NewResumePage from '@/app/resumes/new/page';

describe('/resumes/new page', () => {
  it('renders the form and the preview', () => {
    const { container } = render(<NewResumePage />);
    expect(screen.getByLabelText(/title\s*\*/i)).toBeInTheDocument();
    expect(container.querySelector('[data-slot="resume-preview"]')).toBeInTheDocument();
  });
});
