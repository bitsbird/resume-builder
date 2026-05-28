import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function swapItems<T>(arr: T[], i: number, j: number): T[] {
  return arr.with(i, arr[j]).with(j, arr[i]);
}
