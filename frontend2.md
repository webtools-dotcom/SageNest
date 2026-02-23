SageNest Frontend Design System Version: 1.1

Last Updated: February 23, 2026

This document is the canonical frontend design system for SageNest. It
includes the new global background \#F3EFE0 (cream), a refined shadow
system for a premium look, and explicit performance-safe implementation
steps Codex should follow every time it modifies the frontend. Key goal:
make the whole site feel soft, premium, and brandable while keeping
page-speed and accessibility excellent. Avoid heavy visual effects (no
large blurs/backdrop-filter or animated

box-shadows). Use CSS variables and minimal shadow ops for fast
rendering. Table of Contents

Design Philosophy Color System (updated) Typography

Spacing & Layout

Component Library (card / button / inputs) Shadow & Elevation —
performance-minded Tailwind / Implementation Snippets (apply these)

Search & Replace Guidelines (safe automated commands) Performance &
pagespeed rules

Testing checklist & PR guidance Accessibility & motion preferences
\[Conclusion & commit message\] Design Philosophy

Maintain calm, trust-building design for pregnancy tools. Use cream
background to reduce glare and add warmth.

Use white only for floating cards or where high contrast is required for
readability. Keep animations subtle and GPU-friendly (transform +
opacity).

Use single-source CSS variables so changes are fast and consistent.
Color System (updated)

Primary brand & neutrals (use CSS variables in :root) CSS

Copy code :root {

> /\* NEW global page background (cream) \*/
>
> --cream: \#F3EFE0; /\* page background — replace old --cream if
> present \*/
>
> /\* Card & surfaces \*/
>
> --card-bg: \#ffffff; /\* keep cards white for contrast and readability
> \*/
>
> /\* Sage brand \*/
>
> --sage-primary: \#9AA88D; /\* CTAs, brand accents \*/ --sage-dark:
> \#7A8872;
>
> --sage-light: \#C5D0BA;
>
> --sage-softest: \#E8EDE3;
>
> /\* Text \*/
>
> --charcoal: \#2D2D2D;
>
> --text-secondary: \#6B6B6B; --text-tertiary: \#9B9B9B;
>
> /\* Borders / hairlines \*/
>
> --border-hairline: \#E5E7EB; --border-subtle: \#D1D5DB;
>
> /\* Shadows (single variable usage) \*/

--shadow-soft: 0 6px 18px rgba(45,45,45,0.06); /\* default card shadow
\*/ }

Usage rules

body / root: background: var(--cream); Cards/modules: background:
var(--card-bg);

Primary actions: background: var(--sage-primary); color: var(--card-bg);
Text: headings --charcoal, body --text-secondary

Borders: use --border-hairline or --border-subtle as appropriate

Do not replace all whites globally. Keep --card-bg white for
cards/inputs where contrast is required.

Typography

(Keep the earlier system — no change required except to ensure contrast
against cream background.)

CSS

Copy code /\* Display \*/

font-family: 'Playfair Display', Georgia, serif;

/\* Body / UI \*/

font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
sans-serif;

Type scale, line-heights, and usage remain the same as the prior file.
Ensure headings use --charcoal and body text uses --text-secondary for
comfortable contrast against --cream. Spacing & Layout

Retain spacing scale from earlier file. Ensure container background
remains transparent so page background (--cream) is visible behind page
sections.

Example root/body: CSS

Copy code html, body {

height: 100%; }

body {

> margin: 0;
>
> background: var(--cream); color: var(--text-secondary);
>
> -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing:
> grayscale; text-rendering: optimizeLegibility;

}

Component Library (high level updates) Cards (recommended: floating
white cards) CSS

Copy code .card {

> background: var(--card-bg);
>
> border-radius: 20px; /\* friendly rounded corners \*/ padding: 28px;
>
> border: 1px solid var(--border-hairline);

box-shadow: var(--shadow-soft); /\* simple, single shadow for
performance \*/ }

Buttons (primary) CSS

Copy code .button--primary {

> background: var(--sage-primary); color: var(--card-bg);
>
> border-radius: 999px; padding: 0.9rem 1.6rem; border: 1px solid
> transparent; font-weight: 600;

transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms
ease; }

.button--primary:hover, .button--primary:focus {

> transform: translateY(-2px); /\* GPU-friendly transform \*/

box-shadow: 0 10px 20px rgba(47,93,80,0.16); /\* controlled shadow - not
animated heavily \*/ }

Inputs CSS

Copy code

input, textarea, select { background: var(--card-bg);

> border: 1px solid var(--border-subtle); border-radius: 999px;
>
> padding: 12px 16px;

color: var(--charcoal); }

Shadow & Elevation — performance-minded Rules

Use one shadow variable per elevation level (--shadow-soft,
--shadow-medium, --shadow-hover).

Avoid stacking multiple layered shadows.

Do not animate box-shadow on frequent interactions. Prefer transform and
opacity. No backdrop-filter or heavy CSS filters.

Keep shadow alpha low (≤ 0.08) for GPU efficiency. Suggested constants

CSS

Copy code :root {

> --shadow-soft: 0 6px 18px rgba(45,45,45,0.06);
>
> --shadow-medium: 0 10px 30px rgba(45,45,45,0.08); --shadow-hover: 0
> 12px 36px rgba(45,45,45,0.10);

}

Tailwind / Implementation Snippets (apply these) If using Tailwind
(update tailwind.config.js): JavaScript

Copy code

// tailwind.config.js module.exports = {

> theme: { extend: {
>
> colors: {
>
> sageCream: '#F3EFE0', // page background sageCard: '#ffffff', // card
> surfaces sagePrimary: '#9AA88D',
>
> sageDark: '#7A8872', },
>
> boxShadow: {
>
> 'soft': '0 6px 18px rgba(45,45,45,0.06)', 'medium': '0 10px 30px
> rgba(45,45,45,0.08)',
>
> }, borderRadius: {
>
> 'lgcard': '20px', 'pill': '999px',
>
> } }

} }

Global CSS (e.g., src/styles/global.css or index.css)

CSS

Copy code :root {

> --cream: \#F3EFE0; --card-bg: \#ffffff;

--shadow-soft: 0 6px 18px rgba(45,45,45,0.06); }

html, body {

> background: var(--cream); color: var(--text-secondary);

}

/\* Ensure top-level app wrapper does not override the body background
\*/ \#root, \#app {

> min-height: 100%; background: transparent;

}

Search & Replace Guidelines (safe automated commands)

Important: run these in a branch, review diffs, and do not blindly
replace white everywhere. We provide examples using git + grep + sed.
Always create backups or use git to revert.

Create a new branch: Bash

Copy code

git checkout -b feat/ui/cream-background

Add global variables (manual edit src/styles/global.css or index.css) —
paste the :root block above.

Replace page-level bg-white usages safely (only where intended): Bash

Copy code

\# Find occurrences that look like page wrappers or body overrides: grep
-R --line-number "bg-white" src/ \| sed -n '1,200p'

\# Replace \*only\* in files known to be page wrappers or layout files:
\# Example (edit manually or use sed for a known file):

\# sed -i.bak "s/bg-white/bg-sageCream/g" src/layouts/MainLayout.tsx
Replace literal hex \#fff/#ffffff only where it denotes background:

Bash Copy code

\# Preview occurrences (do NOT replace blindly)

grep -R --line-number "#fff\\#ffffff" src/ \| sed -n '1,200p' \# For
known page wrapper file(s):

\# sed -i.bak "s/#ffffff/var(--card-bg)/g" src/components/SomeCard.css
Replace body { background: ... } in any file to background:
var(--cream): Bash

Copy code

\# Example: replace in index.css \# (Make a backup first)

cp src/styles/index.css src/styles/index.css.bak

perl -0777 -pe "s/body\s\*\\\[^\\\]\*\\/body { background: var(--cream);
}/s" -i src/styles/index.css Manual review required: after automated
replacements, review diffs (git diff) and run the site locally.

Performance & pagespeed rules

No heavy filters: do not add backdrop-filter, large blur() or
multi-layer filters.

Limit shadows: single shadow variable; avoid stacking multiple shadows
per element.

Prefer CSS over images: use SVG or CSS shapes instead of background hero
images where possible.

Avoid large critical CSS: keep global stylesheet small; component-level
CSS can be code-split. Animations: animate transform and opacity only —
avoid animating layout properties (width, height, margin).

Hardware: use will-change only on transient hover interactions and
remove it after use. Fonts: load fonts with font-display: swap and
subset for better FCP.

Images: compress / serve AVIF/WEBP and use loading="lazy" for offscreen
images. Lighthouse target: preserve 90+ scores for Performance and
Accessibility where possible. Testing checklist & PR guidance

Before raising PR:

\[ \] All usages of page-level white replaced with var(--cream) (body
background) \[ \] Cards still use --card-bg (white) and have
--shadow-soft

\[ \] Tailwind config updated and compiled (if using Tailwind) \[ \] No
backdrop-filter, no heavy CSS filters introduced

\[ \] Page layout not shifted; spacing preserved \[ \] Fonts load with
font-display: swap

Pages to manually test (desktop + mobile): Homepage (/)

Pregnancy Due Date Calculator (page with forms) Blog post pages (if
present)

Header and Nav (sticky) Footer

All tool pages listed in the repo Suggested commit message Copy code

feat(ui): global cream background (#F3EFE0) + refined shadows and
updated tailwind tokens

\- body background -\> var(--cream)

\- add --card-bg white surface and --shadow-soft for elevations

\- tailwind.config.js tokens: sageCream, sageCard, boxShadow
soft/medium - performance-safe shadow & animation rules

\- update global.css

Accessibility & motion preferences

Respect prefers-reduced-motion: reduce or remove transforms/animations
when set. Keep focus outlines accessible (:focus-visible) and visible on
keyboard navigation.

Ensure contrast: --charcoal on --cream and --card-bg meets WCAG AA for
body text sizes. If any text falls below contrast thresholds, use darker
text (--charcoal) or make the element

--card-bg with --charcoal text. Example prefers-reduced-motion: CSS

Copy code

@media (prefers-reduced-motion: reduce) { \* {

> transition: none !important;
>
> animation-duration: 0.001ms !important; animation-iteration-count: 1
> !important;

} }

Conclusion & instructions for Codex

Action steps for Codex (apply changes repo-wide): Create branch
feat/ui/cream-background.

Add or update :root variables in src/styles/global.css (or top-level
stylesheet) with the variables block above.

Update body background to var(--cream) and ensure \#root / \#app
wrappers are transparent. Update tailwind.config.js with new tokens (if
used).

Replace only page-level bg-white or background: white occurrences that
are intended to be page surfaces (not cards) — follow the Search &
Replace Guidelines above.

Ensure cards still use --card-bg: \#ffffff so readability is preserved.

Run local dev server, do visual QA on listed pages, and run
Lighthouse/a11y checks. Push branch and open PR with screenshots and
Lighthouse scores included.

Quick Reference (short)

Page background → --cream: \#F3EFE0 Cards/surfaces → --card-bg: \#ffffff
Shadows → single variable --shadow-soft Animations → transform + opacity
only

Performance → no heavy filters, limit box-shadows, subset fonts
