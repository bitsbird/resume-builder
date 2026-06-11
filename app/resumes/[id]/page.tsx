import { notFound } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { BaseText, H2, H3, H4, H5 } from '@/components/ui/typography';
import { getDb } from '@/lib/db';
import { getResumeWithData } from '@/lib/resumes';

import { ActionBar } from './_components/action-bar';
import { ResumeSection } from './_components/resume-section';

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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <H2>{resume.title}</H2>
        <ActionBar resumeId={resumeId} />
      </div>

      <H3>{resume.targetRole}</H3>
      <H4>{resume.targetCompany}</H4>
      {resume.skillSections.filter((s) => s.skills.length > 0).length > 0 && (
        <ResumeSection title="Skills">
          <div className="flex flex-col gap-4">
            {resume.skillSections
              .filter((s) => s.skills.length > 0)
              .map((section) => (
                <div key={section.id}>
                  <Label testId="skill-section-title" className="mb-2">
                    {section.title}
                  </Label>
                  <BaseText testId="skill-section-skills">
                    {section.skills.map((sk) => sk.name).join(', ')}
                  </BaseText>
                </div>
              ))}
          </div>
        </ResumeSection>
      )}
      {resume.workExperiences.length > 0 && (
        <ResumeSection title="Work Experience">
          <div className="flex flex-col">
            {resume.workExperiences.map((we) => (
              <div key={we.id} className="mt-8 first:mt-0">
                {we.header && <H5 className="mb-1 italic">{we.header}</H5>}
                <div>
                  <Label className="mr-2">Employer:</Label>
                  <BaseText>{we.employer}</BaseText>
                </div>
                <div>
                  <Label className="mr-2">Role:</Label>
                  <BaseText>{we.role}</BaseText>
                </div>
                <div>
                  <Label className="mr-2">Dates:</Label>
                  {we.startDate}
                  {we.endDate ? ` – ${we.endDate}` : ' – present'}
                </div>
                <div>
                  <Label className="mr-2">Location:</Label>
                  <BaseText>{we.location}</BaseText>
                </div>
                <div className="mt-2">
                  <Label className="mr-2">Accomplishments:</Label>
                  {we.accomplishments.length > 0 && (
                    <ul className="ml-6 flex list-disc flex-col [&>li]:mt-2">
                      {we.accomplishments.map((acc) => (
                        <li key={acc.id} data-testid="we-accomplishment">
                          <BaseText>{acc.content}</BaseText>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ResumeSection>
      )}

      {resume.education.length > 0 && (
        <ResumeSection title="Education" testId="education-section">
          <div className="flex flex-col gap-4">
            {resume.education.map((edu) => (
              <div key={edu.id}>
                <div>
                  <Label> {edu.degree}</Label>
                </div>
                <div>
                  <BaseText> {edu.institution}</BaseText>
                </div>
                <div>
                  <BaseText>
                    {' '}
                    {edu.startDate}
                    {edu.endDate ? ` – ${edu.endDate}` : ' – present'}
                  </BaseText>
                </div>
              </div>
            ))}
          </div>
        </ResumeSection>
      )}
    </div>
  );
}
