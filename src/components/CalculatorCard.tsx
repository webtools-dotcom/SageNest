import { type FormEvent, useMemo, useState } from 'react';
import { conceptionWindow, trimesterFromDueDate, validateLMP } from '../lib/calc';
import { dueDateFromLMP, weeksAndDaysFromLMP } from '../lib/dateHelpers';
import { PregnancyTimeline } from './PregnancyTimeline';
import { ResultCard } from './ResultCard';

const CYCLE_PRESETS = [21, 24, 28, 30, 35] as const;

export const CalculatorCard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [date, setDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [dateError, setDateError] = useState('');
  const [cycleError, setCycleError] = useState('');
  const [error, setError] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

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
    setDateError('');
    setCycleError('');
    setError('');
    setDueDate(null);
  };

  const onCalculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateStepOne()) {
      setCurrentStep(1);
      return;
    }

    if (!validateStepTwo()) {
      setCurrentStep(2);
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    const valid = validateLMP(selectedDate);
    if (!valid.valid) {
      setError(valid.message ?? 'Invalid date');
      setCurrentStep(1);
      return;
    }

    setDueDate(dueDateFromLMP(selectedDate, cycleLength));
    setError('');
  };

  const derived = useMemo(() => {
    if (!dueDate || !date) return null;

    const lmpEstimate = new Date(`${date}T00:00:00`);
    const ga = weeksAndDaysFromLMP(lmpEstimate);
    const trimester = trimesterFromDueDate(dueDate);
    const window = conceptionWindow(lmpEstimate, cycleLength);

    return {
      gestationalWeeks: ga.weeks,
      gestationalDays: ga.days,
      trimester,
      conceptionDate: window.ovulationEstimate
    };
  }, [cycleLength, date, dueDate]);

  return (
    <>
      <div className="calculator-card">
        <div className="calculator-header">
          <h2 className="calculator-title">Calculate Your Due Date</h2>
          <p className="calculator-subtitle">
            A simple, private tool to estimate your pregnancy timeline
          </p>
        </div>

        {/* Progress Steps */}
        {!dueDate && (
          <div className="steps-progress" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={2}>
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
              {currentStep === 1 && (
                <fieldset style={{ border: 'none', padding: 0 }}>
                  <legend className="eyebrow" style={{ marginBottom: 'var(--space-md)' }}>Step 1 — Last Menstrual Period</legend>
                  <div className="field-row">
                    <label htmlFor="date">First Day of Last Period</label>
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
                      aria-describedby={dateError ? 'date-error' : undefined}
                    />
                    {dateError && (
                      <p id="date-error" className="error" role="alert">
                        {dateError}
                      </p>
                    )}
                  </div>
                  <button className="primary" type="button" onClick={goToStepTwo} style={{ width: '100%', marginTop: 'var(--space-md)' }}>
                    Continue to Cycle Length
                  </button>
                </fieldset>
              )}

              {currentStep === 2 && (
                <fieldset style={{ border: 'none', padding: 0 }}>
                  <legend className="eyebrow" style={{ marginBottom: 'var(--space-md)' }}>Step 2 — Cycle Length</legend>
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
                      aria-describedby={cycleError ? 'cycle-error' : undefined}
                    />
                    {cycleError && (
                      <p id="cycle-error" className="error" role="alert">
                        {cycleError}
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: 'var(--space-lg)' }}>
                    <label style={{ marginBottom: 'var(--space-sm)', display: 'block', fontSize: '0.875rem' }}>Quick Presets</label>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                      {CYCLE_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setCycleLength(preset);
                            setCycleError('');
                          }}
                          style={{
                            padding: '0.75rem 1.25rem',
                            background: cycleLength === preset ? 'var(--sage-primary)' : 'var(--off-white)',
                            color: cycleLength === preset ? 'var(--off-white)' : 'var(--charcoal)',
                            borderColor: cycleLength === preset ? 'var(--sage-primary)' : 'var(--border-subtle)',
                          }}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="cta-row" style={{ marginTop: 'var(--space-xl)' }}>
                    <button type="button" onClick={() => setCurrentStep(1)}>
                      Back
                    </button>
                    <button className="primary" type="submit" style={{ flex: 1 }}>
                      Calculate Due Date
                    </button>
                  </div>
                </fieldset>
              )}
            </>
          )}

          {error && (
            <p className="error" role="alert" style={{ marginTop: 'var(--space-md)', justifyContent: 'center' }}>
              {error}
            </p>
          )}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage-primary)" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Private
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage-primary)" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Evidence-Based
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sage-primary)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Instant Results
            </div>
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
          
          <div style={{ textAlign: 'center', margin: 'var(--space-xl) 0' }}>
            <button onClick={resetCalculator} className="primary">
              Calculate New Date
            </button>
          </div>

          <PregnancyTimeline dueDate={dueDate} />

          <p className="disclaimer">
            For informational purposes only. Not medical advice. Consult a healthcare provider.
          </p>
        </>
      )}
    </>
  );
};
