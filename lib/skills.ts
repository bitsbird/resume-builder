import type Database from 'better-sqlite3';

type DbSkill = {
  id: number;
  name: string;
};

type DbSkillSection = {
  id: number;
  resume_id: number;
  title: string;
  position: number;
};

export type Skill = {
  id: number;
  name: string;
};

export type SkillSection = {
  id: number;
  resumeId: number;
  title: string;
  position: number;
};

export type SkillSectionWithSkills = SkillSection & { skills: Skill[] };

function toSkill(row: DbSkill): Skill {
  return { id: row.id, name: row.name };
}

function toSkillSection(row: DbSkillSection): SkillSection {
  return { id: row.id, resumeId: row.resume_id, title: row.title, position: row.position };
}

export function createSkill(db: Database.Database, { name }: { name: string }): { id: number } {
  const result = db.prepare('INSERT INTO skills (name) VALUES (?)').run(name);
  return { id: result.lastInsertRowid as number };
}

export function createSkillSection(
  db: Database.Database,
  { resumeId, title }: { resumeId: number; title: string },
): { id: number } {
  const { next_pos } = db
    .prepare('SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM skill_sections WHERE resume_id = ?')
    .get(resumeId) as { next_pos: number };
  const result = db
    .prepare('INSERT INTO skill_sections (resume_id, title, position) VALUES (?, ?, ?)')
    .run(resumeId, title, next_pos);
  return { id: result.lastInsertRowid as number };
}

export function addSkillToSection(
  db: Database.Database,
  sectionId: number,
  skillId: number,
): void {
  const { next_pos } = db
    .prepare('SELECT COALESCE(MAX(position), -1) + 1 AS next_pos FROM skill_section_skills WHERE section_id = ?')
    .get(sectionId) as { next_pos: number };
  db.prepare('INSERT INTO skill_section_skills (section_id, skill_id, position) VALUES (?, ?, ?)')
    .run(sectionId, skillId, next_pos);
}

export function getSkillSectionsForResume(
  db: Database.Database,
  resumeId: number,
): SkillSectionWithSkills[] {
  const sections = (
    db.prepare('SELECT * FROM skill_sections WHERE resume_id = ? ORDER BY position ASC').all(resumeId) as DbSkillSection[]
  ).map(toSkillSection);

  return sections.map((section) => {
    const skills = (
      db
        .prepare(
          `SELECT s.* FROM skills s
           JOIN skill_section_skills sss ON sss.skill_id = s.id
           WHERE sss.section_id = ?
           ORDER BY sss.position ASC`,
        )
        .all(section.id) as DbSkill[]
    ).map(toSkill);
    return { ...section, skills };
  });
}

export function removeSkillFromSection(
  db: Database.Database,
  sectionId: number,
  skillId: number,
): void {
  db.prepare('DELETE FROM skill_section_skills WHERE section_id = ? AND skill_id = ?').run(sectionId, skillId);
  const { count } = db
    .prepare('SELECT COUNT(*) AS count FROM skill_section_skills WHERE skill_id = ?')
    .get(skillId) as { count: number };
  if (count === 0) {
    db.prepare('DELETE FROM skills WHERE id = ?').run(skillId);
  }
}

export function deleteSkillSection(db: Database.Database, sectionId: number): void {
  const skillIds = (
    db.prepare('SELECT skill_id FROM skill_section_skills WHERE section_id = ?').all(sectionId) as { skill_id: number }[]
  ).map((r) => r.skill_id);

  db.prepare('DELETE FROM skill_section_skills WHERE section_id = ?').run(sectionId);
  db.prepare('DELETE FROM skill_sections WHERE id = ?').run(sectionId);

  skillIds.forEach((skillId) => {
    const { count } = db
      .prepare('SELECT COUNT(*) AS count FROM skill_section_skills WHERE skill_id = ?')
      .get(skillId) as { count: number };
    if (count === 0) {
      db.prepare('DELETE FROM skills WHERE id = ?').run(skillId);
    }
  });
}
