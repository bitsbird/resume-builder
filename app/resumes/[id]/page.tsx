import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getDb } from '@/lib/db';
import { getResumeWithData } from '@/lib/resumes';

interface ResumPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumePage({ params }: ResumPageProps) {
  const { id } = await params;
  const resumeId = parseInt(id, 10);

  if (isNaN(resumeId)) {
    notFound();
  }

  const resume = getResumeWithData(getDb(), resumeId);

  if (!resume) {
    notFound();
  }

  return (
    <main className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{resume.title}</h1>
        <Button asChild>
          <Link href={`/resumes/${resumeId}/edit`} data-testid="resume-edit-link">
            Edit
          </Link>
        </Button>
      </div>

      <div className="mt-2 text-gray-600">
        <p>{resume.targetRole}</p>
        <p>{resume.targetCompany}</p>
      </div>

      {resume.workExperiences.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Work Experience</h2>
          <div className="flex flex-col gap-4">
            {resume.workExperiences.map((we) => (
              <div key={we.id} className="rounded border border-gray-200 p-4">
                {we.header && <p className="mb-1 text-sm font-medium text-gray-500">{we.header}</p>}
                <p className="font-semibold">{we.employer}</p>
                <p className="text-gray-700">{we.role}</p>
                <p className="text-sm text-gray-500">
                  {we.startDate}
                  {we.endDate ? ` – ${we.endDate}` : ' – present'} · {we.location}
                </p>
                {we.accomplishments.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1">
                    {we.accomplishments.map((acc) => (
                      <li key={acc.id} data-testid="we-accomplishment" className="text-sm">
                        {acc.content}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
