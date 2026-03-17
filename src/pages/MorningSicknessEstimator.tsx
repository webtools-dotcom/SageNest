import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { normalizeDate } from '../lib/calc';
import { calculateMorningSicknessTimeline, validateMorningSicknessInputs } from '../lib/morningSicknessCalc';

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
    const lmpError = validation.errors.find((error) => error.toLowerCase().includes('last menstrual period'));
    if (lmpError) {
      next.lmp = lmpError;
    }

    return next;
  }, [lmp]);

  const showLmpError = Boolean(errors.lmp) && (touched.lmp || hasSubmitted);

  const result = useMemo(() => {
    if (!lmp || errors.lmp) {
      return null;
    }

    return calculateMorningSicknessTimeline(new Date(lmp));
  }, [lmp, errors.lmp]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched({ lmp: true });
  };

  const jsonLd = [
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
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="When Does Morning Sickness End Calculator — Free Pregnancy Estimator"
        description="Find out when your morning sickness will likely end. Enter your LMP to get your personalized nausea peak date and expected end date, based on ACOG guidelines. Free, no signup required."
        canonicalPath="/morning-sickness-end-date-estimator"
        jsonLd={jsonLd}
      />

      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Free morning sickness end date estimate</div>
        </div>
        <h1 className="hero-title">Morning Sickness <span>End Date Estimator</span></h1>
        <p className="hero-description">
          When does morning sickness end? Use your LMP date to estimate when nausea may start, peak, and improve based on ACOG-aligned gestational timing.
        </p>
      </section>

      <div className="calculator-card" aria-labelledby="form-title">
        <div className="calculator-header">
          <h2 id="form-title" className="calculator-title">Enter Your Details</h2>
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
              onChange={(event) => setLmp(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, lmp: true }))}
              aria-invalid={showLmpError}
              aria-describedby={showLmpError ? 'lmp-error' : undefined}
            />
            <p className="field-help">Use the first day of bleeding from your last period.</p>
            {showLmpError ? (
              <p className="error" id="lmp-error">{errors.lmp}</p>
            ) : null}
          </div>

          <button type="submit">Estimate morning sickness end date</button>
        </form>
      </div>

      <section className="results-card" aria-live="polite" aria-labelledby="results-heading">
        <h2 id="results-heading">Your Result</h2>
        {hasSubmitted && result ? (
          <>
            <p style={{ marginTop: 0 }}>
              Current gestational age: <strong>Week {result.gestationalWeek}</strong> ({result.gestationalWeek}w {result.gestationalDays}d)
            </p>
            <p style={{ marginBottom: 'var(--space-md)' }}>
              Most women see significant improvement around week 12.
            </p>

            <div className="results-meta">
              <article className="meta-item">
                <div className="meta-label">Nausea starts (week 6)</div>
                <div className="meta-value" style={{ fontSize: '1.15rem' }}>{formatDate(result.nauseaStart)}</div>
              </article>
              <article className="meta-item">
                <div className="meta-label">Nausea peak (week 9)</div>
                <div className="meta-value" style={{ fontSize: '1.15rem' }}>{formatDate(result.nauseaPeak)}</div>
              </article>
              <article className="meta-item" style={{ borderColor: 'var(--sage-primary)', boxShadow: '0 0 0 1px var(--sage-primary)' }}>
                <div className="meta-label">Likely end (week 12)</div>
                <div className="meta-value" style={{ fontSize: '1.15rem' }}>{formatDate(result.likelyEnd)}</div>
              </article>
              <article className="meta-item" style={{ borderColor: 'var(--sage-primary)', boxShadow: '0 0 0 1px var(--sage-primary)' }}>
                <div className="meta-label">Expected end (week 14)</div>
                <div className="meta-value" style={{ fontSize: '1.15rem' }}>{formatDate(result.expectedEnd)}</div>
              </article>
              <article className="meta-item">
                <div className="meta-label">Outer bound (week 20)</div>
                <div className="meta-value" style={{ fontSize: '1.15rem' }}>{formatDate(result.outerBound)}</div>
              </article>
            </div>

            <div style={{ marginTop: 'var(--space-md)' }}>
              <p style={{ marginBottom: 'var(--space-xs)' }}>Want your full pregnancy timeline?</p>
              <Link to="/pregnancy-due-date-calculator" style={{ color: 'var(--sage-primary)', fontWeight: 500 }}>
                Calculate your full pregnancy due date
              </Link>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-md)' }}>
              Source: ACOG Practice Bulletin #189 — Nausea and Vomiting of Pregnancy ({' '}
              <a
                href="https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/01/nausea-and-vomiting-of-pregnancy"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
              >
                acog.org
              </a>
              )
            </p>
          </>
        ) : (
          <p>Submit your details above to see your personalized estimate.</p>
        )}
      </section>

      <section className="content-section" style={{ marginTop: 'var(--space-xl)' }}>
        <h2>How does this morning sickness estimator work?</h2>
        <p>
          This tool estimates key nausea milestones from your LMP date using standard gestational age timing. It maps a likely nausea start, peak nausea week, and a resolution window based on obstetric guidance.
        </p>

        <h2>When does morning sickness typically end in pregnancy?</h2>
        <p>
          Many women begin to improve around week 12, and most feel better by week 14. A smaller group can have symptoms that continue to week 20 or, rarely, throughout pregnancy.
        </p>

        <h2>When should you talk to your doctor about nausea in pregnancy?</h2>
        <p>
          Reach out sooner if you cannot keep fluids down, feel dizzy, lose weight, or vomit frequently throughout the day. Severe persistent symptoms can indicate hyperemesis gravidarum and need medical support.
        </p>

        <p>
          Learn more with our guide to{' '}
          <a href="/blog/morning-sickness-remedies-that-actually-work" style={{ color: 'var(--sage-primary)' }}>
            morning sickness remedies that actually work
          </a>
          .
        </p>
      </section>

      <p className="disclaimer" style={{ textAlign: 'left', marginTop: 'var(--space-lg)', maxWidth: 'unset' }}>
        <strong>Medical disclaimer:</strong> This tool is for educational use only and does not replace professional medical advice, diagnosis, or treatment.
      </p>

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
          <strong>Privacy:</strong> SageNest performs all calculations in your browser. We do not store your inputs or results.
        </p>
      </section>

      <section className="content-section" style={{ marginTop: 'var(--space-xl)' }} aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently asked questions</h2>
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} style={{ marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-xs)' }}>{item.question}</h3>
            <p style={{ marginBottom: 0 }}>{item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
};
