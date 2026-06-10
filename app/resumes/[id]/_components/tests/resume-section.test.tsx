import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ResumeSection } from '@/app/resumes/[id]/_components/resume-section';

describe('ResumeSection', () => {
  it('renders the section title and children', () => {
    const { getByText } = render(
      <ResumeSection title="Work Experience">
        <p>Some content</p>
      </ResumeSection>,
    );
    expect(getByText('Work Experience')).toBeInTheDocument();
    expect(getByText('Some content')).toBeInTheDocument();
  });

  it('renders the section element without error when title is empty and children is null', () => {
    const { container } = render(<ResumeSection title="">{null}</ResumeSection>);
    expect(container.querySelector('[data-slot="resume-section"]')).toBeInTheDocument();
  });
});
