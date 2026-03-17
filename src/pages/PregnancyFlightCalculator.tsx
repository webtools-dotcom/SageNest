import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DisclaimerBox } from '../components/DisclaimerBox';
import { SEOHead } from '../components/SEOHead';
import { normalizeDate } from '../lib/calc';
import {
  calculatePregnancyFlightSafety,
  validatePregnancyFlightInputs,
} from '../lib/pregnancyFlightCalc';

const AIRLINE_POLICIES = [
  { airline: 'IndiGo', domestic: '36 weeks', international: '32 weeks', letter: 'Required from 28 weeks' },
  { airline: 'Air India', domestic: '36 weeks', international: '32 weeks', letter: 'Required from 32 weeks' },
  { airline: 'SpiceJet', domestic: '35 weeks', international: '32 weeks', letter: 'Required from 28 weeks' },
  { airline: 'Emirates', domestic: 'N/A', international: '36 weeks', letter: 'Required from 29 weeks' },
  { airline: 'British Airways', domestic: '36 weeks', international: '36 weeks', letter: 'Required from 28 weeks' },
  { airline: 'Air France', domestic: '36 weeks', international: '36 weeks', letter: 'Required from 28 weeks' },
];

const FAQ_ITEMS = [
  {
    question: 'Is it safe to fly in the first trimester of pregnancy?',
    answer:
      'Flying in the first trimester is generally considered safe for uncomplicated pregnancies. ACOG notes no evidence that air travel causes miscarriage or harm to the developing fetus. The main concerns in early pregnancy are nausea and fatigue, which altitude and cabin pressure can worsen for some women.',
  },
  {
    question: 'How many weeks pregnant can you fly internationally?',
    answer:
      "Most international airlines restrict pregnant passengers from flying at or after 28–32 weeks without a doctor's letter, and most will not allow travel after 36 weeks at all. Policies vary by airline, so always check directly with your carrier before booking.",
  },
  {
    question: 'Do I need a doctor\'s letter to fly while pregnant?',
    answer:
      "Most airlines require a doctor's letter confirming your expected due date and that you are fit to fly, typically from around 28 weeks onwards. Some carriers require it earlier for international routes. This tool shows the policy for major airlines but always verify directly with your carrier before travel.",
  },
  {
    question: 'Can flying cause early labor?',
    answer:
      'There is no strong evidence that flying triggers early labor in healthy pregnancies. However, ACOG recommends that women with pregnancy complications, placenta previa, or a history of preterm labor avoid air travel. Always consult your OB or midwife before flying in the third trimester.',
  },
  {
    question: 'What is the best time to fly during pregnancy?',
    answer:
      'The second trimester (weeks 14–27) is generally considered the most comfortable time to fly. Morning sickness has typically improved, the risk of miscarriage is lower than in the first trimester, and you are not yet in the late-pregnancy restriction window. Most airlines have no restrictions during this period.',
  },
  {
    question: 'What precautions should I take when flying pregnant?',
    answer:
      'ACOG recommends: wearing a seatbelt below the belly, walking or stretching every hour to reduce DVT risk, staying hydrated, choosing an aisle seat for easier movement, and wearing compression stockings on long flights. Carry a copy of your prenatal records when flying in the third trimester.',
  },
];

type FieldErrors = {
  lmp?: string;
  flightDate?: string;
};

const toInputDate = (value: Date): string => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getVerdictTone = (label: 'safe' | 'caution' | 'restricted') => {
  if (label === 'safe') {
    return {
      heading: 'Safe window',
      bg: 'var(--sage-softest)',
      border: 'var(--sage-light)',
      text: 'var(--sage-dark)',
    };
  }

  if (label === 'caution') {
    return {
      heading: 'Check policy carefully',
      bg: 'var(--sand)',
      border: 'var(--border-hairline)',
      text: 'var(--charcoal)',
    };
  }

  return {
    heading: 'Restricted window',
    bg: '#fff3f2',
    border: '#ffd2cf',
    text: '#8b2522',
  };
};

export const PregnancyFlightCalculatorPage = () => {
  const today = normalizeDate(new Date());
  const [lmp, setLmp] = useState(() => toInputDate(today));
  const [flightDate, setFlightDate] = useState(() => toInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)));
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({ lmp: false, flightDate: false });

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};

    if (!lmp) {
      next.lmp = 'Enter your LMP date.';
      return next;
    }

    if (!flightDate) {
      next.flightDate = 'Enter your planned flight date.';
      return next;
    }

    const validation = validatePregnancyFlightInputs(new Date(lmp), new Date(flightDate));
    validation.errors.forEach((message) => {
      if (message.toLowerCase().includes('lmp')) next.lmp = message;
      if (message.toLowerCase().includes('flight')) next.flightDate = message;
    });

    return next;
  }, [lmp, flightDate]);

  const result = useMemo(() => {
    if (!lmp || !flightDate || errors.lmp || errors.flightDate) return null;
    return calculatePregnancyFlightSafety(new Date(lmp), new Date(flightDate));
  }, [lmp, flightDate, errors.lmp, errors.flightDate]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched({ lmp: true, flightDate: true });
  };

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Pregnancy Flight Safety Calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        url: 'https://sagenesthealth.com/pregnancy-flight-calculator',
        description:
          'Find out if you can fly at your stage of pregnancy. Enter your LMP and flight date to see your gestational week, safety verdict, and major airline policy rules. Free, instant, no signup.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
    [],
  );

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Can I Fly While Pregnant? Free Pregnancy Flight Calculator"
        description="Find out if you can fly at your stage of pregnancy. Enter your LMP and flight date to see your gestational week, safety verdict, and major airline policy rules. Free, instant, no signup."
        canonicalPath="/pregnancy-flight-calculator"
        jsonLd={jsonLd}
      />

      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Based on ACOG guidelines + airline policies</div>
        </div>
        <h1 className="hero-title">Pregnancy Flight <span>Safety Calculator</span></h1>
        <p className="hero-description">
          Wondering <strong>can I fly while pregnant</strong>? Enter your LMP and planned flight
          date to check gestational age and a practical safety verdict based on ACOG guidance.
        </p>
      </section>

      <div className="calculator-card" aria-labelledby="flight-form-title">
        <div className="calculator-header">
          <h2 id="flight-form-title" className="calculator-title">Enter Your Details</h2>
          <p className="calculator-subtitle">All calculations run privately in your browser.</p>
        </div>

        <form noValidate onSubmit={onSubmit}>
          <div className="field-row">
            <label htmlFor="lmp">First day of your last menstrual period (LMP)</label>
            <input
              id="lmp"
              name="lmp"
              type="date"
              value={lmp}
              max={toInputDate(today)}
              onChange={(event) => setLmp(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, lmp: true }))}
              aria-invalid={Boolean(errors.lmp) && (hasSubmitted || touched.lmp)}
            />
            {Boolean(errors.lmp) && (hasSubmitted || touched.lmp) ? <p className="error">{errors.lmp}</p> : null}
          </div>

          <div className="field-row">
            <label htmlFor="flightDate">Planned flight date</label>
            <input
              id="flightDate"
              name="flightDate"
              type="date"
              value={flightDate}
              min={toInputDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))}
              onChange={(event) => setFlightDate(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, flightDate: true }))}
              aria-invalid={Boolean(errors.flightDate) && (hasSubmitted || touched.flightDate)}
            />
            {Boolean(errors.flightDate) && (hasSubmitted || touched.flightDate) ? (
              <p className="error">{errors.flightDate}</p>
            ) : null}
          </div>

          <button type="submit">Check flight safety</button>
        </form>
      </div>

      <section className="results-card" aria-live="polite" aria-labelledby="results-heading">
        <h2 id="results-heading">Your Result</h2>
        {hasSubmitted && result ? (
          <>
            <div
              style={{
                background: getVerdictTone(result.label).bg,
                border: `1px solid ${getVerdictTone(result.label).border}`,
                color: getVerdictTone(result.label).text,
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-md)',
                marginBottom: 'var(--space-md)',
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, marginBottom: '6px' }}>
                {getVerdictTone(result.label).heading}
              </p>
              <p style={{ margin: 0 }}>{result.verdict}</p>
            </div>

            <p>
              At your flight date, gestational age is estimated to be <strong>{result.gestationalWeeksAtFlight} weeks {result.gestationalDaysRemainder} days</strong>.
            </p>
            <p>
              Need a date cross-check? <Link to="/pregnancy-due-date-calculator">Calculate your exact due date</Link>.
            </p>

            <h3 style={{ marginTop: 'var(--space-lg)' }}>Major airline pregnancy policy reference</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid var(--border-hairline)' }}>Airline</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid var(--border-hairline)' }}>Domestic limit</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid var(--border-hairline)' }}>International limit</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid var(--border-hairline)' }}>Doctor's letter policy</th>
                  </tr>
                </thead>
                <tbody>
                  {AIRLINE_POLICIES.map((policy) => (
                    <tr key={policy.airline}>
                      <td style={{ padding: '10px', borderBottom: '1px solid var(--border-hairline)' }}>{policy.airline}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid var(--border-hairline)' }}>{policy.domestic}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid var(--border-hairline)' }}>{policy.international}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid var(--border-hairline)' }}>{policy.letter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>Enter your dates and select “Check flight safety” to see your pregnancy travel guidance.</p>
        )}
      </section>

      <section className="educational-section" aria-labelledby="flight-education-heading">
        <h2 id="flight-education-heading">How does this pregnancy flight calculator work?</h2>
        <p>
          We estimate gestational age on your flight date by counting exact days from your LMP,
          converting to weeks + days, then applying safety guidance bands. This makes it quick to
          evaluate <strong>pregnancy flight restrictions by week</strong> before booking.
        </p>

        <h2>Is it safe to fly during pregnancy?</h2>
        <p>
          For healthy pregnancies, flying while pregnant is often safe in the first and second
          trimester. Risk management becomes more important later in pregnancy, especially in the
          third trimester, when airlines add medical-clearance rules.
        </p>

        <h2>When do airlines restrict pregnant passengers?</h2>
        <p>
          Most carriers start policy checks between 28–32 weeks and many stop accepting passengers
          after 36 weeks. Review your carrier-specific rules in the table above and compare with
          your current timeline using these <Link to="/pregnancy-week-by-week">week-by-week pregnancy milestones</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {FAQ_ITEMS.map((item) => (
            <article key={item.question} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="source-section">
        Source: ACOG Committee Opinion #746 — Air Travel During Pregnancy (2018).{' '}
        <a
          href="https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/08/air-travel-during-pregnancy"
          target="_blank"
          rel="noreferrer"
        >
          Read source
        </a>
        .
      </section>

      <DisclaimerBox />

      <section className="privacy-note" aria-label="Privacy notice">
        <p>
          Privacy: this tool does not store your dates. All calculations happen on your device.
        </p>
      </section>
    </main>
  );
};
