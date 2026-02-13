import { type FormEvent, useMemo, useState } from 'react';
import {
  conceptionWindow,
  gestationalAge,
  lmpToDueDate,
  trimesterFromDueDate,
  validateLMP
} from '../lib/calc';
import { weekSummaries } from '../data/weekSummaries';
import { CalculatorSteps } from './CalculatorSteps';
import { PregnancyTimeline } from './PregnancyTimeline';
import { ProgressWheel } from './ProgressWheel';
import { ResultCard } from './ResultCard';

const CYCLE_PRESETS = [26, 28, 30] as const;

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

  const goToStepThree = () => {
    if (!validateStepTwo()) return;
    setCurrentStep(3);
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

    setDueDate(lmpToDueDate(selectedDate, cycleLength));
    setError('');
  };

  const derived = useMemo(() => {
    if (!dueDate || !date) return null;

    const lmpEstimate = new Date(`${date}T00:00:00`);
    const ga = gestationalAge(lmpEstimate);
    const trimester = trimesterFromDueDate(dueDate);
    const window = conceptionWindow(lmpEstimate, cycleLength);

    return {
      gestational: `${ga.weeks} weeks ${ga.days} days`,
      trimester,
      conceptionWindow: `${window.start.toLocaleDateString()} to ${window.end.toLocaleDateString()}`,
      summary: weekSummaries[trimester],
      weeks: ga.weeks,
      days: ga.days
    };
  }, [cycleLength, date, dueDate]);

  return (
    <section className="hero-card">
      <h1 id="calc-heading">Pregnancy Due Date Calculator</h1>
      <p>A calm, medically cautious way to estimate when you may be due and prepare thoughtful questions for prenatal visits.</p>
      <CalculatorSteps currentStep={currentStep} />
      <form aria-labelledby="calc-heading" onSubmit={onCalculate}>
        {currentStep === 1 ? (
          <fieldset>
            <legend>Step 1: Last menstrual period date</legend>
            <div className="field-row">
              <label htmlFor="date">First day of last period</label>
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
            </div>
            {dateError ? <p id="date-error" className="error" role="alert">{dateError}</p> : null}
            <button className="primary" type="button" onClick={goToStepTwo}>Next: Cycle length</button>
          </fieldset>
        ) : null}

        {currentStep === 2 ? (
          <fieldset>
            <legend>Step 2: Cycle length</legend>
            <div className="field-row">
              <label htmlFor="cycleLength">Cycle length (21-40 days)</label>
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
            </div>
            <div className="field-row" role="group" aria-label="Cycle length presets">
              <span>Presets</span>
              <div className="cta-row">
                {CYCLE_PRESETS.map((preset) => (
                  <button key={preset} type="button" onClick={() => {
                    setCycleLength(preset);
                    setCycleError('');
                  }}>
                    {preset} days
                  </button>
                ))}
              </div>
            </div>
            {cycleError ? <p id="cycle-error" className="error" role="alert">{cycleError}</p> : null}
            <div className="cta-row">
              <button type="button" onClick={() => setCurrentStep(1)}>Back</button>
              <button className="primary" type="button" onClick={goToStepThree}>Next: Review</button>
            </div>
          </fieldset>
        ) : null}

        {currentStep === 3 ? (
          <fieldset>
            <legend>Step 3: Review and calculate</legend>
            <p><strong>LMP date:</strong> {date || 'Not set'}</p>
            <p><strong>Cycle length:</strong> {cycleLength} days</p>
            <div className="cta-row">
              <button type="button" onClick={() => setCurrentStep(2)}>Back</button>
              <button className="primary" type="submit">Calculate due date</button>
            </div>
          </fieldset>
        ) : null}
      </form>
      {error ? <p className="error" role="alert">{error}</p> : null}
      {dueDate && derived ? (
        <>
          <ResultCard
            dueDate={dueDate}
            gestational={derived.gestational}
            trimester={derived.trimester}
            conceptionWindow={derived.conceptionWindow}
            summary={derived.summary}
          />
          <div className="results-grid">
            <ProgressWheel weeks={derived.weeks} days={derived.days} />
            <PregnancyTimeline dueDate={dueDate} />
          </div>
        </>
      ) : null}
    </section>
  );
};
