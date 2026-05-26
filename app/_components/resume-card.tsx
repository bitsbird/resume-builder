import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Resume } from '@/lib/resumes';

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const parsedDate = resume.createdAt ? new Date(resume.createdAt) : null;
  const formattedDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleDateString() : null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{resume.title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-1">
        {resume.targetRole && <p>{resume.targetRole}</p>}
        {resume.targetCompany && <p>{resume.targetCompany}</p>}
        {formattedDate && <p>{formattedDate}</p>}
      </CardContent>
    </Card>
  );
}
