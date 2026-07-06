import { Fragment } from 'react';

import { H4 } from '@/components/ui/typography';
import type { WorkExperienceWithAccomplishments } from '@/lib/resumes';

import { SimpleLabel } from './simple-label';
import { SimpleText } from './simple-text';

interface WorkTemplateSectionProps {
  workExperiences: WorkExperienceWithAccomplishments[];
  title: string;
}
export default function WorkTemplateSection({ title, workExperiences }: WorkTemplateSectionProps) {
  console.log(workExperiences);
  return (
    <section className="pt-4 pb-4">
      <div className="grid grid-cols-[2fr_4fr] gap-x-8 gap-y-4">
        <div>
          <H4>{title}</H4>
        </div>
        <div />
        {workExperiences.map((we) => (
          <Fragment key={we.id}>
            <div className="flex flex-col">
              <SimpleLabel>{we.role}</SimpleLabel>
              <div>{we.employer}</div>
              <SimpleText>
                {we.startDate} - {we.endDate ?? 'Present'}
              </SimpleText>
            </div>
            <div>
              {we.accomplishments.map((a) => (
                <div key={a.id}>
                  <SimpleText>{a.content}</SimpleText>
                </div>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
