Status: ready-for-agent

# #04 — Work Experience management

## What to build

Add the ability to manage Work Experiences from the resume editor. Work Experiences are shared entities belonging to the job seeker — adding one in any resume makes it available across all resumes.

The editor panel gets a Work Experience section with a `+` button to add a new WE inline. Each WE displays its fields (employer, role, start date, end date, location, optional header) and can be edited or removed from the resume. The resume-level ordering of WEs is controlled by the `position` column on the `resume_work_experiences` join table.

The preview panel updates live to show the selected WEs in order.

## Acceptance criteria

- [ ] Database schema includes `work_experiences` table and `resume_work_experiences` join table (with `position`)
- [ ] A `+` button in the editor's Work Experience section opens an inline form to add a new Work Experience (employer, role, start_date, end_date nullable, location, header nullable)
- [ ] Added WEs appear in the editor and are included in the resume (linked via join table)
- [ ] WEs can be reordered within the resume (position stored on join table)
- [ ] A WE can be removed from a resume without deleting the shared entity
- [ ] WEs appear in the live preview in the correct order
- [ ] All mutations go through Server Actions

## Blocked by

- [#03 Resume editor shell](.scratch/resume-builder/issues/03-resume-editor-shell.md)
