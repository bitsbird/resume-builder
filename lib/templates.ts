import type { ResumeWithData } from './resumes';

export interface TemplateProps {
  resume: ResumeWithData;
}

export type TemplateComponent = React.ComponentType<TemplateProps>;

interface TemplateDefinition {
  label: string;
  load: () => Promise<TemplateComponent>;
}

export const TEMPLATES: Record<string, TemplateDefinition> = {
  default: {
    label: 'Default',
    load: async () =>
      (
        await import('@/app/resumes/[id]/preview/_components/templates/default-template/default-template')
      ).DefaultTemplate,
  },
};

export const defaultTemplateId = 'default';
