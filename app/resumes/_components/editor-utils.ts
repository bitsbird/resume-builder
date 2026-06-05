import type { EditorAccomplishment, EditorSkill, EditorSkillSection, EditorWorkExperience } from './editor-types';
import type { CreateWorkExperienceInput } from '@/lib/work-experiences';

type AccomplishmentEntry =
  | { type: 'new'; content: string }
  | { type: 'existing'; id: number; content: string };

type SkillEntry =
  | { type: 'new'; name: string }
  | { type: 'existing'; id: number; name: string };

type SkillSectionEntry =
  | { type: 'new'; title: string; skills: SkillEntry[] }
  | { type: 'existing'; id: number; title: string; skills: SkillEntry[] };

function toAccomplishmentEntry(acc: EditorAccomplishment): AccomplishmentEntry {
  return acc.type === 'new'
    ? { type: 'new', content: acc.content }
    : { type: 'existing', id: acc.id, content: acc.content };
}

function toSkillEntry(skill: EditorSkill): SkillEntry {
  return skill.type === 'new'
    ? { type: 'new', name: skill.name }
    : { type: 'existing', id: skill.id, name: skill.name };
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

export function toSkillSectionsActionInput(sections: EditorSkillSection[]): SkillSectionEntry[] {
  return sections.map((section) => {
    const skills = section.skills.map(toSkillEntry);
    return section.type === 'new'
      ? { type: 'new', title: section.title, skills }
      : { type: 'existing', id: section.id, title: section.title, skills };
  });
}
