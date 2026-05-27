import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import NewResumePage from '@/app/resumes/new/page';

vi.mock('@/app/actions', () => ({ createResumeAction: vi.fn() }));

describe('/resumes/new page', () => {
  it('renders the form and the preview', () => {
    const { container } = render(<NewResumePage />);
    expect(screen.getByLabelText(/title\s*\*/i)).toBeInTheDocument();
    expect(container.querySelector('[data-slot="resume-preview"]')).toBeInTheDocument();
  });
});
