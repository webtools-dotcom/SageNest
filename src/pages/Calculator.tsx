import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalculatorCard } from '../components/CalculatorCard';
import { FAQAccordion, FAQItem, getFAQJsonLD } from '../components/FAQAccordion';
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

const faq: FAQItem[] = [
  ['How accurate is a due date calculator?', 'It provides a planning estimate based on the standard 280-day pregnancy. Your clinician may adjust dating based on ultrasound measurements and your unique cycle history.'],
  ['Can I use this with irregular cycles?', 'Yes. Enter your average cycle length between 21 and 40 days for a personalized estimate.'],
  ['Does conception date differ from LMP dating?', 'Yes. Conception-based dating starts from fertilization, while LMP dating starts about two weeks earlier from your last menstrual period.'],
  ['Can IVF due dates be more precise?', 'Often yes, because the embryo age and transfer date are precisely known, allowing for more accurate calculation.'],
  ['Why does cycle length matter?', 'Longer or shorter cycles shift ovulation timing. Including your cycle length helps create a more personalized estimate.'],
  ['Is my data stored anywhere?', 'No. All calculations happen entirely in your browser. SageNest does not collect, store, or transmit any personal data.'],
  ['Can this replace prenatal care?', 'No. This tool is educational and does not replace professional medical assessment or guidance from your healthcare provider.'],
  ['When should I call my provider?', 'Contact your provider for any pain, bleeding, severe symptoms, or urgent concerns during pregnancy.'],
  ['How is trimester defined?', 'First trimester is weeks 1-13, second trimester is weeks 14-27, and third trimester is weeks 28-40.'],
  ['What if my calculated date differs from ultrasound?', 'First-trimester ultrasound is generally considered the most accurate dating method. Discuss any differences with your healthcare provider.']
];

export const CalculatorPage = () => {
  const location = useLocation();
  const navState = (location.state as CalculatorNavState | null) ?? undefined;
  useEffect(() => {
    const prior = document.getElementById('faq-jsonld-root');
    if (prior) prior.remove();

    const script = document.createElement('script');
    script.id = 'faq-jsonld-root';
    script.type = 'application/ld+json';
    script.textContent = getFAQJsonLD(faq);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Pregnancy Due Date Calculator',
      url: 'https://sagenesthealth.com/pregnancy-due-date-calculator',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://sagenesthealth.com/blog?query={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    { '@context': 'https://schema.org', '@type': 'Blog', name: 'SageNest Blog', url: 'https://sagenesthealth.com/blog' },
    ...blogPosts.map((post) => ({ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, url: `https://sagenesthealth.com/blog/${post.slug}` }))
  ];

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Pregnancy Due Date Calculator"
        description="Free pregnancy due date calculator — enter your LMP and cycle length to estimate your due date, gestational age, and trimester instantly. No signup required."
        canonicalPath="/pregnancy-due-date-calculator"
        jsonLd={jsonLd}
      />

      <header className="tool-header">
        <div>
          <h1>Pregnancy Due Date Calculator</h1>
          <p className="muted">Calculate your due date in seconds. No signup required.</p>
        </div>
      </header>

      <CalculatorCard navState={navState} />

      <InfoGrid />

      <section aria-labelledby="planning-tools-heading" className="content-section" style={{ marginTop: 'var(--space-2xl)' }}>
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
      </section>

      <FAQAccordion items={faq} />

      <section className="cta-section">
        <p className="eyebrow" style={{ color: 'var(--sage-dark)' }}>Stay Informed</p>
        <h2>Explore our pregnancy guides</h2>
        <p>Read evidence-based articles on pregnancy planning, prenatal care, and week-by-week development.</p>
        <div className="cta-buttons">
          <button onClick={() => window.location.href = '/blog'}>
            Browse Articles
          </button>
        </div>
      </section>
      <DisclaimerBox />
    </main>
  );
};
