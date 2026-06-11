import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { EditorEducation, EditorSkillSection, EditorWorkExperience } from '@/app/resumes/_components/editor-types';
import { ResumeEditorForm } from '@/app/resumes/_components/resume-editor-form';

vi.mock('@/app/resumes/_components/work-experience-section', () => ({
  WorkExperienceSection: () => <div data-testid="we-section-mock" />,
}));

vi.mock('@/app/resumes/_components/skill-sections-area', () => ({
  SkillSectionsArea: () => <div data-testid="skill-section-mock" />,
}));

vi.mock('@/app/resumes/_components/education-section', () => ({
  EducationSection: () => <div data-testid="edu-section-mock" />,
}));

const noop = () => {};

const newWorkExperience: EditorWorkExperience = {
  type: 'new',
  localId: 'local-1',
  data: { employer: 'Acme', role: 'Engineer', startDate: '2020-01', endDate: null, location: 'Remote', header: null },
  accomplishments: [],
};

const newSkillSection: EditorSkillSection = {
  type: 'new',
  localId: 'sec-1',
  title: 'Tech',
  skills: [{ type: 'new', localId: 'sk-1', name: 'React' }],
};

const newEducation: EditorEducation = {
  type: 'new',
  localId: 'edu-1',
  data: { degree: 'BSc CS', institution: 'MIT', startDate: '2015-09', endDate: '2019-06' },
};

function fullProps() {
  return {
    title: 'My CV',
    onTitleChange: noop,
    targetRole: 'Staff Engineer',
    onTargetRoleChange: noop,
    targetCompany: 'Acme',
    onTargetCompanyChange: noop,
    workExperiences: [newWorkExperience],
    onWorkExperiencesChange: noop,
    onAccomplishmentsToDeleteChange: noop,
    skillSections: [newSkillSection],
    onSkillSectionsChange: noop,
    education: [newEducation],
    onEducationChange: noop,
    resumeId: 42,
    allSkills: [{ id: 1, name: 'TypeScript' }],
    error: null,
  };
}

function emptyProps() {
  return {
    title: '',
    onTitleChange: noop,
    targetRole: '',
    onTargetRoleChange: noop,
    targetCompany: '',
    onTargetCompanyChange: noop,
    workExperiences: [],
    onWorkExperiencesChange: noop,
    onAccomplishmentsToDeleteChange: noop,
    skillSections: [],
    onSkillSectionsChange: noop,
    education: [],
    onEducationChange: noop,
    allSkills: [],
  };
}

describe('ResumeEditorForm', () => {
  it('renders all sections with all props fully populated', () => {
    render(<ResumeEditorForm {...fullProps()} />);

    expect(screen.getByTestId('resume-title-input')).toHaveValue('My CV');
    expect(screen.getByTestId('resume-role-input')).toHaveValue('Staff Engineer');
    expect(screen.getByTestId('resume-company-input')).toHaveValue('Acme');
    expect(screen.getByTestId('we-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('skill-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('edu-section-mock')).toBeInTheDocument();
  });

  it('renders with empty/boundary prop values', () => {
    render(<ResumeEditorForm {...emptyProps()} />);

    expect(screen.getByTestId('resume-title-input')).toHaveValue('');
    expect(screen.getByTestId('resume-role-input')).toHaveValue('');
    expect(screen.getByTestId('resume-company-input')).toHaveValue('');
    expect(screen.getByTestId('we-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('skill-section-mock')).toBeInTheDocument();
    expect(screen.getByTestId('edu-section-mock')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<ResumeEditorForm {...emptyProps()} error="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('does not display error when error prop is null', () => {
    render(<ResumeEditorForm {...emptyProps()} error={null} />);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});
