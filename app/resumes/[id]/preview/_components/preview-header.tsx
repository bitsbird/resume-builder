'use client';

import { Button } from '@/components/ui/button';
import { H2 } from '@/components/ui/typography';

interface PreviewHeaderProps {
  templateLabel: string;
}
export default function PreviewHeader({ templateLabel }: PreviewHeaderProps) {
  const exportCv = () => {};
  return (
    <div className="flex flex-row justify-between">
      <H2>Template: {templateLabel}</H2>
      <div>
        <Button onClick={() => exportCv()}>Export to PDF</Button>
      </div>
    </div>
  );
}
