import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TemplateSelectorBar } from '@/app/resumes/[id]/_components/template-selector-bar';
import { defaultTemplateId, TEMPLATES } from '@/lib/templates';

describe('TemplateSelectorBar', () => {
  it('preselects the default template label without requiring the dropdown to be opened', () => {
    render(<TemplateSelectorBar resumeId={1} />);

    expect(screen.getByText(TEMPLATES[defaultTemplateId].label)).toBeInTheDocument();
  });

  it('renders a preview link that carries the selected template id', () => {
    render(<TemplateSelectorBar resumeId={7} />);

    const previewLink = screen.getByRole('link', { name: 'Preview' });
    expect(previewLink).toHaveAttribute('href', `/resumes/7/preview?templateId=${defaultTemplateId}`);
  });
});
