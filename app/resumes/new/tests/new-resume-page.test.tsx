import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import NewResumePage from '@/app/resumes/new/page';

vi.mock('@/app/actions', () => ({
  createResumeWithDataAction: vi.fn(),
  listAllWorkExperiencesAction: vi.fn(),
  listAllEducationAction: vi.fn(),
}));

vi.mock('@/lib/skills', () => ({
  getAllSkills: vi.fn().mockReturnValue([]),
}));

describe('/resumes/new page', () => {
  it('renders the work experience section and save button', async () => {
    render(await NewResumePage());
    expect(screen.getByTestId('we-add-new')).toBeInTheDocument();
    expect(screen.getByTestId('we-lookup-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('new-resume-save')).toBeInTheDocument();
  });

  it('renders resume title and role fields', async () => {
    render(await NewResumePage());
    expect(screen.getByTestId('resume-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('resume-role-input')).toBeInTheDocument();
  });

  it('renders education and skill sections', async () => {
    render(await NewResumePage());
    expect(screen.getByTestId('edu-add-new')).toBeInTheDocument();
    expect(screen.getByTestId('skill-section-add')).toBeInTheDocument();
  });
});
