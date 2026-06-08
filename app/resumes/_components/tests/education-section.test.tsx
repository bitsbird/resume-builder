import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EducationSection } from '@/app/resumes/_components/education-section';
import { listAllEducationAction } from '@/app/actions';
import type { EditorEducation } from '@/app/resumes/_components/editor-types';
import type { Education } from '@/lib/educations';

vi.mock('@/app/actions', () => ({
  listAllEducationAction: vi.fn(),
}));

const savedEdu: Education = {
  id: 10,
  degree: 'BSc Computer Science',
  institution: 'MIT',
  startDate: '2015-09',
  endDate: '2019-06',
};

const editorEdu: EditorEducation = {
  type: 'existing',
  localId: 'local-1',
  id: 10,
  data: {
    degree: savedEdu.degree,
    institution: savedEdu.institution,
    startDate: savedEdu.startDate,
    endDate: savedEdu.endDate,
  },
};

beforeEach(() => {
  vi.mocked(listAllEducationAction).mockResolvedValue([]);
});

describe('EducationSection', () => {
  it('renders the section heading and add button', () => {
    render(<EducationSection education={[]} onChange={vi.fn()} />);
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByTestId('edu-add-new')).toBeInTheDocument();
  });

  it('renders existing education entries', () => {
    render(<EducationSection education={[editorEdu]} onChange={vi.fn()} />);
    expect(screen.getByDisplayValue('BSc Computer Science')).toBeInTheDocument();
  });

  it('adds a blank education entry when the + button is clicked', () => {
    const onChange = vi.fn();
    render(<EducationSection education={[]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('edu-add-new'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ type: 'new' })]),
    );
  });

  it('fetches and shows saved education in the lookup when "Add saved" is clicked', async () => {
    vi.mocked(listAllEducationAction).mockResolvedValue([savedEdu]);
    render(<EducationSection education={[]} onChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId('edu-lookup-trigger'));
    expect(await screen.findByText('BSc Computer Science')).toBeInTheDocument();
  });

  it('filters already-linked entries from the lookup results', async () => {
    vi.mocked(listAllEducationAction).mockResolvedValue([savedEdu]);
    render(<EducationSection education={[editorEdu]} onChange={vi.fn()} />);
    fireEvent.click(screen.getByTestId('edu-lookup-trigger'));
    expect(await screen.findByTestId('edu-lookup-empty')).toBeInTheDocument();
  });

  it('adds an existing entry from the lookup to the list', async () => {
    vi.mocked(listAllEducationAction).mockResolvedValue([savedEdu]);
    const onChange = vi.fn();
    render(<EducationSection education={[]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('edu-lookup-trigger'));
    fireEvent.click(await screen.findByTestId('edu-lookup-add'));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ type: 'existing', id: savedEdu.id })]),
    );
  });

  it('removes an education entry when remove is called', () => {
    const onChange = vi.fn();
    render(<EducationSection education={[editorEdu]} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('edu-remove'));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
