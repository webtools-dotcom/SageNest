# NEW_TOOL_GUIDE.md — How to add a new tool to SageNest

> Single-source guide for contributors and automated reviewers (AI) that describes exactly how to add a new tool, how it appears in the **Similar tools** system, and the checklist to ship a high-quality, consistent calculator/tool page.

---

## Table of contents

1. Overview & goals
2. High-level workflow (one-paragraph) — quick reference
3. Project conventions (naming, routing, components)
4. Files to create / update (step-by-step)
5. `src/data/tools.ts` — canonical tools registry (format + examples)
6. Page template (React + TSX) — copyable starting point
7. Header / Nav changes — keep a single Similar Tools nav pill
8. Styling & layout guidelines
9. Accessibility checklist
10. SEO & meta tags
11. Tests, QA & acceptance criteria
12. Example: add **Pregnancy Weight Gain Calculator** (end-to-end)
13. Common pitfalls & troubleshooting
14. PR checklist and suggested commit messages
15. How to use this file with AI for automatic review

---

# 1. Overview & goals

This document is the definitive guide contributors and automation (bots/AI) should follow when adding a new standalone tool (calculator) to the SageNest site. Goals:

- Make each new tool adopt the same visual language, navigation, and accessibility standards.
- Keep a single, data-driven source of truth for the tool list so adding a new tool only needs 1 small registry change plus the tool implementation files.
- Ensure the new tool appears in `/similar-tools` automatically and can be discovered from any existing tool page through a **Similar tools** button.
- Keep the repo maintainable and onboarding friction low for future contributors.

# 2. High-level workflow — quick reference

1. Create the new tool page component (suggested location: `src/pages/<slug>.tsx`).
2. Implement the tool UI and logic. Reuse shared UI patterns (Container, Header, Card) used elsewhere.
3. Do **not** add a second in-page Similar tools pill; global header nav already contains it.
4. Add the tool metadata to `src/data/tools.ts` (the single source of truth).
5. Add the new route to the routing file (usually `src/App.tsx` or `src/routes.tsx`).
6. Run local build/dev, verify `/similar-tools` lists the new tool and links work.
7. Run accessibility checks and add unit/E2E tests as needed.
8. Open a PR with the changes and reference this `NEW_TOOL_GUIDE.md` in the PR message.

# 3. Project conventions (naming, routing, components)

- **Slug & path**: Use `kebab-case` for URLs and filenames. Example: `pregnancy-weight-gain-calculator`.
- **Component / file names**: Use `PascalCase` for React components: `PregnancyWeightGainCalculator.tsx`.
- **Tool ID**: `snake_case` or `kebab-case` for `id` field in `tools.ts` is OK — be consistent. Prefer `kebab-case`.
- **Route path**: Always begin with `/` and match the slug: `/pregnancy-weight-gain-calculator`.
- **Single source of truth**: `src/data/tools.ts` (or `.json`) must list every tool. Do not create separate registries.
- **Styling**: Use existing utility classes in the project (Tailwind or CSS modules) — avoid new global CSS unless necessary.

# 4. Files to create / update (step-by-step)

For each new tool, the minimum changes are:

- Create: `src/pages/<slug>.tsx` — Tool page component.
- Optional: `src/components/<ToolName>/*` if the tool has multiple subcomponents.
- Update: `src/App.tsx` (or central routing file) — add `<Route path="/slug" element={<Page/>} />`.
- Update: `src/data/tools.ts` — add the tool metadata (id, title, path, description, thumbnail if any).
- Update (if needed): `src/components/Header.tsx` — header should contain a single global `Similar tools` pill in nav.
- Do not add `Similar tools` buttons inside individual tool hero sections; this causes duplicate pills.

> Note: If the repo uses JS instead of TS, the page file can be `.jsx` / `.js`. Keep the same structure.

# 5. `src/data/tools.ts` — canonical tools registry

This file is the only place you must edit to make a tool show up in `/similar-tools`. Example shape (TypeScript):

```ts
// src/data/tools.ts
export type Tool = {
  id: string;          // unique id (kebab-case)
  title: string;       // display title
  slug?: string;       // optional; keep for convenience
  path: string;        // route path e.g. '/pregnancy-due-date-calculator'
  description?: string;// short blurb (1-2 sentences)
  thumbnail?: string;  // optional asset path
  hidden?: boolean;    // if true, don't show in similar-tools listing (useful for dev)
};

const tools: Tool[] = [
  {
    id: "pregnancy-due-date-calculator",
    title: "Pregnancy Due Date Calculator",
    path: "/pregnancy-due-date-calculator",
    description: "Calculate your due date using clinical standards.",
  },
  {
    id: "pregnancy-weight-gain-calculator",
    title: "Pregnancy Weight Gain Calculator",
    path: "/pregnancy-weight-gain-calculator",
    description: "Track safe weight gain ranges during pregnancy.",
  }
];

export default tools;
```

**Important**
- Keep `path` values unique.
- If you add `thumbnail`, add it to `public/` or the repo's static assets location.
- `hidden: true` is useful during development when a page exists but you don't want it public yet.

# 6. Page template (React + TSX) — ready-to-copy

Use this as the starting point. Replace placeholder logic with your tool's real inputs/outputs.

```tsx
// src/pages/<slug>.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ToolPage() {
  return (
    <main className="page-container">
      <header className="tool-header grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif">Tool Title</h1>
          <p className="muted">Short description or instructions for the tool.</p>
        </div>
        <div className="actions flex justify-end items-center">
        </div>
      </header>

      <section className="tool-body mt-6">
        {/* Tool UI: form controls, inputs, results area */}
        <form className="card p-6 rounded-lg shadow-sm">
          {/* inputs here */}
        </form>
      </section>
    </main>
  );
}
```

**Placement**: keep only the global nav pill in the site header. Do not place a second Similar tools pill in the page hero.

# 7. Header / Nav changes — keep a single Similar Tools nav pill

There should be exactly one prominent nav pill in the top-right of the site that links to `/similar-tools`. Keep its style identical to the old "Calculator" pill. Implementation notes:

- Use `Link` from `react-router-dom`.
- Render a count optionally: `Similar tools (N)` where `N = tools.filter(t => !t.hidden).length`.
- Do not add dropdowns; the link should go to `/similar-tools` page where tools are listed in a data-driven way.

Keep this link only in `Header.tsx` (global nav). Do not duplicate it inside individual tool pages.

# 8. Styling & layout guidelines

- Keep the typography consistent: large serif headline for tool titles, body copy uses system sans.
- The hero (large central banner) is **not** used on tool pages — tools should be lean and get users to inputs quickly.
- Tool container should be centered with a comfortable max-width (e.g. `max-w-3xl`).
- Maintain visual hierarchy: Title → Short description → Inputs card → Results area.
- Use consistent spacing, rounded corners, and soft shadows matching the site.
- Mobile-first: ensure each interactive element is large enough to tap (min 44px target) and layouts stack vertically.

# 9. Accessibility checklist

Every new tool must pass this checklist before merging:

- [ ] Page uses semantic elements: `<main>`, `<header>`, `<section>`, `<form>`, `<label>`, `<button>`, `<nav>` where appropriate.
- [ ] All inputs have associated `<label>` elements (or `aria-label` if label is hidden).
- [ ] Keyboard navigation: tab order follows visual order and interactive elements are focusable.
- [ ] Focus outline visible and meets contrast requirements.
- [ ] Color contrast for text vs. background meets WCAG AA (4.5:1 for normal text).
- [ ] `aria-live` region added for dynamic results (if results update after user input without a full page reload).
- [ ] Images/thumbs have descriptive `alt` attributes.
- [ ] Links and buttons have `aria-label` where the visible text is ambiguous.

# 10. SEO & meta tags

For each tool page add appropriate meta tags to the head: `title`, `description`, `og:title`, `og:description`. Follow the site's existing SEO patterns (usually in a layout or Head component). Example:

- Title: `Pregnancy Weight Gain Calculator — SageNest`
- Description: Short summary of what the tool does (120–160 chars).

# 11. Tests, QA & acceptance criteria

Before merging, verify:

- **Functionality**: The tool works in dev and production build (no runtime errors).
- **Similar tools** listing: `/similar-tools` shows the new tool (title, description, link).
- **Navigation**: The global header's Similar tools pill links to `/similar-tools`.
- **Tool-level link**: Verify no duplicate Similar tools pill appears inside the tool hero.
- **No large hero**: Ensure the old hero component is removed from the tool page.
- **Accessibility**: Run `axe` or Lighthouse Accessibility checks and fix high-impact issues.
- **Responsiveness**: Check on multiple viewports.

Suggested manual checks (smoke tests):

- Open site, click Similar tools in header — confirm page loads.
- Click new tool from list — confirm page URL and core UI visible.
- Run `npm run build` locally and check for warnings or errors.

# 12. Example: Add **Pregnancy Weight Gain Calculator** (end-to-end)

This example demonstrates the exact minimal steps to add the tool.

1. **Create page file** `src/pages/pregnancy-weight-gain-calculator.tsx` using the page template in section 6.
2. **Implement UI**: inputs for pre-pregnancy weight, height, BMI calc, week selection, and a results card.
3. **Avoid duplicate nav pills**: Do not import `SimilarToolsButton` into new tool pages.
4. **Add route**: In `src/App.tsx`, add `<Route path="/pregnancy-weight-gain-calculator" element={<PregnancyWeightGainCalculator />} />`.
5. **Register tool**: In `src/data/tools.ts`, add the metadata object for weight-gain tool.
6. **Run & verify**: `npm run dev`, open `http://localhost:5173/similar-tools`, confirm weight gain tool appears.
7. **Accessibility**: Confirm labels, aria-live region for results.
8. **PR**: Open PR, reference this `NEW_TOOL_GUIDE.md` and list the checklist items you completed.

# 13. Common pitfalls & troubleshooting

- **Tool not showing in `/similar-tools`**: Did you add it to `src/data/tools.ts`? Check `hidden` flag.
- **Route 404**: Ensure you added the `<Route>` to the central routing file and the `path` matches exactly the `path` in `tools.ts`.
- **Styling mismatch**: Reuse site containers and classes — adding global CSS can break consistency.
- **Console errors due to SSR vs. client-only code**: If the repo has any pockets of SSR, avoid `window` in top-level scope.
- **Broken images**: Put thumbnails into `public/images/` and reference them as `/images/name.jpg`.
- **Duplicate IDs**: Ensure `id` is unique across `tools.ts`.

# 14. PR checklist and suggested commit messages

**PR checklist** (include in PR description):

- [ ] `src/pages/<slug>.tsx` added
- [ ] Route added to routing file
- [ ] `src/data/tools.ts` updated
- [ ] No duplicate in-page `Similar tools` pill
- [ ] Hero removed from tool page
- [ ] Accessibility checklist completed
- [ ] Local build succeeded: `npm run build`
- [ ] Tested on mobile/desktop viewports
- [ ] PR description references `NEW_TOOL_GUIDE.md`

**Suggested commit message template**:

```
feat(tool): add <Tool Title> (path: /<slug>)

- add page: src/pages/<slug>.tsx
- register in src/data/tools.ts
- add route in src/App.tsx
- do not add in-page Similar tools pill
```

# 15. How to use this file with AI for automatic review

If you want an AI (Codex / ChatGPT automation) to review a PR or a set of changes and ensure they match this guide, instruct the AI to do the following checks:

1. Verify `src/data/tools.ts` has one entry for the new tool and `path` matches the route in the router.
2. Verify `src/pages/<slug>.tsx` exists and does not render a duplicate `Similar tools` button inside the page hero.
3. Verify the global header contains a link to `/similar-tools` using `Link` from `react-router-dom`.
4. Verify the main hero (if present previously) has been removed from the tool page.
5. Run static analysis on the code (lint) — check for missing labels, `aria-*` usage, and presence of `aria-live` if results are dynamic.
6. Run a quick Lighthouse-like checklist: page title, description meta, and correct HTTP status for route.
7. Optionally, run a headless browser test to click `/similar-tools` → tool → back.

**Prompt template to ask AI to validate a PR:**

> "Please review the changed files in this PR and confirm they follow `NEW_TOOL_GUIDE.md`:
> - `src/data/tools.ts` must have a single entry for the new tool with path `/my-slug`.
> - `src/pages/my-slug.tsx` must exist and should not include a duplicate in-page `Similar tools` button.
> - `src/App.tsx` (or router file) must contain a `<Route path="/my-slug" ...>`.
> - Run accessibility checklist items and report failures.
> Provide a concise report with any required fixes."

---

## Appendix: Minimal checklist to paste in PR description

1. Page file added & route wired ✅
2. Tool registered in `src/data/tools.ts` ✅
3. Duplicate Similar tools pill avoided ✅
4. Hero removed from tool page ✅
5. Accessibility labels for inputs & results ✅
6. SEO meta set ✅
7. Local build passes ✅


---

