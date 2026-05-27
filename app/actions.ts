'use server';

import { redirect } from 'next/navigation';

import { getDb } from '@/lib/db';
import { createResume, listResumes } from '@/lib/resumes';
import type { CreateResumeInput, Resume } from '@/lib/resumes';

export async function getResumes(): Promise<Resume[]> {
  return listResumes(getDb());
}

export async function createResumeAction(
  input: CreateResumeInput,
): Promise<{ error: string } | void> {
  const result = createResume(getDb(), input);
  if ('error' in result) return { error: result.error };
  redirect(`/resumes/${result.id}`);
}
