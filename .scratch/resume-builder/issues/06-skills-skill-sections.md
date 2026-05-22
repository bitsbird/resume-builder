Status: ready-for-agent

# #06 — Skills & Skill Sections

## What to build

Add skills management and per-resume skill sections to the editor. Skills are shared entities (1–2 words each) with no inherent category. Categorisation is a per-resume concern handled by Skill Sections — each resume can group the same skills into completely different named sections.

The editor gets a Skill Sections area where the job seeker can create named sections (e.g. "Tech Skills", "Soft Skills"), add skills to each section from the shared repository (or create new skills inline), and reorder both sections and skills within sections.

The live preview renders skill sections in the order defined for this resume.

## Acceptance criteria

- [ ] Database schema includes `skills`, `skill_sections`, and `skill_section_skills` tables with appropriate `position` columns
- [ ] The editor lets the job seeker create named skill sections for the current resume
- [ ] Within a section, the job seeker can add skills from the shared repository or create new skills inline (1–2 words enforced)
- [ ] Skills within a section are orderable (position on `skill_section_skills`)
- [ ] Skill sections themselves are orderable within the resume (position on `skill_sections`)
- [ ] The same skill can appear in different sections across different resumes
- [ ] Skill sections and their skills appear in the live preview in the correct order

## Blocked by

- [#03 Resume editor shell](.scratch/resume-builder/issues/03-resume-editor-shell.md)
