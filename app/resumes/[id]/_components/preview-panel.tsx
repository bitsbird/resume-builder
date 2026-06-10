import { H2 } from '@/components/ui/typography';
import type { Resume } from '@/lib/resumes';

interface PreviewPanelProps {
  resume: Resume;
}

export function PreviewPanel({ resume }: PreviewPanelProps) {
  return (
    <div data-slot="preview-panel" className="flex flex-col gap-4 overflow-auto bg-gray-50 p-6">
      <div className="rounded border border-gray-300 bg-white">
        <H2>{resume.title}</H2>
        <div className="mt-2 text-gray-600">
          <p>{resume.targetRole}</p>
          <p>{resume.targetCompany}</p>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>Template: {resume.templateId}</p>
        </div>
      </div>
    </div>
  );
}
