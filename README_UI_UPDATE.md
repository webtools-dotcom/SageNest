# UI Update Notes (Calculator)

## Component map

- `src/pages/Calculator.tsx`
  - Sets calculator page SEO metadata and structured data.
  - Renders the calculator experience shell.
- `src/components/CalculatorCard.tsx`
  - Owns the 3-step LMP input flow and result state.
  - Delegates due date + gestational helper calculations through `src/lib/dateHelpers.ts`.
- `src/components/ResultCard.tsx`
  - Displays due date summary, gestational age text, milestone message, and share/print actions.
  - Uses `formatWeeksAndDays()` and readable date formatting from `src/lib/dateHelpers.ts`.
- `src/components/ProgressWheel.tsx`
  - Renders progress UI.
  - Exposes pure helper mappers (`progressToPercent`, `progressToCircumference`) for reliable unit testing.
- `src/lib/dateHelpers.ts`
  - New UI-facing date helper layer that delegates core math to `src/lib/calc.ts`.

## Local test checklist

Run from project root:

1. `npm install`
2. `npm run test`
3. `npm run build`

Expected:
- Vitest passes including new helper and progress mapping tests.
- TypeScript + Vite build completes without errors.

## Manual QA steps

1. Start dev server: `npm run dev`.
2. Open `/pregnancy-due-date-calculator`.
3. Confirm SEO title in browser tab is `Pregnancy Due Date Calculator — SageNest`.
4. Complete calculator flow:
   - Step 1: select valid LMP date.
   - Step 2: choose cycle length (preset + manual values within 21-40).
   - Step 3: calculate.
5. Verify result card shows:
   - due date text,
   - gestational age in `Xw Yd` format,
   - progress wheel percentage,
   - milestone message.
6. Validate edge behavior:
   - future LMP date shows validation error,
   - out-of-range cycle length shows validation error,
   - large day normalization displays correctly in formatted values (covered by unit tests).
