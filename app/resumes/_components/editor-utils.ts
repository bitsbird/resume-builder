import type { EditorWorkExperience } from './editor-types';
import type { CreateWorkExperienceInput } from '@/lib/work-experiences';

export function toActionInput(
  wes: EditorWorkExperience[],
): Array<{ type: 'new'; data: CreateWorkExperienceInput } | { type: 'existing'; id: number }> {
  return wes.map((we) =>
    we.type === 'new' ? { type: 'new', data: we.data } : { type: 'existing', id: we.id },
  );
}
