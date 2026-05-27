import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getResumes } from '@/app/actions';
import Home from '@/app/page';

vi.mock('@/app/actions', () => ({
  getResumes: vi.fn(),
  createResumeAction: vi.fn(),
}));

const mockResumes = [
  {
    id: 1,
    title: 'Senior Engineer CV',
    targetRole: 'Staff Engineer',
    targetCompany: 'Acme Corp',
    createdAt: '2024-06-01T12:00:00.000Z',
    templateId: 'default',
    profileSummary: '',
  },
  {
    id: 2,
    title: 'Product Manager CV',
    targetRole: 'Senior PM',
    targetCompany: 'Beta Ltd',
    createdAt: '2024-07-01T12:00:00.000Z',
    templateId: 'default',
    profileSummary: '',
  },
];

beforeEach(() => {
  vi.mocked(getResumes).mockReset();
});

describe('Home page', () => {
  it('renders a link to the new resume page', async () => {
    vi.mocked(getResumes).mockResolvedValue([]);
    render(await Home());
    const link = screen.getByTestId('new-resume');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/resumes/new');
  });

  it('shows empty state when no resumes exist', async () => {
    vi.mocked(getResumes).mockResolvedValue([]);
    render(await Home());
    expect(screen.getByText(/no resumes yet/i)).toBeInTheDocument();
  });

  it('renders one card per resume', async () => {
    vi.mocked(getResumes).mockResolvedValue(mockResumes);
    const { container } = render(await Home());
    const cards = container.querySelectorAll('[data-slot="card"]');
    expect(cards).toHaveLength(mockResumes.length);
  });
});
