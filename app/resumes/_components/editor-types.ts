import type { CreateWorkExperienceInput } from '@/lib/work-experiences';

export type EditorAccomplishment =
  | { type: 'new'; localId: string; content: string }
  | { type: 'existing'; localId: string; id: number; content: string };

export type EditorWorkExperience =
  | { type: 'new'; localId: string; data: CreateWorkExperienceInput; accomplishments: EditorAccomplishment[] }
  | { type: 'existing'; localId: string; id: number; data: CreateWorkExperienceInput; accomplishments: EditorAccomplishment[] };

export type EditorSkill =
  | { type: 'new'; localId: string; name: string }
  | { type: 'existing'; localId: string; id: number; name: string };

export type EditorSkillSection =
  | { type: 'new'; localId: string; title: string; skills: EditorSkill[] }
  | { type: 'existing'; localId: string; id: number; title: string; skills: EditorSkill[] };
