Status: ready-for-agent

# #06c — Reorder sections and skills

## Parent

[#06 Skills & Skill Sections](issue.md)

## What to build

Add up/down reordering for both skill sections within the resume and skills within a section. Positions persist on save and control the order in which sections and skills are rendered everywhere.

## Acceptance criteria

- [ ] Each skill section has "move up" and "move down" buttons; first section has no "move up", last has no "move down"
- [ ] Each skill chip within a section has "move up" and "move down" controls
- [ ] Positions are written to `skill_sections.position` and `skill_section_skills.position` on save
- [ ] Reloading the editor preserves the saved order
- [ ] Uses the existing `swapItems` utility from `lib/utils.ts`

## Blocked by

- [#06a skill-sections-and-inline-skills](06a-skill-sections-and-inline-skills.md)
