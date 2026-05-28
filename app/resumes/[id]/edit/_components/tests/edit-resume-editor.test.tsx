import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { updateResumeWithDataAction } from '@/app/actions';
import { EditResumeEditor } from '@/app/resumes/[id]/edit/_components/edit-resume-editor';
import type { EditorWorkExperience } from '@/app/resumes/_components/editor-types';

vi.mock('@/app/actions', () => ({
  updateResumeWithDataAction: vi.fn(),
}));

let capturedOnChange: ((wes: EditorWorkExperience[]) => void) | null = null;

vi.mock('@/app/resumes/_components/work-experience-section', () => ({
  WorkExperienceSection: ({ onChange }: { onChange: (wes: EditorWorkExperience[]) => void }) => {
    capturedOnChange = onChange;
    return null;
  },
}));

const mockResume = {
  id: 42,
  title: 'Senior Engineer CV',
  targetRole: 'Staff Engineer',
  targetCompany: 'Acme Corp',
  createdAt: '2024-06-01T12:00:00.000Z',
  templateId: 'default',
  profileSummary: 'Experienced engineer.',
};

const newWorkExperience: EditorWorkExperience = {
  type: 'new',
  localId: 'local-1',
  data: {
    employer: 'Beta Industries',
    role: 'Engineer',
    startDate: '2020-01',
    endDate: '2023-06',
    location: 'Remote',
    header: 'Backend focus',
  },
};

const existingWorkExperience: EditorWorkExperience = {
  type: 'existing',
  localId: 'local-2',
  id: 10,
  data: {
    employer: 'Beta Industries',
    role: 'Engineer',
    startDate: '2020-01',
    endDate: '2023-06',
    location: 'Remote',
    header: 'Backend focus',
  },
};

beforeEach(() => {
  vi.mocked(updateResumeWithDataAction).mockReset();
});

describe('EditResumeEditor', () => {
  it('calls updateResumeWithDataAction with all form data when save is clicked', async () => {
    render(
      <EditResumeEditor
        resume={mockResume}
        initialWorkExperiences={[newWorkExperience]}
      />,
    );

    fireEvent.change(screen.getByTestId('resume-title-input'), {
      target: { value: 'Updated CV' },
    });
    fireEvent.change(screen.getByTestId('resume-role-input'), {
      target: { value: 'Principal Engineer' },
    });
    fireEvent.change(screen.getByTestId('resume-company-input'), {
      target: { value: 'Globex Corp' },
    });

    fireEvent.click(screen.getByTestId('edit-resume-save'));

    expect(updateResumeWithDataAction).toHaveBeenCalledWith({
      resumeId: mockResume.id,
      title: 'Updated CV',
      targetRole: 'Principal Engineer',
      targetCompany: 'Globex Corp',
      workExperiences: [{ type: 'new', data: newWorkExperience.data }],
    });
  });

  it('calls updateResumeWithDataAction with initial values when save is clicked without changes', async () => {
    render(
      <EditResumeEditor resume={mockResume} initialWorkExperiences={[]} />,
    );

    fireEvent.click(screen.getByTestId('edit-resume-save'));

    expect(updateResumeWithDataAction).toHaveBeenCalledWith({
      resumeId: mockResume.id,
      title: mockResume.title,
      targetRole: mockResume.targetRole,
      targetCompany: mockResume.targetCompany,
      workExperiences: [],
    });
  });

  it('sends modified work experiences when save is clicked after WorkExperienceSection onChange fires', () => {
    const modifiedWorkExperience: EditorWorkExperience = {
      type: 'new',
      localId: 'local-2',
      data: {
        employer: 'Globex Corp',
        role: 'Lead Engineer',
        startDate: '2022-03',
        endDate: '2024-01',
        location: 'NYC',
        header: 'Platform team',
      },
    };

    render(<EditResumeEditor resume={mockResume} initialWorkExperiences={[existingWorkExperience]} />);

    act(() => capturedOnChange!([modifiedWorkExperience]));

    fireEvent.click(screen.getByTestId('edit-resume-save'));

    expect(updateResumeWithDataAction).toHaveBeenCalledWith({
      resumeId: mockResume.id,
      title: mockResume.title,
      targetRole: mockResume.targetRole,
      targetCompany: mockResume.targetCompany,
      workExperiences: [{ type: 'new', data: modifiedWorkExperience.data }],
    });
  });
});
