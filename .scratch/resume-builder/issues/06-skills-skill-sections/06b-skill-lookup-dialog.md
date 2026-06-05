Status: ready-for-agent

# #06b — Skill lookup dialog

## Parent

[#06 Skills & Skill Sections](issue.md)

## What to build

Add an "Add saved skill" button to each skill section card that opens a dialog listing all skills in the shared repository that are not already in this section. The job seeker selects a skill to link it to the section (no copy — the same `skills` row is referenced). The same skill can be linked to different sections across different resumes.

## Acceptance criteria

- [ ] Each skill section card has an "Add saved skill" button
- [ ] Clicking it opens a dialog listing all repository skills not already in this section
- [ ] Selecting a skill links it (adds a row to `skill_section_skills`), not copies it
- [ ] The same skill can be added to multiple sections across different resumes
- [ ] Closing the dialog without selecting does nothing
- [ ] The dialog is accessible (focus management, keyboard navigation)

## Blocked by

- [#06a skill-sections-and-inline-skills](06a-skill-sections-and-inline-skills.md)
