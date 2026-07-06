import type { ReactNode } from 'react';

import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { resumeDesignTokens } from '@/app/resumes/[id]/preview/_lib/resume-design-tokens';
import type { WorkExperienceWithAccomplishments } from '@/lib/resumes';
import type { TemplateProps } from '@/lib/templates';

const styles = StyleSheet.create({
  page: {
    color: resumeDesignTokens.colors.text,
  },
  main: {
    paddingLeft: resumeDesignTokens.spacing[8],
    paddingRight: resumeDesignTokens.spacing[8],
    backgroundColor: resumeDesignTokens.colors.bodyBackground,
  },
  sectionRow: {
    flexDirection: 'row',
    paddingTop: resumeDesignTokens.spacing[4],
  },
  sectionLabelColumn: {
    flexGrow: 2,
    marginRight: resumeDesignTokens.spacing[8],
  },
  sectionContentColumn: {
    flexGrow: 4,
    paddingBottom: resumeDesignTokens.spacing[4],
  },
  sectionTitle: {
    fontSize: resumeDesignTokens.typeScale.sm.fontSize,
    fontWeight: resumeDesignTokens.typeScale.sm.fontWeight,
  },
  label: {
    color: resumeDesignTokens.colors.text,
  },
  workExperienceList: {
    flexDirection: 'column',
    gap: resumeDesignTokens.spacing[4],
  },
  workExperienceRow: {
    flexDirection: 'row',
    gap: resumeDesignTokens.spacing[8],
  },
  workExperienceMeta: {
    flexGrow: 2,
    flexDirection: 'column',
  },
  workExperienceAccomplishments: {
    flexGrow: 4,
  },
});

function formatDateRange(startDate: string, endDate: string | null): string {
  return `${startDate} - ${endDate ?? 'Present'}`;
}

interface TemplateSectionPdfProps {
  title: string;
  children: ReactNode;
}

function TemplateSectionPdf({ title, children }: TemplateSectionPdfProps) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionLabelColumn}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContentColumn}>{children}</View>
    </View>
  );
}

interface WorkExperienceEntryProps {
  workExperience: WorkExperienceWithAccomplishments;
}

function WorkExperienceEntry({ workExperience }: WorkExperienceEntryProps) {
  return (
    <View style={styles.workExperienceRow}>
      <View style={styles.workExperienceMeta}>
        <Text style={styles.label}>{workExperience.role}</Text>
        <Text style={styles.label}>{workExperience.employer}</Text>
        <Text style={styles.label}>
          {formatDateRange(workExperience.startDate, workExperience.endDate)}
        </Text>
      </View>
      <View style={styles.workExperienceAccomplishments}>
        {workExperience.accomplishments.map((accomplishment) => (
          <Text key={accomplishment.id} style={styles.label}>
            {accomplishment.content}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function DefaultTemplatePdf({ resume }: TemplateProps) {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.main}>
          <TemplateSectionPdf title="Contacts">
            {/* TODO: remove once real data is wired up */}
            <View>
              <Text style={styles.label}>Email: James.sommers@gmail.com</Text>
            </View>
            <View>
              <Text style={styles.label}>Address: Karl Lieblich Strasse 104, Berlin, Germany</Text>
            </View>
            <View>
              <Text style={styles.label}>Phone: +49166641234</Text>
            </View>
          </TemplateSectionPdf>
          <TemplateSectionPdf title="Profile">
            <Text style={styles.label}>
              {resume.profileSummary}
              {/* TODO: remove once real data is wired up */}
              This software engineering curriculum bridges computer science foundations with
              practical industry skills. Students master data structures, algorithms, and object
              oriented programming using Python and Java. The full stack segment covers scalable web
              applications with React, Node.js, and PostgreSQL. DevOps topics include Docker
              containerization, CI CD pipelines, and AWS cloud management. Advanced modules explore
              distributed systems, microservices, and workflows like Agile and Git. The program
              culminates in a distributed system Capstone Project, preparing graduates with the
              technical depth and collaborative skills to excel in modern engineering teams.
            </Text>
          </TemplateSectionPdf>
          <TemplateSectionPdf title="Skills">
            {resume.skillSections.map((section) => (
              <Text key={section.id} style={styles.label}>
                {section.title}:{' '}
                {section.skills.map((skill, i) => (i !== 0 ? ` - ${skill.name}` : skill.name)).join('')}
              </Text>
            ))}
          </TemplateSectionPdf>
          <View style={{ paddingTop: resumeDesignTokens.spacing[4], paddingBottom: resumeDesignTokens.spacing[4] }}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <View style={[styles.workExperienceList, { paddingTop: resumeDesignTokens.spacing[4] }]}>
              {resume.workExperiences.map((workExperience) => (
                <WorkExperienceEntry key={workExperience.id} workExperience={workExperience} />
              ))}
            </View>
          </View>
          <TemplateSectionPdf title="Education">
            {resume.education.map((education, i, all) => (
              <View
                key={education.id}
                style={{ paddingBottom: i === all.length - 1 ? 0 : resumeDesignTokens.spacing[4] }}
              >
                <Text style={styles.label}>{education.degree}</Text>
                <Text style={styles.label}>{education.institution}</Text>
                <Text style={styles.label}>{formatDateRange(education.startDate, education.endDate)}</Text>
              </View>
            ))}
          </TemplateSectionPdf>
        </View>
      </Page>
    </Document>
  );
}
