 
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

