import type Database from 'better-sqlite3';

type DbResume = {
  id: number;
  title: string;
  target_role: string;
  target_company: string;
  created_at: string;
  template_id: string;
  profile_summary: string;
};

export type Resume = {
  id: number;
  title: string;
  targetRole: string;
  targetCompany: string;
  createdAt: string;
  templateId: string;
  profileSummary: string;
};

function toResume(row: DbResume): Resume {
  return {
    id: row.id,
    title: row.title,
    targetRole: row.target_role,
    targetCompany: row.target_company,
    createdAt: row.created_at,
    templateId: row.template_id,
    profileSummary: row.profile_summary,
  };
}

export function listResumes(db: Database.Database): Resume[] {
  return (db
    .prepare('SELECT * FROM resumes ORDER BY created_at DESC')
    .all() as DbResume[]).map(toResume);
}

// TODO: remove once real data is wired up via getResumes()
export function getMockResumes(): Resume[] {
  return [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      targetRole: 'Senior Frontend Engineer',
      targetCompany: 'Acme Corp',
      createdAt: '2026-05-20T10:00:00.000Z',
      templateId: 'default',
      profileSummary: 'Experienced frontend engineer with 7 years building React apps.',
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      targetRole: 'Full Stack Developer',
      targetCompany: 'Startup Inc',
      createdAt: '2026-05-18T09:30:00.000Z',
      templateId: 'default',
      profileSummary: 'Full stack developer focused on TypeScript and Node.js.',
    },
    {
      id: 3,
      title: 'Engineering Manager',
      targetRole: 'Engineering Manager',
      targetCompany: 'Big Tech Co',
      createdAt: '2026-05-15T14:00:00.000Z',
      templateId: 'default',
      profileSummary: 'People-first engineering leader with a background in distributed systems.',
    },
  ];
}
