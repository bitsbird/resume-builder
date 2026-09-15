import type Database from 'better-sqlite3';
import { beforeEach, describe, expect, it } from 'vitest';

import { initDb } from '@/lib/db';
import { getJobSeeker, updateJobSeeker } from '@/lib/job-seeker';

let db: Database.Database;

beforeEach(() => {
  db = initDb(':memory:');
});

describe('getJobSeeker', () => {
  it('returns empty strings for a freshly initialized database', () => {
    expect(getJobSeeker(db)).toEqual({ name: '', email: '', phone: '', address: '' });
  });
});

describe('updateJobSeeker', () => {
  it('persists all fields and returns them from getJobSeeker', () => {
    updateJobSeeker(db, {
      name: 'James Sommers',
      email: 'james.sommers@example.com',
      phone: '+49 160 1234567',
      address: 'Karl Liebknecht Strasse 104, Berlin, Germany',
    });

    expect(getJobSeeker(db)).toEqual({
      name: 'James Sommers',
      email: 'james.sommers@example.com',
      phone: '+49 160 1234567',
      address: 'Karl Liebknecht Strasse 104, Berlin, Germany',
    });
  });

  it('overwrites a previous update rather than creating a second row', () => {
    updateJobSeeker(db, { name: 'First Name', email: 'a@b.com', phone: '1', address: 'A' });
    updateJobSeeker(db, { name: 'Second Name', email: 'c@d.com', phone: '2', address: 'B' });

    expect(getJobSeeker(db).name).toBe('Second Name');
    expect(db.prepare('SELECT COUNT(*) AS count FROM job_seeker').get()).toEqual({ count: 1 });
  });
});
