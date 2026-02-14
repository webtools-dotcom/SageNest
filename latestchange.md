 
# Latest Change Log

## 2026-02-13

- Added guidance for handling the Codex limitation: when a pull request has been modified outside Codex, create a brand-new PR from the latest branch head instead of trying to update the original PR.
- Confirmed this repository contains no unresolved git conflict markers.
- Fixed malformed `package.json` that was breaking Cloudflare/npm installs (`EJSONPARSE`) by removing duplicated keys and restoring valid JSON structure for scripts and dependencies.
- Repaired broken TypeScript/TSX files (`src/App.tsx`, `src/components/BlogList.tsx`, `src/components/BlogPost.tsx`, `tsconfig.json`) that had duplicated merge content causing Cloudflare `npm run build` compiler errors.
- Made `scripts/check-conflicts.sh` Cloudflare-compatible by falling back to `grep` when `rg` is unavailable.

### Vibe-coder friendly steps to create a new PR safely

1. Commit all current local changes.
2. Push your working branch to GitHub.
3. Open GitHub and click **Compare & pull request** for that branch.
4. Use a fresh PR title/description (do not reopen the old locked PR flow).
5. Verify the PR diff has no conflict symbols and `package.json` is valid JSON.
6. Merge only after Cloudflare build passes.

## 2026-02-14

- Verified codebase is clean of git conflict markers using the repository conflict check script.
- Added explicit GitHub conflict-resolution steps for PR UI so merge-marker text is not committed by mistake.

## 2026-02-13 (Calculator page refactor)

- Added a dedicated `CalculatorPage` at `src/pages/Calculator.tsx` and moved calculator-page content/SEO/FAQ composition out of `App.tsx`.
- Added new UI components: `CalculatorCard`, `CalculatorSteps`, `ResultCard`, `ProgressWheel`, `PregnancyTimeline`, `InfoGrid`, and `FAQAccordion`.
- Updated routing so `/pregnancy-due-date-calculator` (and `/`) render the new calculator page while keeping the existing header/footer links unchanged.
- Kept calculation logic sourced from `src/lib/calc.ts` by consuming existing utility imports from UI components.
- Added supporting styles for the new calculator layout sections (progress wheel, timeline card, info grid, FAQ accordion).


## 2026-02-13 (Calculator accessibility step flow)

- Rebuilt `CalculatorSteps` to accept a `currentStep` prop and expose accessible progress semantics via `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- Refactored `CalculatorCard` into a 3-step LMP flow (date, cycle length with presets, review/calculate) using semantic `<form>`, `<fieldset>`, `<legend>`, and explicit `<label htmlFor>` wiring.
- Added inline validation alerts for required LMP date and cycle-length bounds (21–40) while keeping due-date computation on the existing `lmpToDueDate` and gestational helper path.
- Moved step rendering inside `CalculatorCard` and removed the standalone page-level `CalculatorSteps` usage so step state is always synchronized with the active calculator form.


## 2026-02-13 (Result experience enhancements)

- Rebuilt `src/components/ResultCard.tsx` to accept explicit due-date detail props (`dueDate`, gestational weeks/days, trimester, optional conception date) and render a stronger due-date-focused summary layout.
- Updated `src/components/ProgressWheel.tsx` to a reusable SVG-free circular progress API based on `value` in the `0..1` range with an accessible `aria-label` percentage.
- Added milestone messaging (including the anatomy scan around week 20), share action with Web Share API + clipboard fallback, print action, and subtle reveal transition animation for result presentation.
- Moved medical disclaimer text below the result card while keeping privacy/disclaimer messaging visible in the results flow.
- Updated calculator wiring/styles so gestational metadata feeds the new result card shape and responsive layout remains stable.


## 2026-02-13 (Timeline + info content refresh)

- Rebuilt `PregnancyTimeline` with trimester bands for weeks 1-13, 14-27, and 28-40, including a calculated current-week marker and a stacked mobile fallback view.
- Reworked `InfoGrid` into four educational cards with icon-led headers and short explainers for calculator method, gestational age, cycle-length impact, and post-result next steps.
- Added `Read more` links on each info card that route to existing `/about` or `/blog` pages.
- Extended global styles with timeline band/marker styles and responsive info card styling for the new components.

## 2026-02-13 (FAQ accordion accessibility + schema injection)

- Rebuilt `FAQAccordion` to a controlled React accordion with one expanded item at a time and keyboard support for Arrow Up/Down navigation and Enter/Space toggling.
- Added proper ARIA wiring for FAQ triggers and panels (`aria-expanded`, `aria-controls`, panel `id`, and `aria-labelledby`).
- Added and exported `getFAQJsonLD(faqs)` from `FAQAccordion` to generate stringified FAQPage JSON-LD from the same Q/A source of truth.
- Updated calculator page SEO behavior to safely inject FAQ JSON-LD via a dedicated `faq-jsonld-root` script tag in `Calculator.tsx` while preserving existing `SEOHead` metadata.
- Updated FAQ styles in `global.css` to support the new button/panel accordion structure.

## 2026-02-13 (Date helper module + calculator metadata/test updates)

- Added `src/lib/dateHelpers.ts` with UI-facing helper functions (`formatDateToReadable`, `weeksAndDaysFromLMP`, `dueDateFromLMP`, `formatWeeksAndDays`) that delegate core pregnancy math to `src/lib/calc.ts`.
- Updated calculator and results wiring to use the new helper layer without changing core math logic.
- Updated calculator page metadata description copy while keeping title as `Pregnancy Due Date Calculator — SageNest`.
- Added Vitest coverage for `formatWeeksAndDays()` normalization behavior and `ProgressWheel` percentage/circumference mapping helpers.
- Added `README_UI_UPDATE.md` with a calculator component map, local test checklist, and manual QA steps.
- Updated `README.md` calculator feature bullets to match the current LMP-first UI flow and current test coverage.

## 2026-02-14 (Markdown sanitization hardening)

- Hardened `markdownToHtml` to sanitize raw HTML input by stripping `<script>/<style>` tags, removing inline event-handler attributes, escaping user text, and blocking unsafe URL protocols such as `javascript:`/`data:`/`vbscript:`.
- Kept markdown support for headings, bold text, links, paragraphs, and list rendering while routing all blog post HTML through sanitized conversion output.
- Updated `BlogPost` to compute sanitized HTML via `markdownToHtml` before passing it to `dangerouslySetInnerHTML`.
- Added focused Vitest coverage for malicious markdown payloads and safe markdown rendering, including fallback post content and Supabase-like content samples.

## 2026-02-14 (BlogPoster admin guard parity)

- Added `assertAdminUser` in `src/pages/BlogPoster.tsx` to validate Supabase `auth.getUser()` against `ADMIN_EMAIL` before admin blog operations.
- Added `runAdminGuardedAction` helper and applied it at the start of `loadPosts`, `onUpload`, `savePost`, and `deletePost` so unauthorized attempts stop immediately and surface clear messages via `setMessage(...)`.
- Added unit tests in `tests/blogPosterAuth.test.ts` to cover helper authorization logic and an unauthorized action-abort path.

## 2026-02-14 (Git ignore secret patterns hardening)

- Updated the repository root `.gitignore` to keep existing frontend build/test ignores (`node_modules`, `dist`, `.vite`, `coverage`) and add required secret-safe entries from `SECURITY.md`: `.env`, `.env.local`, `.env.*.local`, `*.key`, `*.pem`, and `secrets/`.
- Ran tracked-file checks to verify no files matching secret patterns are currently committed.

## 2026-02-14 (BlogPoster upload validation hardening)

- Added MIME allowlist validation in `src/pages/BlogPoster.tsx` for image uploads (`image/jpeg`, `image/png`, `image/webp`) with clear user-facing rejection messaging.
- Added max image size enforcement (2MB) before Supabase Storage upload and abort behavior for invalid files.
- Updated upload filename extension generation to use a trusted MIME-to-extension mapping rather than raw filename extension parsing.
- Added `tests/blogPosterUploadValidation.test.ts` coverage for allowed uploads, disallowed MIME rejection, and oversized file rejection.
