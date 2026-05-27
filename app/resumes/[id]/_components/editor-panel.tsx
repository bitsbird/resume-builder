import type { Resume } from '@/lib/resumes';

interface EditorPanelProps {
  resume: Resume;
}

export function EditorPanel({ resume }: EditorPanelProps) {
  return (
    <div data-slot="editor-panel" className="flex flex-col gap-4 border-r border-gray-200 p-6">
      <div>
        <h2 className="text-2xl font-bold">{resume.title}</h2>
        <p className="text-gray-600">{resume.targetRole}</p>
        <p className="text-gray-600">{resume.targetCompany}</p>
      </div>
    </div>
  );
}
