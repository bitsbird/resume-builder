import { renderToBuffer } from '@react-pdf/renderer';
import { PDFParse } from 'pdf-parse';
import { describe, expect, it } from 'vitest';

import { DefaultTemplatePdf } from '@/app/resumes/[id]/preview/_components/templates/default-template/default-template-pdf';
import type { ResumeWithData } from '@/lib/resumes';

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

const longProfileSummary =
  'Building reliable backend systems for five years. This software engineering background bridges computer science foundations with practical industry skills, spanning data structures, algorithms, and object oriented programming in Python and Java. The full stack experience covers scalable web applications with React, Node.js, and PostgreSQL. DevOps work includes Docker containerization, CI CD pipelines, and AWS cloud management. Advanced projects explore distributed systems, microservices, and workflows like Agile and Git, culminating in a distributed system capstone that combined technical depth with collaborative delivery across modern engineering teams.';

const fullResume: ResumeWithData = {
  id: 1,
  title: 'Senior Engineer CV',
  targetRole: 'Staff Software Engineer',
  targetCompany: 'Acme Corp',
  createdAt: '2024-06-01T12:00:00.000Z',
  templateId: 'default',
  profileSummary: longProfileSummary,
  workExperiences: [
    {
      id: 1,
      employer: 'Acme Corp',
      role: 'Senior Backend Engineer',
      startDate: '2022-01',
      endDate: null,
      location: 'Berlin',
      header: null,
      accomplishments: [{ id: 1, weId: 1, content: 'Led the platform migration' }],
    },
  ],
  skillSections: [
    {
      id: 1,
      resumeId: 1,
      title: 'Tech Skills',
      position: 0,
      skills: [
        { id: 1, name: 'TypeScript' },
        { id: 2, name: 'React' },
      ],
    },
  ],
  education: [
    { id: 1, degree: 'BSc Computer Science', institution: 'TU Berlin', startDate: '2015', endDate: '2019' },
    { id: 2, degree: 'MSc Computer Science', institution: 'TU Munich', startDate: '2019', endDate: null },
  ],
};

const minimalResume: ResumeWithData = {
  id: 2,
  title: '',
  targetRole: '',
  targetCompany: '',
  createdAt: '',
  templateId: '',
  profileSummary: '',
  workExperiences: [],
  skillSections: [],
  education: [],
};

async function extractPdfText(resume: ResumeWithData): Promise<string> {
  const buffer = await renderToBuffer(<DefaultTemplatePdf resume={resume} />);
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();
  return normalizeWhitespace(text);
}

describe('DefaultTemplatePdf', () => {
  it('renders the contacts section', async () => {
    const text = await extractPdfText(fullResume);

    expect(text).toContain('Contacts');
    expect(text).toContain('James.sommers@gmail.com');
  });

  it('renders the profile section with the resume profile summary', async () => {
    const text = await extractPdfText(fullResume);

    expect(text).toContain('Profile');
    expect(text).toContain(fullResume.profileSummary);
  });

  it('renders the full profile summary without clipping any characters, even though it wraps across many lines', async () => {
    const text = await extractPdfText(fullResume);

    expect(text).toContain(normalizeWhitespace(longProfileSummary));
  });

  it('renders a header with the target role', async () => {
    const text = await extractPdfText(fullResume);

    expect(text).toContain(fullResume.targetRole);
  });

  it('renders the skills section with each skill section title and its skills', async () => {
    const text = await extractPdfText(fullResume);

    expect(text).toContain('Skills');
    expect(text).toContain('Tech Skills:');
    expect(text).toContain('TypeScript');
    expect(text).toContain('React');
  });

  it('renders work experience with role, employer, dates, and accomplishments', async () => {
    const text = await extractPdfText(fullResume);

    expect(text).toContain('Work Experience');
    expect(text).toContain('Senior Backend Engineer');
    expect(text).toContain('Acme Corp');
    expect(text).toContain('2022-01 - Present');
    expect(text).toContain('Led the platform migration');
  });

  it('renders education with degree, institution, and dates, using Present for an open-ended end date', async () => {
    const text = await extractPdfText(fullResume);

    expect(text).toContain('Education');
    expect(text).toContain('BSc Computer Science');
    expect(text).toContain('TU Berlin');
    expect(text).toContain('2015 - 2019');
    expect(text).toContain('MSc Computer Science');
    expect(text).toContain('TU Munich');
    expect(text).toContain('2019 - Present');
  });

  it('renders section titles with no stray content for a boundary resume with no skills, no education, and no work experience', async () => {
    const text = await extractPdfText(minimalResume);

    expect(text).toContain('Contacts');
    expect(text).toContain('Profile');
    expect(text).toContain('Skills');
    expect(text).toContain('Work Experience');
    expect(text).toContain('Education');

    expect(text).not.toContain('Tech Skills:');
    expect(text).not.toContain('Senior Backend Engineer');
    expect(text).not.toContain('BSc Computer Science');
  });

  it.each([
    ['a fully-populated resume', fullResume],
    ['a boundary resume', minimalResume],
  ])('produces a valid, non-empty PDF buffer for %s', async (_label, resume) => {
    const buffer = await renderToBuffer(<DefaultTemplatePdf resume={resume} />);

    expect(buffer.length).toBeGreaterThan(0);
    expect(buffer.toString('latin1', 0, 5)).toBe('%PDF-');
  });
});
