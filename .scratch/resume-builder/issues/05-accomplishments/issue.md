Status: ready-for-agent

# #05 — Accomplishments (selection + linking)

## What to build

Add accomplishment management to the resume editor. Accomplishments are shared entities tied strictly to one Work Experience — they can never move to a different WE. The same accomplishment record can be linked (not copied) across multiple resumes.

From the editor, each Work Experience shows a lookup of all accomplishments for that WE in the shared repository. The job seeker selects which accomplishments to include in this resume (max 5 per WE). New accomplishments can be added inline. The selected accomplishments appear in the live preview under their WE, in the order the job seeker arranges them.

Injecting an accomplishment from another resume creates a link — a shared reference. Editing it updates all resumes that reference it. (The detach-to-copy flow is a separate deferred issue.)

## Acceptance criteria

- [ ] Database schema includes `accomplishments` table and `resume_work_experience_accomplishments` join table (with `position`); max-5 constraint enforced server-side
- [ ] a WE linked in the editor show a default set of accomplishments
- [ ] Each WE in the editor shows a lookup of all accomplishments for that WE in the repository
- [ ] The job seeker can add a new accomplishment inline
- [ ] The job seeker can select/deselect accomplishments for the current resume (up to 5 per WE)
- [ ] Selected accomplishments can be reordered within the resume (position on join table)
- [ ] Accomplishments render as HTML
- [ ] Selecting an accomplishment that already exists in the repository creates a link — the same row is referenced, not duplicated
- [ ] Attempting to select a 6th accomplishment for a WE shows a validation error
- [ ] an accomplishment can be modified in the editor, highlight it differently, when shared with other resumes
- [ ] an accomplishment can be deleted from the work experience. If deleted, the system show a message informing the user when the accomplishment is referenced in other resumes

## Blocked by

- [#04 Work Experience management](.scratch/resume-builder/issues/04-work-experience-management.md)

## Subtasks

- [ ] [#05a add-accomplishment-inline](05a-add-accomplishment-inline.md)
- [ ] [#05b list-accomplishments-in-editor](05b-list-accomplishments-in-editor.md)
- [ ] [#05c accomplishment-lookup-dialog](05c-accomplishment-lookup-dialog.md)
- [ ] [#05d reorder-accomplishments](05d-reorder-accomplishments.md)
- [ ] [#05e accomplishments-in-preview](05e-accomplishments-in-preview.md)
- [ ] [#05f shared-accomplishment-indicator](05f-shared-accomplishment-indicator.md)
