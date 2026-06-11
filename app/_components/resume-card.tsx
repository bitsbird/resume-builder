import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Small } from '@/components/ui/typography';
import type { Resume } from '@/lib/resumes';

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const parsedDate = resume.createdAt ? new Date(resume.createdAt) : null;
  const formattedDate =
    parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleDateString() : null;
  return (
    <Link href={`/resumes/${resume.id}`} className="h-full">
      <Card className="hover:bg-accent h-full transition-colors">
        <CardHeader>
          <CardTitle>{resume.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {resume.targetRole && <div><Small>{resume.targetRole}</Small></div>}
          {resume.targetCompany && <div><Small>{resume.targetCompany}</Small></div>}
          {formattedDate && <div><Small>{formattedDate}</Small></div>}
        </CardContent>
      </Card>
    </Link>
  );
}
