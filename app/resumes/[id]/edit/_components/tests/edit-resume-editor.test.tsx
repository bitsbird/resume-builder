import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { updateResumeWithDataAction } from '@/app/actions';
import { EditResumeEditor } from '@/app/resumes/[id]/edit/_components/edit-resume-editor';
import type { EditorEducation, EditorSkillSection, EditorWorkExperience } from '@/app/resumes/_components/editor-types';

vi.mock('@/app/actions', () => ({
  updateResumeWithDataAction: vi.fn(),
}));

let capturedWeOnChange: ((wes: EditorWorkExperience[]) => void) | null = null;
let capturedSkillOnChange: ((sections: EditorSkillSection[]) => void) | null = null;
let capturedEduOnChange: ((education: EditorEducation[]) => void) | null = null;

vi.mock('@/app/resumes/_components/work-experience-section', () => ({
  WorkExperienceSection: ({ onChange }: { onChange: (wes: EditorWorkExperience[]) => void }) => {
    capturedWeOnChange = onChange;
    return null;
  },
}));

vi.mock('@/app/resumes/_components/skill-sections-area', () => ({
  SkillSectionsArea: ({ onChange }: { onChange: (sections: EditorSkillSection[]) => void }) => {
    capturedSkillOnChange = onChange;
    return null;
  },
}));

vi.mock('@/app/resumes/_components/education-section', () => ({
  EducationSection: ({ onChange }: { onChange: (education: EditorEducation[]) => void }) => {
    capturedEduOnChange = onChange;
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
  accomplishments: [],
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
  accomplishments: [],
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
        initialSkillSections={[]}
        initialEducation={[]}
        allSkills={[]}
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
      workExperiences: [{ type: 'new', data: newWorkExperience.data, accomplishments: [] }],
      accomplishmentsToDelete: [],
      skillSections: [],
      education: [],
    });
  });

  it('calls updateResumeWithDataAction with initial values when save is clicked without changes', async () => {
    render(
      <EditResumeEditor resume={mockResume} initialWorkExperiences={[]} initialSkillSections={[]} initialEducation={[]} allSkills={[]} />,
    );

    fireEvent.click(screen.getByTestId('edit-resume-save'));

    expect(updateResumeWithDataAction).toHaveBeenCalledWith({
      resumeId: mockResume.id,
      title: mockResume.title,
      targetRole: mockResume.targetRole,
      targetCompany: mockResume.targetCompany,
      workExperiences: [],
      accomplishmentsToDelete: [],
      skillSections: [],
      education: [],
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
      accomplishments: [],
    };

    render(<EditResumeEditor resume={mockResume} initialWorkExperiences={[existingWorkExperience]} initialSkillSections={[]} initialEducation={[]} allSkills={[]} />);

    act(() => capturedWeOnChange!([modifiedWorkExperience]));

    fireEvent.click(screen.getByTestId('edit-resume-save'));

    expect(updateResumeWithDataAction).toHaveBeenCalledWith({
      resumeId: mockResume.id,
      title: mockResume.title,
      targetRole: mockResume.targetRole,
      targetCompany: mockResume.targetCompany,
      workExperiences: [{ type: 'new', data: modifiedWorkExperience.data, accomplishments: [] }],
      accomplishmentsToDelete: [],
      skillSections: [],
      education: [],
    });
  });

  it('sends modified skill sections when save is clicked after SkillSectionsArea onChange fires', () => {
    const newSection: EditorSkillSection = {
      type: 'new',
      localId: 'section-1',
      title: 'Tech Skills',
      skills: [{ type: 'new', localId: 'skill-1', name: 'React' }],
    };

    render(<EditResumeEditor resume={mockResume} initialWorkExperiences={[]} initialSkillSections={[]} initialEducation={[]} allSkills={[]} />);

    act(() => capturedSkillOnChange!([newSection]));

    fireEvent.click(screen.getByTestId('edit-resume-save'));

    expect(updateResumeWithDataAction).toHaveBeenCalledWith(
      expect.objectContaining({
        skillSections: [
          { type: 'new', title: 'Tech Skills', skills: [{ type: 'new', name: 'React' }] },
        ],
      }),
    );
  });

  it('sends modified education when save is clicked after EducationSection onChange fires', () => {
    const newEdu: EditorEducation = {
      type: 'new',
      localId: 'edu-1',
      data: { degree: 'BSc CS', institution: 'MIT', startDate: '2015-09', endDate: '2019-06' },
    };

    render(<EditResumeEditor resume={mockResume} initialWorkExperiences={[]} initialSkillSections={[]} initialEducation={[]} allSkills={[]} />);

    act(() => capturedEduOnChange!([newEdu]));

    fireEvent.click(screen.getByTestId('edit-resume-save'));

    expect(updateResumeWithDataAction).toHaveBeenCalledWith(
      expect.objectContaining({
        education: [{ type: 'new', data: newEdu.data }],
      }),
    );
  });
});
