import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import NewResumePage from '@/app/resumes/new/page';

const mockRouterPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

vi.mock('@/app/actions', () => ({
  createResumeWithDataAction: vi.fn(),
  listAllWorkExperiencesAction: vi.fn(),
  listAllEducationAction: vi.fn(),
}));

vi.mock('@/lib/skills', () => ({
  getAllSkills: vi.fn().mockReturnValue([]),
}));

vi.mock('@/lib/job-seeker', () => ({
  getJobSeeker: vi.fn().mockReturnValue({
    name: 'James Sommers',
    email: 'james.sommers@example.com',
    phone: '+49 160 1234567',
    address: 'Karl Liebknecht Strasse 104, Berlin, Germany',
  }),
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

  it('renders the profile summary and job seeker contact fields, preloaded with existing contact info', async () => {
    render(await NewResumePage());
    expect(screen.getByTestId('resume-profile-summary-input')).toBeInTheDocument();
    expect(screen.getByTestId('job-seeker-name-input')).toHaveValue('James Sommers');
    expect(screen.getByTestId('job-seeker-email-input')).toHaveValue('james.sommers@example.com');
    expect(screen.getByTestId('job-seeker-phone-input')).toHaveValue('+49 160 1234567');
    expect(screen.getByTestId('job-seeker-address-input')).toHaveValue('Karl Liebknecht Strasse 104, Berlin, Germany');
  });

  it('cancel button navigates to home', async () => {
    render(await NewResumePage());
    fireEvent.click(screen.getByTestId('new-resume-cancel'));
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });
});
