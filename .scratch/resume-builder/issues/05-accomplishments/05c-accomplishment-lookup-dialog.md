Status: ready-for-agent

# #05c — Lookup dialog: select / deselect accomplishments (max 5)

## Parent

[#05 Accomplishments (selection + linking)](issue.md)

## What to build

A lookup dialog on each WE card listing all accomplishments for that WE in the shared repository. The user checks or unchecks accomplishments to include them in the current resume. Selecting an accomplishment that already exists in the repository creates a link (the same DB row is referenced, not duplicated). Attempting to select a 6th accomplishment for a WE shows an inline validation error.

## Acceptance criteria

- [ ] Each WE card has a button that opens the lookup dialog
- [ ] The dialog lists all accomplishments for that WE from the shared repository
- [ ] Already-selected accomplishments are shown as checked
- [ ] Checking an unchecked accomplishment links it to the current resume/WE
- [ ] Unchecking a checked accomplishment removes the link
- [ ] Selecting a 6th accomplishment is blocked with an inline validation error
- [ ] Selecting uses the existing DB row (link), not a copy

## Blocked by

- [#05a add-accomplishment-inline](05a-add-accomplishment-inline.md)
- [#05b list-accomplishments-in-editor](05b-list-accomplishments-in-editor.md)
