import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getResume } from '@/lib/resumes';
import ResumePage from '@/app/resumes/[id]/page';

vi.mock('@/lib/resumes', () => ({
  getResume: vi.fn(),
}));

const mockResume = {
  id: 1,
  title: 'Senior Engineer CV',
  targetRole: 'Staff Engineer',
  targetCompany: 'Acme Corp',
  createdAt: '2024-06-01T12:00:00.000Z',
  templateId: 'default',
  profileSummary: 'Experienced engineer.',
};

beforeEach(() => {
  vi.mocked(getResume).mockReset();
});

describe('/resumes/[id] page', () => {
  it('renders the split view layout with editor and preview panels', async () => {
    vi.mocked(getResume).mockReturnValue(mockResume);
    const { container } = render(
      await ResumePage({
        params: Promise.resolve({ id: '1' }),
      }),
    );

    expect(container.querySelector('[data-slot="split-view"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="editor-panel"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="preview-panel"]')).toBeInTheDocument();
  });

  it('displays resume title, target role, and target company in editor', async () => {
    vi.mocked(getResume).mockReturnValue(mockResume);
    const { container } = render(
      await ResumePage({
        params: Promise.resolve({ id: '1' }),
      }),
    );

    const editorPanel = container.querySelector('[data-slot="editor-panel"]');
    expect(editorPanel?.textContent).toContain('Senior Engineer CV');
    expect(editorPanel?.textContent).toContain('Staff Engineer');
    expect(editorPanel?.textContent).toContain('Acme Corp');
  });

  it('renders preview panel on the right with resume data', async () => {
    vi.mocked(getResume).mockReturnValue(mockResume);
    const { container } = render(
      await ResumePage({
        params: Promise.resolve({ id: '1' }),
      }),
    );

    const previewPanel = container.querySelector('[data-slot="preview-panel"]');
    expect(previewPanel?.textContent).toContain('Senior Engineer CV');
    expect(previewPanel?.textContent).toContain('default');
  });
});
