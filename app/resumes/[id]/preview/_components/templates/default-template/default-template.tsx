import { resumeDesignTokens } from '@/app/resumes/[id]/preview/_lib/resume-design-tokens';
import type { TemplateProps } from '@/lib/templates';

import { ResumeHeading } from './resume-heading';
import { SimpleLabel } from './simple-label';
import { SimpleText } from './simple-text';
import TemplateSection from './template-section';
import WorkTemplateSection from './work-template-section';

export function DefaultTemplate({ resume }: TemplateProps) {
  return (
    <div className="flex flex-col" style={{ color: resumeDesignTokens.colors.text }}>
      <header
        style={{
          padding: resumeDesignTokens.spacing[8],
          backgroundColor: resumeDesignTokens.colors.headerBackground,
        }}
      >
        <ResumeHeading size="lg" style={{ paddingBottom: resumeDesignTokens.spacing[2] }}>
          James Sommers
        </ResumeHeading>
        <ResumeHeading size="md">{resume.targetRole}</ResumeHeading>
      </header>
      <main
        style={{
          paddingInline: resumeDesignTokens.spacing[8],
          backgroundColor: resumeDesignTokens.colors.bodyBackground,
        }}
      >
        <TemplateSection title="Contacts">
          <div>
            <div>
              <SimpleLabel>Email:</SimpleLabel>
              <SimpleText>James.sommers@gmail.com</SimpleText>
            </div>
            <div>
              <SimpleLabel>Address:</SimpleLabel>
              <SimpleText>Karl Lieblich Strasse 104, Berlin, Germany</SimpleText>
            </div>
            <div>
              <SimpleLabel>Phone:</SimpleLabel>
              <SimpleText>+49166641234</SimpleText>
            </div>
          </div>
        </TemplateSection>
        <TemplateSection title="Profile">
          <div className="flex flex-4 flex-col">
            <SimpleText>
              {resume.profileSummary}
              This software engineering curriculum bridges computer science foundations with
              practical industry skills. Students master data structures, algorithms, and object
              oriented programming using Python and Java. The full stack segment covers scalable web
              applications with React, Node.js, and PostgreSQL. DevOps topics include Docker
              containerization, CI CD pipelines, and AWS cloud management. Advanced modules explore
              distributed systems, microservices, and workflows like Agile and Git. The program
              culminates in a distributed system Capstone Project, preparing graduates with the
              technical depth and collaborative skills to excel in modern engineering teams.
            </SimpleText>
          </div>
        </TemplateSection>
        <TemplateSection title="Skills">
          <div className="flex flex-4 flex-col">
            {resume.skillSections.map((section) => (
              <div key={section.id}>
                <SimpleLabel>{section.title}:</SimpleLabel>
                {section.skills.map((s, i) => (
                  <span key={s.id}>
                    <SimpleText>
                      {i !== 0 ? ' - ' : ''}
                      {s.name}
                    </SimpleText>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </TemplateSection>
        <WorkTemplateSection title="Work Experience" workExperiences={resume.workExperiences} />

        <TemplateSection title="Education" noBorder={true}>
          {resume.education.map((e, i, arr) => (
            <div
              key={e.id}
              style={{ paddingBottom: i === arr.length - 1 ? 0 : resumeDesignTokens.spacing[4] }}
            >
              <div>
                <SimpleLabel>{e.degree}</SimpleLabel>
              </div>
              <div>
                <SimpleText>{e.institution}</SimpleText>
              </div>
              <div>
                <SimpleText>
                  {e.startDate} - {e.endDate ?? 'Present'}
                </SimpleText>
              </div>
            </div>
          ))}
        </TemplateSection>
      </main>
    </div>
  );
}
