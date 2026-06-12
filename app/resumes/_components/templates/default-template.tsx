import type { TemplateProps } from '@/lib/templates';

export function DefaultTemplate({ resume }: TemplateProps) {
  return <h1>{resume.title}</h1>;
}
