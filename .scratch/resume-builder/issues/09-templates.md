Status: ready-for-human

# #09 — Templates (built-in + switching)

## What to build

Design and implement at least 2 built-in resume templates. Each template defines both the visual layout (fonts, colours, column structure) and the section order (e.g. whether skills appear before or after work experience). Templates are built-in — the job seeker cannot create or customise them.

A template switcher in the resume editor lets the job seeker switch templates at any time without losing any content. The `template_id` is stored on the `resumes` table and is already wired in earlier slices.

This issue is marked **HITL** because the visual design of built-in templates (typography, spacing, column structure, colour palette) requires human design decisions that are not specified in the project scope.

## Acceptance criteria

- [ ] At least 2 distinct built-in templates are implemented, each with a different visual layout and section order
- [ ] A template switcher is available in the resume editor (e.g. a dropdown or segmented control)
- [ ] Switching templates updates the live preview immediately without losing any resume content
- [ ] The selected template is persisted (stored as `template_id` on the resume)
- [ ] The live preview in the editor and the PDF export both use the same template render path

## Blocked by

- [#03 Resume editor shell](.scratch/resume-builder/issues/03-resume-editor-shell.md)
