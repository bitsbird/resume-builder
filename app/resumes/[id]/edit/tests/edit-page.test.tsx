import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getResumeWithData } from '@/lib/resumes';
import EditPage from '@/app/resumes/[id]/edit/page';

vi.mock('@/lib/resumes', () => ({
  getResumeWithData: vi.fn(),
}));

vi.mock('@/app/resumes/[id]/edit/_components/edit-resume-editor', () => ({
  EditResumeEditor: ({ initialWorkExperiences }: { initialWorkExperiences: unknown[] }) => (
    <div data-testid="editor" data-we-count={initialWorkExperiences.length}>
      {JSON.stringify(initialWorkExperiences)}
    </div>
  ),
}));

vi.mock('@/app/actions', () => ({
  listAllWorkExperiencesAction: vi.fn(),
}));

const mockResume = {
  id: 5,
  title: 'My CV',
  targetRole: 'Engineer',
  targetCompany: 'Acme',
  createdAt: '2024-01-01T00:00:00.000Z',
  templateId: 'default',
  profileSummary: '',
  workExperiences: [
    {
      id: 10,
      employer: 'Acme Corp',
      role: 'Senior Engineer',
      startDate: '2020-01',
      endDate: null,
      location: 'Remote',
      header: null,
      accomplishments: [
        { id: 101, weId: 10, content: 'Shipped feature X' },
        { id: 102, weId: 10, content: 'Reduced latency by 40%' },
      ],
    },
  ],
};

beforeEach(() => {
  vi.mocked(getResumeWithData).mockReset();
});

describe('/resumes/[id]/edit page', () => {
  it('passes pre-loaded accomplishments as existing EditorAccomplishment entries', async () => {
    vi.mocked(getResumeWithData).mockReturnValue(mockResume);

    render(await EditPage({ params: Promise.resolve({ id: '5' }) }));

    const editorEl = screen.getByTestId('editor');
    const wes = JSON.parse(editorEl.textContent ?? '[]') as Array<{
      accomplishments: Array<{ type: string; id: number; content: string }>;
    }>;

    expect(wes[0].accomplishments).toHaveLength(2);
    expect(wes[0].accomplishments[0]).toMatchObject({ type: 'existing', id: 101, content: 'Shipped feature X' });
    expect(wes[0].accomplishments[1]).toMatchObject({ type: 'existing', id: 102, content: 'Reduced latency by 40%' });
  });

  it('passes an empty accomplishments array when the WE has none', async () => {
    vi.mocked(getResumeWithData).mockReturnValue({
      ...mockResume,
      workExperiences: [{ ...mockResume.workExperiences[0], accomplishments: [] }],
    });

    render(await EditPage({ params: Promise.resolve({ id: '5' }) }));

    const wes = JSON.parse(screen.getByTestId('editor').textContent ?? '[]') as Array<{
      accomplishments: unknown[];
    }>;
    expect(wes[0].accomplishments).toHaveLength(0);
  });
});
