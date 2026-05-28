import type { CreateWorkExperienceInput } from '@/lib/work-experiences';

export type EditorAccomplishment =
  | { type: 'new'; localId: string; content: string }
  | { type: 'existing'; localId: string; id: number; content: string };

export type EditorWorkExperience =
  | { type: 'new'; localId: string; data: CreateWorkExperienceInput; accomplishments: EditorAccomplishment[] }
  | { type: 'existing'; localId: string; id: number; data: CreateWorkExperienceInput; accomplishments: EditorAccomplishment[] };
