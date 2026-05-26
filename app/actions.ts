'use server';

import { getDb } from '@/lib/db';
import { listResumes } from '@/lib/resumes';
import type { Resume } from '@/lib/resumes';

export async function getResumes(): Promise<Resume[]> {
  return listResumes(getDb());
}
