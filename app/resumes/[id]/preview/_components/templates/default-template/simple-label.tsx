import type { ReactNode } from 'react';

import { resumeDesignTokens } from '@/app/resumes/[id]/preview/_lib/resume-design-tokens';
import { Label } from '@/components/ui/label';

interface SimpleLabelProps {
  children: ReactNode;
}
export function SimpleLabel({ children }: SimpleLabelProps) {
  return (
    <Label style={{ paddingRight: resumeDesignTokens.spacing[2], color: resumeDesignTokens.colors.text }}>
      {children}
    </Label>
  );
}
