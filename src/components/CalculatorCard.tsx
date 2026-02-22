import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { conceptionToDueDate, conceptionWindow, ivfToDueDate, lmpToDueDate, trimesterFromDueDate, validateLMP } from '../lib/calc';
import { dueDateFromLMP, weeksAndDaysFromLMP } from '../lib/dateHelpers';
import { PregnancyTimeline } from './PregnancyTimeline';
import { ResultCard } from './ResultCard';

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

  useEffect(() => {
    if (!navState || navState.mode !== 'conception' || !navState.conceptionDate) {
      return;
    }

    const hydrationKey = `${navState.mode}|${navState.conceptionDate}|${navState.autoCalculate ? 'auto' : 'manual'}|${navState.sourceContext ?? ''}`;
    if (hydratedStateKeyRef.current === hydrationKey) {
      return;
    }

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

  const validateStepOne = () => {
    if (!date) { setDateError('Please select a date'); return false; }
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
    if (!validateStepOne()) { setCurrentStep(1); return; }

    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();

    if (mode === 'lmp') {
      if (!validateStepTwo()) { setCurrentStep(2); return; }
      const valid = validateLMP(selectedDate);
      if (!valid.valid) { setError(valid.message ?? 'Invalid date'); setCurrentStep(1); return; }
      setDueDate(dueDateFromLMP(selectedDate, cycleLength));
    } else if (mode === 'conception') {
      if (selectedDate > today) { setError('Conception date cannot be in the future'); return; }
      setDueDate(conceptionToDueDate(selectedDate));
    } else if (mode === 'ivf') {
      if (selectedDate > today) { setError('Transfer date cannot be in the future'); return; }
      if (embryoDays < 1 || embryoDays > 7) { setError('Embryo age must be between 1 and 7 days'); return; }
      setDueDate(ivfToDueDate(selectedDate, embryoDays));
    }
    setError('');
  };

  const derived = useMemo(() => {
    if (!dueDate || !date) return null;
    const lmpEstimate = mode === 'lmp'
      ? new Date(`${date}T00:00:00`)
      : new Date(dueDate.getTime() - 280 * 86400000);
    const ga = weeksAndDaysFromLMP(lmpEstimate);
    const trimester = trimesterFromDueDate(dueDate);
    const cw = conceptionWindow(lmpEstimate, cycleLength);
    return {
      gestationalWeeks: ga.weeks,
      gestationalDays: ga.days,
      trimester,
      conceptionDate: mode === 'lmp' ? cw.ovulationEstimate : undefined,
    };
  }, [cycleLength, date, dueDate, mode]);

  const dateLabel = mode === 'lmp' ? 'First Day of Last Period'
    : mode === 'conception' ? 'Conception Date'
    : 'Embryo Transfer Date';

  const dateHint = mode === 'lmp' ? 'The first day bleeding started, not when it ended'
    : mode === 'conception' ? 'An approximate date is fine — your provider will confirm with ultrasound'
    : 'The calendar date of your transfer procedure';

  const weekByWeekPath = derived && derived.gestationalWeeks >= 1 && derived.gestationalWeeks <= 40
    ? `/pregnancy-week-by-week/week-${derived.gestationalWeeks}`
    : '/pregnancy-week-by-week';
  const weekByWeekLabel = derived && derived.gestationalWeeks >= 1 && derived.gestationalWeeks <= 40
    ? `See pregnancy week-by-week guidance for week ${derived.gestationalWeeks}`
    : 'See the full pregnancy week-by-week guide';

  return (
    <>
      <div className="calculator-card">
        <div className="calculator-header">
          <h2 className="calculator-title">Calculate Your Due Date</h2>
          <p className="calculator-subtitle">Private, evidence-based — no signup required</p>
        </div>

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
              <strong>Based on ovulation date:</strong> {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}.{' '}
              <Link to="/ovulation-calculator">Back to ovulation calculator</Link>
            </p>
          </div>
        )}

        {/* Mode Selector */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage-primary)', marginBottom: 'var(--space-md)' }}>Calculation Method</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-sm)' }}>
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
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: 'var(--space-sm)', textAlign: 'center', transition: 'all 0.2s' }}>
              {MODE_DESCRIPTIONS[showHint]}
            </p>
          )}
        </div>

        {/* Progress Steps — LMP mode only */}
        {!dueDate && mode === 'lmp' && (
          <div className="steps-progress" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              {currentStep > 1 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : '1'}
            </div>
            <div className={`step-line ${currentStep > 1 ? 'completed' : ''}`} />
            <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          </div>
        )}

        <form aria-labelledby="calc-heading" onSubmit={onCalculate}>
          {!dueDate && (
            <>
              {/* Step 1 — Date input */}
              {(mode !== 'lmp' || currentStep === 1) && (
                <fieldset style={{ border: 'none', padding: 0 }}>
                  <legend className="eyebrow" style={{ marginBottom: 'var(--space-md)' }}>
                    {mode === 'lmp' ? 'Step 1 — Last Menstrual Period' : mode === 'conception' ? 'Conception Date' : 'Transfer Details'}
                  </legend>
                  <div className="field-row">
                    <label htmlFor="date">{dateLabel}</label>
                    <input
                      id="date"
                      type="date"
                      value={date}
                      onChange={(e) => { setDate(e.target.value); setDateError(''); }}
                      max={new Date().toISOString().slice(0, 10)}
                      aria-invalid={Boolean(dateError)}
                      aria-describedby={dateError ? 'date-error' : 'date-hint'}
                    />
                    <p id="date-hint" className="field-help">{dateHint}</p>
                    {dateError && <p id="date-error" className="error" role="alert">{dateError}</p>}
                  </div>

                  {/* IVF embryo day selector */}
                  {mode === 'ivf' && (
                    <div className="field-row">
                      <label>Embryo Age at Transfer</label>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                        {IVF_DAY_PRESETS.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setEmbryoDays(d)}
                            style={{
                              padding: '0.75rem 1.5rem',
                              background: embryoDays === d ? 'var(--sage-primary)' : 'var(--off-white)',
                              color: embryoDays === d ? 'var(--off-white)' : 'var(--charcoal)',
                              borderColor: embryoDays === d ? 'var(--sage-primary)' : 'var(--border-subtle)',
                              flex: 1,
                            }}
                          >
                            Day {d} {d === 5 ? '(Blastocyst)' : d === 3 ? '(Cleavage)' : '(Late)'}
                          </button>
                        ))}
                      </div>
                      <p className="field-help">Day 5 blastocyst is most common. Check your clinic records.</p>
                    </div>
                  )}

                  {mode === 'lmp' ? (
                    <button className="primary" type="button" onClick={goToStepTwo} style={{ width: '100%', marginTop: 'var(--space-md)' }}>
                      Continue to Cycle Length →
                    </button>
                  ) : (
                    <button className="primary" type="submit" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
                      Calculate Due Date
                    </button>
                  )}
                </fieldset>
              )}

              {/* Step 2 — Cycle length (LMP only) */}
              {mode === 'lmp' && currentStep === 2 && (
                <fieldset style={{ border: 'none', padding: 0 }}>
                  <legend className="eyebrow" style={{ marginBottom: 'var(--space-md)' }}>Step 2 — Cycle Length</legend>

                  {/* Visual cycle explainer */}
                  <div style={{ background: 'var(--sage-softest)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)', border: '1px solid var(--sage-light)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--charcoal)' }}>Why this matters:</strong> Women with longer cycles ovulate later, shifting the due date forward. Shorter cycles shift it earlier. If you\'re unsure, 28 days is the standard default.
                  </div>

                  <div className="field-row">
                    <label htmlFor="cycleLength">Average Cycle Length (Days)</label>
                    <input
                      id="cycleLength"
                      type="number"
                      value={cycleLength}
                      onChange={(e) => { setCycleLength(Number(e.target.value)); setCycleError(''); }}
                      min={21}
                      max={40}
                      aria-invalid={Boolean(cycleError)}
                      aria-describedby={cycleError ? 'cycle-error' : 'cycle-hint'}
                    />
                    <p id="cycle-hint" className="field-help">Count from day 1 of one period to day 1 of the next. Typical range: 21–40 days.</p>
                    {cycleError && <p id="cycle-error" className="error" role="alert">{cycleError}</p>}
                  </div>

                  <div style={{ marginTop: 'var(--space-md)' }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--charcoal)', marginBottom: 'var(--space-sm)' }}>Common Cycle Lengths</p>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                      {CYCLE_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => { setCycleLength(preset); setCycleError(''); }}
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            background: cycleLength === preset ? 'var(--sage-primary)' : 'var(--off-white)',
                            color: cycleLength === preset ? 'var(--off-white)' : 'var(--charcoal)',
                            borderColor: cycleLength === preset ? 'var(--sage-primary)' : 'var(--border-subtle)',
                          }}
                        >
                          {preset} days{preset === 28 ? ' ★' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due date preview */}
                  {date && !cycleError && (
                    <div style={{ background: 'var(--sand)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginTop: 'var(--space-lg)', border: '1px solid var(--border-hairline)', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage-primary)', margin: '0 0 4px 0' }}>Estimated Due Date Preview</p>
                      <p style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: '\'Playfair Display\', serif', color: 'var(--charcoal)', margin: 0 }}>
                        {dueDateFromLMP(new Date(`${date}T00:00:00`), cycleLength).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  )}

                  <div className="cta-row" style={{ marginTop: 'var(--space-xl)' }}>
                    <button type="button" onClick={() => setCurrentStep(1)}>← Back</button>
                    <button className="primary" type="submit" style={{ flex: 1 }}>Calculate Due Date</button>
                  </div>
                </fieldset>
              )}
            </>
          )}

          {error && <p className="error" role="alert" style={{ marginTop: 'var(--space-md)', justifyContent: 'center' }}>{error}</p>}
        </form>

        {/* Trust Indicators */}
        {!dueDate && (
          <div style={{
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-xl)',
            borderTop: '1px solid var(--border-hairline)',
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-lg)',
            flexWrap: 'wrap',
            fontSize: '0.8125rem',
            color: 'var(--text-tertiary)'
          }}>
            {[
              { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Private & Secure' },
              { icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8', label: 'Evidence-Based' },
              { icon: 'M12 6v6l4 2 M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', label: 'Instant Results' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage-primary)" strokeWidth="2"><path d={icon} /></svg>
                {label}
              </div>
            ))}
          </div>
        )}
      </div>

      {dueDate && derived && (
        <>
          <ResultCard
            dueDate={dueDate}
            gestationalWeeks={derived.gestationalWeeks}
            gestationalDays={derived.gestationalDays}
            trimester={derived.trimester}
            conceptionDate={derived.conceptionDate}
          />

          <p style={{ textAlign: 'center', margin: 'var(--space-lg) 0 0 0' }}>
            <Link to={weekByWeekPath}>
              {weekByWeekLabel}
            </Link>
          </p>

          <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0' }}>
            <button onClick={resetCalculator} className="primary">Calculate New Date</button>
          </div>

          <PregnancyTimeline dueDate={dueDate} />

          <p className="disclaimer">For informational purposes only. Not medical advice. Consult a healthcare provider.</p>
        </>
      )}
    </>
  );
};
