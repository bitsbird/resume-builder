import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { WorkExperienceSection } from '@/app/resumes/_components/work-experience-section';
import { listAllWorkExperiencesAction } from '@/app/actions';
import type { EditorWorkExperience } from '@/app/resumes/_components/editor-types';
import type { WorkExperience } from '@/lib/work-experiences';

vi.mock('@/app/actions', () => ({
  listAllWorkExperiencesAction: vi.fn(),
}));

const existingWe: WorkExperience = {
  id: 10,
  employer: 'Saved Co',
  role: 'Dev',
  startDate: '2019-01',
  endDate: null,
  location: 'Remote',
  header: null,
};

const editorWe: EditorWorkExperience = {
  type: 'existing',
  localId: 'local-1',
  id: 10,
  data: {
    employer: existingWe.employer,
    role: existingWe.role,
    startDate: existingWe.startDate,
    endDate: existingWe.endDate,
    location: existingWe.location,
    header: existingWe.header,
  },
};

beforeEach(() => {
  vi.mocked(listAllWorkExperiencesAction).mockResolvedValue([]);
});

describe('WorkExperienceSection', () => {
  it('renders existing work experiences', () => {
    render(
      <WorkExperienceSection workExperiences={[editorWe]} onChange={vi.fn()} />,
    );
    expect(screen.getByDisplayValue('Saved Co')).toBeInTheDocument();
  });

  it('renders an empty section with no work experiences', () => {
    render(
      <WorkExperienceSection workExperiences={[]} onChange={vi.fn()} />,
    );
    expect(screen.queryAllByTestId('we-item')).toHaveLength(0);
    expect(screen.getByTestId('we-add-new')).toBeInTheDocument();
    expect(screen.getByTestId('we-lookup-trigger')).toBeInTheDocument();
  });

  it('adds a blank work experience when the + button is clicked', () => {
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('we-add-new'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ type: 'new' })]),
    );
  });

  it('fetches and shows available WEs when the lookup button is clicked', async () => {
    vi.mocked(listAllWorkExperiencesAction).mockResolvedValue([existingWe]);
    render(<WorkExperienceSection workExperiences={[]} onChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId('we-lookup-trigger'));
    expect(await screen.findByText('Saved Co')).toBeInTheDocument();
  });

  it('filters already-linked WEs from the lookup results', async () => {
    vi.mocked(listAllWorkExperiencesAction).mockResolvedValue([existingWe]);
    render(<WorkExperienceSection workExperiences={[editorWe]} onChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId('we-lookup-trigger'));
    expect(await screen.findByTestId('we-lookup-empty')).toBeInTheDocument();
  });

  it('removes a work experience when remove is called', () => {
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[editorWe]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('we-remove'));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('adds an existing WE from the lookup', async () => {
    vi.mocked(listAllWorkExperiencesAction).mockResolvedValue([existingWe]);
    const onChange = vi.fn();
    render(<WorkExperienceSection workExperiences={[]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('we-lookup-trigger'));
    fireEvent.click(await screen.findByTestId('we-lookup-add'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ type: 'existing', id: existingWe.id })]),
    );
  });
});
