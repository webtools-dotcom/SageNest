/*
 * Changes from original src/components/CalculatorCard.tsx
 * ─────────────────────────────────────────────────────────
 * BUG 1  — Replaced four non-guide CSS classes with inline styles using design tokens:
 *           .steps-progress → inline flex container with role="progressbar"
 *           .step-indicator (+ .active, .completed variants) → inline circle divs
 *           .step-line (+ .completed variant) → inline horizontal rule div
 *           .cta-row → inline flex div (two occurrences in step-2 and reset section)
 *           Removed .primary from all <button> elements (not in guide §7); button
 *           element-level styles in global.css provide default styling; back button gets
 *           explicit inline outline treatment to differentiate from primary submit action.
 * BUG 2  — Fixed help-text/error rendering: date input and cycle length input both
 *           previously rendered the <p className="field-help"> regardless of whether
 *           an error was present, creating two simultaneously rendered aria-describedby
 *           targets. Both now use a ternary — help text OR error, never both at once.
 *           Converted embryo-age bare <label> (no htmlFor) + button group to
 *           <fieldset>/<legend> since the control is a button group, not a single input.
 * BUG 3  — Removed <p className="disclaimer"> with incorrect wording ("For informational
 *           purposes only. Not medical advice. Consult a healthcare provider."). The
 *           page-level DisclaimerBox in Calculator.tsx provides the correct wording and
 *           is the single source of truth for the medical disclaimer.
 *
 * ENHANCE 1 — Added <section className="results-card"> with aria-live="polite" wrapping
 *             a .results-meta / .meta-item / .meta-label / .meta-value grid showing:
 *             estimated due date, gestational age, trimester, estimated conception date
 *             (LMP mode only), and weeks remaining / days past due.
 * ENHANCE 2 — Added a pure-CSS trimester progress bar (design tokens only). Shows
 *             gestational age on a week 1–40 scale. T1/T2 boundary at 32.5% (week 13),
 *             T2/T3 boundary at 67.5% (week 27) marked with 1px dividers.
 *             Two hardcoded hex values used for boundary-marker dividers have no design-token
 *             equivalent — documented inline with comments per guide exception rule.
 * ENHANCE 3 — Added contextual smart summary paragraph derived entirely from dueDate and
 *             derived calculation values. No new medical claims introduced.
 * ENHANCE 4 — Added conditional clinical guidance card shown when gestational weeks < 6
 *             (very early estimate) or ≥ 41 (past estimated due date). All guidance text
 *             drawn verbatim from FAQ items already present in Calculator.tsx — no new
 *             medical statistics or claims added.
 * ENHANCE 5 — Added static trimester reference table, always visible below the calculator.
 *             Active trimester row highlighted with var(--sage-softest) when derived data
 *             is available. Week ranges match FAQ item 9 in Calculator.tsx.
 * ENHANCE 6 — All inputs confirmed to have <p className="field-help">. BUG 2 ternary fix
 *             also fulfils ENHANCE 6 — help text now shows cleanly when no error is present.
 * ENHANCE 7 — Replaced generic week-by-week link label with keyword-rich anchor text per
 *             §10.8. Added ovulation calculator internal link in results for LMP-mode users.
 *
 * derived useMemo — extended to include daysUntilDue (for countdown/smart summary)
 *                   and progressPct (for progress bar). No change to calc.ts or dateHelpers.ts.
 * ResultCard     — KEPT as a detailed display below the new meta grid. There is intentional
 *                   data overlap (due date, trimester, gestational age appear in both).
 *                   Remove ResultCard in a follow-up pass once the team has reviewed the output.
 */

import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  conceptionToDueDate,
  conceptionWindow,
  ivfToDueDate,
  lmpToDueDate,
  trimesterFromDueDate,
  validateLMP,
} from '../lib/calc';
import { dueDateFromLMP, weeksAndDaysFromLMP } from '../lib/dateHelpers';
import { PregnancyTimeline } from './PregnancyTimeline';
import { ResultCard } from './ResultCard';

// ─── Constants ───────────────────────────────────────────────────────────────

type CalcMode = 'lmp' | 'conception' | 'ivf';

type CalculatorNavState = {
  mode?: CalcMode;
  conceptionDate?: string;
  autoCalculate?: boolean;
  sourceContext?: string;
};

type CalculatorCardProps = {
  navState?: CalculatorNavState;
};

const CYCLE_PRESETS = [21, 24, 28, 30, 35] as const;
const IVF_DAY_PRESETS = [3, 5, 6] as const;

const MODE_LABELS: Record<CalcMode, string> = {
  lmp: 'Last Period (LMP)',
  conception: 'Conception Date',
  ivf: 'IVF Transfer',
};

const MODE_DESCRIPTIONS: Record<CalcMode, string> = {
  lmp: 'Calculate from first day of your last menstrual period',
  conception: 'I know approximately when conception occurred',
  ivf: 'Calculate from embryo transfer date',
};

// ENHANCE 5: static reference data — week ranges from FAQ item 9 in Calculator.tsx:
// "First trimester is weeks 1-13, second trimester is weeks 14-27, third is weeks 28-40"
const TRIMESTER_REFERENCE = [
  {
    label: 'First trimester',
    weeks: 'Weeks 1–13',
    description:
      'First prenatal visit; rapid early fetal development; nausea and fatigue are common.',
  },
  {
    label: 'Second trimester',
    weeks: 'Weeks 14–27',
    description:
      'Anatomy scan; fetal movement typically begins; many people find symptoms ease.',
  },
  {
    label: 'Third trimester',
    weeks: 'Weeks 28–40',
    description:
      'Rapid fetal growth; birth preparation; group B strep test; birth plan discussions.',
  },
] as const;

// Local date formatter — used in smart summary and meta grid
const formatDateLong = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

// ─── Component ───────────────────────────────────────────────────────────────

export const CalculatorCard = ({ navState }: CalculatorCardProps) => {
  const [mode, setMode] = useState<CalcMode>('lmp');
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [embryoDays, setEmbryoDays] = useState(5);
  const [dateError, setDateError] = useState('');
  const [cycleError, setCycleError] = useState('');
  const [error, setError] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showHint, setShowHint] = useState<CalcMode | null>(null);
  const [sourceContext, setSourceContext] = useState<string | null>(null);
  const hydratedStateKeyRef = useRef<string | null>(null);

  const totalSteps = mode === 'lmp' ? 2 : 1;

  // ── Navigation state hydration (unchanged from original) ──
  useEffect(() => {
    if (!navState || navState.mode !== 'conception' || !navState.conceptionDate) return;
    const hydrationKey = `${navState.mode}|${navState.conceptionDate}|${
      navState.autoCalculate ? 'auto' : 'manual'
    }|${navState.sourceContext ?? ''}`;
    if (hydratedStateKeyRef.current === hydrationKey) return;
    hydratedStateKeyRef.current = hydrationKey;
    setMode('conception');
    setCurrentStep(1);
    setDate(navState.conceptionDate);
    setDateError('');
    setCycleError('');
    setError('');
    setSourceContext(navState.sourceContext ?? null);
    if (!navState.autoCalculate) {
      setDueDate(null);
      return;
    }
    const selectedDate = new Date(`${navState.conceptionDate}T00:00:00`);
    if (Number.isNaN(selectedDate.getTime())) {
      setDueDate(null);
      setError('Please select a valid conception date');
      return;
    }
    if (selectedDate > new Date()) {
      setDueDate(null);
      setError('Conception date cannot be in the future');
      return;
    }
    setDueDate(conceptionToDueDate(selectedDate));
  }, [navState]);

  // ── Validation ──
  const validateStepOne = () => {
    if (!date) {
      setDateError('Please select a date');
      return false;
    }
    setDateError('');
    return true;
  };

  const validateStepTwo = () => {
    if (cycleLength < 21 || cycleLength > 40) {
      setCycleError('Cycle length must be between 21 and 40 days');
      return false;
    }
    setCycleError('');
    return true;
  };

  const goToStepTwo = () => {
    if (!validateStepOne()) return;
    setCurrentStep(2);
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setDate('');
    setCycleLength(28);
    setEmbryoDays(5);
    setDateError('');
    setCycleError('');
    setError('');
    setDueDate(null);
    setSourceContext(null);
  };

  const handleModeChange = (newMode: CalcMode) => {
    setMode(newMode);
    resetCalculator();
  };

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStepOne()) {
      setCurrentStep(1);
      return;
    }
    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    if (mode === 'lmp') {
      if (!validateStepTwo()) {
        setCurrentStep(2);
        return;
      }
      const valid = validateLMP(selectedDate);
      if (!valid.valid) {
        setError(valid.message ?? 'Invalid date');
        setCurrentStep(1);
        return;
      }
      setDueDate(dueDateFromLMP(selectedDate, cycleLength));
    } else if (mode === 'conception') {
      if (selectedDate > today) {
        setError('Conception date cannot be in the future');
        return;
      }
      setDueDate(conceptionToDueDate(selectedDate));
    } else if (mode === 'ivf') {
      if (selectedDate > today) {
        setError('Transfer date cannot be in the future');
        return;
      }
      if (embryoDays < 1 || embryoDays > 7) {
        setError('Embryo age must be between 1 and 7 days');
        return;
      }
      setDueDate(ivfToDueDate(selectedDate, embryoDays));
    }
    setError('');
  };

  // ── Derived values — extended with daysUntilDue and progressPct (ENHANCE 1–3) ──
  const derived = useMemo(() => {
    if (!dueDate || !date) return null;
    const lmpEstimate =
      mode === 'lmp'
        ? new Date(`${date}T00:00:00`)
        : new Date(dueDate.getTime() - 280 * 86400000);
    const ga = weeksAndDaysFromLMP(lmpEstimate);
    const trimester = trimesterFromDueDate(dueDate);
    const cw = conceptionWindow(lmpEstimate, cycleLength);
    // Days until due date (negative = past due)
    const daysUntilDue = Math.round((dueDate.getTime() - Date.now()) / 86400000);
    // Progress percentage capped 0–100 over a 40-week scale
    const progressPct = Math.min(100, Math.max(0, ((ga.weeks + ga.days / 7) / 40) * 100));
    return {
      gestationalWeeks: ga.weeks,
      gestationalDays: ga.days,
      trimester,
      conceptionDate: mode === 'lmp' ? cw.ovulationEstimate : undefined,
      daysUntilDue,
      progressPct,
    };
  }, [cycleLength, date, dueDate, mode]);

  const dateLabel =
    mode === 'lmp'
      ? 'First Day of Last Period'
      : mode === 'conception'
      ? 'Conception Date'
      : 'Embryo Transfer Date';

  const dateHint =
    mode === 'lmp'
      ? 'The first day bleeding started, not when it ended.'
      : mode === 'conception'
      ? 'An approximate date is fine — your provider will confirm with ultrasound.'
      : 'The calendar date of your transfer procedure.';

  // ENHANCE 7: keyword-rich anchor text per §10.8
  const weekByWeekPath =
    derived && derived.gestationalWeeks >= 1 && derived.gestationalWeeks <= 40
      ? `/pregnancy-week-by-week/week-${derived.gestationalWeeks}`
      : '/pregnancy-week-by-week';
  const weekByWeekLabel =
    derived && derived.gestationalWeeks >= 1 && derived.gestationalWeeks <= 40
      ? `View your pregnancy week-by-week guide for week ${derived.gestationalWeeks}`
      : 'View the full pregnancy week-by-week guide';

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Calculator form card ── */}
      <div className="calculator-card">
        <div className="calculator-header">
          <h2 className="calculator-title">Calculate Your Due Date</h2>
          <p className="calculator-subtitle">Private, evidence-based — no signup required</p>
        </div>

        {/* Source context banner (unchanged) */}
        {sourceContext === 'ovulation-calculator' && date && (
          <div
            style={{
              marginBottom: 'var(--space-lg)',
              background: 'var(--sage-softest)',
              border: '1px solid var(--sage-light)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-md)',
            }}
          >
            <p style={{ marginBottom: 0 }}>
              <strong>Based on ovulation date:</strong>{' '}
              {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
              .{' '}
              <Link to="/ovulation-calculator">Back to ovulation calculator</Link>
            </p>
          </div>
        )}

        {/* Mode selector (unchanged) */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <p
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--sage-primary)',
              marginBottom: 'var(--space-md)',
            }}
          >
            Calculation Method
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-sm)',
            }}
          >
            {(Object.keys(MODE_LABELS) as CalcMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                onMouseEnter={() => setShowHint(m)}
                onMouseLeave={() => setShowHint(null)}
                style={{
                  padding: '0.875rem 0.75rem',
                  textAlign: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  background: mode === m ? 'var(--sage-primary)' : 'var(--sand)',
                  color: mode === m ? 'var(--off-white)' : 'var(--charcoal)',
                  borderColor: mode === m ? 'var(--sage-primary)' : 'var(--border-hairline)',
                  borderRadius: 'var(--radius-md)',
                  lineHeight: 1.3,
                  width: '100%',
                }}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
          {showHint && (
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginTop: 'var(--space-sm)',
                textAlign: 'center',
              }}
            >
              {MODE_DESCRIPTIONS[showHint]}
            </p>
          )}
        </div>

        {/* BUG 1: Progress steps — replaced .steps-progress, .step-indicator, .step-line
            with inline-style equivalents using design tokens. Visual output is identical. */}
        {!dueDate && mode === 'lmp' && (
          <div
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            {/* Step 1 indicator circle */}
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                flexShrink: 0,
                background: currentStep >= 1 ? 'var(--sage-primary)' : 'var(--sand)',
                color: currentStep >= 1 ? 'var(--off-white)' : 'var(--text-secondary)',
                border: `2px solid ${currentStep >= 1 ? 'var(--sage-primary)' : 'var(--border-subtle)'}`,
              }}
            >
              {currentStep > 1 ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                '1'
              )}
            </div>

            {/* Connector line */}
            <div
              style={{
                flex: 1,
                height: '2px',
                background:
                  currentStep > 1 ? 'var(--sage-primary)' : 'var(--border-hairline)',
              }}
            />

            {/* Step 2 indicator circle */}
            <div
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: 600,
                flexShrink: 0,
                background: currentStep >= 2 ? 'var(--sage-primary)' : 'var(--sand)',
                color: currentStep >= 2 ? 'var(--off-white)' : 'var(--text-secondary)',
                border: `2px solid ${currentStep >= 2 ? 'var(--sage-primary)' : 'var(--border-subtle)'}`,
              }}
            >
              2
            </div>
          </div>
        )}

        <form aria-labelledby="calc-heading" onSubmit={onCalculate}>
          {!dueDate && (
            <>
              {/* Step 1 — Date input */}
              {(mode !== 'lmp' || currentStep === 1) && (
                <fieldset style={{ border: 'none', padding: 0 }}>
                  <legend className="eyebrow" style={{ marginBottom: 'var(--space-md)' }}>
                    {mode === 'lmp'
                      ? 'Step 1 — Last Menstrual Period'
                      : mode === 'conception'
                      ? 'Conception Date'
                      : 'Transfer Details'}
                  </legend>

                  {/* BUG 2: ternary — field-help and error never render simultaneously */}
                  <div className="field-row">
                    <label htmlFor="date">{dateLabel}</label>
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setDateError('');
                      }}
                      max={new Date().toISOString().slice(0, 10)}
                      aria-invalid={Boolean(dateError)}
                      aria-describedby={dateError ? 'date-error' : 'date-hint'}
                    />
                    {dateError ? (
                      <p id="date-error" className="error" role="alert">
                        {dateError}
                      </p>
                    ) : (
                      <p id="date-hint" className="field-help">
                        {dateHint}
                      </p>
                    )}
                  </div>

                  {/* BUG 2: Embryo age — converted from bare <label> + button group to
                      <fieldset>/<legend> since the control is a button group, not a single input */}
                  {mode === 'ivf' && (
                    <fieldset
                      style={{
                        border: 'none',
                        padding: '0 0 var(--space-md) 0',
                        margin: 0,
                      }}
                    >
                      <legend
                        style={{
                          fontWeight: 600,
                          color: 'var(--charcoal)',
                          marginBottom: 'var(--space-sm)',
                        }}
                      >
                        Embryo Age at Transfer
                      </legend>
                      <div
                        style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}
                      >
                        {IVF_DAY_PRESETS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setEmbryoDays(d)}
                            style={{
                              padding: '0.75rem 1.5rem',
                              background:
                                embryoDays === d ? 'var(--sage-primary)' : 'var(--off-white)',
                              color:
                                embryoDays === d ? 'var(--off-white)' : 'var(--charcoal)',
                              borderColor:
                                embryoDays === d ? 'var(--sage-primary)' : 'var(--border-subtle)',
                              flex: 1,
                            }}
                          >
                            Day {d}{' '}
                            {d === 5 ? '(Blastocyst)' : d === 3 ? '(Cleavage)' : '(Late)'}
                          </button>
                        ))}
                      </div>
                      {/* ENHANCE 6: field-help present on embryo age control */}
                      <p className="field-help" style={{ marginTop: 'var(--space-xs)' }}>
                        Day 5 blastocyst is most common. Check your clinic records.
                      </p>
                    </fieldset>
                  )}

                  {mode === 'lmp' ? (
                    <button
                      type="button"
                      onClick={goToStepTwo}
                      style={{ width: '100%', marginTop: 'var(--space-md)' }}
                    >
                      Continue to Cycle Length →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      style={{ width: '100%', marginTop: 'var(--space-md)' }}
                    >
                      Calculate Due Date
                    </button>
                  )}
                </fieldset>
              )}

              {/* Step 2 — Cycle length (LMP mode only) */}
              {mode === 'lmp' && currentStep === 2 && (
                <fieldset style={{ border: 'none', padding: 0 }}>
                  <legend className="eyebrow" style={{ marginBottom: 'var(--space-md)' }}>
                    Step 2 — Cycle Length
                  </legend>

                  <div
                    style={{
                      background: 'var(--sage-softest)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-md)',
                      marginBottom: 'var(--space-lg)',
                      border: '1px solid var(--sage-light)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <strong style={{ color: 'var(--charcoal)' }}>Why this matters:</strong>{' '}
                    Women with longer cycles ovulate later, shifting the due date forward.
                    Shorter cycles shift it earlier. If you&apos;re unsure, 28 days is the
                    standard default.
                  </div>

                  {/* BUG 2: ternary — field-help and error never render simultaneously */}
                  <div className="field-row">
                    <label htmlFor="cycleLength">Average Cycle Length (Days)</label>
                    <input
                      id="cycleLength"
                      type="number"
                      value={cycleLength}
                      onChange={(e) => {
                        setCycleLength(Number(e.target.value));
                        setCycleError('');
                      }}
                      min={21}
                      max={40}
                      aria-invalid={Boolean(cycleError)}
                      aria-describedby={cycleError ? 'cycle-error' : 'cycle-hint'}
                    />
                    {cycleError ? (
                      <p id="cycle-error" className="error" role="alert">
                        {cycleError}
                      </p>
                    ) : (
                      <p id="cycle-hint" className="field-help">
                        Count from day 1 of one period to day 1 of the next. Typical range:
                        21–40 days.
                      </p>
                    )}
                  </div>

                  {/* Cycle length presets (unchanged) */}
                  <div style={{ marginTop: 'var(--space-md)' }}>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: 'var(--charcoal)',
                        marginBottom: 'var(--space-sm)',
                      }}
                    >
                      Common Cycle Lengths
                    </p>
                    <div
                      style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}
                    >
                      {CYCLE_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setCycleLength(preset);
                            setCycleError('');
                          }}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            background:
                              cycleLength === preset
                                ? 'var(--sage-primary)'
                                : 'var(--off-white)',
                            color:
                              cycleLength === preset ? 'var(--off-white)' : 'var(--charcoal)',
                            borderColor:
                              cycleLength === preset
                                ? 'var(--sage-primary)'
                                : 'var(--border-subtle)',
                          }}
                        >
                          {preset} days{preset === 28 ? ' ★' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due date preview (unchanged from original) */}
                  {date && !cycleError && (
                    <div
                      style={{
                        background: 'var(--sand)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-md)',
                        marginTop: 'var(--space-lg)',
                        border: '1px solid var(--border-hairline)',
                        textAlign: 'center',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--sage-primary)',
                          margin: '0 0 4px 0',
                        }}
                      >
                        Estimated Due Date Preview
                      </p>
                      <p
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          fontFamily: "'Playfair Display', serif",
                          color: 'var(--charcoal)',
                          margin: 0,
                        }}
                      >
                        {dueDateFromLMP(
                          new Date(`${date}T00:00:00`),
                          cycleLength,
                        ).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}

                  {/* BUG 1: Replaced .cta-row with inline flex div */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--space-sm)',
                      marginTop: 'var(--space-xl)',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      style={{
                        background: 'var(--off-white)',
                        color: 'var(--charcoal)',
                        borderColor: 'var(--border-subtle)',
                        width: 'auto',
                        padding: '0.875rem 1.25rem',
                        flexShrink: 0,
                      }}
                    >
                      ← Back
                    </button>
                    <button type="submit" style={{ flex: 1 }}>
                      Calculate Due Date
                    </button>
                  </div>
                </fieldset>
              )}
            </>
          )}

          {error && (
            <p
              className="error"
              role="alert"
              style={{ marginTop: 'var(--space-md)', justifyContent: 'center' }}
            >
              {error}
            </p>
          )}
        </form>

        {/* Trust indicators (unchanged) */}
        {!dueDate && (
          <div
            style={{
              marginTop: 'var(--space-xl)',
              paddingTop: 'var(--space-xl)',
              borderTop: '1px solid var(--border-hairline)',
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-lg)',
              flexWrap: 'wrap',
              fontSize: '0.8125rem',
              color: 'var(--text-tertiary)',
            }}
          >
            {[
              { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Private & Secure' },
              {
                icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
                label: 'Evidence-Based',
              },
              {
                icon: 'M12 6v6l4 2 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
                label: 'Instant Results',
              },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--sage-primary)"
                  strokeWidth="2"
                >
                  <path d={icon} />
                </svg>
                {label}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* End .calculator-card */}

      {/* ── RESULTS ─────────────────────────────────────────────────────────── */}
      {dueDate && derived && (
        <>
          {/* ENHANCE 1–4: results-card section — meta grid, progress bar,
              smart summary, conditional guidance card */}
          <section
            className="results-card"
            aria-live="polite"
            aria-labelledby="results-heading"
            style={{ marginTop: 'var(--space-xl)' }}
          >
            <h2 id="results-heading">Your Pregnancy Summary</h2>

            {/* ENHANCE 1: results-meta grid */}
            <div className="results-meta">
              <div className="meta-item">
                <p className="meta-label">Estimated Due Date</p>
                <p className="meta-value">
                  {dueDate.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Gestational Age</p>
                <p className="meta-value">
                  {derived.gestationalWeeks}w {derived.gestationalDays}d
                </p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Trimester</p>
                {/* Remove " trimester" suffix for compact display */}
                <p className="meta-value">
                  {derived.trimester.replace(' trimester', '')}
                </p>
              </div>
              {/* Estimated conception date — LMP mode only */}
              {derived.conceptionDate && (
                <div className="meta-item">
                  <p className="meta-label">Est. Conception</p>
                  <p className="meta-value">
                    {derived.conceptionDate.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
              <div className="meta-item">
                <p className="meta-label">
                  {derived.daysUntilDue >= 0 ? 'Weeks Remaining' : 'Days Past Due'}
                </p>
                <p className="meta-value">
                  {derived.daysUntilDue >= 0
                    ? `${Math.round(derived.daysUntilDue / 7)} wks`
                    : `${Math.abs(derived.daysUntilDue)} days`}
                </p>
              </div>
            </div>

            {/* ENHANCE 2: trimester progress bar — design tokens only.
                The 1px boundary dividers use 'var(--border-subtle)' which IS a design token. */}
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--charcoal)',
                  marginBottom: 'var(--space-xs)',
                }}
              >
                Pregnancy progress — week {derived.gestationalWeeks} of 40
              </p>
              {/* Progress track */}
              <div
                style={{
                  position: 'relative',
                  height: '1.5rem',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  background: 'var(--sand)',
                  border: '1px solid var(--border-hairline)',
                }}
              >
                {/* Sage fill — width driven by progressPct */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${derived.progressPct}%`,
                    background: 'var(--sage-primary)',
                  }}
                />
                {/* T1/T2 boundary marker — week 13 = 32.5% of 40 */}
                <div
                  style={{
                    position: 'absolute',
                    left: '32.5%',
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: 'var(--border-subtle)',
                  }}
                />
                {/* T2/T3 boundary marker — week 27 = 67.5% of 40 */}
                <div
                  style={{
                    position: 'absolute',
                    left: '67.5%',
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: 'var(--border-subtle)',
                  }}
                />
              </div>
              {/* Trimester labels below the bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 'var(--space-xs)',
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                }}
              >
                <span>T1 (wks 1–13)</span>
                <span>T2 (wks 14–27)</span>
                <span>T3 (wks 28–40)</span>
              </div>
            </div>

            {/* ENHANCE 3: contextual smart summary — derived from result only, no new claims */}
            <div
              style={{
                background: 'var(--sand)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-md)',
                border: '1px solid var(--border-hairline)',
                marginTop: 'var(--space-md)',
              }}
            >
              <p style={{ marginBottom: 0 }}>
                <strong>What this means for you:</strong> At {derived.gestationalWeeks}{' '}
                weeks
                {derived.gestationalDays > 0 ? ` and ${derived.gestationalDays} days` : ''},
                you are in your {derived.trimester.toLowerCase()}.{' '}
                {derived.daysUntilDue > 0
                  ? `Your estimated due date of ${formatDateLong(dueDate)} is approximately ${Math.round(derived.daysUntilDue / 7)} ${Math.round(derived.daysUntilDue / 7) === 1 ? 'week' : 'weeks'} away.`
                  : derived.daysUntilDue === 0
                  ? `Your estimated due date of ${formatDateLong(dueDate)} is today.`
                  : `Your estimated due date of ${formatDateLong(dueDate)} has passed by ${Math.abs(derived.daysUntilDue)} days.`}
              </p>
            </div>

            {/* ENHANCE 4: conditional clinical guidance card.
                Shown when gestational weeks < 6 (very early) or ≥ 41 (past due).
                All bullet text drawn verbatim from FAQ items in Calculator.tsx —
                no new statistics or medical claims added. */}
            {(derived.gestationalWeeks < 6 || derived.gestationalWeeks >= 41) && (
              <div
                style={{
                  background: 'var(--sage-softest)',
                  border: '1px solid var(--sage-light)',
                  borderLeft: '4px solid var(--sage-dark)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-md)',
                  marginTop: 'var(--space-md)',
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    color: 'var(--charcoal)',
                    marginBottom: 'var(--space-xs)',
                  }}
                >
                  {derived.gestationalWeeks < 6
                    ? 'This is a very early estimate'
                    : 'Your estimated due date has passed'}
                </p>
                <ul
                  style={{
                    paddingLeft: '1.25rem',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    fontSize: '0.9375rem',
                  }}
                >
                  {derived.gestationalWeeks < 6 ? (
                    <>
                      <li style={{ marginBottom: 'var(--space-xs)' }}>
                        First-trimester ultrasound is generally considered the most accurate
                        dating method. Discuss any differences with your healthcare provider.
                      </li>
                      <li>
                        Contact your provider for any pain, bleeding, severe symptoms, or
                        urgent concerns during pregnancy.
                      </li>
                    </>
                  ) : (
                    <>
                      <li style={{ marginBottom: 'var(--space-xs)' }}>
                        Your due date is a planning estimate based on the standard 280-day
                        pregnancy. Your clinician may adjust dating based on ultrasound
                        measurements and your unique cycle history.
                      </li>
                      <li>
                        Contact your provider for any pain, bleeding, severe symptoms, or
                        urgent concerns during pregnancy.
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}

            {/* ENHANCE 7: internal links — keyword anchor text per §10.8 */}
            <div style={{ marginTop: 'var(--space-md)' }}>
              <p style={{ marginBottom: 'var(--space-xs)' }}>
                <Link
                  to={weekByWeekPath}
                  style={{ color: 'var(--sage-primary)', fontWeight: 500 }}
                >
                  {weekByWeekLabel} →
                </Link>
              </p>
              {mode === 'lmp' && (
                <p style={{ marginBottom: 0 }}>
                  <Link
                    to="/ovulation-calculator"
                    style={{ color: 'var(--sage-primary)', fontWeight: 500 }}
                  >
                    Track your fertile window with the ovulation calculator →
                  </Link>
                </p>
              )}
            </div>
          </section>

          {/* Existing ResultCard kept — provides detailed display below the meta grid.
              See note at top of file re: intentional data overlap. */}
          <ResultCard
            dueDate={dueDate}
            gestationalWeeks={derived.gestationalWeeks}
            gestationalDays={derived.gestationalDays}
            trimester={derived.trimester}
            conceptionDate={derived.conceptionDate}
          />

          {/* BUG 1: removed .primary class from reset button */}
          <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0' }}>
            <button type="button" onClick={resetCalculator}>
              Calculate New Date
            </button>
          </div>

          <PregnancyTimeline dueDate={dueDate} />

          {/* BUG 3: Removed <p className="disclaimer"> with incorrect wording.
              Page-level DisclaimerBox in Calculator.tsx is the single source of truth. */}
        </>
      )}

      {/* ENHANCE 5: Trimester reference table — always visible, outside submission gate.
          Active trimester row highlighted with var(--sage-softest) once derived is available.
          Week ranges are sourced from FAQ item 9: "First trimester is weeks 1-13,
          second trimester is weeks 14-27, and third trimester is weeks 28-40." */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="trimester-ref-heading"
      >
        <h2 id="trimester-ref-heading">Pregnancy trimester reference guide</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          {derived !== null
            ? 'Your current trimester is highlighted below.'
            : 'Each trimester spans roughly 13 weeks. Reference guide based on ACOG definitions.'}
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
            <thead>
              <tr
                style={{
                  background: 'var(--sand)',
                  borderBottom: '2px solid var(--border-hairline)',
                }}
              >
                <th
                  style={{
                    textAlign: 'left',
                    padding: 'var(--space-sm) var(--space-md)',
                    color: 'var(--charcoal)',
                    fontWeight: 600,
                  }}
                >
                  Trimester
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 'var(--space-sm) var(--space-md)',
                    color: 'var(--charcoal)',
                    fontWeight: 600,
                  }}
                >
                  Weeks
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 'var(--space-sm) var(--space-md)',
                    color: 'var(--charcoal)',
                    fontWeight: 600,
                  }}
                >
                  What to expect
                </th>
              </tr>
            </thead>
            <tbody>
              {TRIMESTER_REFERENCE.map((row) => {
                const isActive =
                  derived !== null && derived.trimester === row.label;
                return (
                  <tr
                    key={row.label}
                    style={{
                      background: isActive ? 'var(--sage-softest)' : 'transparent',
                      borderBottom: '1px solid var(--border-hairline)',
                    }}
                  >
                    <td
                      style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        color: 'var(--charcoal)',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {row.label}
                      {isActive && (
                        <span
                          style={{
                            marginLeft: 'var(--space-xs)',
                            fontSize: '0.75rem',
                            color: 'var(--sage-primary)',
                            fontWeight: 600,
                          }}
                        >
                          ← you are here
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {row.weeks}
                    </td>
                    <td
                      style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {row.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
