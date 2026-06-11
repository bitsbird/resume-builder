import { H2 } from '@/components/ui/typography';

interface ResumeSectionProps {
  title: string;
  children: React.ReactNode;
  testId?: string;
}

export function ResumeSection({ title, children, testId }: ResumeSectionProps) {
  return (
    <section data-slot="resume-section" className="mt-8" data-testid={testId}>
      <H2 className="mb-1">{title}</H2>
      <hr className="border-muted-foreground mb-4 w-[35%]" />
      <div className="px-4">{children}</div>
    </section>
  );
}
