# Project scope

## Resume Builder

A component-based resume builder enabling a single job seeker to generate resumes tailored to specific positions. The application treats user data as a shared repository of structured components rather than static text. All data entry happens through the resume interface.

---

## Architecture decisions

**Storage:** SQLite in a gitignored `data/` directory. Accessed via `better-sqlite3` through Next.js Server Actions. Data never enters the git repository.

**Auth:** None. Single job seeker, single local machine.

**Rich text:** Profile summary and accomplishments support bold/italic formatting, stored as Markdown, rendered as HTML in the browser preview and PDF export.

**PDF export:** Browser native print-to-PDF (`window.print()`). The resume preview is styled to be print-friendly.

**Templates:** Built-in only. A resume has a default template set at creation and can switch freely. Templates control both visual layout and section order.

---

## Data model

### Shared entities (repository)
| Entity | Owned by | Notes |
|---|---|---|
| Skill | Job seeker | 1–2 words, no inherent category |
| Work Experience | Job seeker | employer, role, start_date, end_date, location, header (nullable) |
| Accomplishment | Work Experience | Markdown, max 5 per WE per resume, linked across resumes |
| Education | Job seeker | degree, institution, start_date, end_date; always fully included |

### Per-resume entities
| Entity | Notes |
|---|---|
| Resume | title (unique), target_role, target_company, created_at, template_id, profile_summary (Markdown) |
| Skill Section | title + ordered subset of Skills; position stored on join table |

### Key join tables
- `resume_work_experiences` — resume ↔ work experience, with `position`
- `resume_work_experience_accomplishments` — selects up to 5 accomplishments per WE per resume, with `position`
- `skill_sections` — per-resume, with `position`
- `skill_section_skills` — skill section ↔ skill, with `position`

---

## Core constraints

- An accomplishment belongs strictly to one Work Experience and can never be associated with a different employer or role.
- A resume selects a maximum of 5 accomplishments per Work Experience.
- Injecting an accomplishment from another resume creates a **link** (shared reference), not a copy. Editing it updates all resumes. The job seeker can explicitly detach a copy to get an independent version.
- Cloning a resume copies metadata and profile summary as new values; all other selections (work experiences, accomplishments, skill sections, skills) are linked references pointing to the same shared entities.
- Skills have no inherent category — categorisation is a per-resume concern handled by Skill Sections.

---

## UI structure

- **Home:** List of resume cards (title, target role, target company, created date).
- **Resume editor:** Split view — editor panel (left) + live preview (right).
  - All entities added via `+` button inline in the editor.
  - From a work experience, a lookup shows all accomplishments for that WE across the repository.
  - Template switchable from the editor at any time.
- **PDF export:** Browser print triggered from the editor.
