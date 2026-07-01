import type { ReactNode } from 'react';

import { H4 } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface TemplateSectionProps {
  children: ReactNode;
  title: string;
  noBorder?: boolean;
}
export default function TemplateSection({ title, noBorder, children }: TemplateSectionProps) {
  return (
    <section className="flex flex-row pt-4">
      <div
        className={cn(
          'border-muted-foreground mr-8 flex-2 border-0 border-b-4',
          noBorder && 'border-0',
        )}
      >
        <H4>{title}</H4>
      </div>
      <div
        className={cn(
          'border-muted-foreground flex flex-4 flex-col content-center border-b-4 pb-4',
          noBorder && 'border-0',
        )}
      >
        {children}
      </div>
    </section>
  );
}
