import { useMemo, useState } from 'react';
import {
  conceptionToDueDate,
  conceptionWindow,
  gestationalAge,
  ivfToDueDate,
  lmpToDueDate,
  trimesterFromDueDate,
  validateLMP
} from '../lib/calc';
import { weekSummaries } from '../data/weekSummaries';
import { PregnancyTimeline } from './PregnancyTimeline';
import { ProgressWheel } from './ProgressWheel';
import { ResultCard } from './ResultCard';

type Mode = 'lmp' | 'conception' | 'ivf';

export const CalculatorCard = () => {
  const [mode, setMode] = useState<Mode>('lmp');
  const [date, setDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [embryoAgeDays, setEmbryoAgeDays] = useState(5);
  const [error, setError] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const onCalculate = () => {
    if (!date) {
      setError('Please choose a date.');
      return;
    }

    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();

    if (mode === 'lmp') {
      const valid = validateLMP(selectedDate);
      if (!valid.valid) {
        setError(valid.message ?? 'Invalid date.');
        return;
      }
      if (cycleLength < 21 || cycleLength > 40) {
        setError('Cycle length must be between 21 and 40 days.');
        return;
      }
      setDueDate(lmpToDueDate(selectedDate, cycleLength));
    }

    if (mode === 'conception') {
      if (selectedDate > today) {
        setError('Conception date cannot be in the future.');
        return;
      }
      setDueDate(conceptionToDueDate(selectedDate));
    }

    if (mode === 'ivf') {
      if (selectedDate > today) {
        setError('Transfer date cannot be in the future.');
        return;
      }
      if (embryoAgeDays < 1 || embryoAgeDays > 7) {
        setError('Embryo age must be between 1 and 7 days.');
        return;
      }
      setDueDate(ivfToDueDate(selectedDate, embryoAgeDays));
    }

    setError('');
  };

  const derived = useMemo(() => {
    if (!dueDate || !date) return null;

    const lmpEstimate = mode === 'lmp' ? new Date(`${date}T00:00:00`) : new Date(dueDate.getTime() - 280 * 86400000);
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
  }, [cycleLength, date, dueDate, mode]);

  return (
    <section className="hero-card">
      <h1>Pregnancy Due Date Calculator</h1>
      <p>A calm, medically cautious way to estimate when you may be due and prepare thoughtful questions for prenatal visits.</p>
      <div className="field-row">
        <label htmlFor="mode">Calculation mode</label>
        <select id="mode" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="lmp">LMP</option>
          <option value="conception">Conception Date</option>
          <option value="ivf">IVF / Embryo Transfer</option>
        </select>
      </div>
      <div className="field-row">
        <label htmlFor="date">{mode === 'lmp' ? 'First day of last period' : mode === 'conception' ? 'Conception date' : 'Transfer date'}</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
      </div>
      {mode === 'lmp' ? (
        <div className="field-row">
          <label htmlFor="cycleLength">Cycle length (21-40 days)</label>
          <input id="cycleLength" type="number" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} min={21} max={40} />
        </div>
      ) : null}
      {mode === 'ivf' ? (
        <div className="field-row">
          <label htmlFor="embryoAge">Embryo age at transfer (1-7 days)</label>
          <input id="embryoAge" type="number" value={embryoAgeDays} onChange={(e) => setEmbryoAgeDays(Number(e.target.value))} min={1} max={7} />
        </div>
      ) : null}
      <button className="primary" onClick={onCalculate}>Calculate due date</button>
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
