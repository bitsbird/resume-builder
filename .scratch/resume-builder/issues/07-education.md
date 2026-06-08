Status: ready-for-agent

# #07 — Education

## What to build

Add education entry management to the resume editor. Education entries are shared entities belonging to the job seeker. Unlike Work Experiences and Skills, education is always fully included in every resume — there is no selection or ordering per resume.

The editor gets an Education section with a `+` button to add entries inline. Each entry captures degree, institution, start date, and end date. All education entries always appear in the preview.

## Acceptance criteria

- [ ] Database schema includes an `education` table with columns: `id`, `degree`, `institution`, `start_date`, `end_date`
- [ ] The editor's Education section has a `+` button to add a new education entry inline
- [ ] Existing education entries are displayed in the editor and can be edited
- [ ] All education entries are always shown in the live preview (no per-resume selection)
- [ ] All mutations go through Server Actions

## Blocked by

- [#03 Resume editor shell](.scratch/resume-builder/issues/03-resume-editor-shell.md)
