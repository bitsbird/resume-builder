import { describe, expect, it } from 'vitest';

import { DefaultTemplatePdf } from '@/app/resumes/[id]/preview/_components/templates/default-template/default-template-pdf';
import { TEMPLATES } from '@/lib/templates';

describe('TEMPLATES', () => {
  it('resolves the Default template PDF component via loadPdf', async () => {
    const PdfComponent = await TEMPLATES.default.loadPdf();

    expect(PdfComponent).toBe(DefaultTemplatePdf);
  });
});
