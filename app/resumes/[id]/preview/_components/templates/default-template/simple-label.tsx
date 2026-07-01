import type { ReactNode } from 'react';

import { Label } from '@/components/ui/label';

interface SimpleLabelProps {
  children: ReactNode;
}
export function SimpleLabel({ children }: SimpleLabelProps) {
  return <Label className="pr-2 text-gray-600">{children}</Label>;
}
