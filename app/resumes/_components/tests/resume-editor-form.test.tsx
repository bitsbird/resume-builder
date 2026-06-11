import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { EditorEducation, EditorSkillSection, EditorWorkExperience } from '@/app/resumes/_components/editor-types';
import { ResumeEditorForm } from '@/app/resumes/_components/resume-editor-form';

let capturedWeOnChange: ((wes: EditorWorkExperience[]) => void) | null = null;
let capturedSkillOnChange: ((sections: EditorSkillSection[]) => void) | null = null;
let capturedEduOnChange: ((education: EditorEducation[]) => void) | null = null;

vi.mock('@/app/resumes/_components/work-experience-section', () => ({
  WorkExperienceSection: ({ onChange }: { onChange: (wes: EditorWorkExperience[]) => void }) => {
    capturedWeOnChange = onChange;
    return <div data-testid="we-section-mock" />;
  },
}));

vi.mock('@/app/resumes/_components/skill-sections-area', () => ({
  SkillSectionsArea: ({ onChange }: { onChange: (sections: EditorSkillSection[]) => void }) => {
    capturedSkillOnChange = onChange;
    return <div data-testid="skill-section-mock" />;
  },
}));

vi.mock('@/app/resumes/_components/education-section', () => ({
  EducationSection: ({ onChange }: { onChange: (education: EditorEducation[]) => void }) => {
    capturedEduOnChange = onChange;
    return <div data-testid="edu-section-mock" />;
  },
}));

const newWorkExperience: EditorWorkExperience = {
  type: 'new',
  localId: 'local-1',
  data: { employer: 'Acme', role: 'Engineer', startDate: '2020-01', endDate: null, location: 'Remote', header: null },
  accomplishments: [],
};

describe('ResumeEditorForm', () => {
  it('renders all sections and save button with all props fully populated', () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <ResumeEditorForm
        initialTitle="My CV"
        initialTargetRole="Staff Engineer"
        initialTargetCompany="Acme"
        initialWorkExperiences={[newWorkExperience]}
        initialSkillSections={[]}
        initialEducation={[]}
        resumeId={42}
        allSkills={[{ id: 1, name: 'TypeScript' }]}
        onSave={onSave}
        saveTestId="form-save"
      />,
    );

    expect(screen.getByTestId('resume-title-input')).toHaveValue('My CV');
    expect(screen.getByTestId('resume-role-input')).toHaveValue('Staff Engineer');
    expect(screen.getByTestId('resume-company-input')).toHaveValue('Acme');
    expect(screen.getByTestId('we-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('skill-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('edu-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('form-save')).toBeInTheDocument();
  });

  it('renders with all optional props omitted (empty form)', () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<ResumeEditorForm allSkills={[]} onSave={onSave} />);

    expect(screen.getByTestId('resume-title-input')).toHaveValue('');
    expect(screen.getByTestId('resume-role-input')).toHaveValue('');
    expect(screen.getByTestId('resume-company-input')).toHaveValue('');
    expect(screen.getByTestId('we-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('skill-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('edu-section-mock')).toBeInTheDocument();
  });

  it('calls onSave with current form state when save is clicked', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <ResumeEditorForm
        initialTitle="Draft"
        initialTargetRole="Engineer"
        initialTargetCompany="Corp"
        allSkills={[]}
        onSave={onSave}
        saveTestId="form-save"
      />,
    );

    fireEvent.change(screen.getByTestId('resume-title-input'), { target: { value: 'Final CV' } });
    fireEvent.click(screen.getByTestId('form-save'));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Final CV',
        targetRole: 'Engineer',
        targetCompany: 'Corp',
        workExperiences: [],
        skillSections: [],
        education: [],
        accomplishmentsToDelete: [],
      }),
    );
  });

  it('passes updated work experiences to onSave after onChange fires', () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<ResumeEditorForm allSkills={[]} onSave={onSave} saveTestId="form-save" />);

    act(() => capturedWeOnChange!([newWorkExperience]));
    fireEvent.click(screen.getByTestId('form-save'));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ workExperiences: [newWorkExperience] }),
    );
  });

  it('passes updated skill sections to onSave after onChange fires', () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const section: EditorSkillSection = {
      type: 'new',
      localId: 'sec-1',
      title: 'Tech',
      skills: [{ type: 'new', localId: 'sk-1', name: 'React' }],
    };

    render(<ResumeEditorForm allSkills={[]} onSave={onSave} saveTestId="form-save" />);

    act(() => capturedSkillOnChange!([section]));
    fireEvent.click(screen.getByTestId('form-save'));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ skillSections: [section] }));
  });

  it('passes updated education to onSave after onChange fires', () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const edu: EditorEducation = {
      type: 'new',
      localId: 'edu-1',
      data: { degree: 'BSc CS', institution: 'MIT', startDate: '2015-09', endDate: '2019-06' },
    };

    render(<ResumeEditorForm allSkills={[]} onSave={onSave} saveTestId="form-save" />);

    act(() => capturedEduOnChange!([edu]));
    fireEvent.click(screen.getByTestId('form-save'));

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ education: [edu] }));
  });

  it('displays error message when onSave returns an error', async () => {
    const onSave = vi.fn().mockResolvedValue({ error: 'Something went wrong' });

    render(<ResumeEditorForm allSkills={[]} onSave={onSave} saveTestId="form-save" />);

    await act(async () => fireEvent.click(screen.getByTestId('form-save')));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
