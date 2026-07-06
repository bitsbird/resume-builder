import { resumeDesignTokens } from '@/app/resumes/[id]/preview/_lib/resume-design-tokens';
import type { WorkExperienceWithAccomplishments } from '@/lib/resumes';

import { ResumeHeading } from './resume-heading';
import { SimpleLabel } from './simple-label';
import { SimpleText } from './simple-text';

interface WorkTemplateSectionProps {
  workExperiences: WorkExperienceWithAccomplishments[];
  title: string;
}
export default function WorkTemplateSection({ title, workExperiences }: WorkTemplateSectionProps) {
  return (
    <section style={{ paddingTop: resumeDesignTokens.spacing[4], paddingBottom: resumeDesignTokens.spacing[4] }}>
      <ResumeHeading size="sm">{title}</ResumeHeading>
      <div
        className="flex flex-col"
        style={{ gap: resumeDesignTokens.spacing[4], paddingTop: resumeDesignTokens.spacing[4] }}
      >
        {workExperiences.map((we) => (
          <div key={we.id} className="flex flex-row" style={{ gap: resumeDesignTokens.spacing[8] }}>
            <div className="flex flex-2 flex-col">
              <SimpleLabel>{we.role}</SimpleLabel>
              <div>{we.employer}</div>
              <SimpleText>
                {we.startDate} - {we.endDate ?? 'Present'}
              </SimpleText>
            </div>
            <div className="flex-4">
              {we.accomplishments.map((a) => (
                <div key={a.id}>
                  <SimpleText>{a.content}</SimpleText>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
