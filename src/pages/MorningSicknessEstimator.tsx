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
        title="When Does Morning Sickness End Calculator — Free Pregnancy Estimator"
        description="Find out when your morning sickness will likely end. Enter your LMP to get your personalized nausea peak date and expected end date, based on ACOG guidelines. Free, no signup required."
        canonicalPath="/morning-sickness-end-date-estimator"
        jsonLd={jsonLd}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Free morning sickness end date estimate</div>
        </div>
        <h1 className="hero-title">
          Morning Sickness <span>End Date Estimator</span>
        </h1>
        <p className="hero-description">
          When does morning sickness end? Use your LMP date to estimate when nausea may start,
          peak, and improve based on ACOG-aligned gestational timing.
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
        <h2 id="edu-heading">How does this morning sickness estimator work?</h2>
        <p>
          This tool estimates key nausea milestones from your LMP date using standard gestational
          age timing. It maps a likely nausea start, peak nausea week, and a resolution window
          based on obstetric guidance from ACOG.
        </p>

        <h2>When does morning sickness typically end in pregnancy?</h2>
        <p>
          Many women begin to improve around week 12, and most feel better by week 14. A smaller
          group can have symptoms that continue to week 20 or, rarely, throughout pregnancy. The
          decline in hCG levels after week 10 is the main driver of improvement for most women.
        </p>

        <h2>When should you talk to your doctor about nausea in pregnancy?</h2>
        <p>
          Reach out if you cannot keep fluids down, feel dizzy or lightheaded, notice weight loss,
          or vomit multiple times throughout the day. These can be signs of hyperemesis gravidarum,
          which requires medical support. Do not wait for week 12 if symptoms are severe.
        </p>

        {/* Internal link 2 — related blog post */}
        <p>
          Learn more in our guide to{' '}
          <a
            href="/blog/morning-sickness-remedies-that-actually-work"
            style={{ color: 'var(--sage-primary)' }}
          >
            morning sickness remedies that actually work
          </a>
          .
        </p>

        {/* Source citation in educational section */}
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
