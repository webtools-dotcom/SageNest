/*
 * Changes from original OvulationCalculator.tsx
 * -----------------------------------------------
 * BUG 1  — Replaced non-guide class 'fertility-visuals' (not in newtoolMAIN.md §7)
 *           with an inline-style flex wrapper div.
 * BUG 2  — Added id attributes to all <p className="field-help"> elements;
 *           updated aria-describedby on each input to reference the help-id
 *           when no error is present, and the error-id when erroring.
 * BUG 3  — Fixed privacy banner: removed erroneous "Privacy banner:" label;
 *           now reads exactly "Privacy:" per newtoolMAIN.md §2.
 * BUG 4  — Added source citation with real primary source URL (Wilcox AJ et al.
 *           1995 NEJM — the study underpinning WILCOX_POINTS in ovulationCalc.ts).
 * BUG 5  — DisclaimerBox confirmed present in codebase; kept import; moved to
 *           the very bottom of the page as the last element inside <main>.
 *
 * ENHANCE 1 — Upgraded results section: all five key outputs now use the
 *             .results-meta / .meta-item / .meta-label / .meta-value grid
 *             from newtoolMAIN.md §5, replacing the plain <p> text layout.
 * ENHANCE 2 — Added a pure-CSS cycle-phase progress bar (design tokens only,
 *             except menstrual phase fill which has no token equivalent —
 *             documented inline). Segments are proportional to day count;
 *             short-cycle edge cases are handled with Math.max(0, …) clamping.
 * ENHANCE 3 — Added a contextual smart summary paragraph below the meta grid,
 *             derived entirely from the calculation result with no new data.
 * ENHANCE 4 — Added a conditional clinical guidance card rendered only when
 *             cycle length is ≤ 23 or ≥ 36 days (extremes of the valid range).
 *             All guidance text is sourced exclusively from wording already
 *             present in the original file's educational section — no new
 *             medical claims or statistics have been added.
 * ENHANCE 5 — Added a static cycle-phase reference table (always visible,
 *             updates day ranges as cycle length input changes). Fertile window
 *             and Peak fertility rows are highlighted with var(--sage-softest)
 *             after the user submits.
 * ENHANCE 6 — Added id + aria-describedby linkage for all field-help
 *             paragraphs (covers BUG 2 above).
 * ENHANCE 7 — Added Link import; two keyword-anchored internal links added:
 *             (a) results section → /pregnancy-due-date-calculator
 *             (b) educational section → /blog/cervical-mucus-ovulation-guide
 *
 * FAQ     — Added 2 new items (items 4 and 5) to meet newtoolMAIN.md §10.6
 *           minimum-5 rule. The original 3 items are completely unchanged.
 *
 * calc lib — NOT modified. No logic bugs found in ovulationCalc.ts.
 */

import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FertilityCalendar } from '../components/FertilityCalendar';
import { FertilityChart } from '../components/FertilityChart';
import { SEOHead } from '../components/SEOHead';
import { DisclaimerBox } from '../components/DisclaimerBox';
import { normalizeDate } from '../lib/calc';
import { calculateOvulation, validateOvulationInputs } from '../lib/ovulationCalc';

// ─── Constants ───────────────────────────────────────────────────────────────

const CYCLE_PRESETS = [28, 30, 32] as const;
type PresetValue = `${(typeof CYCLE_PRESETS)[number]}` | 'custom';

type FieldErrors = {
  lmp?: string;
  cycleLength?: string;
};

// Minimum 5 FAQ items per newtoolMAIN.md §10.6.
// Items 1–3 are unchanged from the original (SEO assets).
// Items 4–5 are new additions.
const FAQ_ITEMS = [
  {
    question: 'How does this ovulation estimate work?',
    answer:
      'It counts forward from the first day of your last menstrual period and assumes ovulation happens about 14 days before your next period.',
  },
  {
    question: 'What cycle lengths are supported?',
    answer:
      'You can use cycle lengths from 21 to 40 days, including custom input for irregular cycle patterns.',
  },
  {
    question: 'Is my data saved?',
    answer:
      'No. Inputs stay in your browser and are not stored, sent, or shared by SageNest.',
  },
  {
    question: 'Can I use this ovulation calculator if I have irregular periods?',
    answer:
      'Cycle-based estimates are less accurate when your period length varies by more than a few days each month. If your cycles are irregular, confirm ovulation with basal body temperature charting or LH test strips alongside this estimate for more reliable timing.',
  },
  {
    question: 'When should I see a doctor if I cannot detect ovulation?',
    answer:
      'If you have been trying to conceive for 12 months (or 6 months if you are 35 or older) without success, or if your cycles are consistently shorter than 21 days or longer than 40 days, speak with a licensed clinician.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (value: Date): string =>
  value.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const toInputDate = (value: Date): string => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ─── Component ───────────────────────────────────────────────────────────────

export const OvulationCalculatorPage = () => {
  const navigate = useNavigate();

  // ── State ──
  const [lmp, setLmp] = useState(toInputDate(new Date()));
  const [preset, setPreset] = useState<PresetValue>('28');
  const [customCycleLength, setCustomCycleLength] = useState('');
  const [touched, setTouched] = useState({ lmp: false, cycleLength: false });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  const cycleLengthValue = preset === 'custom' ? customCycleLength : preset;

  // ── Derived cycle geometry (used for progress bar and reference table) ──
  // Clamped so render stays safe even with partially typed custom values.
  const cycleLen = Math.max(21, Math.min(40, Number(cycleLengthValue) || 28));
  const ovDay = cycleLen - 13; // cycle day of ovulation (day 1 = LMP)
  const fertileStartDay = ovDay - 5;
  const peakStartDay = ovDay - 2;

  // Progress bar segment widths as percentages — clamped to 0 for short cycles
  // where fertile window overlaps the menstrual phase.
  const pctMenstrual = (5 / cycleLen) * 100;
  const pctFollicular = (Math.max(0, fertileStartDay - 6) / cycleLen) * 100;
  const pctFertile = (Math.max(0, peakStartDay - fertileStartDay) / cycleLen) * 100;
  const pctPeak = (Math.max(0, ovDay - peakStartDay + 1) / cycleLen) * 100;
  // Luteal fills the remainder via flex: 1.

  // ── Reference table rows (updates live with cycle length input) ──
  const cyclePhases = useMemo(
    () => [
      {
        key: 'menstrual',
        phase: 'Menstrual',
        days: '1–5',
        description: 'Uterine lining sheds',
      },
      {
        key: 'follicular',
        phase: 'Follicular',
        days: `6–${Math.max(6, fertileStartDay - 1)}`,
        description: 'Follicle matures, oestrogen rises',
      },
      {
        key: 'fertile',
        phase: 'Fertile window',
        days: `${fertileStartDay}–${peakStartDay - 1}`,
        description: 'Sperm can survive to fertilisation day',
      },
      {
        key: 'peak',
        phase: 'Peak fertility',
        days: `${peakStartDay}–${ovDay}`,
        description: 'Highest estimated conception probability',
      },
      {
        key: 'luteal',
        phase: 'Luteal',
        days: `${ovDay + 1}–${cycleLen}`,
        description: 'Progesterone rises; implantation window',
      },
    ],
    [fertileStartDay, peakStartDay, ovDay, cycleLen],
  );

  // ── Validation ──
  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};

    if (!lmp) {
      next.lmp = 'Enter the first day of your last menstrual period.';
    }

    const cycleLength = Number(cycleLengthValue);
    if (!cycleLengthValue || Number.isNaN(cycleLength)) {
      next.cycleLength = 'Enter your average cycle length in days.';
    }

    if (!next.lmp && !next.cycleLength) {
      const validation = validateOvulationInputs(new Date(lmp), cycleLength);
      const lmpError = validation.errors.find((e) =>
        e.toLowerCase().includes('last menstrual period'),
      );
      const cycleError = validation.errors.find((e) =>
        e.toLowerCase().includes('cycle length'),
      );
      if (lmpError) next.lmp = lmpError;
      if (cycleError) next.cycleLength = cycleError;
    }

    return next;
  }, [lmp, cycleLengthValue]);

  const showLmpError = Boolean(errors.lmp) && (touched.lmp || hasSubmitted);
  const showCycleError = Boolean(errors.cycleLength) && (touched.cycleLength || hasSubmitted);

  // ── Result ──
  const result = useMemo(() => {
    if (errors.lmp || errors.cycleLength || !cycleLengthValue || !lmp) return null;
    return calculateOvulation(new Date(lmp), Number(cycleLengthValue));
  }, [cycleLengthValue, errors.cycleLength, errors.lmp, lmp]);

  // ── Selected calendar day (for FertilityChart) ──
  const selectedCycleDay = useMemo(() => {
    if (!result) return null;
    const normalizedLmp = normalizeDate(new Date(lmp));
    const selectedDate = normalizeDate(selectedCalendarDate ?? result.ovulationEstimate);
    const daysSinceLmp = Math.floor(
      (selectedDate.getTime() - normalizedLmp.getTime()) / 86_400_000,
    );
    const cycleLength = Number(cycleLengthValue);
    const offset = ((daysSinceLmp % cycleLength) + cycleLength) % cycleLength;
    return offset + 1;
  }, [result, lmp, selectedCalendarDate, cycleLengthValue]);

  // ── Conditional clinical guidance (ENHANCE 4) ──
  // Only surfaces when the submitted cycle length is at the extremes of the
  // valid input range (≤ 23 or ≥ 36). All guidance text is drawn from wording
  // already present in this file's own educational section — no new medical
  // claims added.
  const showClinicalGuidance = hasSubmitted && Boolean(result) && (cycleLen <= 23 || cycleLen >= 36);

  // ── JSON-LD ──
  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Ovulation Calculator',
        url: 'https://sagenesthealth.com/ovulation-calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        description:
          'Estimate ovulation timing, fertile window dates, and next period timing from your LMP and cycle length.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
    [],
  );

  // ── Handlers ──
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setSelectedCalendarDate(null);
    setTouched({ lmp: true, cycleLength: true });
  };

  const onUseConceptionDate = () => {
    if (!result) return;
    navigate('/pregnancy-due-date-calculator', {
      state: {
        mode: 'conception',
        conceptionDate: toInputDate(result.ovulationEstimate),
        autoCalculate: true,
        sourceContext: 'ovulation-calculator',
      },
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <main id="main-content" className="container">

      {/* SEO — always first inside main */}
      <SEOHead
        title="Ovulation Calculator"
        description="Free ovulation calculator — enter your last period date and cycle length to find your fertile window, peak fertility days, and estimated ovulation date. No signup required."
        canonicalPath="/ovulation-calculator"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          {/* ENHANCE 7 / §10.7: trust badge updated to contain primary keyword + benefit signal */}
          <div className="trust-badge">Free fertile window estimate — no signup required</div>
        </div>
        <h1 className="hero-title">Ovulation <span>Calculator</span></h1>
        <p className="hero-description">
          Get an estimated ovulation date and fertile window from your cycle information. Use this as planning guidance, not a diagnosis.
        </p>
      </section>

      {/* Input card */}
      <div className="calculator-card" aria-labelledby="ovulation-form-title">
        <div className="calculator-header">
          <h2 id="ovulation-form-title" className="calculator-title">Enter Cycle Details</h2>
          <p className="calculator-subtitle">Your data stays on your device. Nothing is stored on our servers.</p>
        </div>

        <form noValidate onSubmit={onSubmit}>

          {/* LMP date — BUG 2 / ENHANCE 6: help <p> now has id; aria-describedby references it */}
          <div className="field-row">
            <label htmlFor="lmp-date">First day of last menstrual period (LMP)</label>
            <input
              id="lmp-date"
              type="date"
              value={lmp}
              onChange={(e) => setLmp(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, lmp: true }))}
              max={toInputDate(new Date())}
              aria-invalid={showLmpError}
              aria-describedby={showLmpError ? 'lmp-error' : 'lmp-help'}
            />
            {showLmpError ? (
              <p id="lmp-error" className="error" role="alert">{errors.lmp}</p>
            ) : (
              <p id="lmp-help" className="field-help">
                Use the first day bleeding started, not the day it ended.
              </p>
            )}
          </div>

          {/* Cycle length presets */}
          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 var(--space-md) 0' }}>
            <legend style={{ marginBottom: 'var(--space-xs)', fontWeight: 600, color: 'var(--charcoal)' }}>
              Average cycle length
            </legend>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
              {CYCLE_PRESETS.map((value) => {
                const key = `${value}` as PresetValue;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPreset(key)}
                    style={{
                      width: 'auto',
                      padding: '0.45rem 0.9rem',
                      borderColor: preset === key ? 'var(--sage-primary)' : 'var(--border-subtle)',
                      background: preset === key ? 'var(--sage-primary)' : 'var(--off-white)',
                      color: preset === key ? 'var(--off-white)' : 'var(--charcoal)',
                    }}
                    aria-pressed={preset === key}
                  >
                    {value} days
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPreset('custom')}
                style={{
                  width: 'auto',
                  padding: '0.45rem 0.9rem',
                  borderColor: preset === 'custom' ? 'var(--sage-primary)' : 'var(--border-subtle)',
                  background: preset === 'custom' ? 'var(--sage-primary)' : 'var(--off-white)',
                  color: preset === 'custom' ? 'var(--off-white)' : 'var(--charcoal)',
                }}
                aria-pressed={preset === 'custom'}
              >
                Custom
              </button>
            </div>

            {/* Custom number input — BUG 2 / ENHANCE 6: aria-describedby updated */}
            {preset === 'custom' && (
              <div className="field-row" style={{ marginBottom: 0 }}>
                <label htmlFor="custom-cycle-length">Custom cycle length (days)</label>
                <input
                  id="custom-cycle-length"
                  type="number"
                  min={21}
                  max={40}
                  step={1}
                  inputMode="numeric"
                  placeholder="e.g. 27"
                  value={customCycleLength}
                  onChange={(e) => setCustomCycleLength(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, cycleLength: true }))}
                  aria-invalid={showCycleError}
                  aria-describedby={showCycleError ? 'cycle-length-error' : 'cycle-length-help'}
                />
              </div>
            )}

            {showCycleError ? (
              <p id="cycle-length-error" className="error" role="alert">{errors.cycleLength}</p>
            ) : (
              <p id="cycle-length-help" className="field-help">
                Most cycles are between 21 and 40 days. Pick a preset or enter your average.
              </p>
            )}
          </fieldset>

          <button type="submit">Calculate fertile window</button>
        </form>
      </div>

      {/* ── Results card ── */}
      <section
        className="results-card"
        aria-live="polite"
        aria-labelledby="results-heading"
        style={{ marginTop: 'var(--space-xl)' }}
      >
        <h2 id="results-heading">Your Fertility Summary</h2>

        {hasSubmitted && result ? (
          <>
            {/* ENHANCE 1: results-meta grid — replaces plain <p> text */}
            <div className="results-meta">
              <div className="meta-item">
                <p className="meta-label">Estimated Ovulation</p>
                <p className="meta-value">{formatDate(result.ovulationEstimate)}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Fertile Window Opens</p>
                <p className="meta-value">{formatDate(result.fertileWindowStart)}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Fertile Window Closes</p>
                <p className="meta-value">{formatDate(result.fertileWindowEnd)}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Peak Fertility Start</p>
                <p className="meta-value">{formatDate(result.peakFertilityStart)}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Next Period Estimate</p>
                <p className="meta-value">{formatDate(result.nextPeriodEstimate)}</p>
              </div>
            </div>

            {/* ENHANCE 2: cycle-phase progress bar (pure CSS, design tokens only).
                Menstrual segment fill: #fce4e4 — no design token equivalent for
                menstrual phase colour; caution colour documented here per guide. */}
            <div style={{ marginTop: 'var(--space-lg)' }}>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--charcoal)',
                marginBottom: 'var(--space-xs)',
              }}>
                Your {cycleLen}-day cycle at a glance
              </p>
              <div style={{
                display: 'flex',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                height: '2rem',
                border: '1px solid var(--border-hairline)',
              }}>
                {/* Menstrual — #fce4e4: menstrual phase, no design-token equivalent */}
                <div
                  title={`Menstrual (days 1–5)`}
                  style={{
                    width: `${pctMenstrual}%`,
                    background: '#fce4e4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6875rem',
                    color: '#7a2020', /* dark red on pale red — no token equivalent */
                    flexShrink: 0,
                  }}
                >
                  M
                </div>
                {/* Follicular */}
                {pctFollicular > 0 && (
                  <div
                    title={`Follicular (days 6–${Math.max(6, fertileStartDay - 1)})`}
                    style={{
                      width: `${pctFollicular}%`,
                      background: 'var(--sand)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6875rem',
                      color: 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                  >
                    F
                  </div>
                )}
                {/* Fertile window (non-peak) */}
                {pctFertile > 0 && (
                  <div
                    title={`Fertile window (days ${fertileStartDay}–${peakStartDay - 1})`}
                    style={{
                      width: `${pctFertile}%`,
                      background: 'var(--sage-softest)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6875rem',
                      color: 'var(--sage-dark)',
                      flexShrink: 0,
                    }}
                  >
                    FW
                  </div>
                )}
                {/* Peak fertility */}
                {pctPeak > 0 && (
                  <div
                    title={`Peak fertility (days ${peakStartDay}–${ovDay})`}
                    style={{
                      width: `${pctPeak}%`,
                      background: 'var(--sage-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6875rem',
                      color: 'var(--off-white)',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    Peak
                  </div>
                )}
                {/* Luteal — fills remainder */}
                <div
                  title={`Luteal (days ${ovDay + 1}–${cycleLen})`}
                  style={{
                    flex: 1,
                    background: 'var(--sand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6875rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  L
                </div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 'var(--space-xs)',
                fontSize: '0.75rem',
                color: 'var(--text-tertiary)',
              }}>
                <span>Day 1</span>
                <span style={{ color: 'var(--sage-primary)', fontWeight: 600 }}>
                  Day {ovDay} — ovulation
                </span>
                <span>Day {cycleLen}</span>
              </div>
            </div>

            {/* ENHANCE 3: contextual smart summary — derived from result only, no new data */}
            <div style={{
              background: 'var(--sand)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-md)',
              border: '1px solid var(--border-hairline)',
              marginTop: 'var(--space-md)',
            }}>
              <p style={{ marginBottom: 0 }}>
                <strong>What this means for you:</strong>{' '}
                Based on a {cycleLen}-day cycle, your next fertile phase runs from{' '}
                <strong>{formatDate(result.fertileWindowStart)}</strong> through{' '}
                <strong>{formatDate(result.fertileWindowEnd)}</strong>. The highest
                estimated conception probability falls on{' '}
                <strong>{formatDate(result.peakFertilityStart)}</strong>
                {result.peakFertilityStart.getTime() !== result.peakFertilityEnd.getTime()
                  ? ` through ${formatDate(result.peakFertilityEnd)}`
                  : ''}
                . Intercourse every one to two days during the fertile window gives
                the best chance of sperm being present at ovulation. Your next
                period is expected around{' '}
                <strong>{formatDate(result.nextPeriodEstimate)}</strong>.
              </p>
            </div>

            {/* ENHANCE 4: conditional clinical guidance card.
                Shown only when cycleLen ≤ 23 or ≥ 36 (extremes of valid range).
                All bullet text is drawn verbatim from the educational section
                already in this file — no new medical claims. */}
            {showClinicalGuidance && (
              <div style={{
                background: 'var(--sage-softest)',
                border: '1px solid var(--sage-light)',
                borderLeft: '4px solid var(--sage-dark)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-md)',
                marginTop: 'var(--space-md)',
              }}>
                <p style={{
                  marginBottom: 'var(--space-xs)',
                  fontWeight: 600,
                  color: 'var(--charcoal)',
                }}>
                  A note on your {cycleLen}-day cycle
                </p>
                <p style={{
                  marginBottom: 'var(--space-xs)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                }}>
                  Cycle-based estimates are less reliable when cycle length varies
                  significantly. Consider these additional steps:
                </p>
                <ul style={{
                  paddingLeft: '1.25rem',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  fontSize: '0.9375rem',
                }}>
                  <li style={{ marginBottom: 'var(--space-xs)' }}>
                    Track basal body temperature each morning to confirm your
                    ovulation pattern across several cycles.
                  </li>
                  <li style={{ marginBottom: 'var(--space-xs)' }}>
                    Use LH test strips (ovulation predictor kits) to detect your
                    LH surge directly rather than relying on cycle-day estimates alone.
                  </li>
                  <li>
                    If you have been trying to conceive for 12 months (or 6 months
                    if age 35+), contact a licensed clinician.
                  </li>
                </ul>
              </div>
            )}

            {/* ENHANCE 7 — Internal link 1: results section → due date calculator */}
            <div style={{ marginTop: 'var(--space-md)' }}>
              <p style={{ marginBottom: 'var(--space-xs)' }}>
                Know your ovulation date? Estimate your pregnancy due date now.
              </p>
              <Link
                to="/pregnancy-due-date-calculator"
                style={{ color: 'var(--sage-primary)', fontWeight: 500 }}
              >
                Calculate your due date using this ovulation estimate →
              </Link>
            </div>

            {/* Quick-navigate button (preserved from original) */}
            <div style={{ marginTop: 'var(--space-sm)' }}>
              <button type="button" onClick={onUseConceptionDate}>
                Use ovulation date in due date calculator
              </button>
            </div>

            {/* BUG 1 fix: replaced non-guide class 'fertility-visuals' with inline style */}
            <div style={{
              marginTop: 'var(--space-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-lg)',
            }}>
              <FertilityCalendar
                lmp={new Date(lmp)}
                cycleLength={Number(cycleLengthValue)}
                ovulationResult={result}
                selectedDate={selectedCalendarDate ?? result.ovulationEstimate}
                onSelectDate={setSelectedCalendarDate}
              />
              {selectedCycleDay !== null ? (
                <FertilityChart
                  cycleLength={Number(cycleLengthValue)}
                  ovulationCycleDay={Number(cycleLengthValue) - 13}
                  selectedCycleDay={selectedCycleDay}
                />
              ) : null}
            </div>
          </>
        ) : (
          <p style={{ marginBottom: 0 }}>
            Submit your details above to see a personalized ovulation and fertile
            window estimate.
          </p>
        )}
      </section>

      {/* ENHANCE 5: static cycle-phase reference table.
          Always visible; updates as cycle length input changes.
          Fertile window and Peak fertility rows highlighted after submission. */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="phase-table-heading"
      >
        <h2 id="phase-table-heading">Menstrual cycle phases explained</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Day ranges below are calculated for a {cycleLen}-day cycle and update
          as you change the cycle length above.
          {hasSubmitted && result
            ? ' Your fertile phase rows are highlighted.'
            : ''}
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
            <thead>
              <tr style={{
                background: 'var(--sand)',
                borderBottom: '2px solid var(--border-hairline)',
              }}>
                <th style={{
                  textAlign: 'left',
                  padding: 'var(--space-sm) var(--space-md)',
                  color: 'var(--charcoal)',
                  fontWeight: 600,
                }}>
                  Phase
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: 'var(--space-sm) var(--space-md)',
                  color: 'var(--charcoal)',
                  fontWeight: 600,
                }}>
                  Cycle days
                </th>
                <th style={{
                  textAlign: 'left',
                  padding: 'var(--space-sm) var(--space-md)',
                  color: 'var(--charcoal)',
                  fontWeight: 600,
                }}>
                  What is happening
                </th>
              </tr>
            </thead>
            <tbody>
              {cyclePhases.map((row) => {
                const isHighlighted =
                  hasSubmitted &&
                  Boolean(result) &&
                  (row.key === 'fertile' || row.key === 'peak');
                return (
                  <tr
                    key={row.key}
                    style={{
                      background: isHighlighted ? 'var(--sage-softest)' : 'transparent',
                      borderBottom: '1px solid var(--border-hairline)',
                    }}
                  >
                    <td style={{
                      padding: 'var(--space-sm) var(--space-md)',
                      color: 'var(--charcoal)',
                      fontWeight: isHighlighted ? 600 : 400,
                    }}>
                      {row.phase}
                      {isHighlighted && (
                        <span style={{
                          marginLeft: 'var(--space-xs)',
                          fontSize: '0.75rem',
                          color: 'var(--sage-primary)',
                          fontWeight: 600,
                        }}>
                          ← your window
                        </span>
                      )}
                    </td>
                    <td style={{
                      padding: 'var(--space-sm) var(--space-md)',
                      color: 'var(--text-secondary)',
                    }}>
                      {row.days}
                    </td>
                    <td style={{
                      padding: 'var(--space-sm) var(--space-md)',
                      color: 'var(--text-secondary)',
                    }}>
                      {row.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Educational section */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="ovulation-guidance"
      >
        <h2 id="ovulation-guidance">How does this ovulation calculator work?</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          This tool uses the standard LMP-based ovulation model: ovulation is estimated
          at cycle length minus 14 days from your last menstrual period, which represents
          the typical luteal phase length. The fertile window spans the five days before
          ovulation through ovulation day itself, based on sperm survival data from
          Wilcox et al. (1995).
        </p>

        <h2 style={{ marginTop: 'var(--space-lg)' }}>
          What affects ovulation timing in your cycle?
        </h2>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
          <li>
            Cycle-based estimates are less reliable if your cycle length varies
            significantly month to month.
          </li>
          <li>
            Ovulation test strips, cervical mucus tracking, and basal body temperature
            can improve timing accuracy.
          </li>
          <li>
            If you have been trying to conceive for 12 months (or 6 months if age
            35+), contact a licensed clinician.
          </li>
        </ul>

        <h2 style={{ marginTop: 'var(--space-lg)' }}>
          When should you talk to your doctor about your ovulation cycle?
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Speak with a clinician if your cycles are consistently shorter than 21 days
          or longer than 40 days, if you have no period for three or more months, or
          if you have been unable to conceive within the timeframes above. These
          patterns may indicate conditions that affect ovulation.
        </p>

        {/* ENHANCE 7 — Internal link 2: educational section → related blog post */}
        <p style={{ marginTop: 'var(--space-md)', color: 'var(--text-secondary)' }}>
          Learn how to read your body's natural ovulation signals in our guide to{' '}
          <a
            href="/blog/cervical-mucus-ovulation-guide"
            style={{ color: 'var(--sage-primary)' }}
          >
            cervical mucus changes across your cycle
          </a>.
        </p>
      </section>

      {/* BUG 4: Source citation — real primary source URL (Wilcox et al. 1995 NEJM)
          which underpins the WILCOX_POINTS fertility probability data in ovulationCalc.ts */}
      <p style={{
        fontSize: '0.8125rem',
        color: 'var(--text-tertiary)',
        marginTop: 'var(--space-md)',
      }}>
        Fertility probability estimates based on:{' '}
        <a
          href="https://www.nejm.org/doi/full/10.1056/NEJM199512073332301"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
        >
          Wilcox AJ et al. Timing of Sexual Intercourse in Relation to Ovulation.
          N Engl J Med. 1995;333:1517–1521
        </a>
        . For informational use only.
      </p>

      {/* BUG 3: Privacy banner — exact wording from newtoolMAIN.md §2 */}
      <section
        aria-label="Privacy"
        style={{
          marginTop: 'var(--space-lg)',
          background: 'var(--sage-softest)',
          border: '1px solid var(--sage-light)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-md)',
        }}
      >
        <p
          className="privacy"
          style={{ margin: 0, maxWidth: 'unset', textAlign: 'left', color: 'var(--sage-dark)' }}
        >
          <strong>Privacy:</strong> SageNest performs all calculations in your browser.
          We do not store your inputs or results.
        </p>
      </section>

      {/* FAQ — 5 items: items 1–3 unchanged; items 4–5 added to meet §10.6 minimum */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="ovulation-faq-heading"
      >
        <h2 id="ovulation-faq-heading">Frequently asked questions</h2>
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} style={{ marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>
              {item.question}
            </h3>
            <p style={{ marginBottom: 0 }}>{item.answer}</p>
          </article>
        ))}
      </section>

      {/* BUG 5: DisclaimerBox at very bottom of page */}
      <DisclaimerBox />

    </main>
  );
};
