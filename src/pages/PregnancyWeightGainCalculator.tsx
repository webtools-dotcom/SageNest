import { ChangeEvent, useMemo, useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { calculatePregnancyWeightGain, formatKg, Trimester, weekRanges } from '../lib/pregnancyWeightGain';

// BMI band color map for visual gauge
const BMI_COLORS: Record<string, string> = {
  underweight: '#6B9FD4',
  normal: '#9AA88D',
  overweight: '#D4A76A',
  obesity: '#D47A6B',
};

const BMI_LABELS: Record<string, string> = {
  underweight: 'Underweight',
  normal: 'Normal Weight',
  overweight: 'Overweight',
  obesity: 'Obese',
};

// Prenatal appointment schedule reference
const APPOINTMENT_SCHEDULE = [
  { weeks: '6–10', label: 'First prenatal visit', trimester: 1 },
  { weeks: '11–13', label: 'Nuchal translucency scan (optional)', trimester: 1 },
  { weeks: '15–20', label: 'Maternal serum screening', trimester: 2 },
  { weeks: '18–22', label: 'Anatomy scan', trimester: 2 },
  { weeks: '24–28', label: 'Glucose challenge test (GDM screening)', trimester: 2 },
  { weeks: '28', label: 'Begin bi-weekly appointments', trimester: 3 },
  { weeks: '35–37', label: 'Group B strep test', trimester: 3 },
  { weeks: '36', label: 'Begin weekly appointments', trimester: 3 },
];

// Visual gain progress bar
const GainProgressBar = ({
  gainSoFar,
  minGain,
  maxGain,
}: {
  gainSoFar: number;
  minGain: number;
  maxGain: number;
}) => {
  const clampedGain = Math.max(0, gainSoFar);
  const maxDisplay = maxGain * 1.3;
  const gainPct = Math.min(100, (clampedGain / maxDisplay) * 100);
  const minPct = (minGain / maxDisplay) * 100;
  const maxPct = (maxGain / maxDisplay) * 100;

  const status = gainSoFar < minGain ? 'below' : gainSoFar > maxGain ? 'above' : 'on-track';
  const statusColors = { below: '#6B9FD4', 'on-track': '#9AA88D', above: '#D47A6B' };
  const statusLabels = { below: 'Below target range', 'on-track': 'Within target range', above: 'Above target range' };

  return (
    <div style={{ marginTop: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '6px' }}>
        <span>0 kg</span>
        <span>{maxGain.toFixed(1)} kg (max target)</span>
      </div>
      <div style={{ position: 'relative', height: '20px', borderRadius: '99px', background: 'var(--warm-gray)', overflow: 'visible' }}>
        {/* Target range band */}
        <div style={{
          position: 'absolute',
          left: `${minPct}%`,
          width: `${maxPct - minPct}%`,
          height: '100%',
          background: 'rgba(154,168,141,0.25)',
          border: '1px solid var(--sage-light)',
          borderRadius: '4px',
        }} />
        {/* Actual gain bar */}
        <div style={{
          position: 'absolute',
          left: 0,
          width: `${gainPct}%`,
          height: '100%',
          background: statusColors[status],
          borderRadius: '99px',
          transition: 'width 0.5s ease',
        }} />
        {/* Gain marker dot */}
        <div style={{
          position: 'absolute',
          left: `calc(${gainPct}% - 10px)`,
          top: '-4px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: statusColors[status],
          border: '3px solid var(--off-white)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.625rem',
          fontWeight: 700,
          color: '#fff',
        }}>
          {gainSoFar.toFixed(0)}
        </div>
      </div>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '10px',
        padding: '4px 10px',
        borderRadius: '99px',
        background: `${statusColors[status]}20`,
        border: `1px solid ${statusColors[status]}40`,
        fontSize: '0.75rem',
        fontWeight: 600,
        color: statusColors[status],
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[status], display: 'inline-block' }} />
        {statusLabels[status]}
      </div>
    </div>
  );
};

// BMI Visual Gauge
const BMIGauge = ({ bmi, bandKey }: { bmi: number; bandKey: string }) => {
  const segments = [
    { key: 'underweight', label: '<18.5', min: 10, max: 18.5 },
    { key: 'normal', label: '18.5–25', min: 18.5, max: 25 },
    { key: 'overweight', label: '25–30', min: 25, max: 30 },
    { key: 'obesity', label: '30+', min: 30, max: 45 },
  ];
  const totalRange = 45 - 10;
  const bmiPct = Math.min(100, Math.max(0, ((Math.min(bmi, 45) - 10) / totalRange) * 100));

  return (
    <div style={{ margin: 'var(--space-md) 0' }}>
      <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '12px' }}>
        {segments.map((seg) => (
          <div
            key={seg.key}
            style={{
              flex: (seg.max - seg.min) / totalRange,
              background: BMI_COLORS[seg.key],
              opacity: bandKey === seg.key ? 1 : 0.3,
            }}
          />
        ))}
      </div>
      {/* Marker */}
      <div style={{ position: 'relative', height: '20px' }}>
        <div style={{
          position: 'absolute',
          left: `calc(${bmiPct}% - 4px)`,
          top: '0',
          width: '8px',
          height: '14px',
          background: BMI_COLORS[bandKey] || 'var(--sage-primary)',
          borderRadius: '0 0 4px 4px',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
        {segments.map((seg) => (
          <span key={seg.key} style={{ flex: (seg.max - seg.min) / totalRange, textAlign: 'center', color: bandKey === seg.key ? BMI_COLORS[seg.key] : 'var(--text-tertiary)', fontWeight: bandKey === seg.key ? 700 : 400 }}>
            {seg.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export const PregnancyWeightGainCalculatorPage = () => {
  const [prePregnancyWeight, setPrePregnancyWeight] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [trimester, setTrimester] = useState<Trimester>('second');
  const [currentWeek, setCurrentWeek] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [useImperial, setUseImperial] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  // Convert imperial inputs if needed
  const kgWeight = useImperial && prePregnancyWeight
    ? (Number(prePregnancyWeight) * 0.453592).toFixed(1)
    : prePregnancyWeight;
  const cmHeight = useImperial && heightCm
    ? (Number(heightCm) * 2.54).toFixed(1)
    : heightCm;

  const parsed = useMemo(() => {
    const preWeightValue = Number(kgWeight);
    const heightValue = Number(cmHeight);
    const weekValue = currentWeek ? Number(currentWeek) : null;
    const currentWeightValue = currentWeight ? Number(useImperial ? (Number(currentWeight) * 0.453592).toFixed(1) : currentWeight) : null;

    const errors: Record<string, string> = {};

    if (!kgWeight || Number.isNaN(preWeightValue)) {
      errors.prePregnancyWeight = `Enter your pre-pregnancy weight in ${useImperial ? 'lbs' : 'kg'}.`;
    } else if (preWeightValue < 30 || preWeightValue > 250) {
      errors.prePregnancyWeight = 'Pre-pregnancy weight must be between 30–250 kg.';
    }

    if (!cmHeight || Number.isNaN(heightValue)) {
      errors.heightCm = `Enter your height in ${useImperial ? 'inches' : 'cm'}.`;
    } else if (heightValue < 120 || heightValue > 220) {
      errors.heightCm = 'Height must be between 120–220 cm.';
    }

    if (weekValue !== null && (Number.isNaN(weekValue) || weekValue < 1 || weekValue > 42)) {
      errors.currentWeek = 'Current week must be between 1 and 42.';
    }

    if (currentWeightValue !== null && (Number.isNaN(currentWeightValue) || currentWeightValue < 30 || currentWeightValue > 300)) {
      errors.currentWeight = `Current weight must be between 30–300 kg.`;
    }

    if (weekValue !== null && !errors.currentWeek) {
      const [minWeek, maxWeek] = weekRanges[trimester];
      if (weekValue < minWeek || weekValue > maxWeek) {
        errors.currentWeek = `Week ${weekValue} is outside the selected trimester (weeks ${minWeek}–${maxWeek}).`;
      }
    }

    const hasRequired = !errors.prePregnancyWeight && !errors.heightCm;
    if (!hasRequired) return { errors, bmi: null, band: null, weekValue, currentWeightValue };

    const results = calculatePregnancyWeightGain(preWeightValue, heightValue);
    return { errors, bmi: results.bmi, band: results.band, weekValue, currentWeightValue };
  }, [kgWeight, cmHeight, currentWeek, currentWeight, trimester, useImperial]);

  const progress = useMemo(() => {
    if (!parsed.band || !parsed.weekValue || parsed.errors.currentWeek) return null;
    return calculatePregnancyWeightGain(Number(kgWeight), Number(cmHeight), parsed.weekValue).recommendedByWeek;
  }, [parsed, kgWeight, cmHeight]);

  const gainSoFar = useMemo(() => {
    const preWeightValue = Number(kgWeight);
    if (parsed.currentWeightValue === null || Number.isNaN(preWeightValue) || parsed.errors.currentWeight) return null;
    return calculatePregnancyWeightGain(preWeightValue, Number(cmHeight), undefined, parsed.currentWeightValue).gainSoFar;
  }, [kgWeight, cmHeight, parsed]);

  const weightUnit = useImperial ? 'lbs' : 'kg';
  const heightUnit = useImperial ? 'in' : 'cm';
  const displayGain = (kg: number) => useImperial ? `${(kg * 2.20462).toFixed(1)} lbs` : formatKg(kg);

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Pregnancy Weight Gain Calculator"
        description="Free pregnancy weight gain calculator — enter your pre-pregnancy BMI to get your IOM-recommended total gain range and week-by-week targets by trimester. No signup required."
        canonicalPath="/pregnancy-weight-gain-calculator"
      />

      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Evidence-aligned prenatal guidance</div>
        </div>
        <h1 className="hero-title">Pregnancy Weight Gain <span>Calculator</span></h1>
        <p className="hero-description">
          Estimate your healthy weight gain range based on IOM guidelines. Enter your details below and get a personalized result to discuss with your care team.
        </p>
      </section>

      <div className="calculator-card" aria-labelledby="weight-gain-title">
        <div className="calculator-header">
          <h2 id="weight-gain-title" className="calculator-title">Enter Your Details</h2>
          <p className="calculator-subtitle">All calculations run privately in your browser.</p>
        </div>

        {/* Unit toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
          <button
            type="button"
            onClick={() => setUseImperial(false)}
            style={{
              padding: '0.5rem 1.5rem',
              fontSize: '0.875rem',
              background: !useImperial ? 'var(--sage-primary)' : 'var(--off-white)',
              color: !useImperial ? 'var(--off-white)' : 'var(--charcoal)',
              borderColor: !useImperial ? 'var(--sage-primary)' : 'var(--border-subtle)',
              width: 'auto',
            }}
          >
            Metric (kg / cm)
          </button>
          <button
            type="button"
            onClick={() => setUseImperial(true)}
            style={{
              padding: '0.5rem 1.5rem',
              fontSize: '0.875rem',
              background: useImperial ? 'var(--sage-primary)' : 'var(--off-white)',
              color: useImperial ? 'var(--off-white)' : 'var(--charcoal)',
              borderColor: useImperial ? 'var(--sage-primary)' : 'var(--border-subtle)',
              width: 'auto',
            }}
          >
            Imperial (lbs / in)
          </button>
        </div>

        <form noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="field-row" style={{ marginBottom: 0 }}>
              <label htmlFor="pre-pregnancy-weight">Pre-pregnancy weight ({weightUnit})</label>
              <input
                id="pre-pregnancy-weight"
                type="number"
                min={useImperial ? 66 : 30}
                max={useImperial ? 550 : 250}
                step="0.1"
                inputMode="decimal"
                value={prePregnancyWeight}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPrePregnancyWeight(e.target.value)}
                aria-invalid={Boolean(parsed.errors.prePregnancyWeight)}
                placeholder={useImperial ? 'e.g. 140' : 'e.g. 65'}
              />
              {parsed.errors.prePregnancyWeight && <p className="error" role="alert">{parsed.errors.prePregnancyWeight}</p>}
            </div>

            <div className="field-row" style={{ marginBottom: 0 }}>
              <label htmlFor="height-cm">Height ({heightUnit})</label>
              <input
                id="height-cm"
                type="number"
                min={useImperial ? 47 : 120}
                max={useImperial ? 87 : 220}
                step="0.1"
                inputMode="decimal"
                value={heightCm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setHeightCm(e.target.value)}
                aria-invalid={Boolean(parsed.errors.heightCm)}
                placeholder={useImperial ? 'e.g. 65' : 'e.g. 165'}
              />
              {parsed.errors.heightCm && <p className="error" role="alert">{parsed.errors.heightCm}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginTop: 'var(--space-md)' }}>
            <div className="field-row" style={{ marginBottom: 0 }}>
              <label htmlFor="trimester">Trimester</label>
              <select
                id="trimester"
                value={trimester}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setTrimester(e.target.value as Trimester)}
              >
                <option value="first">First (Weeks 1–13)</option>
                <option value="second">Second (Weeks 14–27)</option>
                <option value="third">Third (Weeks 28–42)</option>
              </select>
            </div>

            <div className="field-row" style={{ marginBottom: 0 }}>
              <label htmlFor="current-week">Current Week (optional)</label>
              <input
                id="current-week"
                type="number"
                min={1}
                max={42}
                step="1"
                inputMode="numeric"
                value={currentWeek}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentWeek(e.target.value)}
                aria-invalid={Boolean(parsed.errors.currentWeek)}
                placeholder="e.g. 20"
              />
              {parsed.errors.currentWeek && <p className="error" role="alert">{parsed.errors.currentWeek}</p>}
            </div>
          </div>

          <div className="field-row" style={{ marginTop: 'var(--space-md)' }}>
            <label htmlFor="current-weight">Current Weight ({weightUnit}, optional)</label>
            <input
              id="current-weight"
              type="number"
              min={useImperial ? 66 : 30}
              max={useImperial ? 660 : 300}
              step="0.1"
              inputMode="decimal"
              value={currentWeight}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentWeight(e.target.value)}
              aria-invalid={Boolean(parsed.errors.currentWeight)}
              placeholder={`Add to see how much you've gained`}
            />
            <p className="field-help">Compare your actual gain so far against your target range.</p>
            {parsed.errors.currentWeight && <p className="error" role="alert">{parsed.errors.currentWeight}</p>}
          </div>
        </form>

        {/* Results Panel */}
        <section
          className="results-card"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{ marginTop: 'var(--space-xl)', marginBottom: 0 }}
        >
          {parsed.bmi && parsed.band ? (
            <>
              <div className="results-header">
                <p className="eyebrow">Your Result</p>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>
                  Recommended Total Gain: <span style={{ color: 'var(--sage-primary)' }}>
                    {displayGain(parsed.band.totalGain[0])} – {displayGain(parsed.band.totalGain[1])}
                  </span>
                </h3>
              </div>

              {/* BMI Gauge */}
              <div style={{ background: 'var(--sand)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)', border: '1px solid var(--border-hairline)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Pre-Pregnancy BMI</span>
                  <span style={{ fontFamily: '\'Playfair Display\', serif', fontSize: '1.75rem', fontWeight: 700, color: BMI_COLORS[parsed.band.key] || 'var(--charcoal)' }}>
                    {parsed.bmi.toFixed(1)}
                  </span>
                </div>
                <BMIGauge bmi={parsed.bmi} bandKey={parsed.band.key} />
                <p style={{ textAlign: 'center', fontSize: '0.875rem', fontWeight: 600, color: BMI_COLORS[parsed.band.key], margin: '4px 0 0 0' }}>
                  {BMI_LABELS[parsed.band.key]}
                </p>
              </div>

              {/* Meta grid */}
              <div className="results-meta">
                <div className="meta-item">
                  <p className="meta-label">Total Gain Target</p>
                  <p className="meta-value" style={{ fontSize: '1.25rem' }}>{displayGain(parsed.band.totalGain[0])}–{displayGain(parsed.band.totalGain[1])}</p>
                </div>
                <div className="meta-item">
                  <p className="meta-label">Weekly Rate (T2/T3)</p>
                  <p className="meta-value" style={{ fontSize: '1.25rem' }}>
                    {useImperial
                      ? `${(parsed.band.weeklyGain[0] * 2.20462).toFixed(2)}–${(parsed.band.weeklyGain[1] * 2.20462).toFixed(2)} lbs`
                      : `${parsed.band.weeklyGain[0]}–${parsed.band.weeklyGain[1]} kg`}
                  </p>
                </div>
                {progress && parsed.weekValue && (
                  <div className="meta-item">
                    <p className="meta-label">By Week {parsed.weekValue}</p>
                    <p className="meta-value" style={{ fontSize: '1.25rem' }}>
                      {displayGain(progress.min)}–{displayGain(progress.max)}
                    </p>
                  </div>
                )}
              </div>

              {/* Gain so far tracker */}
              {gainSoFar !== null && parsed.band && (
                <div style={{ background: 'var(--sand)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', marginTop: 'var(--space-lg)', border: '1px solid var(--border-hairline)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Your Gain So Far</span>
                    <span style={{ fontFamily: '\'Playfair Display\', serif', fontSize: '1.5rem', fontWeight: 700, color: 'var(--charcoal)' }}>
                      {displayGain(gainSoFar)}
                    </span>
                  </div>
                  <GainProgressBar
                    gainSoFar={gainSoFar}
                    minGain={parsed.band.totalGain[0]}
                    maxGain={parsed.band.totalGain[1]}
                  />
                </div>
              )}

              <p className="disclaimer" style={{ textAlign: 'left', margin: 'var(--space-lg) 0 0 0', maxWidth: 'unset' }}>
                <strong>Clinical caveat:</strong> These are IOM population guidelines, not personalized prescriptions. Your obstetrician or midwife may adjust your target based on your individual health history.
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-lg) 0' }}>
              <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>Enter your pre-pregnancy weight and height above to calculate your BMI and recommended gain range.</p>
            </div>
          )}
        </section>
      </div>

      {/* IOM Reference Table */}
      <section style={{ marginTop: 'var(--space-2xl)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>IOM Weight Gain Reference</h2>
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-hairline)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--sage-softest)' }}>
                {['BMI Category', 'Pre-pregnancy BMI', 'Total Gain (kg)', 'Total Gain (lbs)', 'Weekly Rate (T2/T3)'].map((h) => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--sage-dark)', borderBottom: '1px solid var(--sage-light)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Underweight', bmi: '< 18.5', kg: '12.5–18', lbs: '28–40', rate: '0.44–0.58 kg/wk', key: 'underweight' },
                { cat: 'Normal Weight', bmi: '18.5–24.9', kg: '11.5–16', lbs: '25–35', rate: '0.35–0.50 kg/wk', key: 'normal' },
                { cat: 'Overweight', bmi: '25.0–29.9', kg: '7–11.5', lbs: '15–25', rate: '0.23–0.33 kg/wk', key: 'overweight' },
                { cat: 'Obese', bmi: '≥ 30', kg: '5–9', lbs: '11–20', rate: '0.17–0.27 kg/wk', key: 'obesity' },
              ].map((row, i) => (
                <tr key={row.cat} style={{ background: i % 2 === 0 ? 'var(--off-white)' : 'var(--sand)' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: BMI_COLORS[row.key] }}>{row.cat}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--charcoal)' }}>{row.bmi}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--charcoal)' }}>{row.kg}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--charcoal)' }}>{row.lbs}</td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-md)', textAlign: 'center' }}>
          Source: Institute of Medicine (IOM) / National Academy of Medicine guidelines for singleton pregnancies.
        </p>
      </section>

      {/* Prenatal Appointment Schedule */}
      <section style={{ marginTop: 'var(--space-2xl)' }}>
        <button
          type="button"
          onClick={() => setShowSchedule(!showSchedule)}
          style={{
            width: '100%',
            background: 'var(--sage-softest)',
            border: '1px solid var(--sage-light)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md) var(--space-lg)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'var(--sage-dark)',
            fontWeight: 600,
            fontSize: '1rem',
          }}
          aria-expanded={showSchedule}
        >
          <span>📅 Prenatal Appointment Schedule Reference</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 300, transform: showSchedule ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
        </button>
        {showSchedule && (
          <div style={{ border: '1px solid var(--border-hairline)', borderTop: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)', overflow: 'hidden' }}>
            {APPOINTMENT_SCHEDULE.map((appt, i) => (
              <div key={appt.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-lg)',
                padding: '0.875rem var(--space-lg)',
                background: i % 2 === 0 ? 'var(--off-white)' : 'var(--sand)',
                borderBottom: i < APPOINTMENT_SCHEDULE.length - 1 ? '1px solid var(--border-hairline)' : 'none',
              }}>
                <div style={{
                  flexShrink: 0,
                  width: '72px',
                  textAlign: 'center',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: appt.trimester === 1 ? '#7A8872' : appt.trimester === 2 ? '#8B9E78' : '#506A45',
                  background: appt.trimester === 1 ? 'var(--sage-softest)' : appt.trimester === 2 ? '#EAF0E3' : '#DDE8D6',
                  padding: '4px 8px',
                  borderRadius: '99px',
                }}>
                  Wk {appt.weeks}
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{appt.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                  T{appt.trimester}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
