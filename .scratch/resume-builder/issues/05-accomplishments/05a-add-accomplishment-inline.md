Status: ready-for-agent

# #05a — Add a new accomplishment inline

## Parent

[#05 Accomplishments (selection + linking)](issue.md)

## What to build

Create the DB schema (`accomplishments` table and `resume_work_experience_accomplishments` join table with `position`), the `lib/accomplishments.ts` data layer, and the `EditorAccomplishment` type in `editor-types.ts`.

Expose an inline input inside each WE card in the editor so the user can type and save a new accomplishment. On save, a new record is created in the shared `accomplishments` table (tied to the WE), immediately linked to this resume/WE via the join table, and appears in the list under the WE card.

## Acceptance criteria

- [ ] `accomplishments` table exists with at least `id`, `we_id`, and `content` columns
- [ ] `resume_work_experience_accomplishments` join table exists with `resume_id`, `we_id`, `accomplishment_id`, and `position` columns
- [ ] Max-5-per-WE constraint is enforced server-side
- [ ] Each WE card in the editor has an inline input to add a new accomplishment
- [ ] Submitting the resume creates the accomplishment in the DB and links it to the current resume/WE
- [ ] The new accomplishment appears in the list under the WE card immediately after save

## Blocked by

None — can start immediately
