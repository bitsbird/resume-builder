import type { ReactNode } from 'react';

import { resumeDesignTokens } from '@/app/resumes/[id]/preview/_lib/resume-design-tokens';
import { cn } from '@/lib/utils';

import { ResumeHeading } from './resume-heading';

interface TemplateSectionProps {
  children: ReactNode;
  title: string;
  noBorder?: boolean;
}
export default function TemplateSection({ title, noBorder, children }: TemplateSectionProps) {
  return (
    <section className="flex flex-row" style={{ paddingTop: resumeDesignTokens.spacing[4] }}>
      <div
        className={cn('flex-2', noBorder && 'border-0')}
        style={{ marginRight: resumeDesignTokens.spacing[8] }}
      >
        <ResumeHeading size="sm">{title}</ResumeHeading>
      </div>
      <div
        className={cn('flex flex-4 flex-col content-center', noBorder && 'border-0')}
        style={{ paddingBottom: resumeDesignTokens.spacing[4] }}
      >
        {children}
      </div>
    </section>
  );
}
