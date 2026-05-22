Status: ready-for-agent

# #03 — Resume editor shell

## What to build

Implement the top-level resume editor page at `/resumes/[id]`. The layout is a split view: an editor panel on the left for data entry and a live preview panel on the right that re-renders as data changes.

The preview panel renders the resume through the assigned template. At this stage the template can produce a minimal but complete structural render — the visual polish comes in a later slice. The editor panel displays the resume title, target role, and target company as read-only headers (editable fields come in later slices as sections are added).

This shell is the foundation that all subsequent editor slices (Work Experience, Skills, Education, Profile Summary) plug into.

## Acceptance criteria

- [ ] Navigating to `/resumes/[id]` loads the editor for that resume (404 for unknown IDs)
- [ ] The page uses a split-view layout: editor panel on the left, live preview on the right
- [ ] The editor panel displays the resume's title, target role, and target company
- [ ] The preview panel renders the resume through its assigned template (minimal structural render is sufficient)
- [ ] The split view is responsive enough to be usable on a laptop screen

## Blocked by

- [#02 Resume creation](.scratch/resume-builder/issues/02-resume-creation.md)
