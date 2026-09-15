import type { ReactNode } from 'react';

import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { resumeDesignTokens } from '@/app/resumes/[id]/preview/_lib/resume-design-tokens';
import type { WorkExperienceWithAccomplishments } from '@/lib/resumes';
import type { TemplateProps } from '@/lib/templates';

Font.registerHyphenationCallback((word) => [word]);

// The PDF renders smaller than the web preview's typeScale looks comfortable on a printed page,
// so the PDF uses its own reduced scale instead of the shared resumeDesignTokens.typeScale.
// `body` must be set explicitly: react-pdf falls back to an 18pt default for any Text without
// a fontSize, which is larger than every heading here and inverts the web version's hierarchy.
const pdfTypeScale = {
  lg: { fontSize: 25, fontWeight: resumeDesignTokens.typeScale.lg.fontWeight },
  md: { fontSize: 17, fontWeight: resumeDesignTokens.typeScale.md.fontWeight },
  sm: { fontSize: 16, fontWeight: resumeDesignTokens.typeScale.sm.fontWeight },
  body: { fontSize: 10, fontWeight: 400 },
} as const;

const styles = StyleSheet.create({
  page: {
    color: resumeDesignTokens.colors.text,
  },
  header: {
    padding: resumeDesignTokens.spacing[8],
    backgroundColor: resumeDesignTokens.colors.headerBackground,
  },
  name: {
    fontSize: pdfTypeScale.lg.fontSize,
    fontWeight: pdfTypeScale.lg.fontWeight,
    paddingBottom: resumeDesignTokens.spacing[2],
  },
  targetRole: {
    fontSize: pdfTypeScale.md.fontSize,
    fontWeight: pdfTypeScale.md.fontWeight,
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
    flexBasis: 0,
    flexGrow: 2,
    marginRight: resumeDesignTokens.spacing[8],
  },
  sectionContentColumn: {
    flexBasis: 0,
    flexGrow: 4,
    paddingBottom: resumeDesignTokens.spacing[4],
  },
  sectionTitle: {
    fontSize: pdfTypeScale.sm.fontSize,
    fontWeight: pdfTypeScale.sm.fontWeight,
  },
  label: {
    fontSize: pdfTypeScale.body.fontSize,
    fontWeight: pdfTypeScale.body.fontWeight,
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
    flexBasis: 0,
    flexGrow: 2,
    flexDirection: 'column',
  },
  workExperienceAccomplishments: {
    flexBasis: 0,
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
    <View style={styles.sectionRow} wrap={false}>
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
    <View wrap={false} style={styles.workExperienceRow}>
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

export function DefaultTemplatePdf({ resume, jobSeeker }: TemplateProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{jobSeeker.name}</Text>
          <Text style={styles.targetRole}>{resume.targetRole}</Text>
        </View>
        <View style={styles.main}>
          <TemplateSectionPdf title="Contacts">
            <View>
              <Text style={styles.label}>Email: {jobSeeker.email}</Text>
            </View>
            <View>
              <Text style={styles.label}>Address: {jobSeeker.address}</Text>
            </View>
            <View>
              <Text style={styles.label}>Phone: {jobSeeker.phone}</Text>
            </View>
          </TemplateSectionPdf>
          <TemplateSectionPdf title="Profile">
            <Text style={styles.label}>{resume.profileSummary}</Text>
          </TemplateSectionPdf>
          <TemplateSectionPdf title="Skills">
            {resume.skillSections.map((section) => (
              <Text key={section.id} style={styles.label}>
                {section.title}:{' '}
                {section.skills
                  .map((skill, i) => (i !== 0 ? ` - ${skill.name}` : skill.name))
                  .join('')}
              </Text>
            ))}
          </TemplateSectionPdf>
          <View
            style={{
              paddingTop: resumeDesignTokens.spacing[4],
              paddingBottom: resumeDesignTokens.spacing[4],
            }}
          >
            {/* Keep the title glued to at least the first entry so it never renders alone at the bottom of a page. */}
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {resume.workExperiences[0] && (
                <View style={{ paddingTop: resumeDesignTokens.spacing[4] }}>
                  <WorkExperienceEntry workExperience={resume.workExperiences[0]} />
                </View>
              )}
            </View>
            {resume.workExperiences.length > 1 && (
              <View
                style={[styles.workExperienceList, { paddingTop: resumeDesignTokens.spacing[4] }]}
              >
                {resume.workExperiences.slice(1).map((workExperience) => (
                  <WorkExperienceEntry key={workExperience.id} workExperience={workExperience} />
                ))}
              </View>
            )}
          </View>
          <TemplateSectionPdf title="Education">
            {resume.education.map((education, i, all) => (
              <View
                key={education.id}
                wrap={false}
                style={{ paddingBottom: i === all.length - 1 ? 0 : resumeDesignTokens.spacing[4] }}
              >
                <Text style={styles.label}>{education.degree}</Text>
                <Text style={styles.label}>{education.institution}</Text>
                <Text style={styles.label}>
                  {formatDateRange(education.startDate, education.endDate)}
                </Text>
              </View>
            ))}
          </TemplateSectionPdf>
        </View>
      </Page>
    </Document>
  );
}
