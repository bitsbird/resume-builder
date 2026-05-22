Status: ready-for-agent

# #02 — Resume creation

## What to build

Add the ability to create a new resume from the home page. A dialog or inline form collects the required fields (title, target role, target company) and submits via a Server Action that inserts a new row into the `resumes` table. On success, the user is redirected to the resume editor for the newly created resume.

The default `template_id` should be assigned automatically (whichever template is considered the default); the user can switch it later in the editor.

## Acceptance criteria

- [ ] A "New Resume" affordance (button or similar) is visible on the home page
- [ ] Clicking it opens a form/dialog with fields: title (required, must be unique), target role (required), target company (required)
- [ ] Submitting the form calls a Server Action that inserts the resume into the database with a default `template_id`
- [ ] On success, the user is redirected to `/resumes/[id]`
- [ ] A duplicate title shows a validation error without crashing
- [ ] The new resume appears on the home page if the user navigates back

## Blocked by

- [#01 Resume list (Home + DB foundation)](.scratch/resume-builder/issues/01-resume-list-home.md)
