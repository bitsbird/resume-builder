import type Database from 'better-sqlite3';

type DbJobSeeker = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type JobSeeker = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type UpdateJobSeekerInput = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

function toJobSeeker(row: DbJobSeeker): JobSeeker {
  return {
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
  };
}

export function getJobSeeker(db: Database.Database): JobSeeker {
  const row = db.prepare('SELECT * FROM job_seeker WHERE id = 1').get() as DbJobSeeker;
  return toJobSeeker(row);
}

export function updateJobSeeker(db: Database.Database, input: UpdateJobSeekerInput): void {
  db
    .prepare('UPDATE job_seeker SET name = ?, email = ?, phone = ?, address = ? WHERE id = 1')
    .run(input.name, input.email, input.phone, input.address);
}
