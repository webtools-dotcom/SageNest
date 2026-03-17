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
    const dueDateError = validation.errors.find((error) =>
      error.toLowerCase().includes('due date'),
    );

    if (dueDateError) next.dueDate = dueDateError;
    return next;
  }, [dueDate]);

  const showDueDateError = Boolean(errors.dueDate) && (touched.dueDate || hasSubmitted);

  const result = useMemo(() => {
    if (!dueDate || errors.dueDate) return null;
    return calculateColostrumHarvestingDates(new Date(dueDate));
  }, [dueDate, errors.dueDate]);

  const today = normalizeDate(new Date());
  const dueDateValue = result ? normalizeDate(result.collectionWindowEnd) : null;

  const statusMessage = useMemo(() => {
    if (!result || !dueDateValue) return '';
    if (result.daysUntilStart > 0) {
      return `Your harvesting start date is in ${result.daysUntilStart} days.`;
    }
    if (today < dueDateValue) {
      return 'You can start harvesting now.';
    }
    return 'You are at or past your due date — harvesting is no longer needed.';
  }, [result, dueDateValue, today]);

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

      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Based on NHS antenatal guidance</div>
        </div>
        <h1 className="hero-title">
          Colostrum Harvesting <span>Start Date Calculator</span>
        </h1>
        <p className="hero-description">
          This colostrum harvesting calculator gives your recommended antenatal colostrum harvesting start date from your due date. Use it to plan when to start colostrum harvesting at 36 weeks.
        </p>
      </section>

      <div className="calculator-card" aria-labelledby="form-title">
        <div className="calculator-header">
          <h2 id="form-title" className="calculator-title">Enter Your Details</h2>
          <p className="calculator-subtitle">Find your antenatal colostrum harvesting start date in seconds.</p>
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
              onBlur={() => setTouched((previous) => ({ ...previous, dueDate: true }))}
              aria-invalid={showDueDateError}
              aria-describedby={showDueDateError ? 'due-date-error' : undefined}
            />
            {showDueDateError ? (
              <p id="due-date-error" className="error" role="alert">{errors.dueDate}</p>
            ) : (
              <p className="field-help">Enter a due date from today up to 42 weeks ahead.</p>
            )}
          </div>
          <button type="submit">Calculate start date</button>
        </form>
      </div>

      <section
        style={{
          marginTop: 'var(--space-lg)',
          background: 'var(--sand)',
          border: '1px solid var(--border-hairline)',
          borderLeft: '4px solid var(--sage-dark)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-md)',
        }}
        aria-label="Important safety warning"
      >
        <p style={{ marginBottom: 0, color: 'var(--charcoal)' }}>
          <strong>Important:</strong> Antenatal colostrum harvesting is not recommended before 36 weeks without explicit midwife or consultant advice, as nipple stimulation can trigger uterine contractions. Always discuss with your midwife before starting.
        </p>
      </section>

      <section className="results-card" aria-live="polite" aria-labelledby="results-heading">
        <h2 id="results-heading">Your Result</h2>
        {hasSubmitted && result ? (
          <>
            <div className="results-meta">
              <div className="meta-item">
                <p className="meta-label">Recommended start</p>
                <p className="meta-value">{formatDate(result.recommendedStart)}</p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Earliest start (midwife advice only)</p>
                <p className="meta-value">{formatDate(result.earliestStart)}</p>
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

            <div style={{ background: 'var(--sand)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)', border: '1px solid var(--border-hairline)', marginTop: 'var(--space-md)' }}>
              <p style={{ marginBottom: 0 }}><strong>Status:</strong> {statusMessage}</p>
            </div>

            <div style={{ background: 'var(--sage-softest)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-md)', border: '1px solid var(--sage-light)', marginTop: 'var(--space-md)' }}>
              <p className="eyebrow" style={{ marginBottom: 'var(--space-xs)' }}>Storage guidance</p>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                <li>Fresh colostrum: store in fridge up to 48 hours.</li>
                <li>Frozen colostrum: store in freezer up to 6 months.</li>
                <li>Bring frozen colostrum to hospital in a cool bag.</li>
              </ul>
            </div>

            <div style={{ marginTop: 'var(--space-md)' }}>
              <p style={{ marginBottom: 'var(--space-xs)' }}>Need to confirm dates first?</p>
              <Link to="/pregnancy-due-date-calculator" style={{ color: 'var(--sage-primary)', fontWeight: 600 }}>
                calculate your due date
              </Link>
            </div>
          </>
        ) : (
          <p>Submit your due date above to see your personalized colostrum harvesting dates.</p>
        )}
      </section>

      <section className="content-section" style={{ marginTop: 'var(--space-xl)' }}>
        <h2>How does this colostrum harvesting calculator work?</h2>
        <p>
          We normalize your due date and subtract 28 days to give your recommended start date at 36 weeks. We also show an earlier 34-week date (42 days before due date) for situations where your midwife or consultant has explicitly advised earlier expression.
        </p>

        <h2>When should you start harvesting colostrum during pregnancy?</h2>
        <p>
          For most pregnancies, the recommended antenatal colostrum harvesting start date is 36 weeks. This balances preparedness with safety by avoiding unnecessary nipple stimulation earlier in pregnancy.
        </p>

        <h2>When should you talk to your midwife before starting colostrum harvesting?</h2>
        <p>
          Always check first if you have risk factors such as previous preterm labor, cervical concerns, bleeding, or a high-risk pregnancy. You can also review{' '}
          <Link to="/pregnancy-week-by-week" style={{ color: 'var(--sage-primary)' }}>
            what happens at 36 weeks of pregnancy
          </Link>{' '}
          before you begin.
        </p>
      </section>

      <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-md)' }}>
        Source:{' '}
        <a href="https://www.nth.nhs.uk/resources/colostrum-harvesting/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}>
          NHS — Antenatal expressing of colostrum
        </a>{' '}
        and{' '}
        <a href="https://www.southtees.nhs.uk/resources/expressing-colostrum-during-pregnancy-2/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}>
          NHS - Expressing colostrum during pregnancy
        </a>
        . For informational use only.
      </p>

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

      <DisclaimerBox />
    </main>
  );
};
