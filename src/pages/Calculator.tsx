import { useEffect } from 'react';
import { CalculatorCard } from '../components/CalculatorCard';
import { FAQAccordion, FAQItem, getFAQJsonLD } from '../components/FAQAccordion';
import { InfoGrid } from '../components/InfoGrid';
import { SEOHead } from '../components/SEOHead';
import { blogPosts } from '../data/blogPosts';

const faq: FAQItem[] = [
  ['How accurate is a due date calculator?', 'It provides a planning estimate; your clinician may adjust dating based on ultrasound and cycle history.'],
  ['Can I use this with irregular cycles?', 'Yes. Enter cycle length between 21 and 40 days for a better estimate.'],
  ['Does conception date differ from LMP dating?', 'Yes. Conception-based dating starts from fertilization, while LMP starts about two weeks earlier.'],
  ['Can IVF due dates be more precise?', 'Often yes, because embryo age and transfer date are known.'],
  ['What if my date is in the future?', 'Future LMP and conception dates are invalid for this calculator.'],
  ['Why does timezone matter?', 'Timezone keeps date boundaries consistent in your local calendar context.'],
  ['Can this replace prenatal care?', 'No. It is educational and does not replace professional medical assessment.'],
  ['When should I call my provider?', 'Contact your provider for pain, bleeding, severe symptoms, or urgent concerns.'],
  ['How is trimester defined?', 'First trimester through week 13, second through week 27, then third trimester.'],
  ['Is my data stored?', 'No. SageNest runs calculations entirely in your browser.']
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
        <div className="hero-content">
          <div className="trust-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            TRUSTED BY 50,000+ MOMS
          </div>
          
          <h1 className="hero-title">
            Your Journey <span>Begins Here.</span>
          </h1>
          
          <p className="hero-description">
            Calculate your due date and discover your pregnancy timeline with SageNest's expert-guided tool. 
            Warm, accurate, and completely private.
          </p>
        </div>
      </section>

      {/* Calculator Component */}
      <CalculatorCard />

      {/* Features Section */}
      <section className="features-section">
        <h3>Why track with SageNest?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h4>Milestone Tracking</h4>
            <p>Beyond just a date, get a full timeline of your baby's development from week 1 to 40.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h4>Expert Insights</h4>
            <p>Access tips from certified OB-GYNs and nutritionists tailored to your specific stage.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h4>Partner Sync</h4>
            <p>Invite your partner to the journey and share progress updates and countdowns automatically.</p>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <InfoGrid />

      {/* FAQ Section */}
      <FAQAccordion items={faq} />

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to start your nesting?</h2>
        <p>Download the SageNest app for a personalized pregnancy experience right on your phone.</p>
        <div className="cta-buttons">
          <button>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            App Store
          </button>
          <button>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm10.81-.85L5.5 15.93l12.76-7.29-4.45 11.01zm5.07-10.02L6.12 3.7l7.69 7.69 5.07-2.76zm-10.7 9.7l12.76-7.29-4.45-11.01L8.18 19.33z" />
            </svg>
            Google Play
          </button>
        </div>
      </section>
    </main>
  );
};
