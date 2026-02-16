import { ChangeEvent, useMemo, useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import SimilarToolsButton from '../components/SimilarToolsButton';
import { calculatePregnancyWeightGain, formatKg, Trimester, weekRanges } from '../lib/pregnancyWeightGain';

export const PregnancyWeightGainCalculatorPage = () => {
  const [prePregnancyWeight, setPrePregnancyWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [trimester, setTrimester] = useState<Trimester>('first');
  const [currentWeek, setCurrentWeek] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');

  const parsed = useMemo(() => {
    const preWeightValue = Number(prePregnancyWeight);
    const heightValue = Number(heightCm);
    const weekValue = currentWeek ? Number(currentWeek) : null;
    const currentWeightValue = currentWeight ? Number(currentWeight) : null;

    const errors: Record<string, string> = {};

    if (!prePregnancyWeight || Number.isNaN(preWeightValue)) {
      errors.prePregnancyWeight = 'Enter your pre-pregnancy weight in kilograms.';
    } else if (preWeightValue < 30 || preWeightValue > 250) {
      errors.prePregnancyWeight = 'Pre-pregnancy weight must be between 30 kg and 250 kg.';
    }

    if (!heightCm || Number.isNaN(heightValue)) {
      errors.heightCm = 'Enter your height in centimeters.';
    } else if (heightValue < 120 || heightValue > 220) {
      errors.heightCm = 'Height must be between 120 cm and 220 cm.';
    }

    if (weekValue !== null && (Number.isNaN(weekValue) || weekValue < 1 || weekValue > 42)) {
      errors.currentWeek = 'Current week must be between 1 and 42.';
    }

    if (currentWeightValue !== null && (Number.isNaN(currentWeightValue) || currentWeightValue < 30 || currentWeightValue > 300)) {
      errors.currentWeight = 'Current weight must be between 30 kg and 300 kg.';
    }

    if (weekValue !== null) {
      const [minWeek, maxWeek] = weekRanges[trimester];
      if (weekValue < minWeek || weekValue > maxWeek) {
        errors.currentWeek = `Week ${weekValue} does not match the selected trimester (${minWeek}-${maxWeek}).`;
      }
    }

    const hasRequiredValues = !errors.prePregnancyWeight && !errors.heightCm;
    if (!hasRequiredValues) {
      return { errors, bmi: null, band: null, weekValue, currentWeightValue };
    }

    const results = calculatePregnancyWeightGain(preWeightValue, heightValue);

    return { errors, bmi: results.bmi, band: results.band, weekValue, currentWeightValue };
  }, [prePregnancyWeight, heightCm, currentWeek, currentWeight, trimester]);

  const progress = useMemo(() => {
    if (!parsed.band || !parsed.weekValue || parsed.errors.currentWeek) {
      return null;
    }

    return calculatePregnancyWeightGain(Number(prePregnancyWeight), Number(heightCm), parsed.weekValue).recommendedByWeek;
  }, [parsed, prePregnancyWeight, heightCm]);

  const currentGain = useMemo(() => {
    const preWeightValue = Number(prePregnancyWeight);
    if (parsed.currentWeightValue === null || Number.isNaN(preWeightValue) || parsed.errors.currentWeight) {
      return null;
    }

    return calculatePregnancyWeightGain(preWeightValue, Number(heightCm), undefined, parsed.currentWeightValue).gainSoFar;
  }, [prePregnancyWeight, heightCm, parsed.currentWeightValue, parsed.errors.currentWeight]);

  const preWeightHelp = 'pre-pregnancy-weight-help';
  const heightHelp = 'height-help';
  const trimesterHelp = 'trimester-help';
  const weekHelp = 'week-help';
  const currentWeightHelp = 'current-weight-help';

  const describedBy = (helpId: string, errorId?: string) => (errorId ? `${helpId} ${errorId}` : helpId);

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Pregnancy Weight Gain Calculator — SageNest"
        description="Estimate pre-pregnancy BMI, IOM total pregnancy weight gain range, and week-by-week gain targets to discuss with your prenatal clinician."
        canonicalPath="/pregnancy-weight-gain-calculator"
      />

      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Evidence-aligned prenatal guidance</div>
          <SimilarToolsButton />
        </div>
        <h1 className="hero-title">Pregnancy Weight Gain <span>Calculator</span></h1>
        <p className="hero-description">
          Use your pre-pregnancy weight and height to estimate BMI and review Institute of Medicine (IOM) weight-gain guidance.
        </p>
      </section>

      <section className="calculator-card" aria-labelledby="pregnancy-weight-gain-form-title">
        <div className="calculator-header">
          <h2 id="pregnancy-weight-gain-form-title" className="calculator-title">Enter your pregnancy details</h2>
          <p className="calculator-subtitle">All calculations run in your browser and are for educational use.</p>
        </div>

        <form noValidate>
          <div className="field-row">
            <label htmlFor="pre-pregnancy-weight">Pre-pregnancy weight (kg)</label>
            <input
              id="pre-pregnancy-weight"
              name="prePregnancyWeight"
              type="number"
              min={30}
              max={250}
              step="0.1"
              inputMode="decimal"
              value={prePregnancyWeight}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setPrePregnancyWeight(event.target.value)}
              aria-describedby={describedBy(preWeightHelp, parsed.errors.prePregnancyWeight ? 'pre-pregnancy-weight-error' : undefined)}
              aria-invalid={Boolean(parsed.errors.prePregnancyWeight)}
            />
            <p id={preWeightHelp} className="field-help">Enter your weight before pregnancy began.</p>
            {parsed.errors.prePregnancyWeight ? <p id="pre-pregnancy-weight-error" className="error" role="alert">{parsed.errors.prePregnancyWeight}</p> : null}
          </div>

          <div className="field-row">
            <label htmlFor="height-cm">Height (cm)</label>
            <input
              id="height-cm"
              name="heightCm"
              type="number"
              min={120}
              max={220}
              step="0.1"
              inputMode="decimal"
              value={heightCm}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setHeightCm(event.target.value)}
              aria-describedby={describedBy(heightHelp, parsed.errors.heightCm ? 'height-error' : undefined)}
              aria-invalid={Boolean(parsed.errors.heightCm)}
            />
            <p id={heightHelp} className="field-help">Used only to calculate BMI for this session.</p>
            {parsed.errors.heightCm ? <p id="height-error" className="error" role="alert">{parsed.errors.heightCm}</p> : null}
          </div>

          <div className="field-row">
            <label htmlFor="trimester">Trimester</label>
            <select
              id="trimester"
              name="trimester"
              value={trimester}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => setTrimester(event.target.value as Trimester)}
              aria-describedby={trimesterHelp}
            >
              <option value="first">First trimester</option>
              <option value="second">Second trimester</option>
              <option value="third">Third trimester</option>
            </select>
            <p id={trimesterHelp} className="field-help">Select your current trimester to validate optional week input.</p>
          </div>

          <div className="field-row">
            <label htmlFor="current-week">Current week (optional)</label>
            <input
              id="current-week"
              name="currentWeek"
              type="number"
              min={1}
              max={42}
              step="1"
              inputMode="numeric"
              value={currentWeek}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCurrentWeek(event.target.value)}
              aria-describedby={describedBy(weekHelp, parsed.errors.currentWeek ? 'current-week-error' : undefined)}
              aria-invalid={Boolean(parsed.errors.currentWeek)}
            />
            <p id={weekHelp} className="field-help">Useful for week-specific gain targets.</p>
            {parsed.errors.currentWeek ? <p id="current-week-error" className="error" role="alert">{parsed.errors.currentWeek}</p> : null}
          </div>

          <div className="field-row">
            <label htmlFor="current-weight">Current weight (kg, optional)</label>
            <input
              id="current-weight"
              name="currentWeight"
              type="number"
              min={30}
              max={300}
              step="0.1"
              inputMode="decimal"
              value={currentWeight}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setCurrentWeight(event.target.value)}
              aria-describedby={describedBy(currentWeightHelp, parsed.errors.currentWeight ? 'current-weight-error' : undefined)}
              aria-invalid={Boolean(parsed.errors.currentWeight)}
            />
            <p id={currentWeightHelp} className="field-help">Add this to compare your current gain with estimated guidance.</p>
            {parsed.errors.currentWeight ? <p id="current-weight-error" className="error" role="alert">{parsed.errors.currentWeight}</p> : null}
          </div>
        </form>

        <section className="results-card" role="status" aria-live="polite" aria-atomic="true">
          <h3>Results</h3>
          {parsed.bmi && parsed.band ? (
            <>
              <p><strong>BMI:</strong> {parsed.bmi.toFixed(1)}</p>
              <p><strong>BMI category:</strong> {parsed.band.label}</p>
              <p>
                <strong>Recommended total pregnancy gain:</strong>{' '}
                {formatKg(parsed.band.totalGain[0])} to {formatKg(parsed.band.totalGain[1])}
              </p>
              {progress ? (
                <p>
                  <strong>Recommended gain by week {parsed.weekValue}:</strong>{' '}
                  {formatKg(progress.min)} to {formatKg(progress.max)}
                </p>
              ) : (
                <p>Enter your current week to see a week-specific gain target.</p>
              )}
              {currentGain !== null ? (
                <p><strong>Your gain so far:</strong> {formatKg(currentGain)}</p>
              ) : (
                <p>Enter current weight to compare gain so far with the estimated range.</p>
              )}
              <p className="disclaimer" style={{ textAlign: 'left', margin: 'var(--space-md) 0 0 0', maxWidth: 'unset' }}>
                Clinical caveat: this estimate is educational only. Contact your obstetric clinician or midwife for personalized care.
              </p>
            </>
          ) : (
            <p>Enter pre-pregnancy weight and height to calculate BMI and recommended gain range.</p>
          )}
        </section>
      </section>
    </main>
  );
};
