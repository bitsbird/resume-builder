import { describe, expect, it } from 'vitest';

import { initDb } from '@/lib/db';

describe('initDb', () => {
  it('creates a resumes table with the required columns', () => {
    const db = initDb(':memory:');
    const cols = db.prepare("PRAGMA table_info('resumes')").all() as { name: string }[];
    const names = cols.map((c) => c.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'id',
        'title',
        'target_role',
        'target_company',
        'created_at',
        'template_id',
        'profile_summary',
      ]),
    );
  });
});
