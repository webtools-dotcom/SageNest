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
      setDateError('Please choose a date.');
      return false;
    }
    setDateError('');
    return true;
  };

  const validateStepTwo = () => {
    if (cycleLength < 21 || cycleLength > 40) {
      setCycleError('Cycle length must be between 21 and 40 days.');
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
      setError(valid.message ?? 'Invalid date.');
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
            Fill in the details below to reveal your little one's big day.
          </p>
        </div>

        {/* Progress Steps */}
        {!dueDate && (
          <div className="steps-progress" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={2}>
            <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              {currentStep > 1 ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
                  <legend className="eyebrow" style={{ marginBottom: '1.5rem' }}>Step 1: Last Menstrual Period</legend>
                  <div className="field-row">
                    <label htmlFor="date">First Day of Last Period</label>
                    <div style={{ position: 'relative' }}>
                      <svg 
                        style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }}
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
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
                        style={{ paddingLeft: '3rem' }}
                      />
                    </div>
                    {dateError && (
                      <p id="date-error" className="error" role="alert">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {dateError}
                      </p>
                    )}
                  </div>
                  <button className="primary" type="button" onClick={goToStepTwo} style={{ width: '100%', marginTop: '1rem' }}>
                    Next: Cycle Length
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </fieldset>
              )}

              {currentStep === 2 && (
                <fieldset style={{ border: 'none', padding: 0 }}>
                  <legend className="eyebrow" style={{ marginBottom: '1.5rem' }}>Step 2: Cycle Length</legend>
                  <div className="field-row">
                    <label htmlFor="cycleLength">Average Cycle Length (Days)</label>
                    <div style={{ position: 'relative' }}>
                      <svg 
                        style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', pointerEvents: 'none' }}
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                      </svg>
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
                        style={{ paddingLeft: '3rem' }}
                      />
                    </div>
                    {cycleError && (
                      <p id="cycle-error" className="error" role="alert">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {cycleError}
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: '1.5rem' }}>
                    <label style={{ marginBottom: '0.75rem', display: 'block' }}>Quick Presets</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                            background: cycleLength === preset ? 'var(--primary)' : 'white',
                            color: cycleLength === preset ? 'white' : 'var(--text-main)',
                            borderColor: cycleLength === preset ? 'var(--primary)' : 'var(--border-light)',
                          }}
                        >
                          {preset} days
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="cta-row" style={{ marginTop: '2rem' }}>
                    <button type="button" onClick={() => setCurrentStep(1)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                      Back
                    </button>
                    <button className="primary" type="submit" style={{ flex: 1 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      Calculate My Date
                    </button>
                  </div>
                </fieldset>
              )}
            </>
          )}

          {error && (
            <p className="error" role="alert" style={{ marginTop: '1rem', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </p>
          )}
        </form>

        {/* Trust Indicators */}
        <div style={{ 
          marginTop: '2rem', 
          paddingTop: '2rem', 
          borderTop: '1px solid var(--border-light)', 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem',
          flexWrap: 'wrap',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            100% HIPAA Compliant
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Medically Reviewed
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </svg>
            Data Stays Private
          </div>
        </div>
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
          
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <button onClick={resetCalculator} className="primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
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
