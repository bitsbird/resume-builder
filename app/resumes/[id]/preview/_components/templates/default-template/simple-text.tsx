import type { ReactNode } from 'react';

import { BaseText } from '@/components/ui/typography';

interface SimpleTextProps {
  children: ReactNode;
}
export function SimpleText({ children }: SimpleTextProps) {
  return <BaseText className="text-gray-600">{children}</BaseText>;
}
