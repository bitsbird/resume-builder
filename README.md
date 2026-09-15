# Resume builder

A single-user web app for building and exporting tailored resumes. Job seekers maintain one shared pool of career data — skills, work experience, accomplishments, education — and compose it into multiple resumes, each targeting a different role or company.

## Objectives

This is a **prototype**, not a production system. The goal is to test AI-assisted, spec-driven development: writing domain specs first, letting AI agents implement against them, and keeping a human in the loop to verify output. The method is the point — the resume builder itself is the vehicle.

**Author:** Emanuele Covello

## Architecture

- **Next.js App Router** (`app/`) — server components by default, route-colocated UI.
- **SQLite** via `better-sqlite3` (`lib/db.ts`) — single local file, no external DB.
- **`lib/`** — domain modules (`resumes`, `work-experiences`, `accomplishments`, `skills`, `educations`, `templates`) that own all DB access and expose camelCase domain types.
- **PDF export** via `@react-pdf/renderer`, rendered from the same template components used for on-screen preview (`app/resumes/[id]/preview/`).
- No authentication — the app assumes a single job seeker.

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS + shadcn/ui + Radix primitives
- better-sqlite3
- @react-pdf/renderer (PDF export)
- Vitest + Testing Library (tests)
- ESLint + Prettier + Husky (lint-staged)

## AI Tools

Built with a spec-driven, vertical-slice workflow:

1. Domain concepts are documented first in [docs/CONTEXT.md](docs/CONTEXT.md) (Resume, Skill, Work Experience, Accomplishment, Education, Template).
2. Work is broken into small, independently-shippable issues tracked as markdown files under `.scratch/` (see [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)), triaged with a fixed label vocabulary ([docs/agents/triage-labels.md](docs/agents/triage-labels.md)).
3. An AI agent implements each slice against the spec and existing conventions (see [AGENTS.md](AGENTS.md)).
4. A human reviews and verifies every change — including visually inspecting generated PDFs, not just automated tests — before it's considered done.

## Data model

SQLite tables (see `lib/db.ts` for full schema):

| Table | Purpose |
|---|---|
| `resumes` | One resume: title, target role/company, template, profile summary (Markdown) |
| `work_experiences` | Shared job history entries (employer, role, dates, location) |
| `resume_work_experiences` | Which work experiences a resume includes, and in what order |
| `accomplishments` | Shared, quantifiable achievements tied to one work experience |
| `resume_work_experience_accomplishments` | Which accomplishments (max 5) a resume selects per experience, and their order |
| `skills` | Shared skill keywords |
| `skill_sections` / `skill_section_skills` | Per-resume named groupings of skills, ordered |
| `educations` / `resume_educations` | Shared education entries; every resume includes all of them |

Work experiences, accomplishments, skills, and education are shared across resumes — editing one updates everywhere it's referenced.

## Running the project

```bash
pnpm install
pnpm dev          # start dev server
pnpm build        # production build
pnpm start        # run production build
pnpm lint         # ESLint
pnpm test         # Vitest
npx tsc --noEmit  # type check
```
