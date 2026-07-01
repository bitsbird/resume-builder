import { H1, H3 } from '@/components/ui/typography';
import type { TemplateProps } from '@/lib/templates';

import { SimpleLabel } from './simple-label';
import { SimpleText } from './simple-text';
import TemplateSection from './template-section';
import WorkTemplateSection from './work-template-section';

export function DefaultTemplate({ resume }: TemplateProps) {
  return (
    <div className="flex flex-col text-gray-600">
      <header className="bg-blue-50 p-8">
        <H1 className="pb-2">James Sommers</H1>
        <H3>{resume.targetRole}</H3>
      </header>
      <main className="bg-white px-8">
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
        <WorkTemplateSection title="Work Experience" workExperiences={resume.workExperiences} />
      </main>
    </div>
  );
}
