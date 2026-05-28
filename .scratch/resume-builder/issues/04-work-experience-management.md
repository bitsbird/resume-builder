Status: ready-for-agent

# #04 — Work Experience management

## What to build

Add the ability to manage Work Experiences from the resume editor. Work Experiences are shared entities belonging to the job seeker — adding one in any resume makes it available across all resumes.

The editor panel gets a Work Experience section with a `+` button to add a new WE inline. Each WE displays its fields (employer, role, start date, end date, location, optional header) and can be edited or removed from the resume. The resume-level ordering of WEs is controlled by the `position` column on the `resume_work_experiences` join table.

The editor, in the work experiences section, show a button for the lookup of existing work experiences. When clicked, a popup opens, showing the available saved work experiences. The WE list is filtered for all saved experiences that are not in the section already.
The WE experience in the popup are presented as cards. Each card has an add button. Once clicked, the popup closes and the selected WE is added to the editor. If no work experiences are available, the poup opens and show a message informing the user.
The popup has a close button that closes without side effects

The preview panel updates live to show the selected WEs in order.

## Fix

A resume is created along with other data. Creating a resume is an atomic operation along with inserting all his data. Fix the resume creation, so that click on new resume on the home page opens directly the resume editor. update tasks with status ready-for-agent if needed to mind this fix.

## Acceptance criteria

- [] Fix for new resume, it opens resume editor and enable insert of resume data.
- [ ] Database schema includes `work_experiences` table and `resume_work_experiences` join table (with `position`)
- [ ] A `+` button in the editor's Work Experience section opens an inline form to add a new Work Experience (employer, role, start_date, end_date nullable, location, header nullable)
- [ ] the WE editor show a remove button which removes the work experience. A WE can be removed from a resume, It will be deleted only if it's not referenced from any other resumes

- [ ] The Work Experience section is always visible and editable for work experience previusly added and show the work experience data.
- [ ] Added WEs appear in the editor and are included in the resume (linked via join table)
- [ ] WEs can be reordered within the resume by clicking up & down button at the top of the editor. This will move the work-expierence visually and will update the order (position stored on join table)
- [ ] WEs appear in the live preview in the correct order
- [ ] Saved Wes can be lookup and added to the editor
- [ ] All mutations go through Server Actions

## Blocked by

- [#03 Resume editor shell](.scratch/resume-builder/issues/03-resume-editor-shell.md)
