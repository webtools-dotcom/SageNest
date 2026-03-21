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
  region: 'UK' | 'US' | 'Australia' | 'Canada' | 'Europe' | 'Middle East';
  domesticLimit: number | null;
  internationalLimit: number;
  domesticLabel: string;
  internationalLabel: string;
  letter: string;
  notes?: string;
}

const AIRLINE_POLICIES: AirlinePolicy[] = [
  // ── US ──
  {
    airline: 'United Airlines',
    region: 'US',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Not required — consult doctor from 28 weeks',
    notes: 'No formal letter policy but medical clearance recommended in third trimester.',
  },
  {
    airline: 'Delta Air Lines',
    region: 'US',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Not required — consult doctor from 28 weeks',
    notes: 'Passengers may travel up to 36 weeks; no formal letter required.',
  },
  {
    airline: 'American Airlines',
    region: 'US',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Not required — consult doctor from 28 weeks',
    notes: 'No formal letter policy; third-trimester travel should be discussed with OB.',
  },
  {
    airline: 'Alaska Airlines',
    region: 'US',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Not required — consult doctor from 28 weeks',
    notes: 'Generally follows same approach as major US carriers.',
  },
  // ── UK ──
  {
    airline: 'British Airways',
    region: 'UK',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
    notes: 'Letter must state expected due date and confirm no complications.',
  },
  {
    airline: 'Virgin Atlantic',
    region: 'UK',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
    notes: 'Fit-to-fly letter must be dated within 10 days of travel from 28 weeks.',
  },
  {
    airline: 'easyJet',
    region: 'UK',
    domesticLimit: 35,
    internationalLimit: 35,
    domesticLabel: '35 weeks',
    internationalLabel: '35 weeks',
    letter: 'Required from 28 weeks',
    notes: 'Restricts travel earlier than most — check directly if booking close to 35 weeks.',
  },
  {
    airline: 'Ryanair',
    region: 'UK',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
    notes: 'Letter must confirm gestational age and that pregnancy is uncomplicated.',
  },
  // ── Australia ──
  {
    airline: 'Qantas',
    region: 'Australia',
    domesticLimit: 36,
    internationalLimit: 35,
    domesticLabel: '36 weeks',
    internationalLabel: '35 weeks',
    letter: 'Required from 28 weeks',
    notes: 'International limit is 35 weeks. Medical certificate required from 28 weeks for international travel.',
  },
  {
    airline: 'Virgin Australia',
    region: 'Australia',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
    notes: 'Medical certificate required from 28 weeks. Passengers should carry letter at all times when in third trimester.',
  },
  // ── Canada ──
  {
    airline: 'Air Canada',
    region: 'Canada',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Recommended from 28 weeks',
    notes: 'No formal requirement but strongly recommends doctor consultation from 28 weeks.',
  },
  {
    airline: 'WestJet',
    region: 'Canada',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Recommended from 28 weeks',
    notes: 'Advises passengers to consult their physician before flying in the third trimester.',
  },
  // ── Europe ──
  {
    airline: 'Lufthansa',
    region: 'Europe',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
    notes: 'Medical certificate required from the start of the 29th week for all routes.',
  },
  {
    airline: 'Air France',
    region: 'Europe',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
    notes: 'Medical certificate required from 28 weeks for all flights.',
  },
  {
    airline: 'KLM',
    region: 'Europe',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
    notes: 'Follows standard European carrier policy — medical certificate required from 28 weeks.',
  },
  {
    airline: 'Swiss International Air Lines',
    region: 'Europe',
    domesticLimit: 36,
    internationalLimit: 36,
    domesticLabel: '36 weeks',
    internationalLabel: '36 weeks',
    letter: 'Required from 29 weeks',
    notes: 'Medical certificate required from the beginning of the 29th week of pregnancy.',
  },
  // ── Middle East ──
  {
    airline: 'Emirates',
    region: 'Middle East',
    domesticLimit: null,
    internationalLimit: 36,
    domesticLabel: 'N/A',
    internationalLabel: '36 weeks',
    letter: 'Required from 29 weeks',
    notes: 'Medical certificate required from 29 weeks. Travel not permitted at 36 weeks or beyond.',
  },
  {
    airline: 'Etihad Airways',
    region: 'Middle East',
    domesticLimit: null,
    internationalLimit: 36,
    domesticLabel: 'N/A',
    internationalLabel: '36 weeks',
    letter: 'Required from 29 weeks',
    notes: 'Medical certificate dated within 10 days of travel required from 29 weeks.',
  },
  {
    airline: 'Qatar Airways',
    region: 'Middle East',
    domesticLimit: null,
    internationalLimit: 36,
    domesticLabel: 'N/A',
    internationalLabel: '36 weeks',
    letter: 'Required from 28 weeks',
    notes: 'Medical fitness certificate required from 28 weeks. Not permitted to travel at 36 weeks or beyond.',
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
      'Flying in the first trimester is generally considered safe for uncomplicated pregnancies. ACOG notes no evidence that air travel causes miscarriage or harm to the developing fetus. The main concerns in early pregnancy are nausea and fatigue, which altitude and cabin pressure can worsen for some women. No airline restricts travel in the first trimester.',
  },
  {
    question: 'How many weeks pregnant can you fly internationally?',
    answer:
      "Most international airlines restrict pregnant passengers from flying at or after 35–36 weeks. easyJet and Qantas (international routes) cut off at 35 weeks. Most other major carriers cut off at 36 weeks. From 28–29 weeks, a doctor's fit-to-fly letter is required by the majority of UK, European, Middle Eastern, and Australian carriers. Always check your specific airline's policy before booking.",
  },
  {
    question: "Do I need a doctor's letter to fly while pregnant?",
    answer:
      "It depends on your airline and gestational age. Most UK, European, Middle Eastern, and Australian carriers require a medical certificate from 28–29 weeks confirming your due date and that your pregnancy is uncomplicated. US carriers (United, Delta, American, Alaska) do not formally require a letter but recommend consulting your OB in the third trimester. The letter typically needs to include your expected due date, current gestational age, and confirmation you are fit to fly. Some airlines require it to be dated within 10 days of travel.",
  },
  {
    question: 'Can flying cause early labor?',
    answer:
      'There is no strong evidence that flying triggers early labor in healthy pregnancies. However, ACOG recommends that women with pregnancy complications, placenta previa, or a history of preterm labor avoid air travel. Always consult your OB or midwife before flying in the third trimester.',
  },
  {
    question: 'What is the best time to fly during pregnancy?',
    answer:
      'The second trimester (weeks 14–27) is generally considered the most comfortable and safest time to fly. Morning sickness has typically improved, miscarriage risk is lower than in the first trimester, and you are outside the airline restriction window. No major carrier imposes restrictions during this period.',
  },
  {
    question: 'What precautions should I take when flying pregnant?',
    answer:
      'ACOG recommends: wearing a seatbelt below the belly across the hips, walking the aisle or stretching every 1–2 hours to reduce DVT risk, staying well hydrated, choosing an aisle seat for easier movement, wearing graduated compression stockings on flights over 4 hours, and carrying a copy of your prenatal records in the third trimester.',
  },
  {
    question: 'Can I fly long-haul while pregnant?',
    answer:
      'Long-haul flights are generally permissible in uncomplicated pregnancies up to the standard gestational limits, but they carry higher DVT risk due to prolonged immobility. ACOG specifically recommends compression stockings, regular movement, and hydration on flights over 4 hours. For flights over 8 hours in the third trimester, discuss with your OB first, especially if you have any history of clotting disorders or are carrying multiples.',
  },
  {
    question: 'What airlines have the strictest pregnancy policies?',
    answer:
      "easyJet is the strictest major carrier — it restricts travel from 35 weeks, one week earlier than most competitors. Qantas also restricts international travel from 35 weeks. Emirates, Etihad, and Swiss International Air Lines set their doctor's letter requirement at 29 weeks rather than 28. US carriers (United, Delta, American) are the most lenient, with no formal letter requirement though they restrict at 36 weeks like most carriers.",
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
    return `At ${gestWeeks} weeks you are within the accepted limits for all ${total} airlines listed — no doctor's letter is required yet on any of them.`;
  }
  if (gestWeeks < 36) {
    return `At ${gestWeeks} weeks you qualify domestically for ${domesticOk} of ${total} airlines and internationally for ${intlOk} of ${total}. Most UK, European, and Middle Eastern carriers now require a doctor's letter — check per airline in the table below.`;
  }
  return `At ${gestWeeks} weeks, most airlines across the US, UK, Europe, Australia, Canada, and the Middle East will not permit travel without direct written approval from your OB. Seek explicit clearance before booking.`;
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
      {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to check if you can fly while pregnant',
        description: 'Use your LMP date and planned flight date to calculate gestational age and check against major airline pregnancy policies.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Enter your LMP date',
            text: 'Find the first day of your last menstrual period and enter it into the LMP field.',
          },
          {
            '@type': 'HowToStep',
            name: 'Enter your flight date',
            text: 'Enter the date of your planned flight. This must be a future date within 42 weeks of your LMP.',
          },
          {
            '@type': 'HowToStep',
            name: 'Check your safety verdict',
            text: 'The calculator will show your gestational age on the flight date, a safety verdict based on ACOG guidelines, and which airlines permit travel at your gestational week.',
          },
          {
            '@type': 'HowToStep',
            name: 'Review airline policies',
            text: "Check the airline policy table to see whether your carrier requires a doctor's letter at your gestational week and whether you are within their travel limit.",
          },
        ],
      },
    ],
    [],
  );

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Flying While Pregnant: Week-by-Week Guide + Airline Policy Checker"
        description="Can you fly while pregnant? Check your gestational week against major airline policies for the US, UK, Australia, Canada, Europe, and the Middle East. Free tool + week-by-week safety guide based on ACOG guidelines."
        canonicalPath="/pregnancy-flight-calculator"
        jsonLd={jsonLd}
      />

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Based on ACOG guidelines + airline policies</div>
        </div>
        <h1 className="hero-title">
          Flying While Pregnant: <span>Is It Safe for Your Week?</span>
        </h1>
        <p className="hero-description">
          Enter your LMP and planned flight date to instantly check your gestational age, get a
          safety verdict, and see how your week matches major airline pregnancy policies across
          the US, UK, Australia, Canada, Europe, and the Middle East — based on ACOG guidance.
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
          Covers US, UK, Australian, Canadian, European, and Middle Eastern carriers.
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
                  'Region',
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
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {policy.region}
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
          Policies sourced from individual airline websites and verified as of early 2025.
          Always confirm directly with your carrier before booking — policies change.{' '}
          Sources:{' '}
          <a
            href="https://www.britishairways.com/content/information/travel-assistance/medical-conditions-and-pregnancy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            British Airways
          </a>
          ,{' '}
          <a
            href="https://www.virginatlantic.com/en-IN/help/articles/im-pregnant-can-i-still-fly----0915b561-3176-46e6-a081-d935aa8db780"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Virgin Atlantic
          </a>
          ,{' '}
          <a
            href="https://www.emirates.com/in/english/before-you-fly/health/before-you-leave/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Emirates
          </a>
          ,{' '}
          <a
            href="https://www.etihad.com/en-in/help/faq/travel-during-pregnancy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Etihad
          </a>
          ,{' '}
          <a
            href="https://www.qatarairways.com/en-in/family/expectant-mothers.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Qatar Airways
          </a>
          ,{' '}
          <a
            href="https://help.qantas.com/support/s/article/Requirements-for-flying-whilst-pregnant"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Qantas
          </a>
          ,{' '}
          <a
            href="https://travel.gc.ca/travelling/health-safety/travelling-pregnant"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Air Canada
          </a>
          ,{' '}
          <a
            href="https://www.lufthansa.com/us/en/travelling-healthy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            Lufthansa
          </a>
          .
        </p>
      </section>

      {/* ── Educational content ── */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="edu-heading"
      >
        <h2 id="edu-heading">Flying while pregnant: is it safe?</h2>
        <p>
          For most healthy pregnancies, flying is considered safe throughout the first and second
          trimester and into the early third trimester. The American College of Obstetricians and
          Gynecologists (ACOG) states that air travel is safe for pregnant women up to 36 weeks of
          gestation in the absence of obstetric or medical complications. The key risks are not
          from altitude or cabin pressure, but from prolonged immobility, dehydration, and the
          restricted access to emergency medical care on board.
        </p>
        <p>
          That said, the practical question most pregnant travellers face is not just "is it safe"
          — it is "will my airline actually let me board." Airline restrictions and doctor's
          letter requirements vary significantly, and knowing your exact gestational week is
          essential before booking.
        </p>

        <h2>Flying while pregnant by trimester</h2>

        <h3>First trimester (weeks 1–13): Generally safe, nausea is the main issue</h3>
        <p>
          ACOG confirms no evidence that air travel causes miscarriage or fetal harm in
          uncomplicated first-trimester pregnancies. The main concern is nausea, which altitude
          and cabin pressure can worsen. No airline restricts travel in the first trimester. If
          you are experiencing hyperemesis gravidarum or have a threatened miscarriage, consult
          your OB before flying.
        </p>

        <h3>Second trimester (weeks 14–27): The ideal window for flying</h3>
        <p>
          The second trimester is widely considered the most comfortable and lowest-risk period for
          air travel. Morning sickness has typically resolved, miscarriage risk is at its lowest
          point, and you are well outside the airline restriction window. Most women find this the
          easiest trimester to travel in, and no major carrier imposes restrictions during this
          window.
        </p>

        <h3>Third trimester (weeks 28–40): Restrictions apply — check your week</h3>
        <p>
          This is where airline policies, doctor's letter requirements, and medical risk all
          converge. Most carriers begin checking for pregnancy-related documentation at 28 weeks,
          and the majority of airlines will not permit travel at 36 weeks or beyond. Use the
          calculator above to check your exact gestational age on your travel date.
        </p>

        <h2>Flying at specific weeks in the third trimester</h2>

        <h3>Flying at 28 weeks pregnant</h3>
        <p>
          Week 28 is the trigger point for most UK, European, and Middle Eastern airlines. British
          Airways, Virgin Atlantic, Emirates, Qatar Airways, Lufthansa, KLM, Air France, Qantas,
          and others all require a doctor's fit-to-fly letter from this point. US carriers
          (United, Delta, American) do not formally require a letter but strongly recommend
          consulting your OB. If you are planning an international trip, get your letter before 28
          weeks to avoid last-minute complications.
        </p>

        <h3>Flying at 29–31 weeks pregnant</h3>
        <p>
          Etihad and Swiss International Air Lines set their letter requirement at 29 weeks rather
          than 28. At 29–31 weeks you are in the active letter-required zone for virtually all
          carriers outside the US. DVT (deep vein thrombosis) risk increases with flight duration
          at this stage — ACOG recommends compression stockings and movement every 1–2 hours on
          any flight over 4 hours.
        </p>

        <h3>Flying at 32 weeks pregnant</h3>
        <p>
          At 32 weeks you are four weeks away from most airlines' hard cut-off. This is still
          flyable with a letter on almost all carriers, but some long-haul airlines begin
          requiring more detailed documentation. Confirm directly with your airline that they will
          accept travel at 32 weeks on your specific route, particularly for flights over 8 hours.
          ACOG advises carrying a copy of your prenatal records on all third-trimester flights
          from this point.
        </p>

        <h3>Flying at 33–34 weeks pregnant</h3>
        <p>
          At 33–34 weeks you are approaching the restriction window. easyJet restricts travel at
          35 weeks — so at 34 weeks you are one week away from their cut-off. For most other
          carriers you can still fly with a valid doctor's letter. This is a reasonable last
          window for any non-essential long-haul travel.
        </p>

        <h3>Flying at 35 weeks pregnant</h3>
        <p>
          easyJet does not permit travel at 35 weeks or beyond. All other major carriers still
          allow travel with a valid doctor's letter. At 35 weeks Qantas requires a medical
          certificate for international routes. This is the last practical week for international
          travel on most airlines before their 36-week cut-off.
        </p>

        <h3>Flying at 36 weeks pregnant</h3>
        <p>
          Most airlines worldwide impose their hard cut-off at 36 weeks. British Airways, Virgin
          Atlantic, Emirates, Qatar Airways, Etihad, Lufthansa, KLM, Air France, United, Delta,
          American, Air Canada, WestJet, and Virgin Australia all restrict travel at this point
          without explicit written approval. Do not book a flight at 36 weeks without direct
          written clearance from both your airline and your OB.
        </p>

        <h2>Flying while pregnant in months — week converter</h2>
        <p>
          Airline policies are written in gestational weeks, but many women think about pregnancy
          in months. Here is how the key restriction thresholds map to calendar months:
        </p>
        <ul style={{ paddingLeft: 'var(--space-md)', color: 'var(--charcoal)' }}>
          <li style={{ marginBottom: '6px' }}>
            <strong>5 months pregnant</strong> = approximately weeks 18–22 — no airline
            restrictions apply
          </li>
          <li style={{ marginBottom: '6px' }}>
            <strong>6 months pregnant</strong> = approximately weeks 22–26 — no restrictions, but
            get your doctor's letter ready if flying near the end of this month
          </li>
          <li style={{ marginBottom: '6px' }}>
            <strong>7 months pregnant</strong> = approximately weeks 27–31 — most carriers
            require a doctor's letter in this window
          </li>
          <li style={{ marginBottom: '6px' }}>
            <strong>8 months pregnant</strong> = approximately weeks 31–35 — you are in the
            active restriction zone; letter required on almost all carriers
          </li>
          <li style={{ marginBottom: '6px' }}>
            <strong>9 months pregnant</strong> = approximately weeks 36–40 — most airlines will
            not permit travel without explicit written airline approval
          </li>
        </ul>

        <h2>What does a doctor's fit-to-fly letter for pregnancy contain?</h2>
        <p>
          A fit-to-fly letter (also called a medical certificate for travel) is a signed document
          from your OB, midwife, or GP that airlines use to confirm you are safe to board. Most
          carriers require it to include: your full name, your expected due date, your current
          gestational age as of the travel date, confirmation that your pregnancy is uncomplicated
          and you are fit to fly, and the date the letter was written. Some airlines (Emirates,
          Etihad, Virgin Atlantic) specify the letter must be dated within 10 days of your
          outbound travel date, so do not get it too early.
        </p>
        <p>
          Ask your OB or midwife specifically for a "fit-to-fly certificate" or "medical
          certificate for air travel during pregnancy" — they will know what is needed. US
          carriers do not formally require this but having one is good practice in the third
          trimester in case of gate queries. Keep a digital copy on your phone as well as a
          printed version.
        </p>

        <h2>Long-haul flights while pregnant: extra considerations</h2>
        <p>
          ACOG specifically addresses long-haul flights (typically over 4 hours) as carrying
          higher DVT risk due to prolonged immobility. Blood volume increases significantly during
          pregnancy, raising clot risk. On flights over 4 hours, ACOG recommends wearing
          graduated compression stockings (15–30 mmHg), walking the aisle every 1–2 hours,
          performing calf exercises in your seat, and staying well hydrated. Aisle seating makes
          movement easier and is strongly recommended in the third trimester.
        </p>
        <p>
          Flights over 8 hours (transcontinental and long-haul international) warrant additional
          discussion with your OB regardless of gestational week, particularly if you have any
          history of clotting disorders, varicose veins, or are carrying multiples. Some airlines
          impose stricter letter requirements for long-haul routes at certain gestational ages —
          always check route-specific policy, not just the airline's general pregnancy page.
        </p>

        <h2>Destination considerations when flying pregnant</h2>
        <p>
          Beyond the flight itself, your destination matters. ACOG advises pregnant women to avoid
          travel to areas with active Zika virus transmission, as Zika is linked to serious fetal
          complications. The CDC maintains an up-to-date Zika travel advisory list. When
          travelling internationally, also consider: the quality of obstetric emergency care at
          your destination, travel insurance that explicitly covers pregnancy complications and
          premature labour abroad, and the local availability of your blood type if required.
        </p>
        <p>
          Travel to destinations at high altitude (above 8,000 feet / 2,400 metres) may also
          reduce fetal oxygen delivery and should be discussed with your OB in advance.
        </p>

        <h2>Airline-specific pregnancy policies</h2>

        <h3>British Airways pregnancy policy</h3>
        <p>
          British Airways permits travel up to the end of 36 weeks for uncomplicated single
          pregnancies. A doctor's letter is required from 28 weeks confirming your expected due
          date and that you are fit to fly. The letter must be produced at check-in. Passengers
          with multiple pregnancies (twins or more) should confirm restrictions directly with BA
          as policies may differ.
        </p>

        <h3>Emirates pregnancy policy</h3>
        <p>
          Emirates requires a medical fitness certificate from the start of the 29th week of
          pregnancy. Travel is not permitted at 36 weeks or beyond. The certificate must state
          gestational age and confirm there are no complications. Emirates recommends contacting
          their medical desk directly for any complex cases.
        </p>

        <h3>Qatar Airways pregnancy policy</h3>
        <p>
          Qatar Airways requires a medical fitness certificate from 28 weeks. Travel is not
          permitted at 36 weeks or beyond on any route. Qatar specifically states that the
          certificate must include the expected date of delivery and confirmation that the
          pregnancy is uncomplicated.
        </p>

        <h3>Etihad Airways pregnancy policy</h3>
        <p>
          Etihad requires a medical fitness certificate from 29 weeks, dated within 10 days of
          the travel date. Travel is not permitted at 36 weeks or beyond. For multiple
          pregnancies Etihad may impose earlier restrictions — check directly.
        </p>

        <h3>Qantas pregnancy policy</h3>
        <p>
          Qantas permits domestic Australian travel up to 36 weeks. For international travel the
          limit is 35 weeks. A medical certificate is required from 28 weeks for international
          routes. Qantas recommends consulting your doctor before flying after 28 weeks for any
          route.
        </p>

        <h3>Lufthansa pregnancy policy</h3>
        <p>
          Lufthansa requires a medical certificate from the beginning of the 29th week of
          pregnancy for all routes. Travel is restricted at 36 weeks or beyond. The certificate
          must confirm current gestational age and that the pregnancy is proceeding without
          complications.
        </p>

        <h3>Air Canada pregnancy policy</h3>
        <p>
          Air Canada does not impose a formal doctor's letter requirement but strongly recommends
          consulting a physician before flying in the third trimester. Travel is restricted at 36
          weeks. Air Canada advises passengers to carry their medical records when travelling
          beyond 28 weeks.
        </p>

        <h3>easyJet pregnancy policy</h3>
        <p>
          easyJet restricts travel from 35 weeks — one week earlier than most other carriers. A
          doctor's letter is required from 28 weeks. This stricter cut-off makes easyJet one of
          the earliest-restricting major European carriers. If your travel date falls close to
          week 35, confirm with easyJet directly before booking.
        </p>

        <h2>How does this pregnancy flight calculator work?</h2>
        <p>
          The calculator counts the exact number of days between your LMP date and your planned
          flight date, converts that to gestational weeks and days, then applies ACOG safety
          guidance thresholds. The airline table is colour-coded based on your result: green rows
          are airlines where your gestational week is within their safe window, amber rows
          indicate you are approaching their letter requirement or restriction threshold, and red
          rows indicate you are at or past their limit.
        </p>

        <h2>When do airlines restrict pregnant passengers?</h2>
        <p>
          Most carriers begin documentation checks at 28–29 weeks and impose hard travel
          restrictions at 36 weeks. The main exceptions are easyJet (35 weeks) and Qantas for
          international routes (35 weeks). US domestic carriers (United, Delta, American, Alaska)
          are the most lenient — they do not require a formal letter, though they restrict at 36
          weeks like everyone else. For any flight in the third trimester, always verify the
          specific policy with your airline before booking — policies are updated regularly and
          route-specific rules can differ from the general policy page.
        </p>

        <p>
          Track your full pregnancy timeline with our{' '}
          <Link to="/pregnancy-due-date-calculator" style={{ color: 'var(--sage-primary)' }}>
            pregnancy due date calculator
          </Link>
          , or check what is happening with your baby right now in our{' '}
          <Link to="/pregnancy-week-by-week" style={{ color: 'var(--sage-primary)' }}>
            week-by-week pregnancy guide
          </Link>
          .
        </p>

        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-tertiary)',
            marginTop: 'var(--space-md)',
          }}
        >
          Medical guidance based on:{' '}
          <a
            href="https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/08/air-travel-during-pregnancy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            ACOG Committee Opinion #746 — Air Travel During Pregnancy (2018)
          </a>
          .{' '}
          DVT guidance:{' '}
          <a
            href="https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/07/thromboembolism-in-pregnancy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            ACOG Practice Bulletin #196 — Thromboembolism in Pregnancy (2018)
          </a>
          .{' '}
          Zika guidance:{' '}
          <a
            href="https://www.cdc.gov/zika/prevention/index.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            CDC Zika Virus Prevention
          </a>
          . For informational use only.
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
