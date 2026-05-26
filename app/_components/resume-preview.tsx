import type { Resume } from '@/lib/resumes';

interface ResumePreviewProps {
  resume: Partial<Resume>;
}

// TODO: replace skeleton with real template rendering once issue #09 (templates) is implemented
export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div data-slot="resume-preview" className="h-full rounded-xl border border-dashed border-foreground/20 bg-muted/30 p-6 flex flex-col gap-3">
      {resume.title && <p className="text-base font-semibold">{resume.title}</p>}
      {resume.targetRole && <p className="text-sm text-muted-foreground">{resume.targetRole}</p>}
      {resume.targetCompany && <p className="text-sm text-muted-foreground">{resume.targetCompany}</p>}
      <div className="mt-4 flex flex-col gap-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-2 rounded bg-foreground/10" style={{ width: `${70 - i * 5}%` }} />
        ))}
      </div>
    </div>
  );
}
