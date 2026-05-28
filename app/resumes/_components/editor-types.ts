import type { CreateWorkExperienceInput } from '@/lib/work-experiences';

export type EditorWorkExperience =
  | { type: 'new'; localId: string; data: CreateWorkExperienceInput }
  | { type: 'existing'; localId: string; id: number; data: CreateWorkExperienceInput };
