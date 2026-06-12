# Plan: Template Selection & Preview

## Goal

Allow users to pick a resume template from a dropdown on the view page, then navigate to a preview route that renders the resume using the selected template.

---

## Requirements recap

1. Dropdown on `resumes/[id]` — shadcn `Select`, preselected to the default template
2. Preview button navigates to `resumes/[id]/preview` carrying the chosen template
3. Preview layout fetches resume data and renders it via the selected template component
4. Template is a React component; for now it only displays the resume title
5. Template is resolved at runtime from the user's selection (not hardcoded in the preview page)

---

## Architecture

### Template registry

A plain object in `lib/templates.ts` maps template IDs to their React components.

```ts
// lib/templates.ts
export type TemplateProps = { resume: ResumeWithData };
export type TemplateComponent = React.ComponentType<TemplateProps>;

export const TEMPLATES: Record<string, { label: string; component: TemplateComponent }> = {
  default: { label: 'Default', component: DefaultTemplate },
};

export const DEFAULT_TEMPLATE_ID = 'default';
```

This satisfies "template included at runtime based on user selection" — the preview page looks up the component from the registry by ID, so adding a new template only requires registering it here.

### Passing the selected template to preview

The selected template ID travels as a URL search param:

```
/resumes/42/preview?templateId=default
```

Benefits:
- Preview page stays a **Server Component** (reads `searchParams`)
- URL is shareable / bookmarkable
- No client-side state management needed on the preview side

### Keeping `resumes/[id]/page.tsx` as a Server Component

The view page is currently a Server Component. Only the selector + preview button need client interactivity (tracking selected template ID). Extract these into a `TemplateSelectorBar` client component; the rest of the page stays server-rendered.

---

## Files to create / modify

### New files

| File | Purpose |
|---|---|
| `lib/templates.ts` | Template registry — maps ID → `{ label, component }` |
| `app/resumes/_components/templates/default-template.tsx` | Default template — renders resume title only for now |
| `app/resumes/[id]/_components/template-selector-bar.tsx` | Client component — shadcn `Select` + Preview button, builds the preview URL with `?templateId=` |

### Modified files

| File | Change |
|---|---|
| `app/resumes/[id]/page.tsx` | Replace the native `<select>` stub with `<TemplateSelectorBar resumeId={resumeId} />` |
| `app/resumes/[id]/preview/page.tsx` | Fetch resume data, read `templateId` from `searchParams`, resolve template from registry, render it |
| `app/resumes/[id]/preview/layout.tsx` | Minimal semantic wrapper (no data fetching here) |

---

## Component contracts

### `TemplateSelectorBar`

```tsx
interface TemplateSelectorBarProps {
  resumeId: number;
}
```

- Client component (`"use client"`)
- Renders shadcn `Select` populated from `Object.entries(TEMPLATES)`
- Defaults to `DEFAULT_TEMPLATE_ID`
- Preview `Button` wraps a `<Link href={`/resumes/${resumeId}/preview?templateId=${selected}`}>` built from local state

### `DefaultTemplate`

```tsx
interface DefaultTemplateProps {
  resume: ResumeWithData;
}
```

- Server-safe (no `"use client"`)
- Renders `<h1>{resume.title}</h1>` only — placeholder for future styling

### `PreviewPage`

```tsx
// app/resumes/[id]/preview/page.tsx
interface PreviewPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ templateId?: string }>;
}
```

- Reads `templateId` from `searchParams`, falls back to `DEFAULT_TEMPLATE_ID`
- Validates that `templateId` exists in the registry; returns `notFound()` otherwise
- Fetches resume via `getResumeWithData(getDb(), resumeId)`
- Resolves `TemplateComponent = TEMPLATES[templateId].component`
- Renders `<TemplateComponent resume={resume} />`

### `PreviewLayout`

Simple semantic wrapper — no data fetching. Provides layout chrome for all preview sub-routes (for now just `page.tsx`).

---

## shadcn/ui dependency

The `Select` component is not yet installed. It must be added before implementation:

```bash
pnpm dlx shadcn@latest add select
```

---

## Open questions for review

1. ~~**`Link` vs `useRouter` in `TemplateSelectorBar`**~~ — resolved: use `Link`
2. **`templateId` validation on bad URL** — `notFound()` feels right; confirm
3. ~~**Template persistence**~~ — out of scope for now; a TODO will be left in the preview layout as a future reminder
