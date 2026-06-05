import type Database from 'better-sqlite3';
import { beforeEach, describe, expect, it } from 'vitest';

import { initDb } from '@/lib/db';
import {
  addSkillToSection,
  createSkill,
  createSkillSection,
  deleteSkillSection,
  getSkillSectionsForResume,
  removeSkillFromSection,
} from '@/lib/skills';
import { createResume } from '@/lib/resumes';

let db: Database.Database;
let resumeId: number;

beforeEach(() => {
  db = initDb(':memory:');
  resumeId = (createResume(db, { title: 'My Resume', targetRole: '', targetCompany: '' }) as { id: number }).id;
});

describe('createSkill', () => {
  it('creates a skill and returns its id', () => {
    const result = createSkill(db, { name: 'TypeScript' });
    expect(result).toMatchObject({ id: expect.any(Number) });
  });
});

describe('createSkillSection + getSkillSectionsForResume', () => {
  it('creates a section and returns it with an empty skills array in position order', () => {
    createSkillSection(db, { resumeId, title: 'Tech Skills' });
    createSkillSection(db, { resumeId, title: 'Soft Skills' });

    const sections = getSkillSectionsForResume(db, resumeId);

    expect(sections).toHaveLength(2);
    expect(sections[0]).toMatchObject({ resumeId, title: 'Tech Skills', position: 0, skills: [] });
    expect(sections[1]).toMatchObject({ resumeId, title: 'Soft Skills', position: 1, skills: [] });
  });
});

describe('addSkillToSection + getSkillSectionsForResume', () => {
  it('returns skills in position order within a section', () => {
    const { id: sectionId } = createSkillSection(db, { resumeId, title: 'Tech Skills' });
    const { id: skill1Id } = createSkill(db, { name: 'React' });
    const { id: skill2Id } = createSkill(db, { name: 'Node.js' });

    addSkillToSection(db, sectionId, skill1Id);
    addSkillToSection(db, sectionId, skill2Id);

    const sections = getSkillSectionsForResume(db, resumeId);

    expect(sections[0].skills).toHaveLength(2);
    expect(sections[0].skills[0]).toMatchObject({ id: skill1Id, name: 'React' });
    expect(sections[0].skills[1]).toMatchObject({ id: skill2Id, name: 'Node.js' });
  });
});

describe('removeSkillFromSection', () => {
  it('removes the skill link and deletes the skill record when it is orphaned', () => {
    const { id: sectionId } = createSkillSection(db, { resumeId, title: 'Tech Skills' });
    const { id: skillId } = createSkill(db, { name: 'React' });
    addSkillToSection(db, sectionId, skillId);

    removeSkillFromSection(db, sectionId, skillId);

    const sections = getSkillSectionsForResume(db, resumeId);
    expect(sections[0].skills).toHaveLength(0);
    const row = db.prepare('SELECT * FROM skills WHERE id = ?').get(skillId);
    expect(row).toBeUndefined();
  });

  it('does not delete the skill record when it is still used in another section', () => {
    const resumeId2 = (createResume(db, { title: 'Resume 2', targetRole: '', targetCompany: '' }) as { id: number }).id;
    const { id: section1Id } = createSkillSection(db, { resumeId, title: 'Tech Skills' });
    const { id: section2Id } = createSkillSection(db, { resumeId: resumeId2, title: 'Tech Skills' });
    const { id: skillId } = createSkill(db, { name: 'React' });
    addSkillToSection(db, section1Id, skillId);
    addSkillToSection(db, section2Id, skillId);

    removeSkillFromSection(db, section1Id, skillId);

    const row = db.prepare('SELECT * FROM skills WHERE id = ?').get(skillId);
    expect(row).toBeDefined();
  });
});

describe('deleteSkillSection', () => {
  it('removes the section, its skill links, and orphaned skills', () => {
    const { id: sectionId } = createSkillSection(db, { resumeId, title: 'Tech Skills' });
    const { id: skillId } = createSkill(db, { name: 'React' });
    addSkillToSection(db, sectionId, skillId);

    deleteSkillSection(db, sectionId);

    expect(getSkillSectionsForResume(db, resumeId)).toHaveLength(0);
    const row = db.prepare('SELECT * FROM skills WHERE id = ?').get(skillId);
    expect(row).toBeUndefined();
  });

  it('does not delete skills still used by other sections', () => {
    const resumeId2 = (createResume(db, { title: 'Resume 2', targetRole: '', targetCompany: '' }) as { id: number }).id;
    const { id: section1Id } = createSkillSection(db, { resumeId, title: 'Tech Skills' });
    const { id: section2Id } = createSkillSection(db, { resumeId: resumeId2, title: 'Tech Skills' });
    const { id: skillId } = createSkill(db, { name: 'React' });
    addSkillToSection(db, section1Id, skillId);
    addSkillToSection(db, section2Id, skillId);

    deleteSkillSection(db, section1Id);

    const row = db.prepare('SELECT * FROM skills WHERE id = ?').get(skillId);
    expect(row).toBeDefined();
  });
});
