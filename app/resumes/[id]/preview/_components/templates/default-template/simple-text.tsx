import type { ReactNode } from 'react';

import { resumeDesignTokens } from '@/app/resumes/[id]/preview/_lib/resume-design-tokens';

interface SimpleTextProps {
  children: ReactNode;
}
export function SimpleText({ children }: SimpleTextProps) {
  return <span style={{ color: resumeDesignTokens.colors.text }}>{children}</span>;
}
