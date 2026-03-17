import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DisclaimerBox } from '../components/DisclaimerBox';
import { SEOHead } from '../components/SEOHead';
import { addDays, normalizeDate } from '../lib/calc';
import {
  calculateColostrumHarvestingDates,
  validateColostrumHarvestingInputs,
} from '../lib/colostrumHarvestingCalc';

type FieldErrors = {
  dueDate?: string;
};

const FAQ_ITEMS = [
  {
    question: 'When should I start harvesting colostrum?',
    answer:
      'NHS guidance recommends starting antenatal colostrum harvesting at 36 weeks of pregnancy, which is typically 4 weeks before your estimated due date. Starting earlier is not generally advised unless your midwife or consultant specifically recommends it, as nipple stimulation before 36 weeks can stimulate contractions.',
  },
  {
    question: 'What is colostrum and why harvest it before birth?',
    answer:
      'Colostrum is the first milk your body produces, starting in pregnancy. It is highly concentrated in antibodies, growth factors, and nutrients. Harvesting it before birth means you have a supply ready if your baby needs extra feeding support in the first days — particularly useful for babies born to diabetic mothers, or those with a cleft lip or other feeding challenges.',
  },
  {
    question: 'How do I harvest colostrum at home?',
    answer:
      'Hand expression is the recommended method. After washing your hands, gently massage the breast toward the nipple in a rolling motion. Collect any drops in a sterile syringe (usually 1ml syringes available from pharmacies or midwife teams). Sessions of 5–10 minutes, 2–3 times per day, are typical. Your midwife will demonstrate the technique.',
  },
  {
    question: 'How much colostrum is normal to collect before birth?',
    answer:
      'Very small amounts are entirely normal — often just a few drops per session. Colostrum is extremely nutrient-dense, so even 1–2 ml is valuable for a newborn. The amount produced varies widely between women and is not an indicator of how much milk you will make after birth.',
  },
  {
    question: 'Is colostrum harvesting safe for all pregnancies?',
    answer:
      'No. Colostrum harvesting is not recommended if you have a history of preterm labor, cervical incompetence, or are carrying multiples, unless your consultant has specifically approved it. Nipple stimulation releases oxytocin, which can cause uterine contractions. Always discuss with your midwife before starting.',
  },
  {
    question: 'How do I store colostrum I collect before birth?',
    answer:
      'Colostrum can be stored in the fridge for up to 48 hours, or frozen for up to 6 months. Use sterile labelled syringes and store them flat in a sealed bag. When the time comes, bring your frozen syringes to the hospital in a cool bag — most maternity wards have freezers for patient milk.',
  },
];

const PREP_CHECKLIST = [
  { label: 'Ask your midwife to confirm colostrum harvesting is safe for your pregnancy' },
  { label: 'Obtain sterile 1 ml syringes (from your midwife team or pharmacy)' },
  { label: 'Wash hands thoroughly before each session' },
  { label: 'Label each syringe with your name and date collected' },
  { label: 'Store fresh colostrum in the fridge within 1 hour of collection' },
  { label: 'Pack frozen syringes in a cool bag for your hospital bag' },
  { label: 'Note your recommended start date in your pregnancy diary or phone' },
];

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

const formatDateShort = (value: Date): string =>
  value.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

// ─── Timeline — mobile-safe flex layout, no absolute label positioning ────────

const PregnancyTimeline = ({
  earliestStart,
  recommendedStart,
  dueDate,
  today,
}: {
  earliestStart: Date;
  recommendedStart: Date;
  dueDate: Date;
  today: Date;
}) => {
  const isPast = (d: Date) => today >= d;

  // Each milestone: label, sublabel, date, whether it's the "recommended" highlighted one
  const milestones = [
    {
      label: 'Today',
      sublabel: formatDateShort(today),
      date: today,
      isToday: true,
      isRecommended: false,
    },
    {
      label: 'Earliest',
      sublabel: '34 wks',
      date: earliestStart,
      isToday: false,
      isRecommended: false,
    },
    {
      label: 'Start',
      sublabel: '36 wks',
      date: recommendedStart,
      isToday: false,
      isRecommended: true,
    },
    {
      label: 'Due date',
      sublabel: formatDateShort(dueDate),
      date: dueDate,
      isToday: false,
      isRecommended: false,
    },
  ];

  // Harvest window % (recommended start → due date) for the coloured fill
  const totalMs = dueDate.getTime() - today.getTime();
  const safeTotal = Math.max(totalMs, 1);

  const pct = (d: Date) =>
    Math.min(100, Math.max(0, ((d.getTime() - today.getTime()) / safeTotal) * 100));

  const windowStartPct = isPast(recommendedStart) ? 0 : pct(recommendedStart);
  const isInWindow = today >= recommendedStart && today < dueDate;

  return (
    <div
      style={{
        marginTop: 'var(--space-lg)',
        background: 'var(--off-white)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md) var(--space-sm)',
      }}
      aria-label="Pregnancy harvesting timeline"
    >
      <p
        className="eyebrow"
        style={{ marginBottom: 'var(--space-lg)', textAlign: 'center' }}
      >
        Your harvesting timeline
      </p>

      {/*
        Flex row: 4 equal columns.
        Each column: top label → dot (on track) → bottom label.
        Labels for col 0 & 1 go above the track; col 2 & 3 go below.
        The track is a thin absolute line through the dot row.
      */}
      <div style={{ position: 'relative', padding: '0 4px' }}>
        {/* Track line — sits at vertical midpoint of the dot row (40px from top of this div) */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '40px',
            left: '4px',
            right: '4px',
            height: '5px',
            background: 'var(--border-hairline)',
            borderRadius: '3px',
            zIndex: 0,
          }}
        >
          {/* Harvest window highlight */}
          <div
            style={{
              position: 'absolute',
              left: `${windowStartPct}%`,
              right: '0%',
              top: 0,
              height: '100%',
              background: isInWindow ? 'var(--sage-primary)' : 'var(--sage-light)',
              borderRadius: '3px',
            }}
          />
        </div>

        {/* Milestone columns */}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {milestones.map((m, i) => {
            const dotSize = m.isRecommended ? 18 : 13;
            const dotBg = m.isToday
              ? 'var(--charcoal)'
              : isPast(m.date)
              ? 'var(--sage-primary)'
              : m.isRecommended
              ? 'var(--sage-primary)'
              : 'var(--off-white)';
            const dotBorder = m.isToday
              ? '2px solid var(--charcoal)'
              : m.isRecommended || isPast(m.date)
              ? '2px solid var(--sage-primary)'
              : '2px solid var(--border-subtle)';

            // Top labels: cols 0 & 1 (Today, Earliest)
            // Bottom labels: cols 2 & 3 (Start, Due date)
            const isTop = i < 2;

            return (
              <div
                key={m.label}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Top label area — fixed height so dot row aligns */}
                <div
                  style={{
                    height: '36px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingBottom: '4px',
                    textAlign: 'center',
                  }}
                >
                  {isTop && (
                    <>
                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: m.isRecommended ? 'var(--sage-dark)' : 'var(--text-secondary)',
                          lineHeight: 1.2,
                          display: 'block',
                        }}
                      >
                        {m.label}
                      </span>
                      <span
                        style={{
                          fontSize: '0.58rem',
                          color: 'var(--text-tertiary)',
                          lineHeight: 1.2,
                          display: 'block',
                          marginTop: '1px',
                        }}
                      >
                        {m.sublabel}
                      </span>
                    </>
                  )}
                </div>

                {/* Dot */}
                <div
                  aria-hidden="true"
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    borderRadius: '50%',
                    background: dotBg,
                    border: dotBorder,
                    flexShrink: 0,
                    boxShadow: m.isRecommended ? '0 0 0 3px var(--sage-softest)' : 'none',
                  }}
                />

                {/* Bottom label area */}
                <div
                  style={{
                    height: '44px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingTop: '4px',
                    textAlign: 'center',
                    padding: '4px 2px 0',
                  }}
                >
                  {!isTop && (
                    <>
                      <span
                        style={{
                          fontSize: '0.6rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: m.isRecommended ? 'var(--sage-dark)' : 'var(--text-secondary)',
                          lineHeight: 1.2,
                          display: 'block',
                        }}
                      >
                        {m.label}
                      </span>
                      <span
                        style={{
                          fontSize: '0.58rem',
                          color: 'var(--text-tertiary)',
                          lineHeight: 1.2,
                          display: 'block',
                          marginTop: '1px',
                        }}
                      >
                        {m.sublabel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-md)',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: 'var(--space-sm)',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-tertiary)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '20px',
              height: '4px',
              background: 'var(--sage-light)',
              borderRadius: '2px',
            }}
          />
          Harvest window
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-tertiary)',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--sage-primary)',
            }}
          />
          Key milestone
        </span>
      </div>
    </div>
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({
  daysUntilStart,
  today,
  dueDate,
}: {
  daysUntilStart: number;
  today: Date;
  dueDate: Date;
}) => {
  const isPastDue = today >= dueDate;
  const canStartNow = !isPastDue && daysUntilStart <= 0;
  const notYet = daysUntilStart > 0;

  const scheme = isPastDue
    ? {
        bg: 'var(--off-white)',
        border: 'var(--border-subtle)',
        iconBg: '#e0e0e0',
        iconColor: 'var(--text-tertiary)',
        labelColor: 'var(--text-tertiary)',
        countColor: 'var(--text-secondary)',
        icon: '✓',
        statusLabel: 'Past due date',
        message: 'Harvesting is no longer needed.',
      }
    : canStartNow
    ? {
        bg: 'var(--sage-softest)',
        border: 'var(--sage-light)',
        iconBg: 'var(--sage-primary)',
        iconColor: '#fff',
        labelColor: 'var(--sage-dark)',
        countColor: 'var(--sage-primary)',
        icon: '▶',
        statusLabel: 'You can start now',
        message:
          'You have reached 36 weeks. Begin colostrum harvesting after discussing with your midwife.',
      }
    : {
        bg: '#fffbf0',
        border: '#f0d080',
        iconBg: '#f5c842',
        iconColor: '#fff',
        labelColor: '#7a5c00',
        countColor: '#7a5c00',
        icon: '◷',
        statusLabel: 'Not yet — coming up',
        message: 'Your recommended start date is approaching. Mark it in your calendar.',
      };

  return (
    <div
      style={{
        background: scheme.bg,
        border: `1px solid ${scheme.border}`,
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-md)',
        marginTop: 'var(--space-md)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: scheme.iconBg,
          color: scheme.iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {scheme.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: '0 0 2px',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: scheme.labelColor,
          }}
        >
          {scheme.statusLabel}
        </p>
        {notYet && (
          <p
            className="meta-value"
            style={{ margin: '0 0 2px', color: scheme.countColor, lineHeight: 1.1 }}
          >
            {daysUntilStart}{' '}
            <span style={{ fontSize: '1rem', fontWeight: 400 }}>days to go</span>
          </p>
        )}
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {scheme.message}
        </p>
      </div>
    </div>
  );
};

// ─── Skeleton placeholder ─────────────────────────────────────────────────────

const ResultsSkeleton = () => (
  <div aria-hidden="true">
    <style>{`
      @keyframes sn-shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position:  400px 0; }
      }
      .sn-ghost {
        background: linear-gradient(90deg, var(--border-hairline) 25%, var(--off-white) 50%, var(--border-hairline) 75%);
        background-size: 800px 100%;
        animation: sn-shimmer 1.6s ease-in-out infinite;
        border-radius: var(--radius-xs);
      }
    `}</style>
    <div className="results-meta" style={{ marginBottom: 'var(--space-md)' }}>
      {[120, 140, 100, 80].map((w, i) => (
        <div className="meta-item" key={i}>
          <div className="sn-ghost" style={{ height: '12px', width: `${w * 0.5}px`, marginBottom: '8px' }} />
          <div className="sn-ghost" style={{ height: '22px', width: `${w}px` }} />
        </div>
      ))}
    </div>
    <div className="sn-ghost" style={{ height: '72px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }} />
    <div className="sn-ghost" style={{ height: '110px', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }} />
  </div>
);

// ─── Prep checklist ───────────────────────────────────────────────────────────

const PrepChecklist = () => (
  <div
    style={{
      background: 'var(--sage-softest)',
      border: '1px solid var(--sage-light)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-md)',
      marginTop: 'var(--space-md)',
    }}
  >
    <p className="eyebrow" style={{ marginBottom: 'var(--space-sm)', color: 'var(--sage-dark)' }}>
      What to prepare
    </p>
    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
      {PREP_CHECKLIST.map((item, i) => (
        <li
          key={i}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            padding: '6px 0',
            borderBottom:
              i < PREP_CHECKLIST.length - 1 ? '1px solid var(--sage-light)' : 'none',
          }}
        >
          <span
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              border: '1.5px solid var(--sage-primary)',
              flexShrink: 0,
              marginTop: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '2px',
                background: 'var(--sage-softest)',
              }}
            />
          </span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

export const ColostrumHarvestingCalculatorPage = () => {
  const [dueDate, setDueDate] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({ dueDate: false });

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Colostrum Harvesting Start Date Calculator',
        url: 'https://sagenesthealth.com/colostrum-harvesting-calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        description:
          'Find out exactly when to start harvesting colostrum before your due date. Enter your due date for your recommended start date, based on NHS antenatal expressing guidance. Free, no signup.',
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

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};
    if (!dueDate) {
      next.dueDate = 'Enter your due date.';
      return next;
    }
    const validation = validateColostrumHarvestingInputs(new Date(dueDate));
    const dueDateError = validation.errors.find((e) =>
      e.toLowerCase().includes('due date'),
    );
    if (dueDateError) next.dueDate = dueDateError;
    return next;
  }, [dueDate]);

  const showDueDateError = Boolean(errors.dueDate) && (touched.dueDate || hasSubmitted);

  const result = useMemo(() => {
    if (!dueDate || errors.dueDate) return null;
    return calculateColostrumHarvestingDates(new Date(dueDate));
  }, [dueDate, errors.dueDate]);

  const today = useMemo(() => normalizeDate(new Date()), []);
  const dueDateValue = result ? normalizeDate(result.collectionWindowEnd) : null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched({ dueDate: true });
  };

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Colostrum Harvesting Calculator — When to Start Antenatal Expression"
        description="Find out exactly when to start harvesting colostrum before your due date. Enter your due date for your recommended start date, based on NHS antenatal expressing guidance. Free, no signup."
        canonicalPath="/colostrum-harvesting-calculator"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Based on NHS antenatal guidance</div>
        </div>
        <h1 className="hero-title">
          Colostrum Harvesting <span>Start Date Calculator</span>
        </h1>
        <p className="hero-description">
          This colostrum harvesting calculator gives your recommended antenatal colostrum
          harvesting start date from your due date. Use it to plan when to start colostrum
          harvesting at 36 weeks.
        </p>
      </section>

      {/* Warning box — above calculator card */}
      <section
        style={{
          marginBottom: 'var(--space-lg)',
          background: '#fffbf0',
          border: '1px solid #f0d080',
          borderLeft: '4px solid #f5c842',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-md)',
        }}
        aria-label="Important safety warning"
      >
        <p style={{ marginBottom: 0, color: '#5a4200' }}>
          <strong>Important:</strong> Antenatal colostrum harvesting is not recommended before
          36 weeks without explicit midwife or consultant advice, as nipple stimulation can
          trigger uterine contractions. Always discuss with your midwife before starting.
        </p>
      </section>

      {/* Calculator card */}
      <div className="calculator-card" aria-labelledby="form-title">
        <div className="calculator-header">
          <h2 id="form-title" className="calculator-title">Enter Your Details</h2>
          <p className="calculator-subtitle">
            Find your antenatal colostrum harvesting start date in seconds.
          </p>
        </div>
        <form noValidate onSubmit={onSubmit}>
          <div className="field-row">
            <label htmlFor="due-date">Estimated due date</label>
            <input
              id="due-date"
              type="date"
              value={dueDate}
              min={toInputDate(normalizeDate(new Date()))}
              max={toInputDate(addDays(normalizeDate(new Date()), 42 * 7))}
              onChange={(event) => setDueDate(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, dueDate: true }))}
              aria-invalid={showDueDateError}
              aria-describedby={showDueDateError ? 'due-date-error' : 'due-date-help'}
            />
            {showDueDateError ? (
              <p id="due-date-error" className="error" role="alert">
                {errors.dueDate}
              </p>
            ) : (
              <p id="due-date-help" className="field-help">
                Enter a due date from today up to 42 weeks ahead.{' '}
                <Link
                  to="/pregnancy-due-date-calculator"
                  style={{ color: 'var(--sage-primary)', fontWeight: 500 }}
                >
                  Don't know your due date yet? Find it here →
                </Link>
              </p>
            )}
          </div>
          <button type="submit">Calculate start date</button>
        </form>
      </div>

      {/* Results card */}
      <section
        className="results-card"
        aria-live="polite"
        aria-labelledby="results-heading"
      >
        <h2 id="results-heading">Your Result</h2>

        {!hasSubmitted && (
          <>
            <ResultsSkeleton />
            <p style={{ marginTop: 'var(--space-md)', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
              Submit your due date above to see your personalized colostrum harvesting dates.
            </p>
          </>
        )}

        {hasSubmitted && result && dueDateValue ? (
          <>
            {/* Meta grid */}
            <div className="results-meta">
              <div className="meta-item">
                <p className="meta-label">Recommended start</p>
                <p className="meta-value">{formatDate(result.recommendedStart)}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Earliest start</p>
                <p className="meta-value">{formatDate(result.earliestStart)}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                  Midwife advice only
                </p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Collection window end</p>
                <p className="meta-value">{formatDate(result.collectionWindowEnd)}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Gestational week at start</p>
                <p className="meta-value">{result.gestationalWeekAtStart} weeks</p>
              </div>
            </div>

            {/* Status badge */}
            <StatusBadge
              daysUntilStart={result.daysUntilStart}
              today={today}
              dueDate={dueDateValue}
            />

            {/* Timeline — now mobile-safe */}
            <PregnancyTimeline
              earliestStart={result.earliestStart}
              recommendedStart={result.recommendedStart}
              dueDate={dueDateValue}
              today={today}
            />

            {/* Storage guidance */}
            <div
              style={{
                background: 'var(--sage-softest)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-md)',
                border: '1px solid var(--sage-light)',
                marginTop: 'var(--space-md)',
              }}
            >
              <p className="eyebrow" style={{ marginBottom: 'var(--space-xs)', color: 'var(--sage-dark)' }}>
                Storage guidance
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                <li style={{ marginBottom: '4px' }}>Fresh colostrum: store in fridge up to 48 hours.</li>
                <li style={{ marginBottom: '4px' }}>Frozen colostrum: store in freezer up to 6 months.</li>
                <li>Bring frozen colostrum to hospital in a cool bag.</li>
              </ul>
            </div>

            {/* Prep checklist */}
            <PrepChecklist />

            {/* Internal link — due date calculator */}
            <div style={{ marginTop: 'var(--space-md)' }}>
              <p style={{ marginBottom: 'var(--space-xs)' }}>Need to confirm dates first?</p>
              <Link
                to="/pregnancy-due-date-calculator"
                style={{ color: 'var(--sage-primary)', fontWeight: 600 }}
              >
                calculate your due date →
              </Link>
            </div>
          </>
        ) : (
          hasSubmitted && (
            <p>Please correct the errors above to see your personalized colostrum harvesting dates.</p>
          )
        )}
      </section>

      {/* Educational content */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)' }}
        aria-labelledby="edu-heading"
      >
        <h2 id="edu-heading">How does this colostrum harvesting calculator work?</h2>
        <p>
          We normalize your due date and subtract 28 days to give your recommended start date at
          36 weeks. We also show an earlier 34-week date (42 days before due date) for situations
          where your midwife or consultant has explicitly advised earlier expression.
        </p>

        <h2>When should you start harvesting colostrum during pregnancy?</h2>
        <p>
          For most pregnancies, the recommended antenatal colostrum harvesting start date is
          36 weeks. This balances preparedness with safety by avoiding unnecessary nipple
          stimulation earlier in pregnancy.
        </p>

        <h2>When should you talk to your midwife before starting colostrum harvesting?</h2>
        <p>
          Always check first if you have risk factors such as previous preterm labor, cervical
          concerns, bleeding, or a high-risk pregnancy. You can also review{' '}
          <Link to="/pregnancy-week-by-week" style={{ color: 'var(--sage-primary)' }}>
            what happens at 36 weeks of pregnancy
          </Link>{' '}
          before you begin.
        </p>
      </section>

      {/* Source citations */}
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-md)' }}>
        Source:{' '}
        <a
          href="https://www.nth.nhs.uk/resources/colostrum-harvesting/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
        >
          NHS — Antenatal expressing of colostrum
        </a>{' '}
        and{' '}
        <a
          href="https://www.southtees.nhs.uk/resources/expressing-colostrum-during-pregnancy-2/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
        >
          NHS — Expressing colostrum during pregnancy
        </a>
        . For informational use only.
      </p>

      {/* Medical disclaimer */}
      <p className="disclaimer" style={{ textAlign: 'left', marginTop: 'var(--space-lg)', maxWidth: 'unset' }}>
        <strong>Medical disclaimer:</strong> This tool is for educational use only and does not
        replace professional medical advice, diagnosis, or treatment.
      </p>

      {/* Privacy banner */}
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
        <p className="privacy" style={{ margin: 0, maxWidth: 'unset', textAlign: 'left', color: 'var(--sage-dark)' }}>
          <strong>Privacy:</strong> SageNest performs all calculations in your browser. We do
          not store your inputs or results.
        </p>
      </section>

      {/* FAQ */}
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

      <DisclaimerBox />
    </main>
  );
};
