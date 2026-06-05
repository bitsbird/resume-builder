Status: done

# #06a — Skill section management + inline skill adding

## Parent

[#06 Skills & Skill Sections](issue.md)

## What to build

Introduce the DB schema for skills (`skills`, `skill_sections`, `skill_section_skills` with `position` columns) and add a Skill Sections area to the resume editor.

The job seeker can:

- Create named skill sections (e.g. "Tech Skills", "Soft Skills") with an editable title
- Delete a section
- Add new skills inline within a section — 1–2 words, enforced client-side and server-side
- Remove individual skills from a section

Added skills appear as chips/badges inside their section card. Everything saves and reloads correctly.

## Acceptance criteria

- [ ] DB schema includes `skills`, `skill_sections`, and `skill_section_skills` tables with `position` columns on `skill_sections` and `skill_section_skills`
- [ ] A "Skill Sections" area appears in the editor below Work Experience
- [ ] "+ Add section" creates a new section with an editable name field
- [ ] A section can be deleted (with its skill links)
- [ ] Within a section, an inline input lets the user type a new skill and add it as a chip; 1–2 words enforced
- [ ] A skill chip has a remove button
- [ ] A skill is removed from db if no referenced from other resumes
- [ ] Sections and their skills persist on save and reload correctly
- [ ] `EditorSkillSection` and `EditorSkill` types follow the `type: 'new' | 'existing'` pattern from `editor-types.ts`

## Blocked by

None — can start immediately
