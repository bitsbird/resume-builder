## What This Document Is

This is the highest authority governing how AI agents and software engineers work together. it is the foundation everything else is built on. It protects both humans and AI, and makes their collaboration trustworthy.

### Issue tracker

Issues are local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: `CONTEXT.md` at `docs/CONTEXT.md`, ADRs under `docs/adr/`. See `docs/agents/domain.md`.

# Teck stack

Next.js:

  <!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

  <!-- END:nextjs-agent-rules -->

# Claude Code Rules for Next.js

## Tech stack

- Use TypeScript.
- Use Next.js App Router.
- Use Tailwind CSS for styling.
- Use shadcn/ui components by default.
- Use Vitest for testing.

## Project conventions

- Prefer Server Components by default.
- Add `"use client"` only when browser APIs, state, effects, refs, or event handlers are required.
- Keep route-specific components close to the route.
- Put shared UI in `components/` and non-UI helpers in `lib/`.
- Use `app/` as the source of truth for routes, layouts, loading states, errors, and API routes.

## Routing

- Use `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx` where needed.
- Use `route.ts` for API endpoints.
- Prefer route groups for shared layout structure.
- Do not use Pages Router patterns like `getServerSideProps` or `getStaticProps`.

## Data fetching and mutations

- Fetch data on the server when possible.
- Prefer server actions for mutations when they fit the use case.
- Use `revalidatePath` or `revalidateTag` after writes.
- Use explicit caching and revalidation; do not guess.
- Keep client-side fetching minimal and intentional.

## UI and styling

- Use shadcn/ui components for buttons, inputs, dialogs, dropdowns, cards, and form controls.
- Before building a custom UI component, check `components/ui/` first; if the shadcn component is missing, install it with `pnpm dlx shadcn@latest add <component>`.
- Style with Tailwind utilities only unless a file needs a special exception.
- Avoid inventing custom component patterns when shadcn/ui already provides one.
- Prefer semantic HTML, accessible labels, and keyboard-friendly interactions.
- Keep layouts responsive, mobile-first.

## JavaScript style

- Write eloquent JavaScript. Prefer expressive built-in array methods (`.with()`, `.toSorted()`, `.toSpliced()`, `.at()`, `.map()`, `.filter()`) over index manipulation and manual mutations.
- Extract repeated or non-obvious patterns into named utility functions in `lib/utils.ts` so call sites read as intent, not mechanics.

## Component rules

- Keep components small and single-purpose.
- Prefer named exports for reusable components.
- Always define a named `interface ComponentNameProps` for every component's props — never inline the type in the function signature.
- Use descriptive prop names and explicit TypeScript types.
- Use meaningful variable names that describe the value's purpose, not its type (e.g. `formattedDate` not `date`, `parsedDate` not `parsed`).
- All TypeScript types and variables must use camelCase. When reading from the database (snake_case columns), define a private `Db<Type>` type mirroring the raw columns and a `to<Type>()` transformer function that maps it to the camelCase domain type. Never expose snake_case fields outside of `lib/`.
- Avoid `any`; use `unknown` or strict generics instead.
- Use composition over deeply nested conditional logic.

## Testing

- Write Vitest tests for utilities, hooks, and react components.
- use a `tests/` folder consistently.
- Mock server calls and browser APIs deliberately.

### Testing React components

- Tests must prove the component does not break according to its props type definition.
- For each component, write at least two tests: one with all props fully populated, one with all optional or nullable props at their empty/boundary value (empty string, null, undefined, 0 — whatever the type allows).
- Assert on rendered output, not implementation details. Use `data-slot` attributes to verify the correct shadcn/ui element is rendered.
- Never assert on text that is also tested by a child component's own test suite — test the integration boundary, not the child's internals.

## Quality checks

- Run `pnpm lint` and fix all errors before considering a task done.
- Run `npx tsc --noEmit` and fix all TypeScript errors before considering a task done.
- Run `pnpm test`.
- Run `pnpm build` before finishing larger changes.
- Fix TypeScript errors instead of suppressing them.
- Whenever you change a file, update its tests accordingly before considering the task done.
- Always flag temporary mock data with a `// TODO: remove once real data is wired up` comment.

## Generate Commit Guidelines

    - The commit contains the following structural elements, to communicate intent to the consumers of your library:
        - fix: a commit of the type `fix` patches a bug in your codebase (this correlates with PATCH in semantic versioning).
        - feat: a commit of the type `feat` introduces a new feature to the codebase (this correlates with MINOR in semantic versioning).
        - Others: commit types other than `fix:` and `feat:` are allowed, for example `chore:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, and others.
        - A scope may be provided to a commit’s type, to provide additional contextual information and is contained within parenthesis, e.g., `feat(parser): add ability to parse arrays`.
    - Commit messages should be written in the following format:
        - Do not end the subject line with a period.
        - Use the imperative mood in the subject line.
        - Use the body to explain what and why you have done something. In most cases, you can leave out details about how a change has been made.
        - The commit message should be structured as follows: `<type>[optional scope]: <description>`
