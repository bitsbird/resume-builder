Status: ready-for-agent

# #08 — Profile Summary

## What to build

Add a per-resume profile summary editor to the resume editor panel. The profile summary is a free-form Markdown text field — unique to each resume. It supports bold and italic formatting. In the live preview it is rendered as HTML.

The editor panel displays a Markdown editor (textarea or lightweight rich-text control) for the profile summary. Changes persist via a Server Action that updates the `profile_summary` column on the `resumes` table.

## Acceptance criteria

- [ ] The editor panel includes a Profile Summary field (Markdown input — textarea or lightweight rich-text editor with bold/italic support)
- [ ] The profile summary is per-resume (stored in `resumes.profile_summary`)
- [ ] Changes are saved via a Server Action (auto-save on blur or explicit save button)
- [ ] The live preview renders the profile summary as HTML (Markdown → HTML conversion)
- [ ] Bold and italic Markdown syntax renders correctly in the preview

## Blocked by

- [#03 Resume editor shell](.scratch/resume-builder/issues/03-resume-editor-shell.md)
