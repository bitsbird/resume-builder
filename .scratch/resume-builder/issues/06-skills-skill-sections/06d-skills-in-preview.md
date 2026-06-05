Status: ready-for-agent

# #06d — Skill sections in live preview

## Parent

[#06 Skills & Skill Sections](issue.md)

## What to build

Render the skill sections and their skills in the resume preview panel in the order defined for this resume. Each section shows its name as a heading and its skills as a comma-separated list or chips below it, positioned after the work experience block.

## Acceptance criteria

- [ ] The preview panel renders all skill sections for the resume in `position` order
- [ ] Each section shows its name and skills in `position` order
- [ ] Sections with no skills are not rendered
- [ ] Preview updates without requiring a page reload (reactive to editor state, or re-fetches on save)

## Blocked by

- [#06a skill-sections-and-inline-skills](06a-skill-sections-and-inline-skills.md)
