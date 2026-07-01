import type { ReactNode } from 'react';

import { H4 } from '@/components/ui/typography';

interface TemplateSectionProps {
  children: ReactNode;
  title: string;
}
export default function TemplateSection({ title, children }: TemplateSectionProps) {
  return (
    <section className="flex flex-row pt-4">
      <div className="border-muted-foreground mr-8 flex-2 border-b-4">
        <H4>{title}</H4>
      </div>
      <div className="border-muted-foreground flex flex-4 flex-col content-center border-b-4 pb-4">
        {children}
      </div>
    </section>
  );
}
