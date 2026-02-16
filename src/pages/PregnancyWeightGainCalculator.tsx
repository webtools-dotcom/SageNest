
import { useMemo, useState } from 'react';
import { SEOHead } from '../components/SEOHead';

type PregnancyType = 'singleton' | 'twins';

type Recommendation = {
  bmiLabel: string;
  totalGainKg: [number, number];
  weeklyGainKg?: [number, number];
  notes?: string;
};

const clampToWeekRange = (week: number) => Math.min(42, Math.max(1, week));

const toOneDecimal = (value: number) => Math.round(value * 10) / 10;

const getSingletonRecommendation = (bmi: number): Recommendation => {
  if (bmi < 18.5) {
    return {
      bmiLabel: 'Underweight (BMI < 18.5)',
      totalGainKg: [12.5, 18],
      weeklyGainKg: [0.44, 0.58]
    };
  }

  if (bmi < 25) {
    return {
      bmiLabel: 'Normal weight (BMI 18.5–24.9)',
      totalGainKg: [11.5, 16],
      weeklyGainKg: [0.35, 0.5]
    };
  }

  if (bmi < 30) {
    return {
      bmiLabel: 'Overweight (BMI 25–29.9)',
      totalGainKg: [7, 11.5],
      weeklyGainKg: [0.23, 0.33]
    };
  }

  return {
    bmiLabel: 'Obesity (BMI ≥ 30)',
    totalGainKg: [5, 9],
    weeklyGainKg: [0.17, 0.27]
  };
};

const getTwinRecommendation = (bmi: number): Recommendation => {
  if (bmi < 18.5) {
    return {
      bmiLabel: 'Underweight (BMI < 18.5)',
      totalGainKg: [16.8, 24.5],
      notes: 'Twin pregnancy guidance for underweight BMI is limited. Please confirm target gain with your OB-GYN or midwife.'
    };
  }

  if (bmi < 25) {
    return {
      bmiLabel: 'Normal weight (BMI 18.5–24.9)',
      totalGainKg: [16.8, 24.5]
    };
  }

  if (bmi < 30) {
    return {
      bmiLabel: 'Overweight (BMI 25–29.9)',
      totalGainKg: [14.1, 22.7]
    };
  }

  return {
    bmiLabel: 'Obesity (BMI ≥ 30)',
    totalGainKg: [11.3, 19.1]
  };
};

const getExpectedGainByWeek = (week: number, recommendation: Recommendation): [number, number] => {
  const [weeklyMin, weeklyMax] = recommendation.weeklyGainKg ?? [0.3, 0.7];

  if (week <= 13) {
    return [0.5, 2];
  }

  const weeksAfterFirstTrimester = week - 13;
  return [
    2 + weeksAfterFirstTrimester * weeklyMin,
    2 + weeksAfterFirstTrimester * weeklyMax
  ];
};

export const PregnancyWeightGainCalculatorPage = () => {
  const [prePregnancyWeightKg, setPrePregnancyWeightKg] = useState('60');
  const [currentWeightKg, setCurrentWeightKg] = useState('68');
  const [heightCm, setHeightCm] = useState('165');
  const [gestationalWeek, setGestationalWeek] = useState('24');
  const [pregnancyType, setPregnancyType] = useState<PregnancyType>('singleton');

  const result = useMemo(() => {
    const preWeight = Number(prePregnancyWeightKg);
    const currentWeight = Number(currentWeightKg);
    const heightMeters = Number(heightCm) / 100;
    const week = clampToWeekRange(Number(gestationalWeek));

    if (!preWeight || !currentWeight || !heightMeters || !Number.isFinite(heightMeters) || heightMeters <= 0) {
      return null;
    }

    const bmi = preWeight / (heightMeters * heightMeters);
    const recommendation = pregnancyType === 'singleton'
      ? getSingletonRecommendation(bmi)
      : getTwinRecommendation(bmi);

    const expectedSoFar = getExpectedGainByWeek(week, recommendation);
    const actualGain = currentWeight - preWeight;

    return {
      bmi,
      recommendation,
      week,
      actualGain,
      expectedSoFar
    };
  }, [currentWeightKg, gestationalWeek, heightCm, prePregnancyWeightKg, pregnancyType]);

import { ChangeEvent, useMemo, useState } from 'react';
import { SEOHead } from '../components/SEOHead';
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
  }, [parsed]);

  const currentGain = useMemo(() => {
    const preWeightValue = Number(prePregnancyWeight);
    if (parsed.currentWeightValue === null || Number.isNaN(preWeightValue) || parsed.errors.currentWeight) {
      return null;
    }

    return calculatePregnancyWeightGain(preWeightValue, Number(heightCm), undefined, parsed.currentWeightValue).gainSoFar;
  }, [prePregnancyWeight, parsed.currentWeightValue, parsed.errors.currentWeight]);

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

        description="Estimate healthy pregnancy weight gain targets by BMI and gestational week using evidence-aligned guidance for singleton or twin pregnancies."

        description="Estimate pre-pregnancy BMI, IOM total pregnancy weight gain range, and week-by-week gain targets to discuss with your prenatal clinician."

        canonicalPath="/pregnancy-weight-gain-calculator"
      />

      <section className="hero-section">

        <div className="trust-badge">Clinical Guidance Snapshot</div>
        <h1 className="hero-title">Pregnancy <span>Weight Gain</span> Calculator</h1>
        <p className="hero-description">
          Enter your pre-pregnancy weight, current weight, and gestational week to compare your progress with guideline ranges.
          This tool is educational and should be reviewed with your care team.
        </p>
      </section>

      <section className="calculator-card" aria-label="Pregnancy weight gain inputs">
        <div className="field-row">
          <label htmlFor="pregnancy-type">Pregnancy type</label>
          <select
            id="pregnancy-type"
            value={pregnancyType}
            onChange={(event) => setPregnancyType(event.target.value as PregnancyType)}
          >
            <option value="singleton">Singleton</option>
            <option value="twins">Twins</option>
          </select>
        </div>

        <div className="field-row">
          <label htmlFor="height-cm">Height (cm)</label>
          <input
            id="height-cm"
            type="number"
            min="120"
            max="220"
            inputMode="decimal"
            value={heightCm}
            onChange={(event) => setHeightCm(event.target.value)}
          />
        </div>

        <div className="field-row">
          <label htmlFor="pre-pregnancy-weight">Pre-pregnancy weight (kg)</label>
          <input
            id="pre-pregnancy-weight"
            type="number"
            min="30"
            max="250"
            inputMode="decimal"
            value={prePregnancyWeightKg}
            onChange={(event) => setPrePregnancyWeightKg(event.target.value)}
          />
        </div>

        <div className="field-row">
          <label htmlFor="current-weight">Current weight (kg)</label>
          <input
            id="current-weight"
            type="number"
            min="30"
            max="300"
            inputMode="decimal"
            value={currentWeightKg}
            onChange={(event) => setCurrentWeightKg(event.target.value)}
          />
        </div>

        <div className="field-row">
          <label htmlFor="gestational-week">Gestational week</label>
          <input
            id="gestational-week"
            type="number"
            min="1"
            max="42"
            value={gestationalWeek}
            onChange={(event) => setGestationalWeek(event.target.value)}
          />
        </div>

        {result && (
          <section className="results-card" aria-live="polite">
            <h2 style={{ marginBottom: '1rem' }}>Your estimate</h2>
            <p><strong>Pre-pregnancy BMI:</strong> {toOneDecimal(result.bmi)} ({result.recommendation.bmiLabel})</p>
            <p>
              <strong>Total recommended gain:</strong>{' '}
              {result.recommendation.totalGainKg[0]} to {result.recommendation.totalGainKg[1]} kg
            </p>
            <p>
              <strong>Expected gain by week {result.week}:</strong>{' '}
              {toOneDecimal(result.expectedSoFar[0])} to {toOneDecimal(result.expectedSoFar[1])} kg
            </p>
            <p><strong>Your current gain:</strong> {toOneDecimal(result.actualGain)} kg</p>
            {result.recommendation.notes && <p>{result.recommendation.notes}</p>}
            <p style={{ fontSize: '0.875rem' }}>
              Educational use only. Individual targets vary based on medical history, edema, and fetal growth.
              Bring this snapshot to your prenatal visits for personalized guidance.
            </p>
          </section>
        )}

        <div className="trust-badge">Evidence-aligned prenatal guidance</div>
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
