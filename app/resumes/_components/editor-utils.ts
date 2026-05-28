import type { EditorAccomplishment, EditorWorkExperience } from './editor-types';
import type { CreateWorkExperienceInput } from '@/lib/work-experiences';

type AccomplishmentEntry =
  | { type: 'new'; content: string }
  | { type: 'existing'; id: number; content: string };

function toAccomplishmentEntry(acc: EditorAccomplishment): AccomplishmentEntry {
  return acc.type === 'new'
    ? { type: 'new', content: acc.content }
    : { type: 'existing', id: acc.id, content: acc.content };
}

export function toActionInput(
  wes: EditorWorkExperience[],
): Array<
  | { type: 'new'; data: CreateWorkExperienceInput; accomplishments: AccomplishmentEntry[] }
  | { type: 'existing'; id: number; data: CreateWorkExperienceInput; accomplishments: AccomplishmentEntry[] }
> {
  return wes.map((we) => {
    const accomplishments = we.accomplishments.map(toAccomplishmentEntry);
    return we.type === 'new'
      ? { type: 'new', data: we.data, accomplishments }
      : { type: 'existing', id: we.id, data: we.data, accomplishments };
  });
}
