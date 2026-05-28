Status: ready-for-agent

# #05f — Shared-accomplishment indicator and delete warning

## Parent

[#05 Accomplishments (selection + linking)](issue.md)

## What to build

When an accomplishment record is linked in more than one resume, display a visual badge or highlight on the accomplishment item in the editor to signal it is shared. Editing the content of a shared accomplishment updates it everywhere. When the user tries to delete a shared accomplishment, show a confirmation dialog listing the other resumes that reference it before proceeding.

## Acceptance criteria

- [ ] Accomplishments referenced in 2+ resumes show a visible shared indicator in the editor
- [ ] Editing a shared accomplishment's content persists the change and it is reflected in all referencing resumes
- [ ] Deleting a shared accomplishment shows a confirmation dialog naming the other resumes that reference it
- [ ] Confirming deletion removes the accomplishment record and all its join-table references
- [ ] Non-shared accomplishments are deleted without a confirmation dialog

## Blocked by

- [#05a add-accomplishment-inline](05a-add-accomplishment-inline.md)
- [#05c accomplishment-lookup-dialog](05c-accomplishment-lookup-dialog.md)
