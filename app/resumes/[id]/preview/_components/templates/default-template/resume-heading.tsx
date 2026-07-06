import type { CSSProperties, ReactNode } from 'react';

import { resumeDesignTokens } from '@/app/resumes/[id]/preview/_lib/resume-design-tokens';

interface ResumeHeadingProps {
  children: ReactNode;
  size: 'lg' | 'md' | 'sm';
  style?: CSSProperties;
  testId?: string;
}

const tagBySize = { lg: 'h1', md: 'h3', sm: 'h4' } as const;

export function ResumeHeading({ children, size, style, testId }: ResumeHeadingProps) {
  const Tag = tagBySize[size];
  const { fontSize, fontWeight } = resumeDesignTokens.typeScale[size];
  return (
    <Tag className="tracking-tight" style={{ fontSize, fontWeight, ...style }} data-testid={testId}>
      {children}
    </Tag>
  );
}
