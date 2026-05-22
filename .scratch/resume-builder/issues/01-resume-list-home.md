Status: ready-for-agent

# #01 — Resume list (Home + DB foundation)

## What to build

Set up the data layer and render the home page. This slice establishes the SQLite database via `better-sqlite3`, creates the `resumes` table schema, wires up a Server Action to list all resumes, and renders the home page as a grid of resume cards (title, target role, target company, created date).

Also fix the Vitest path alias mismatch: `vitest.config.ts` currently points `@/*` to `./src`, but the project has no `src/` directory — update it to point to `./app` so tests can import from `@/`.

The home page is the entry point for the entire application. It must show an empty state gracefully when no resumes exist yet.

## Acceptance criteria

- [ ] SQLite database is initialised in a gitignored `data/` directory using `better-sqlite3` accessed through Next.js Server Actions
- [ ] `resumes` table exists with columns: `id`, `title` (unique), `target_role`, `target_company`, `created_at`, `template_id`, `profile_summary`
- [ ] Server Action returns all resumes ordered by `created_at` descending
- [ ] Home page (`/`) displays a card for each resume showing title, target role, target company, and created date
- [ ] Home page shows a clear empty state when no resumes exist
- [ ] Vitest `@/*` alias resolves to the project root (no `./src` mismatch)

## Blocked by

None — can start immediately.
