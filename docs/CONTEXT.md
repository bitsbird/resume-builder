# Resume

A professional resume is a concise, structured document highlighting a job seeker's work history, skills, and education to show employers why they qualify for a specific role. A resume is always rendered through a Template.

**Fields:** `title` (unique), `target_role`, `target_company`, `created_at`, `template_id`, `profile_summary` (Markdown)

**Composition:**

- Profile Summary — per-resume free-form Markdown text
- Skill Sections — per-resume ordered sections, each containing an ordered subset of Skills
- Work Experiences — ordered subset of the job seeker's Work Experiences; each carries a selected subset of Accomplishments (max 5) with their own ordering
- Education — always includes all Education entries, no selection

# Job Seeker

A single job seeker owns the application. There is no authentication or multi-user support. The job seeker's career data (Skills, Work Experiences, Accomplishments, Education) forms a shared repository that resumes compose from. All data entry happens through the resume interface — there is no standalone repository management screen.

# Skill

A skill is a concise keyword (1–2 words max) summing up a high-level, professionally relevant ability in a widely recognizable format for rapid scanning. Skills are shared entities belonging to the job seeker with no inherent category. They are organized into Skill Sections at the resume level.

# Skill Section

A skill section is a per-resume named grouping of skills. It has a title (e.g. "Tech Skills", "Soft Skills") and contains an ordered subset of the job seeker's Skills. A skill has no knowledge of which section it belongs to — only the section knows its skills. Different resumes can group the same skills into completely different sections.

# Profile Summary

A profile summary is a catchy, tailored biopic of your profile. It highlights relevant skills for HR scanning, acting as the key hook that decides whether they continue reading. It is per-resume, stored as Markdown, and rendered as HTML in the browser and PDF export.

# Work Experience

A work experience is a chronological record of your professional activity within a company, detailing your specific role, core responsibilities, and main quantifiable accomplishments. Work Experiences are shared entities belonging to the job seeker.

**Fields:** `employer`, `role`, `start_date`, `end_date` (nullable — current role), `location`, `header` (nullable — free-form plain text for role-level context not captured as accomplishments, e.g. "Managed 12 direct reports")

# Accomplishment

An accomplishment is a quantifiable achievement tied to a specific Work Experience. Accomplishments are shared entities — the same accomplishment record can be linked (not copied) across multiple resumes. Editing an accomplishment updates all resumes that reference it. A job seeker can detach a copy to create an independent version. Stored as Markdown; rendered as HTML.

**Constraint:** An accomplishment belongs strictly to one Work Experience. It can never be associated with a different employer or role. A resume selects a maximum of 5 accomplishments per Work Experience.

# Education

A structured record of academic history. Education entries are shared entities belonging to the job seeker. All resumes include all education entries with no selection or customisation.

**Fields:** `degree`, `institution`, `start_date`, `end_date`

# Template

A template defines how resume content is organised for presentation — both the visual layout (fonts, colours, column structure) and the section structure (order of sections). Templates are built-in and cannot be created by the user. A resume is assigned a default template at creation and can switch templates freely at any time without losing content.
