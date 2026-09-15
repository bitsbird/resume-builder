import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { H2 } from '@/components/ui/typography';

interface PreviewHeaderProps {
  templateLabel: string;
  resumeId: number;
  templateId: string;
}
export default function PreviewHeader({ templateLabel, resumeId, templateId }: PreviewHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between">
      <H2>Template: {templateLabel}</H2>
      <div className="flex flex-row items-center gap-4">
        <Button asChild>
          <Link href={`/resumes/${resumeId}`}>Back</Link>
        </Button>
        <Button asChild>
          <a href={`/resumes/${resumeId}/preview/export?templateId=${templateId}`}>Export to PDF</a>
        </Button>
      </div>
    </div>
  );
}
