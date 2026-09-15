import { renderToBuffer } from '@react-pdf/renderer';
import type { NextRequest } from 'next/server';

import { getDb } from '@/lib/db';
import { getJobSeeker } from '@/lib/job-seeker';
import { getResumeWithData } from '@/lib/resumes';
import { defaultTemplateId, TEMPLATES } from '@/lib/templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const resumeId = parseInt(id, 10);
  if (isNaN(resumeId)) {
    return new Response('Not Found', { status: 404 });
  }

  const templateId = request.nextUrl.searchParams.get('templateId') ?? defaultTemplateId;
  const template = TEMPLATES[templateId];
  if (!template) {
    return new Response('Not Found', { status: 404 });
  }

  const db = getDb();
  const resume = getResumeWithData(db, resumeId);
  if (!resume) {
    return new Response('Not Found', { status: 404 });
  }
  const jobSeeker = getJobSeeker(db);

  const PdfTemplate = await template.loadPdf();
  const buffer = await renderToBuffer(<PdfTemplate resume={resume} jobSeeker={jobSeeker} />);

  const filename = resume.title.replace(/"/g, '') || 'resume';

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}.pdf"`,
    },
  });
}
