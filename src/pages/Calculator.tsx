/*
 * Changes from original src/pages/Calculator.tsx
 * ─────────────────────────────────────────────────
 * BUG 1  — Replaced <header className="tool-header"> (not in guide §7) with
 *           <section className="hero-section"> and guide-compliant inner structure:
 *           trust-badge div, <h1 className="hero-title">, <p className="hero-description">.
 *           Replaced <p className="muted"> (not in §7) with hero-description pattern.
 *           Replaced <section className="cta-section"> (not in §7) with content-section.
 *           Replaced <div className="cta-buttons"> (not in §7) with inline flex wrapper.
 * BUG 3  — Added privacy banner with exact wording from newtoolMAIN.md §2 above
 *           DisclaimerBox. DisclaimerBox already present; kept at bottom.
 * BUG 4  — Added ACOG Committee Opinion 700 source citation with direct link to acog.org.
 * BUG 5  — Removed useEffect-based FAQ JSON-LD injection (was bypassing SEOHead and
 *           could create duplicate schema if SEOHead also injects to <head>). Consolidated
 *           into the jsonLd array passed to SEOHead per newtoolMAIN.md §3. Added
 *           WebApplication schema (required by guide §3). Added FAQPage schema built
 *           from the faq constant. Removed getFAQJsonLD import — no longer needed here.
 * ENHANCE 7 — Added blog post internal link with keyword anchor text in the planning
 *             tools section → /blog/how-due-dates-are-calculated (confirmed present
 *             in public/blog-static/).
 *
 * NOT MODIFIED: title, meta description, canonical path (per task brief hard rules).
 * NOT MODIFIED: faq array (SEO asset — unchanged per task brief).
 * NOT IN SCOPE: InfoGrid.tsx uses non-guide classes (info-section, info-card__header,
 *               info-card__action). FAQAccordion.tsx uses non-guide classes (info-section,
 *               faq-list, faq-item, faq-item__*). Both need a separate cleanup pass.
 */

import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalculatorCard } from '../components/CalculatorCard';
import { FAQAccordion, FAQItem } from '../components/FAQAccordion';
import { InfoGrid } from '../components/InfoGrid';
import { SEOHead } from '../components/SEOHead';
import { DisclaimerBox } from '../components/DisclaimerBox';
import { blogPosts } from '../data/blogPosts';

type CalculatorNavState = {
  mode?: 'lmp' | 'conception' | 'ivf';
  conceptionDate?: string;
  autoCalculate?: boolean;
  sourceContext?: string;
};

// SEO asset — do not modify question or answer text (newtoolMAIN.md hard rule)
const faq: FAQItem[] = [
  [
    'How accurate is a due date calculator?',
    'It provides a planning estimate based on the standard 280-day pregnancy. Your clinician may adjust dating based on ultrasound measurements and your unique cycle history.',
  ],
  [
    'Can I use this with irregular cycles?',
    'Yes. Enter your average cycle length between 21 and 40 days for a personalized estimate.',
  ],
  [
    'Does conception date differ from LMP dating?',
    'Yes. Conception-based dating starts from fertilization, while LMP dating starts about two weeks earlier from your last menstrual period.',
  ],
  [
    'Can IVF due dates be more precise?',
    'Often yes, because the embryo age and transfer date are precisely known, allowing for more accurate calculation.',
  ],
  [
    'Why does cycle length matter?',
    'Longer or shorter cycles shift ovulation timing. Including your cycle length helps create a more personalized estimate.',
  ],
  [
    'Is my data stored anywhere?',
    'No. All calculations happen entirely in your browser. SageNest does not collect, store, or transmit any personal data.',
  ],
  [
    'Can this replace prenatal care?',
    'No. This tool is educational and does not replace professional medical assessment or guidance from your healthcare provider.',
  ],
  [
    'When should I call my provider?',
    'Contact your provider for any pain, bleeding, severe symptoms, or urgent concerns during pregnancy.',
  ],
  [
    'How is trimester defined?',
    'First trimester is weeks 1-13, second trimester is weeks 14-27, and third trimester is weeks 28-40.',
  ],
  [
    'What if my calculated date differs from ultrasound?',
    'First-trimester ultrasound is generally considered the most accurate dating method. Discuss any differences with your healthcare provider.',
  ],
];

export const CalculatorPage = () => {
  const location = useLocation();
  const navState = (location.state as CalculatorNavState | null) ?? undefined;

  // BUG 5: Consolidated into single jsonLd array per newtoolMAIN.md §3.
  // Added WebApplication (required by guide). FAQPage schema built from faq constant.
  // Removed getFAQJsonLD useEffect — FAQ schema now managed via SEOHead, consistent
  // with every other tool on the site.
  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Pregnancy Due Date Calculator',
        url: 'https://sagenesthealth.com/pregnancy-due-date-calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        description:
          'Free pregnancy due date calculator — enter your LMP and cycle length to estimate your due date, gestational age, and trimester instantly. No signup required.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Pregnancy Due Date Calculator',
        url: 'https://sagenesthealth.com/pregnancy-due-date-calculator',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://sagenesthealth.com/blog?query={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'SageNest Blog',
        url: 'https://sagenesthealth.com/blog',
      },
      ...blogPosts.map((post) => ({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        url: `https://sagenesthealth.com/blog/${post.slug}`,
      })),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
    [],
  );

  return (
    <main id="main-content" className="container">
      {/* Title, description, and canonicalPath unchanged per task brief hard rules */}
      <SEOHead
        title="Pregnancy Due Date Calculator"
        description="Free pregnancy due date calculator — enter your LMP and cycle length to estimate your due date, gestational age, and trimester instantly. No signup required."
        canonicalPath="/pregnancy-due-date-calculator"
        jsonLd={jsonLd}
      />

      {/* BUG 1: Replaced <header className="tool-header"> + <p className="muted">
          with guide-compliant hero-section per newtoolMAIN.md §2 */}
      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          {/* §10.7: trust badge contains primary keyword + benefit signal */}
          <div className="trust-badge">Free pregnancy due date estimate — no signup</div>
        </div>
        <h1 className="hero-title">Pregnancy Due Date <span>Calculator</span></h1>
        <p className="hero-description">
          Calculate your due date in seconds. Evidence-based, private, and no signup required.
        </p>
      </section>

      <CalculatorCard navState={navState} />

      <InfoGrid />

      {/* Educational section — H2s are secondary keyword targets per §10.5 */}
      <section
        aria-labelledby="planning-tools-heading"
        className="content-section"
        style={{ marginTop: 'var(--space-2xl)' }}
      >
        <h2 id="planning-tools-heading">More planning tools for each pregnancy stage</h2>
        <p>
          If you are also planning healthy prenatal milestones beyond your estimated due date, try our{' '}
          <Link to="/pregnancy-weight-gain-calculator">pregnancy weight gain calculator</Link>{' '}
          to review trimester-based guidance you can discuss with your healthcare provider.
        </p>
        <p>
          You can also explore our{' '}
          <Link to="/pregnancy-week-by-week">pregnancy week-by-week guide</Link>{' '}
          for focused guidance as your pregnancy progresses.
        </p>
        {/* ENHANCE 7: blog post internal link — keyword anchor text per §10.8 */}
        <p>
          Wondering how your provider will confirm your dates? Read our evidence-based guide on{' '}
          <a href="/blog/how-due-dates-are-calculated" style={{ color: 'var(--sage-primary)' }}>
            how due dates are calculated using LMP, ultrasound, and IVF methods
          </a>.
        </p>
      </section>

      {/* BUG 4: Source citation — ACOG Committee Opinion 700, direct URL per §10.9.
          Naegele's rule / 280-day model is formally documented in ACOG CO 700 (2017). */}
      <p
        style={{
          fontSize: '0.8125rem',
          color: 'var(--text-tertiary)',
          marginTop: 'var(--space-md)',
        }}
      >
        Estimates based on:{' '}
        <a
          href="https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--text-tertiary)', textDecoration: 'underline' }}
        >
          ACOG Committee Opinion 700: Methods for Estimating the Due Date (2017)
        </a>
        . For informational use only.
      </p>

      <FAQAccordion items={faq} />

      {/* BUG 1: Replaced .cta-section (not in §7) with content-section.
          Replaced .cta-buttons (not in §7) with inline flex wrapper. */}
      <section
        className="content-section"
        style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}
      >
        <p className="eyebrow" style={{ color: 'var(--sage-dark)' }}>Stay Informed</p>
        <h2>Explore our pregnancy guides</h2>
        <p>
          Read evidence-based articles on pregnancy planning, prenatal care, and week-by-week
          development.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
          <button
            type="button"
            onClick={() => { window.location.href = '/blog'; }}
          >
            Browse pregnancy articles
          </button>
        </div>
      </section>

      {/* BUG 3: Privacy banner — exact wording from newtoolMAIN.md §2 */}
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

      {/* DisclaimerBox at very bottom per task instruction (already present, kept) */}
      <DisclaimerBox />
    </main>
  );
};
