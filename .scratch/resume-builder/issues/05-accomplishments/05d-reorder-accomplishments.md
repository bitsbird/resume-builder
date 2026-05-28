Status: ready-for-agent

# #05d — Reorder accomplishments within the resume

## Parent

[#05 Accomplishments (selection + linking)](issue.md)

## What to build

Up/down controls on each accomplishment item in the editor allow the user to change the display order. The new position is persisted on the `resume_work_experience_accomplishments` join table row.

## Acceptance criteria

- [ ] Each accomplishment item has up and down buttons
- [ ] The first item's up button is disabled; the last item's down button is disabled
- [ ] Moving an item swaps positions in the join table
- [ ] The list re-renders in the updated order immediately after the move

## Blocked by

- [#05b list-accomplishments-in-editor](05b-list-accomplishments-in-editor.md)
