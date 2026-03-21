import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { normalizeDate } from '../lib/calc';
import {
  calculateMorningSicknessTimeline,
  validateMorningSicknessInputs,
} from '../lib/morningSicknessCalc';

type FieldErrors = {
  lmp?: string;
};

const FAQ_ITEMS = [
  {
    question: 'Does morning sickness end at exactly 12 weeks?',
    answer:
      'Not for everyone. About 50% of women find nausea improves by week 12, and around 90% see it resolve by week 14. A small percentage experience nausea throughout pregnancy. This estimator shows the most likely window for your specific LMP date.',
  },
  {
    question: 'Why is week 9 the worst for morning sickness?',
    answer:
      'hCG (human chorionic gonadotropin), the hormone primarily responsible for pregnancy nausea, typically peaks around week 9–10 of pregnancy. As hCG levels start to plateau and then decline after this peak, most women notice gradual improvement in nausea symptoms.',
  },
  {
    question: 'Can morning sickness last all 9 months of pregnancy?',
    answer:
      'In rare cases, yes. A condition called hyperemesis gravidarum affects approximately 0.3–3% of pregnancies and can cause severe nausea and vomiting throughout pregnancy. If you are vomiting multiple times daily and cannot keep fluids down, contact your healthcare provider promptly.',
  },
  {
    question: 'Does this estimator work if I have an irregular cycle?',
    answer:
      'This tool uses your LMP date and standard gestational age calculations. If your cycles are irregular or you have a known conception date, the estimates may vary by a week or two. Your midwife or OB can give a more precise timeline based on your ultrasound dating.',
  },
  {
    question: 'Is morning sickness a sign of a healthy pregnancy?',
    answer:
      'Some studies suggest a correlation between nausea and lower miscarriage rates, but the absence of morning sickness does not indicate a problem. Many women have entirely healthy pregnancies with no nausea at all. This tool is for planning and reassurance, not for assessing pregnancy health.',
  },
  {
    question: 'What can I do to feel better while waiting for morning sickness to end?',
    answer:
      'Common evidence-supported strategies include eating small, frequent meals, avoiding an empty stomach, ginger in any form, vitamin B6 (pyridoxine), and staying hydrated. Talk to your provider before starting any supplements or medications.',
  },
];

// Milestone days from LMP
const TIMELINE_MILESTONES = [
  { label: 'Nausea begins', week: 'Week 6', day: 42, highlight: false },
  { label: 'Nausea peak', week: 'Week 9', day: 63, highlight: false },
  { label: 'Likely end — 50% of women', week: 'Week 12', day: 84, highlight: true },
  { label: 'Expected end — 90% of women', week: 'Week 14', day: 98, highlight: true },
  { label: 'Outer bound', week: 'Week 20', day: 140, highlight: false },
];

// Progress bar: week 6 (day 42) → week 20 (day 140)
const PROGRESS_START_DAY = 42;
const PROGRESS_END_DAY = 140;
const PROGRESS_WINDOW = PROGRESS_END_DAY - PROGRESS_START_DAY; // 98 days

// Relief zone: week 12 (day 84) → week 14 (day 98) within the window
const RELIEF_ZONE_LEFT_PCT = ((84 - PROGRESS_START_DAY) / PROGRESS_WINDOW) * 100; // 42.86%
const RELIEF_ZONE_WIDTH_PCT = ((98 - 84) / PROGRESS_WINDOW) * 100; // 14.29%

interface StatusInfo {
  emoji: string;
  message: string;
}

const getStatusInfo = (week: number): StatusInfo => {
  if (week < 6)
    return {
      emoji: '🌱',
      message:
        "Nausea hasn't started yet for most women — here's your timeline so you know what to expect.",
    };
  if (week < 9)
    return {
      emoji: '🌊',
      message:
        'You are in the early nausea phase. The peak is approaching — week 9 is typically the most intense.',
    };
  if (week < 12)
    return {
      emoji: '🌤',
      message:
        'You are past peak nausea. Relief is on the horizon — most women improve significantly around week 12.',
    };
  if (week < 14)
    return {
      emoji: '☀️',
      message:
        'You are in the most likely relief window right now. Many women feel much better by this point.',
    };
  return {
    emoji: '🌸',
    message:
      'Most women feel significantly better by now. If nausea persists, speak to your healthcare provider.',
  };
};

const toInputDate = (value: Date): string => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate = (value: Date): string =>
  value.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const MorningSicknessEstimatorPage = () => {
  const [lmp, setLmp] = useState(() => toInputDate(normalizeDate(new Date())));
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({ lmp: false });

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};
    if (!lmp) {
      next.lmp = 'Enter your LMP date.';
      return next;
    }
    const validation = validateMorningSicknessInputs(new Date(lmp));
    const lmpError = validation.errors.find((e) =>
      e.toLowerCase().includes('last menstrual period'),
    );
    if (lmpError) next.lmp = lmpError;
    return next;
  }, [lmp]);

  const showLmpError = Boolean(errors.lmp) && (touched.lmp || hasSubmitted);

  const result = useMemo(() => {
    if (!lmp || errors.lmp) return null;
    return calculateMorningSicknessTimeline(new Date(lmp));
  }, [lmp, errors.lmp]);

  // Total gestational days (used for timeline + progress)
  const currentDay = useMemo(() => {
    if (!result) return 0;
    return result.gestationalWeek * 7 + result.gestationalDays;
  }, [result]);

  // Days until week-12 likely end (negative = already past)
  const countdownDays = useMemo(() => {
    if (!result) return null;
    const today = normalizeDate(new Date());
    return Math.round((result.likelyEnd.getTime() - today.getTime()) / 86_400_000);
  }, [result]);

  // Progress bar fill % clamped to [0, 100]
  const progressPct = useMemo(() => {
    if (!result) return null;
    const clamped = Math.min(Math.max(currentDay, PROGRESS_START_DAY), PROGRESS_END_DAY);
    return Math.round(((clamped - PROGRESS_START_DAY) / PROGRESS_WINDOW) * 100);
  }, [result, currentDay]);

  // Index after which to insert the "You are here" marker
  // = number of milestones whose day <= currentDay
  const youAreHereAfterIndex = useMemo(
    () => TIMELINE_MILESTONES.filter((m) => currentDay >= m.day).length,
    [currentDay],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched({ lmp: true });
  };

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Morning Sickness End Date Estimator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        url: 'https://sagenesthealth.com/morning-sickness-end-date-estimator',
        description:
          'Find out when your morning sickness will likely end. Enter your LMP to get your personalized nausea peak date and expected end date, based on ACOG guidelines. Free, no signup required.',
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
        name: 'How to estimate when your morning sickness will end',
        description:
          'Use your LMP date to calculate your personalised nausea timeline including start, peak, and likely end date.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Enter your LMP date',
            text: 'Find the first day of your last menstrual period and enter it into the date field.',
          },
          {
            '@type': 'HowToStep',
            name: 'Submit the form',
            text: 'Click the estimate button to generate your personalised morning sickness timeline.',
          },
          {
            '@type': 'HowToStep',
            name: 'Review your timeline',
            text: 'See your personalised nausea start date, peak week, likely end date, and progress through the nausea window.',
          },
        ],
      },
    ],
    [],
  );

  // Derived status info — only compute when result exists
  const statusInfo = result ? getStatusInfo(result.gestationalWeek) : null;

  // ─── Inline style helpers ───────────────────────────────────────────────────

  const youAreHerePill: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8125rem',
    fontWeight: 700,
    color: 'var(--sage-primary)',
    background: 'var(--sage-softest)',
    border: '1px solid var(--sage-light)',
    borderRadius: 'var(--radius-pill)',
    padding: '3px 12px',
  };

  const timelineDotBase: React.CSSProperties = {
    position: 'absolute',
    left: '-2.25rem',
    top: '6px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    zIndex: 1,
  };

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="When Does Morning Sickness End? — Free Estimator by Week"
        description="Find out exactly when your morning sickness will likely end. Enter your LMP date to get your nausea peak week, likely end date, and week-by-week breakdown. Based on ACOG guidelines."
        canonicalPath="/morning-sickness-end-date-estimator"
        jsonLd={jsonLd}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Free morning sickness end date estimate</div>
        </div>
        <h1 className="hero-title">
          When Does <span>Morning Sickness End?</span>
        </h1>
        <p className="hero-description">
          Enter your last menstrual period (LMP) date to estimate exactly when your nausea will
          start, peak, and end — with a personalised week-by-week timeline based on ACOG
          gestational guidelines.
        </p>
      </section>

      {/* ── Input card ───────────────────────────────────────────────────── */}
      <div className="calculator-card" aria-labelledby="form-title">
        <div className="calculator-header">
          <h2 id="form-title" className="calculator-title">
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
              max={toInputDate(normalizeDate(new Date()))}
              onChange={(e) => setLmp(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, lmp: true }))}
              aria-invalid={showLmpError}
              aria-describedby={showLmpError ? 'lmp-error' : undefined}
            />
            <p className="field-help">Use the first day of bleeding from your last period.</p>
            {showLmpError && (
              <p className="error" id="lmp-error" role="alert">
                {errors.lmp}
              </p>
            )}
          </div>

          <button type="submit">Estimate morning sickness end date</button>
        </form>
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      <section
        className="results-card"
        aria-live="polite"
        aria-labelledby="results-heading"
      >
        <h2 id="results-heading">Your Result</h2>

        {hasSubmitted && result && statusInfo ? (
          <>
            {/* 1. Contextual status banner */}
            <div
              style={{
                background: 'var(--sand)',
                border: '1px solid var(--border-hairline)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-md)',
                marginBottom: 'var(--space-md)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-sm)',
              }}
            >
              <span style={{ fontSize: '1.5rem', lineHeight: 1, flexShrink: 0 }}>
                {statusInfo.emoji}
              </span>
              <div>
                <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: 'var(--charcoal)' }}>
                  You are currently at{' '}
                  <strong>
                    Week {result.gestationalWeek}
                  </strong>{' '}
                  ({result.gestationalWeek}w {result.gestationalDays}d)
                </p>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                  {statusInfo.message}
                </p>
              </div>
            </div>

            {/* 2. Countdown to week-12 relief */}
            {countdownDays !== null && (
              <div
                style={{
                  background: countdownDays <= 0 ? 'var(--sage-softest)' : 'var(--off-white)',
                  border: `1px solid ${countdownDays <= 0 ? 'var(--sage-light)' : 'var(--border-hairline)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-md)',
                  marginBottom: 'var(--space-md)',
                  textAlign: 'center',
                }}
              >
                {countdownDays > 0 ? (
                  <>
                    <p
                      style={{
                        margin: '0 0 var(--space-xs) 0',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Days until likely relief (week 12)
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '3rem',
                        fontWeight: 800,
                        color: 'var(--sage-primary)',
                        lineHeight: 1,
                      }}
                    >
                      {countdownDays}
                    </p>
                    <p
                      style={{
                        margin: 'var(--space-xs) 0 0 0',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      days to go &mdash; {formatDate(result.likelyEnd)}
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      style={{
                        margin: '0 0 var(--space-xs) 0',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Week 12 milestone
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '1.375rem',
                        fontWeight: 700,
                        color: 'var(--sage-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      {countdownDays === 0
                        ? 'Today is your week 12 milestone 🎉'
                        : `You passed it ${Math.abs(countdownDays)} day${Math.abs(countdownDays) !== 1 ? 's' : ''} ago 🎉`}
                    </p>
                    <p
                      style={{
                        margin: 'var(--space-xs) 0 0 0',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      Week 12 was {formatDate(result.likelyEnd)}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* 3. Progress bar through nausea window */}
            {progressPct !== null && (
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-tertiary)',
                      fontWeight: 600,
                    }}
                  >
                    Wk 6 — Nausea begins
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-tertiary)',
                      fontWeight: 600,
                    }}
                  >
                    Wk 20 — Outer bound
                  </span>
                </div>

                {/* Track */}
                <div
                  style={{
                    position: 'relative',
                    height: '14px',
                    background: 'var(--border-hairline)',
                    borderRadius: 'var(--radius-pill)',
                    overflow: 'visible',
                  }}
                >
                  {/* Relief zone (wk 12–14) shaded */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${RELIEF_ZONE_LEFT_PCT}%`,
                      width: `${RELIEF_ZONE_WIDTH_PCT}%`,
                      top: 0,
                      height: '100%',
                      background: 'var(--sage-light)',
                      opacity: 0.6,
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Fill */}
                  <div
                    style={{
                      height: '100%',
                      width: `${progressPct}%`,
                      background: 'var(--sage-primary)',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  />
                  {/* Thumb */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: `${progressPct}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '22px',
                      height: '22px',
                      background: 'var(--sage-primary)',
                      border: '3px solid var(--off-white)',
                      borderRadius: '50%',
                      boxShadow: 'var(--shadow-soft)',
                      zIndex: 2,
                    }}
                  />
                </div>
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    marginTop: '6px',
                    marginBottom: 0,
                  }}
                >
                  Shaded zone marks the most likely relief window (weeks 12–14)
                </p>
              </div>
            )}

            {/* 4. Visual vertical timeline */}
            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <p
                style={{
                  fontWeight: 700,
                  color: 'var(--charcoal)',
                  marginTop: 0,
                  marginBottom: 'var(--space-sm)',
                  fontSize: '0.9375rem',
                }}
              >
                Your personalised nausea timeline
              </p>

              <div style={{ position: 'relative', paddingLeft: '2.25rem' }}>
                {/* Vertical connector */}
                <div
                  style={{
                    position: 'absolute',
                    left: '0.55rem',
                    top: '10px',
                    bottom: '10px',
                    width: '2px',
                    background: 'var(--border-hairline)',
                  }}
                />

                {/* "You are here" before index 0 (before week 6) */}
                {youAreHereAfterIndex === 0 && (
                  <div style={{ marginBottom: 'var(--space-xs)', position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '-2.25rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '14px',
                        height: '14px',
                        background: 'var(--sage-primary)',
                        border: '3px solid var(--off-white)',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 2px var(--sage-primary)',
                        zIndex: 3,
                      }}
                    />
                    <span style={youAreHerePill}>
                      📍 You are here — Week {result.gestationalWeek}
                    </span>
                  </div>
                )}

                {TIMELINE_MILESTONES.map((milestone, index) => {
                  const isPast = currentDay >= milestone.day;
                  const dates = [
                    result.nauseaStart,
                    result.nauseaPeak,
                    result.likelyEnd,
                    result.expectedEnd,
                    result.outerBound,
                  ];

                  return (
                    <div key={milestone.label}>
                      {/* Milestone row */}
                      <div
                        style={{
                          position: 'relative',
                          marginBottom: 'var(--space-xs)',
                        }}
                      >
                        {/* Dot */}
                        <div
                          style={{
                            ...timelineDotBase,
                            background: isPast
                              ? 'var(--sage-primary)'
                              : 'var(--off-white)',
                            border: `2px solid ${isPast ? 'var(--sage-primary)' : 'var(--border-subtle)'}`,
                          }}
                        />
                        {/* Content */}
                        <div
                          style={{
                            padding: 'var(--space-xs) var(--space-sm)',
                            background: milestone.highlight
                              ? 'var(--sage-softest)'
                              : 'transparent',
                            border: milestone.highlight
                              ? '1px solid var(--sage-light)'
                              : '1px solid transparent',
                            borderRadius: 'var(--radius-xs)',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'baseline',
                              flexWrap: 'wrap',
                              gap: '4px',
                            }}
                          >
                            <span
                              style={{
                                fontWeight: milestone.highlight ? 700 : 500,
                                color: milestone.highlight
                                  ? 'var(--charcoal)'
                                  : 'var(--text-secondary)',
                                fontSize: '0.9375rem',
                              }}
                            >
                              {milestone.label}
                            </span>
                            <span
                              style={{
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                color: isPast
                                  ? 'var(--sage-primary)'
                                  : 'var(--text-tertiary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                              }}
                            >
                              {milestone.week}
                            </span>
                          </div>
                          <div
                            style={{
                              marginTop: '2px',
                              fontSize: milestone.highlight ? '1rem' : '0.875rem',
                              fontWeight: milestone.highlight ? 600 : 400,
                              color: milestone.highlight
                                ? 'var(--charcoal)'
                                : 'var(--text-secondary)',
                            }}
                          >
                            {formatDate(dates[index])}
                          </div>
                        </div>
                      </div>

                      {/* "You are here" inserted AFTER this milestone if applicable */}
                      {youAreHereAfterIndex === index + 1 &&
                        index < TIMELINE_MILESTONES.length - 1 && (
                          <div
                            style={{
                              marginBottom: 'var(--space-xs)',
                              position: 'relative',
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                left: '-2.25rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '14px',
                                height: '14px',
                                background: 'var(--sage-primary)',
                                border: '3px solid var(--off-white)',
                                borderRadius: '50%',
                                boxShadow: '0 0 0 2px var(--sage-primary)',
                                zIndex: 3,
                              }}
                            />
                            <span style={youAreHerePill}>
                              📍 You are here — Week {result.gestationalWeek}
                            </span>
                          </div>
                        )}
                    </div>
                  );
                })}

                {/* "You are here" after the last milestone (week 20+) */}
                {youAreHereAfterIndex >= TIMELINE_MILESTONES.length && (
                  <div style={{ position: 'relative', marginTop: 'var(--space-xs)' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '-2.25rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '14px',
                        height: '14px',
                        background: 'var(--sage-primary)',
                        border: '3px solid var(--off-white)',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 2px var(--sage-primary)',
                        zIndex: 3,
                      }}
                    />
                    <span style={youAreHerePill}>
                      📍 You are here — Week {result.gestationalWeek}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Reassurance note */}
            <div
              style={{
                background: 'var(--sand)',
                borderRadius: 'var(--radius-xs)',
                padding: 'var(--space-sm) var(--space-md)',
                border: '1px solid var(--border-hairline)',
                marginBottom: 'var(--space-md)',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.9375rem' }}>
                <strong>Note:</strong> Most women see significant improvement around week 12. Every
                pregnancy is different — use these dates as a guide, not a guarantee.
              </p>
            </div>

            {/* Internal link 1 — related tool */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <p style={{ marginBottom: 'var(--space-xs)' }}>Want your full pregnancy timeline?</p>
              <Link
                to="/pregnancy-due-date-calculator"
                style={{ color: 'var(--sage-primary)', fontWeight: 600 }}
              >
                Calculate your full pregnancy due date →
              </Link>
            </div>

            {/* Source citation in results */}
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-tertiary)',
                marginTop: 'var(--space-md)',
                marginBottom: 0,
              }}
            >
              Source:{' '}
              <a
                href="https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/01/nausea-and-vomiting-of-pregnancy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
              >
                ACOG Practice Bulletin #189 — Nausea and Vomiting of Pregnancy
              </a>
              . For informational use only.
            </p>
          </>
        ) : (
          <p>Submit your details above to see your personalized estimate.</p>
        )}
      </section>

      {/* ── Educational content ──────────────────────────────────────────── */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="edu-heading"
      >
        <h2 id="edu-heading">When does morning sickness end?</h2>
        <p>
          For most women, morning sickness ends between weeks 12 and 14 of pregnancy. Around 50%
          of pregnant women find their nausea improves significantly by the end of week 12, and
          about 90% feel better by week 14. A small percentage — roughly 1 in 10 — continue to
          have symptoms past 14 weeks, and a rare few experience nausea throughout their entire
          pregnancy.
        </p>
        <p>
          The tool above calculates these milestones from your personal LMP date, giving you real
          calendar dates rather than vague ranges.
        </p>

        <h2>How long does morning sickness typically last?</h2>
        <p>
          Morning sickness usually begins around week 6 and lasts approximately 6 to 8 weeks for
          most women. That puts the typical duration between week 6 and week 12–14. In total, most
          pregnancies involve about 6 to 10 weeks of nausea.
        </p>
        <p>
          If your symptoms began earlier (some women notice nausea as early as week 4–5) or
          started later, the duration is roughly the same — the window just shifts slightly.
        </p>

        <h2>Morning sickness by week</h2>

        <h3>Weeks 4–5: Before nausea begins</h3>
        <p>
          Most women do not experience nausea this early, though some notice food aversions or
          mild queasiness. hCG levels are rising but not yet high enough to trigger significant
          symptoms in most pregnancies.
        </p>

        <h3>Week 6: Nausea usually starts</h3>
        <p>
          Week 6 is when morning sickness typically kicks in. Nausea may come in waves, often
          triggered by specific smells, an empty stomach, or fatigue. This coincides with a rapid
          rise in hCG (human chorionic gonadotropin).
        </p>

        <h3>Weeks 7–8: Symptoms intensify</h3>
        <p>
          Nausea often worsens through weeks 7 and 8 as hCG continues to rise. Many women find
          they need to eat small amounts frequently to avoid the empty-stomach nausea that
          intensifies symptoms.
        </p>

        <h3>Week 9: The peak of morning sickness</h3>
        <p>
          Week 9 is widely recognised as the worst week for morning sickness. hCG levels reach
          their highest point around weeks 9–10, which correlates with peak nausea severity. If
          you are struggling at week 9, you are likely at or near the worst of it.
        </p>

        <h3>Weeks 10–11: Plateau phase</h3>
        <p>
          hCG begins to level off and then gradually decline after week 10. Many women notice that
          while nausea is still present, it may not be getting significantly worse. This is a
          promising sign.
        </p>

        <h3>Week 12: Likely relief for most women</h3>
        <p>
          This is the milestone that most pregnancy resources point to — and for good reason.
          Approximately 50% of women see major improvement by the end of week 12. If you pass week
          12 and still feel unwell, that is entirely normal and does not indicate a problem.
        </p>

        <h3>Weeks 13–14: Relief for 90% of women</h3>
        <p>
          By week 14, roughly 9 in 10 women have seen their nausea resolve or reduce to a
          manageable level. The second trimester typically brings a noticeable shift in energy and
          appetite.
        </p>

        <h3>Week 20 and beyond</h3>
        <p>
          A small percentage of women have nausea that extends into the second half of pregnancy.
          If this applies to you, speak to your midwife or OB — there are safe medical options
          available, including vitamin B6 and certain antiemetics.
        </p>

        <h2>What are the signs that morning sickness is ending?</h2>
        <p>
          Common signs that nausea is improving include: waking up less nauseated in the morning,
          being able to eat a larger variety of foods, noticing that certain smell triggers no
          longer bother you, and having longer stretches of the day where you feel relatively
          normal. These improvements often come gradually rather than all at once.
        </p>

        <h2>Why is morning sickness worse in the morning?</h2>
        <p>
          Despite the name, morning sickness can strike at any time of day — and for many women it
          is worst in the evenings. The reason it is called "morning sickness" is that nausea is
          often most intense on an empty stomach, which for many people means right after waking.
          Keeping a small snack (like crackers) by the bed to eat before getting up can help
          reduce that first wave of nausea.
        </p>

        <h2>How does this morning sickness estimator work?</h2>
        <p>
          This tool estimates key nausea milestones from your LMP date using standard gestational
          age timing aligned with ACOG guidelines. It calculates the number of gestational days
          from your LMP to today, then maps your current position against the typical nausea
          timeline — showing you where you are relative to the start, peak, likely end, and outer
          bound of morning sickness.
        </p>
        <p>
          All calculations run entirely in your browser. Nothing you enter is stored or
          transmitted.
        </p>

        <h2>When should you talk to your doctor about nausea in pregnancy?</h2>
        <p>
          Reach out if you cannot keep fluids down, feel dizzy or lightheaded, notice weight loss,
          or vomit multiple times throughout the day. These can be signs of hyperemesis gravidarum,
          a more serious condition that affects approximately 0.3–3% of pregnancies and requires
          medical support. Do not wait for week 12 if symptoms are severe.
        </p>

        {/* Internal links */}
        <p>
          Track your full pregnancy journey with our{' '}
          <Link to="/pregnancy-due-date-calculator" style={{ color: 'var(--sage-primary)' }}>
            pregnancy due date calculator
          </Link>
          , or explore what is happening with your baby in our{' '}
          <Link to="/week-by-week" style={{ color: 'var(--sage-primary)' }}>
            week-by-week pregnancy guide
          </Link>
          .
        </p>

        {/* Source citation */}
        <p
          style={{
            fontSize: '0.8125rem',
            color: 'var(--text-tertiary)',
            marginTop: 'var(--space-md)',
          }}
        >
          Estimates based on:{' '}
          <a
            href="https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/01/nausea-and-vomiting-of-pregnancy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
          >
            ACOG Practice Bulletin #189 — Nausea and Vomiting of Pregnancy
          </a>
          . For informational use only.
        </p>
      </section>

      {/* ── Medical disclaimer ───────────────────────────────────────────── */}
      <p
        className="disclaimer"
        style={{ textAlign: 'left', marginTop: 'var(--space-lg)', maxWidth: 'unset' }}
      >
        <strong>Medical disclaimer:</strong> This tool is for educational use only and does not
        replace professional medical advice, diagnosis, or treatment.
      </p>

      {/* ── Privacy banner ───────────────────────────────────────────────── */}
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
          style={{ margin: 0, maxWidth: 'unset', textAlign: 'left', color: 'var(--sage-dark)' }}
        >
          <strong>Privacy:</strong> SageNest performs all calculations in your browser. We do not
          store your inputs or results.
        </p>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
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
    </main>
  );
};
