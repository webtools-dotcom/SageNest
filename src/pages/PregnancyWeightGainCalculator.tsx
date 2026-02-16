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

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Pregnancy Weight Gain Calculator — SageNest"
        description="Estimate healthy pregnancy weight gain targets by BMI and gestational week using evidence-aligned guidance for singleton or twin pregnancies."
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
      </section>
    </main>
  );
};
