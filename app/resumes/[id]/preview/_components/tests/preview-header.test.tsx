import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PreviewHeader from '@/app/resumes/[id]/preview/_components/preview-header';

describe('PreviewHeader', () => {
  it('renders a plain link to the export route for the given resume and template', () => {
    render(<PreviewHeader templateLabel="Default" resumeId={1} templateId="default" />);

    expect(screen.getByText('Template: Default')).toBeInTheDocument();

    const exportLink = screen.getByRole('link', { name: 'Export to PDF' });
    expect(exportLink.tagName).toBe('A');
    expect(exportLink).toHaveAttribute('href', '/resumes/1/preview/export?templateId=default');
  });

  it('renders a back link to the resume detail page', () => {
    render(<PreviewHeader templateLabel="Default" resumeId={1} templateId="default" />);

    const backLink = screen.getByRole('link', { name: 'Back' });
    expect(backLink).toHaveAttribute('href', '/resumes/1');
  });
});
