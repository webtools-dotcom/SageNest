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
import { ResultsCard } from './ResultsCard';

type Mode = 'lmp' | 'conception' | 'ivf';

export const CalculatorForm = () => {
  const [mode, setMode] = useState<Mode>('lmp');
  const [date, setDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [embryoAgeDays, setEmbryoAgeDays] = useState(5);
  const [error, setError] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const onCalculate = () => {
    if (!date) {
      setError('Please choose a date.');
      return;
    }
    const d = new Date(`${date}T00:00:00`);
    const today = new Date();
    if (mode === 'lmp') {
      const valid = validateLMP(d);
      if (!valid.valid) return setError(valid.message ?? 'Invalid date.');
      if (cycleLength < 21 || cycleLength > 40) return setError('Cycle length must be between 21 and 40 days.');
      setDueDate(lmpToDueDate(d, cycleLength));
    }
    if (mode === 'conception') {
      if (d > today) return setError('Conception date cannot be in the future.');
      setDueDate(conceptionToDueDate(d));
    }
    if (mode === 'ivf') {
      if (d > today) return setError('Transfer date cannot be in the future.');
      if (embryoAgeDays < 1 || embryoAgeDays > 7) return setError('Embryo age must be between 1 and 7 days.');
      setDueDate(ivfToDueDate(d, embryoAgeDays));
    }
    setError('');
  };

  const derived = useMemo(() => {
    if (!dueDate || !date) return null;
    const lmpEstimate = mode === 'lmp' ? new Date(`${date}T00:00:00`) : new Date(dueDate.getTime() - 280 * 86400000);
    const ga = gestationalAge(lmpEstimate);
    const trimester = trimesterFromDueDate(dueDate);
    const cw = conceptionWindow(lmpEstimate, cycleLength);
    return {
      gestational: `${ga.weeks} weeks ${ga.days} days`,
      trimester,
      conceptionWindow: `${cw.start.toLocaleDateString()} to ${cw.end.toLocaleDateString()}`,
      summary: weekSummaries[trimester]
    };
  }, [dueDate, date, mode, cycleLength]);

  const saveICS = () => {
    if (!dueDate) return;
    const dt = dueDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const content = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Estimated Due Date\nDTSTART:${dt}\nDTEND:${dt}\nDESCRIPTION:SageNest estimated due date reminder\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([content], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sagenest-due-date.ics';
    a.click();
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'SageNest Due Date Calculator', text: 'Try this pregnancy due date calculator', url });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard.');
    }
  };

  return (
    <>
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
      {mode === 'lmp' && (
        <div className="field-row">
          <label htmlFor="cycleLength">Cycle length (21-40 days)</label>
          <input id="cycleLength" type="number" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} min={21} max={40} />
        </div>
      )}
      {mode === 'ivf' && (
        <div className="field-row">
          <label htmlFor="embryoAge">Embryo age at transfer (1-7 days)</label>
          <input id="embryoAge" type="number" value={embryoAgeDays} onChange={(e) => setEmbryoAgeDays(Number(e.target.value))} min={1} max={7} />
        </div>
      )}
      <button className="primary" onClick={onCalculate}>Calculate due date</button>
      {error ? <p className="error" role="alert">{error}</p> : null}
      {dueDate && derived ? (
        <>
          <ResultsCard dueDate={dueDate} gestational={derived.gestational} trimester={derived.trimester} conceptionWindow={derived.conceptionWindow} summary={derived.summary} />
          <div className="cta-row">
            <button onClick={saveICS}>Save to calendar (.ics)</button>
            <button onClick={share}>Share</button>
            <button onClick={() => setShowModal(true)}>Get weekly updates</button>
          </div>
        </>
      ) : null}
      {showModal ? (
        <dialog open className="modal" aria-label="Weekly updates modal">
          <h3>Weekly updates preview</h3>
          <p>This is a static UI-only demo. No data is sent or stored.</p>
          <button onClick={() => setShowModal(false)}>Close</button>
        </dialog>
      ) : null}
    </>
  );
};
