import type { Resume } from '@/lib/resumes';

interface ResumePreviewProps {
  resume: Partial<Resume>;
}

// TODO: replace skeleton with real template rendering once issue #09 (templates) is implemented
export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div
      data-slot="resume-preview"
      className="border-foreground/20 bg-muted/30 flex h-full flex-col gap-3 rounded-xl border border-dashed p-6"
    >
      {resume.title && <p className="text-base font-semibold">{resume.title}</p>}
      {resume.targetRole && <p className="text-muted-foreground text-sm">{resume.targetRole}</p>}
      {resume.targetCompany && (
        <p className="text-muted-foreground text-sm">{resume.targetCompany}</p>
      )}
      <div className="mt-4 flex flex-col gap-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-foreground/10 h-2 rounded"
            style={{ width: `${70 - i * 5}%` }}
          />
        ))}
      </div>
    </div>
  );
}
