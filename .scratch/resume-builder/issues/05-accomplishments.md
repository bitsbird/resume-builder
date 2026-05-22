Status: ready-for-agent

# #05 — Accomplishments (selection + linking)

## What to build

Add accomplishment management to the resume editor. Accomplishments are shared entities tied strictly to one Work Experience — they can never move to a different WE. The same accomplishment record can be linked (not copied) across multiple resumes.

From the editor, each Work Experience shows a lookup of all accomplishments for that WE in the shared repository. The job seeker selects which accomplishments to include in this resume (max 5 per WE). New accomplishments can be added inline. The selected accomplishments appear in the live preview under their WE, in the order the job seeker arranges them.

Injecting an accomplishment from another resume creates a link — a shared reference. Editing it updates all resumes that reference it. (The detach-to-copy flow is a separate deferred issue.)

## Acceptance criteria

- [ ] Database schema includes `accomplishments` table and `resume_work_experience_accomplishments` join table (with `position`); max-5 constraint enforced server-side
- [ ] Each WE in the editor shows a lookup of all accomplishments for that WE in the repository
- [ ] The job seeker can add a new accomplishment inline (stored as Markdown)
- [ ] The job seeker can select/deselect accomplishments for the current resume (up to 5 per WE)
- [ ] Selected accomplishments can be reordered within the resume (position on join table)
- [ ] Accomplishments render as HTML (from Markdown) in the live preview
- [ ] Selecting an accomplishment that already exists in the repository creates a link — the same row is referenced, not duplicated
- [ ] Attempting to select a 6th accomplishment for a WE shows a validation error

## Blocked by

- [#04 Work Experience management](.scratch/resume-builder/issues/04-work-experience-management.md)
