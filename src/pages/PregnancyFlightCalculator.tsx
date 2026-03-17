import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { normalizeDate } from '../lib/calc';
import {
  calculatePregnancyFlightSafety,
  validatePregnancyFlightInputs,
} from '../lib/pregnancyFlightCalc';

// ─── Static data ───────────────────────────────────────────────────────────────

interface AirlinePolicy {
  airline: string;
  region: 'UK' | 'International' | 'US';
  domesticLimit: number | null;
  internationalLimit: number;
  domesticLabel: string;
  internationalLabel: string;
  letter: string;
}

const AIRLINE_POLICIES: AirlinePolicy[] = [
  {
    airline: 'British Airways',
    region: 'UK',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
  },
  {
    airline: 'Virgin Atlantic',
    region: 'UK',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
  },
  {
    airline: 'Emirates',
    region: 'International',
    domesticLimit: null,
    internationalLimit: 36,
    domesticLabel: 'N/A',
    internationalLabel: '36 weeks',
    letter: 'Required from 29 weeks',
  },
  {
    airline: 'Air France',
    region: 'International',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
  },
  {
    airline: 'United Airlines',
    region: 'US',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Not required — consult doctor from 28 weeks',
  },
  {
    airline: 'Delta Air Lines',
    region: 'US',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Not required — consult doctor from 28 weeks',
  },
  {
    airline: 'American Airlines',
    region: 'US',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Not required — consult doctor from 28 weeks',
  },
];

const ACOG_PRECAUTIONS = [
  'Wear your seatbelt below the belly, across the hips',
  'Walk or stretch in the aisle every 1–2 hours to reduce DVT risk',
  'Stay well hydrated — cabin air is very dry',
  'Choose an aisle seat for easier movement',
  'Wear compression stockings on flights over 4 hours',
  'Carry a copy of your prenatal records when in the third trimester',
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
    question: "Do I need a doctor's letter to fly while pregnant?",
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

// ─── Types ─────────────────────────────────────────────────────────────────────

type FieldErrors = {
  lmp?: string;
  flightDate?: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const toInputDate = (value: Date): string => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getVerdictStyle = (label: 'safe' | 'caution' | 'restricted') => {
  if (label === 'safe') {
    return {
      icon: '✈',
      heading: 'Safe window',
      bg: 'var(--sage-softest)',
      border: 'var(--sage-light)',
      headingColor: 'var(--sage-dark)',
      textColor: 'var(--charcoal)',
    };
  }
  if (label === 'caution') {
    return {
      icon: '⚠',
      heading: 'Check policy carefully',
      bg: '#fefbf0',
      border: '#f0d98a',
      headingColor: '#7a5c00',
      textColor: 'var(--charcoal)',
    };
  }
  return {
    icon: '🚫',
    heading: 'Restricted window',
    bg: '#fff3f2',
    border: '#ffd2cf',
    headingColor: '#8b2522',
    textColor: '#8b2522',
  };
};

const getRowHighlight = (
  policy: AirlinePolicy,
  gestWeeks: number | null,
): React.CSSProperties => {
  if (gestWeeks === null) return {};
  const limit = policy.internationalLimit;
  if (gestWeeks >= limit) return { background: '#fff3f2' };
  if (gestWeeks >= limit - 4) return { background: '#fefbf0' };
  return { background: 'var(--sage-softest)' };
};

const getAirlineSummary = (gestWeeks: number): string => {
  const total = AIRLINE_POLICIES.length;
  const intlOk = AIRLINE_POLICIES.filter((p) => gestWeeks < p.internationalLimit).length;
  const domesticOk = AIRLINE_POLICIES.filter(
    (p) => p.domesticLimit !== null && gestWeeks < p.domesticLimit,
  ).length;

  if (gestWeeks < 28) {
    return `At ${gestWeeks} weeks you are within the accepted limits for all ${total} listed airlines — no doctor's letter is required yet.`;
  }
  if (gestWeeks < 36) {
    return `At ${gestWeeks} weeks you qualify domestically for ${domesticOk} of ${total} airlines and internationally for ${intlOk} of ${total}. A doctor's letter is likely required — check per airline below.`;
  }
  return `At ${gestWeeks} weeks most airlines will not permit travel without direct written approval. Seek explicit clearance from both your airline and your OB before booking.`;
};

const getTrimesterLabel = (weeks: number): string => {
  if (weeks <= 13) return '1st';
  if (weeks <= 27) return '2nd';
  return '3rd';
};

// ─── Component ─────────────────────────────────────────────────────────────────

export const PregnancyFlightCalculatorPage = () => {
  const today = normalizeDate(new Date());

  const [lmp, setLmp] = useState(() => toInputDate(today));
  const [flightDate, setFlightDate] = useState(() =>
    toInputDate(
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
    ),
  );
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

  const showLmpError = Boolean(errors.lmp) && (hasSubmitted || touched.lmp);
  const showFlightError = Boolean(errors.flightDate) && (hasSubmitted || touched.flightDate);
  const verdictStyle = result ? getVerdictStyle(result.label) : null;
  const timelinePercent = result
    ? Math.min(100, (result.gestationalWeeksAtFlight / 40) * 100)
    : null;

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

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Based on ACOG guidelines + airline policies</div>
        </div>
        <h1 className="hero-title">
          Pregnancy Flight <span>Safety Calculator</span>
        </h1>
        <p className="hero-description">
          Wondering <strong>can I fly while pregnant</strong>? Enter your LMP and planned flight
          date to check gestational age and a practical safety verdict based on ACOG guidance.
        </p>
      </section>

      {/* ── Input card ── */}
      <div className="calculator-card" aria-labelledby="flight-form-title">
        <div className="calculator-header">
          <h2 id="flight-form-title" className="calculator-title">
            Enter Your Details
          </h2>
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
              onChange={(e) => setLmp(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, lmp: true }))}
              aria-invalid={showLmpError}
              aria-describedby={showLmpError ? 'lmp-error' : 'lmp-help'}
            />
            {showLmpError ? (
              <p id="lmp-error" className="error" role="alert">
                {errors.lmp}
              </p>
            ) : (
              <p id="lmp-help" className="field-help">
                The first day of your last period — used to estimate gestational age.
              </p>
            )}
          </div>

          <div className="field-row">
            <label htmlFor="flightDate">Planned flight date</label>
            <input
              id="flightDate"
              name="flightDate"
              type="date"
              value={flightDate}
              min={toInputDate(
                new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
              )}
              onChange={(e) => setFlightDate(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, flightDate: true }))}
              aria-invalid={showFlightError}
              aria-describedby={showFlightError ? 'flight-error' : 'flight-help'}
            />
            {showFlightError ? (
              <p id="flight-error" className="error" role="alert">
                {errors.flightDate}
              </p>
            ) : (
              <p id="flight-help" className="field-help">
                Must be a future date, within 42 weeks of your LMP.
              </p>
            )}
          </div>

          <button type="submit">Check flight safety</button>
        </form>
      </div>

      {/* ── Results ── */}
      <section
        className="results-card"
        aria-live="polite"
        aria-labelledby="results-heading"
      >
        <h2 id="results-heading">Your Result</h2>

        {hasSubmitted && result && verdictStyle ? (
          <>
            {/* Verdict banner */}
            <div
              style={{
                background: verdictStyle.bg,
                border: `1px solid ${verdictStyle.border}`,
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-md)',
                marginBottom: 'var(--space-md)',
                display: 'flex',
                gap: 'var(--space-sm)',
                alignItems: 'flex-start',
              }}
            >
              <span
                style={{ fontSize: '1.25rem', lineHeight: 1, marginTop: '2px', flexShrink: 0 }}
                aria-hidden="true"
              >
                {verdictStyle.icon}
              </span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    marginBottom: '4px',
                    color: verdictStyle.headingColor,
                  }}
                >
                  {verdictStyle.heading}
                </p>
                <p style={{ margin: 0, color: verdictStyle.textColor }}>{result.verdict}</p>
              </div>
            </div>

            {/* Meta cards */}
            <div className="results-meta" style={{ marginBottom: 'var(--space-lg)' }}>
              <div className="meta-item">
                <p className="meta-label">Gestational age at flight</p>
                <p className="meta-value">
                  {result.gestationalWeeksAtFlight}w {result.gestationalDaysRemainder}d
                </p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Trimester</p>
                <p className="meta-value">{getTrimesterLabel(result.gestationalWeeksAtFlight)}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Status</p>
                <p
                  className="meta-value"
                  style={{
                    textTransform: 'capitalize',
                    color:
                      result.label === 'safe'
                        ? 'var(--sage-dark)'
                        : result.label === 'caution'
                          ? '#7a5c00'
                          : '#8b2522',
                  }}
                >
                  {result.label}
                </p>
              </div>
            </div>

            {/* 40-week timeline bar */}
            {timelinePercent !== null && (
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-tertiary)',
                    marginBottom: 'var(--space-xs)',
                  }}
                >
                  Your flight on the pregnancy timeline
                </p>

                {/* Wrapper provides positioning context for plane marker */}
                <div style={{ position: 'relative', paddingTop: '22px' }}>
                  {/* Plane icon + week label above bar */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `${timelinePercent}%`,
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{ fontSize: '1rem', lineHeight: 1 }} aria-hidden="true">
                      ✈
                    </span>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        color: 'var(--charcoal)',
                        marginTop: '1px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Wk {result.gestationalWeeksAtFlight}
                    </span>
                  </div>

                  {/* Segmented bar */}
                  <div
                    style={{
                      display: 'flex',
                      height: '28px',
                      borderRadius: 'var(--radius-xs)',
                      overflow: 'hidden',
                      border: '1px solid var(--border-hairline)',
                    }}
                  >
                    {/* T1 — weeks 1–13 */}
                    <div
                      style={{
                        flex: 13,
                        background: 'var(--sage-softest)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight: '1px solid var(--sage-light)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--sage-dark)',
                          fontWeight: 700,
                          letterSpacing: '0.03em',
                        }}
                      >
                        T1
                      </span>
                    </div>
                    {/* T2 — weeks 14–27 */}
                    <div
                      style={{
                        flex: 14,
                        background: 'var(--sage-softest)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight: '1px solid var(--sage-light)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: 'var(--sage-dark)',
                          fontWeight: 700,
                          letterSpacing: '0.03em',
                        }}
                      >
                        T2
                      </span>
                    </div>
                    {/* T3 — weeks 28–40 */}
                    <div
                      style={{
                        flex: 13,
                        background: '#fff3f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: '#8b2522',
                          fontWeight: 700,
                          letterSpacing: '0.03em',
                        }}
                      >
                        T3
                      </span>
                    </div>
                  </div>

                  {/* Vertical tick through the bar */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: `${timelinePercent}%`,
                      transform: 'translateX(-50%)',
                      width: '2px',
                      height: '28px',
                      background: 'var(--charcoal)',
                      opacity: 0.55,
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* Week labels */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                  }}
                >
                  {['Wk 1', 'Wk 14', 'Wk 28', 'Wk 40'].map((label) => (
                    <span
                      key={label}
                      style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Personalized airline summary */}
            <div
              style={{
                background: 'var(--sand)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-md)',
                border: '1px solid var(--border-hairline)',
                marginBottom: 'var(--space-md)',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.9375rem' }}>
                {getAirlineSummary(result.gestationalWeeksAtFlight)}
              </p>
            </div>

            {/* ACOG precautions — caution + restricted only */}
            {(result.label === 'caution' || result.label === 'restricted') && (
              <div
                style={{
                  background: 'var(--sage-softest)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-md)',
                  border: '1px solid var(--sage-light)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    marginBottom: 'var(--space-xs)',
                    color: 'var(--sage-dark)',
                  }}
                >
                  ACOG in-flight precautions
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 'var(--space-md)',
                    color: 'var(--charcoal)',
                  }}
                >
                  {ACOG_PRECAUTIONS.map((precaution) => (
                    <li
                      key={precaution}
                      style={{ marginBottom: '6px', fontSize: '0.9375rem' }}
                    >
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Internal link */}
            <div style={{ marginTop: 'var(--space-md)' }}>
              <p style={{ marginBottom: 'var(--space-xs)' }}>Want a date cross-check?</p>
              <Link
                to="/pregnancy-due-date-calculator"
                style={{ color: 'var(--sage-primary)', fontWeight: 500 }}
              >
                Calculate your exact due date →
              </Link>
            </div>
          </>
        ) : (
          <p>
            Enter your dates and select "Check flight safety" to see your pregnancy travel
            guidance.
          </p>
        )}
      </section>

      {/* ── Airline policy table — always visible ── */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="airline-table-heading"
      >
        <h2 id="airline-table-heading">Major airline pregnancy policy reference</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Covers UK, US, and international carriers.
          {!hasSubmitted && (
            <> Submit your dates above to see rows highlighted for your gestational week.</>
          )}
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}
          >
            <thead>
              <tr style={{ background: 'var(--sand)' }}>
                {[
                  'Airline',
                  'Domestic limit',
                  'International limit',
                  "Doctor's letter",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderBottom: '2px solid var(--border-hairline)',
                      fontWeight: 600,
                      color: 'var(--charcoal)',
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AIRLINE_POLICIES.map((policy) => {
                const rowStyle =
                  hasSubmitted && result
                    ? getRowHighlight(policy, result.gestationalWeeksAtFlight)
                    : {};
                return (
                  <tr key={policy.airline} style={rowStyle}>
                    <td
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid var(--border-hairline)',
                        fontWeight: 500,
                        color: 'var(--charcoal)',
                      }}
                    >
                      {policy.airline}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid var(--border-hairline)',
                      }}
                    >
                      {policy.domesticLabel}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid var(--border-hairline)',
                      }}
                    >
                      {policy.internationalLabel}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid var(--border-hairline)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {policy.letter}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-tertiary)',
            marginTop: 'var(--space-sm)',
          }}
        >
          Policies correct as of 2024. Always verify directly with your airline before
          booking.
        </p>
      </section>

      {/* ── Educational content ── */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="edu-heading"
      >
        <h2 id="edu-heading">How does this pregnancy flight calculator work?</h2>
        <p>
          We estimate gestational age on your flight date by counting exact days from your LMP,
          converting to weeks and days, then applying safety guidance bands from ACOG. This makes
          it quick to evaluate <strong>pregnancy flight restrictions by week</strong> before
          booking.
        </p>

        <h2>Is it safe to fly during pregnancy?</h2>
        <p>
          For healthy pregnancies, <strong>flying while pregnant is often safe</strong> in the
          first and second trimester. Risk management becomes more important in the third
          trimester, when airlines add medical-clearance rules and ACOG recommends additional
          precautions including compression stockings, aisle seating, and regular movement to
          reduce DVT risk.
        </p>

        <h2>When do airlines restrict pregnant passengers?</h2>
        <p>
          Most carriers begin policy checks between 28–29 weeks and many stop accepting passengers
          after 36 weeks without explicit clearance. US carriers (United, Delta, American) do not
          formally require a doctor's letter but strongly recommend consulting your OB from 28
          weeks. UK and international carriers typically require a written certificate. Review the
          table above and compare with your current timeline using these{' '}
          <Link to="/pregnancy-week-by-week" style={{ color: 'var(--sage-primary)' }}>
            week-by-week pregnancy milestones
          </Link>
          .
        </p>
      </section>

      {/* ── FAQ ── */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="faq-heading"
      >
        <h2 id="faq-heading">Frequently asked questions</h2>
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} style={{ marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>
              {item.question}
            </h3>
            <p style={{ marginBottom: 0 }}>{item.answer}</p>
          </article>
        ))}
      </section>

      {/* ── Source citation ── */}
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--text-tertiary)',
          marginTop: 'var(--space-md)',
        }}
      >
        Estimates based on:{' '}
        <a
          href="https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/08/air-travel-during-pregnancy"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
        >
          ACOG Committee Opinion #746 — Air Travel During Pregnancy (2018)
        </a>
        . For informational use only.
      </p>

      {/* ── Medical disclaimer ── */}
      <p
        className="disclaimer"
        style={{ textAlign: 'left', marginTop: 'var(--space-lg)', maxWidth: 'unset' }}
      >
        <strong>Medical disclaimer:</strong> This tool is for educational use only and does not
        replace professional medical advice, diagnosis, or treatment.
      </p>

      {/* ── Privacy banner ── */}
      <section
        aria-label="Privacy"
        style={{
          marginTop: 'var(--space-lg)',
          background: 'var(--sage-softest)',
          border: '1px solid var(--sage-light)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-md)',
        }}
      >
        <p
          className="privacy"
          style={{
            margin: 0,
            maxWidth: 'unset',
            textAlign: 'left',
            color: 'var(--sage-dark)',
          }}
        >
          <strong>Privacy:</strong> SageNest performs all calculations in your browser. We do
          not store your inputs or results.
        </p>
      </section>
    </main>
  );
};
