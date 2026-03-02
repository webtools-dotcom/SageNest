import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FertilityCalendar } from '../components/FertilityCalendar';
import { FertilityChart } from '../components/FertilityChart';
import { SEOHead } from '../components/SEOHead';
import { normalizeDate } from '../lib/calc';
import { calculateOvulation, validateOvulationInputs } from '../lib/ovulationCalc';

const CYCLE_PRESETS = [28, 30, 32] as const;

type PresetValue = `${(typeof CYCLE_PRESETS)[number]}` | 'custom';

type FieldErrors = {
  lmp?: string;
  cycleLength?: string;
};

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

const FAQ_ITEMS = [
  {
    question: 'How does this ovulation estimate work?',
    answer:
      'It counts forward from the first day of your last menstrual period and assumes ovulation happens about 14 days before your next period.',
  },
  {
    question: 'What cycle lengths are supported?',
    answer: 'You can use cycle lengths from 21 to 40 days, including custom input for irregular cycle patterns.',
  },
  {
    question: 'Is my data saved?',
    answer: 'No. Inputs stay in your browser and are not stored, sent, or shared by SageNest.',
  },
];

export const OvulationCalculatorPage = () => {
  const navigate = useNavigate();
  const [lmp, setLmp] = useState(toInputDate(new Date()));
  const [preset, setPreset] = useState<PresetValue>('28');
  const [customCycleLength, setCustomCycleLength] = useState('');
  const [touched, setTouched] = useState({ lmp: false, cycleLength: false });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  const cycleLengthValue = preset === 'custom' ? customCycleLength : preset;

  const errors = useMemo<FieldErrors>(() => {
    const nextErrors: FieldErrors = {};

    if (!lmp) {
      nextErrors.lmp = 'Enter the first day of your last menstrual period.';
    }

    const cycleLength = Number(cycleLengthValue);
    if (!cycleLengthValue || Number.isNaN(cycleLength)) {
      nextErrors.cycleLength = 'Enter your average cycle length in days.';
    }

    if (!nextErrors.lmp && !nextErrors.cycleLength) {
      const validation = validateOvulationInputs(new Date(lmp), cycleLength);
      const lmpError = validation.errors.find((item) => item.toLowerCase().includes('last menstrual period'));
      const cycleError = validation.errors.find((item) => item.toLowerCase().includes('cycle length'));

      if (lmpError) nextErrors.lmp = lmpError;
      if (cycleError) nextErrors.cycleLength = cycleError;
    }

    return nextErrors;
  }, [lmp, cycleLengthValue]);

  const showLmpError = Boolean(errors.lmp) && (touched.lmp || hasSubmitted);
  const showCycleError = Boolean(errors.cycleLength) && (touched.cycleLength || hasSubmitted);

  const result = useMemo(() => {
    if (errors.lmp || errors.cycleLength || !cycleLengthValue || !lmp) {
      return null;
    }

    return calculateOvulation(new Date(lmp), Number(cycleLengthValue));
  }, [cycleLengthValue, errors.cycleLength, errors.lmp, lmp]);

  const selectedCycleDay = useMemo(() => {
    if (!result) {
      return null;
    }

    const normalizedLmp = normalizeDate(new Date(lmp));
    const selectedDate = normalizeDate(selectedCalendarDate ?? result.ovulationEstimate);
    const daysSinceLmp = Math.floor((selectedDate.getTime() - normalizedLmp.getTime()) / 86_400_000);
    const cycleLength = Number(cycleLengthValue);
    const offset = ((daysSinceLmp % cycleLength) + cycleLength) % cycleLength;
    return offset + 1;
  }, [result, lmp, selectedCalendarDate, cycleLengthValue]);

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
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
    [],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setSelectedCalendarDate(null);
    setTouched({ lmp: true, cycleLength: true });
  };

  const onUseConceptionDate = () => {
    if (!result) {
      return;
    }

    navigate('/pregnancy-due-date-calculator', {
      state: {
        mode: 'conception',
        conceptionDate: toInputDate(result.ovulationEstimate),
        autoCalculate: true,
        sourceContext: 'ovulation-calculator',
      },
    });
  };

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Ovulation Calculator"
        description="Free ovulation calculator — enter your last period date and cycle length to find your fertile window, peak fertility days, and estimated ovulation date. No signup required."
        canonicalPath="/ovulation-calculator"
        jsonLd={jsonLd}
      />

      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Private, browser-only fertility estimate</div>
        </div>
        <h1 className="hero-title">Ovulation <span>Calculator</span></h1>
        <p className="hero-description">
          Get an estimated ovulation date and fertile window from your cycle information. Use this as planning guidance, not a diagnosis.
        </p>
      </section>

      <div className="calculator-card" aria-labelledby="ovulation-form-title">
        <div className="calculator-header">
          <h2 id="ovulation-form-title" className="calculator-title">Enter Cycle Details</h2>
          <p className="calculator-subtitle">Your data stays on your device. Nothing is stored on our servers.</p>
        </div>

        <form noValidate onSubmit={onSubmit}>
          <div className="field-row">
            <label htmlFor="lmp-date">First day of last menstrual period (LMP)</label>
            <input
              id="lmp-date"
              type="date"
              value={lmp}
              onChange={(event) => setLmp(event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, lmp: true }))}
              max={toInputDate(new Date())}
              aria-invalid={showLmpError}
              aria-describedby={showLmpError ? 'lmp-error' : undefined}
            />
            {showLmpError ? (
              <p id="lmp-error" className="error" role="alert">{errors.lmp}</p>
            ) : (
              <p className="field-help">Use the first day bleeding started, not the day it ended.</p>
            )}
          </div>

          <fieldset style={{ border: 'none', padding: 0, margin: '0 0 var(--space-md) 0' }}>
            <legend style={{ marginBottom: 'var(--space-xs)', fontWeight: 600, color: 'var(--charcoal)' }}>Average cycle length</legend>
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

            {preset === 'custom' ? (
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
                  onChange={(event) => setCustomCycleLength(event.target.value)}
                  onBlur={() => setTouched((current) => ({ ...current, cycleLength: true }))}
                  aria-invalid={showCycleError}
                  aria-describedby={showCycleError ? 'cycle-length-error' : undefined}
                />
              </div>
            ) : null}

            {showCycleError ? (
              <p id="cycle-length-error" className="error" role="alert">{errors.cycleLength}</p>
            ) : (
              <p className="field-help">Most cycles are between 21 and 40 days. Pick a preset or enter your average.</p>
            )}
          </fieldset>

          <button type="submit">Calculate fertile window</button>
        </form>
      </div>

      <section
        className="results-card"
        aria-live="polite"
        style={{ marginTop: 'var(--space-xl)', border: '1px solid var(--border-hairline)', borderRadius: 'var(--radius-md)', background: 'var(--off-white)', padding: 'var(--space-lg)' }}
      >
        <h2 style={{ marginBottom: 'var(--space-sm)' }}>Your Fertility Summary</h2>
        {hasSubmitted && result ? (
          <>
            <p style={{ marginBottom: 'var(--space-sm)' }}>
              Estimated ovulation day: <strong>{formatDate(result.ovulationEstimate)}</strong>
            </p>
            <p style={{ marginBottom: 'var(--space-sm)' }}>
              Fertile window: <strong>{formatDate(result.fertileWindowStart)}</strong> to <strong>{formatDate(result.fertileWindowEnd)}</strong>
            </p>
            <p style={{ marginBottom: 'var(--space-md)' }}>
              Peak fertility days: <strong>{formatDate(result.peakFertilityStart)}</strong> to <strong>{formatDate(result.peakFertilityEnd)}</strong>
            </p>
            <div style={{ background: 'var(--sand)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)', border: '1px solid var(--border-hairline)' }}>
              <p style={{ marginBottom: 'var(--space-xs)' }}><strong>Next period estimate:</strong> {formatDate(result.nextPeriodEstimate)}</p>
              <p style={{ marginBottom: 0 }}>Consider intercourse every 1–2 days during the fertile window for best conception chances.</p>
            </div>

            <div style={{ marginTop: 'var(--space-md)' }}>
              <button type="button" onClick={onUseConceptionDate}>
                Use ovulation date in due date calculator
              </button>
            </div>

            <div className="fertility-visuals">
              <FertilityCalendar
                lmp={new Date(lmp)}
                cycleLength={Number(cycleLengthValue)}
                ovulationResult={result}
                selectedDate={selectedCalendarDate ?? result.ovulationEstimate}
                onSelectDate={setSelectedCalendarDate}
              />
              {selectedCycleDay ? (
                <FertilityChart
                  cycleLength={Number(cycleLengthValue)}
                  ovulationCycleDay={Number(cycleLengthValue) - 13}
                  selectedCycleDay={selectedCycleDay}
                />
              ) : null}
            </div>
          </>
        ) : (
          <p style={{ marginBottom: 0 }}>Submit your details above to see a personalized ovulation and fertile window estimate.</p>
        )}
      </section>

      <section className="content-section" style={{ marginTop: 'var(--space-xl)' }} aria-labelledby="ovulation-guidance">
        <h2 id="ovulation-guidance">Educational guidance</h2>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
          <li>Cycle-based estimates are less reliable if your cycle length varies significantly month to month.</li>
          <li>Ovulation test strips, cervical mucus tracking, and basal body temperature can improve timing accuracy.</li>
          <li>If you have been trying to conceive for 12 months (or 6 months if age 35+), contact a licensed clinician.</li>
        </ul>
      </section>

      <p className="disclaimer" style={{ textAlign: 'left', marginTop: 'var(--space-lg)', maxWidth: 'unset' }}>
        <strong>Medical disclaimer:</strong> This tool is for educational use only and does not diagnose fertility conditions or replace professional medical care.
      </p>

      <section
        aria-label="Privacy"
        style={{ marginTop: 'var(--space-lg)', background: 'var(--sage-softest)', border: '1px solid var(--sage-light)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)' }}
      >
        <p className="privacy" style={{ margin: 0, maxWidth: 'unset', textAlign: 'left', color: 'var(--sage-dark)' }}>
          <strong>Privacy banner:</strong> SageNest performs all ovulation calculations in your browser. We do not store your LMP date, cycle length, or results.
        </p>
      </section>

      <section className="content-section" style={{ marginTop: 'var(--space-xl)' }} aria-labelledby="ovulation-faq-heading">
        <h2 id="ovulation-faq-heading">FAQ</h2>
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} style={{ marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>{item.question}</h3>
            <p style={{ marginBottom: 0 }}>{item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
};
