import { useEffect } from 'react';
import { CalculatorCard } from '../components/CalculatorCard';
import { FAQAccordion, FAQItem, getFAQJsonLD } from '../components/FAQAccordion';
import { InfoGrid } from '../components/InfoGrid';
import { SEOHead } from '../components/SEOHead';
import { blogPosts } from '../data/blogPosts';

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
    { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Pregnancy Due Date Calculator — SageNest', url: 'https://sagenest.app/pregnancy-due-date-calculator' },
    { '@context': 'https://schema.org', '@type': 'Blog', name: 'SageNest Blog', url: 'https://sagenest.app/blog' },
    ...blogPosts.map((post) => ({ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, url: `https://sagenest.app/blog/${post.slug}` })),
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SageNest', potentialAction: { '@type': 'SearchAction', target: 'https://sagenest.app/blog?query={search_term_string}', 'query-input': 'required name=search_term_string' } }
  ];

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Pregnancy Due Date Calculator — SageNest"
        description="Estimate your due date from your last menstrual period, view current pregnancy progress by weeks and days, and get a clear planning snapshot to discuss with your care team."
        canonicalPath="/pregnancy-due-date-calculator"
        jsonLd={jsonLd}
      />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="trust-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Trusted by Parents
        </div>
        
        <h1 className="hero-title">
          Your Pregnancy <span>Timeline</span>
        </h1>
        
        <p className="hero-description">
          Calculate your due date with a simple, private tool built on clinical standards.
          No signup required. Results in seconds.
        </p>
      </section>

      {/* Calculator Component */}
      <CalculatorCard />

      {/* Info Grid */}
      <InfoGrid />

      {/* FAQ Section */}
      <FAQAccordion items={faq} />

      {/* Final CTA */}
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
    </main>
  );
};
