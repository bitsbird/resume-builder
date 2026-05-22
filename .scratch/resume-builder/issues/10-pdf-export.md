Status: ready-for-agent

# #10 — PDF export

## What to build

Add PDF export via the browser's native print dialog (`window.print()`). The resume preview is already rendered through a template — this slice adds print-friendly CSS to make that render suitable for a PDF page, and a "Export PDF" button in the editor that triggers `window.print()`.

Print styles should hide the editor panel and any UI chrome (buttons, navigation) so that only the resume preview is printed. Page breaks should be avoided mid-section where possible.

## Acceptance criteria

- [ ] A "Export PDF" (or "Print") button is visible in the resume editor
- [ ] Clicking it calls `window.print()`, opening the browser's native print dialog
- [ ] CSS `@media print` rules hide the editor panel and all UI chrome, leaving only the resume preview
- [ ] The resume preview renders cleanly on a standard A4/Letter page with appropriate margins
- [ ] Page breaks do not split Work Experience entries or Skill Sections mid-way where avoidable

## Blocked by

- [#09 Templates (built-in + switching)](.scratch/resume-builder/issues/09-templates.md)
