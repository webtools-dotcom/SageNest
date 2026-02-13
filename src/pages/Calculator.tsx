import { CalculatorCard } from '../components/CalculatorCard';
import { CalculatorSteps } from '../components/CalculatorSteps';
import { FAQAccordion } from '../components/FAQAccordion';
import { InfoGrid } from '../components/InfoGrid';
import { SEOHead } from '../components/SEOHead';
import { blogPosts } from '../data/blogPosts';

const faq: Array<[string, string]> = [
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
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Pregnancy Due Date Calculator — SageNest', url: 'https://sagenest.app/pregnancy-due-date-calculator' },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
    { '@context': 'https://schema.org', '@type': 'Blog', name: 'SageNest Blog', url: 'https://sagenest.app/blog' },
    ...blogPosts.map((post) => ({ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, url: `https://sagenest.app/blog/${post.slug}` })),
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SageNest', potentialAction: { '@type': 'SearchAction', target: 'https://sagenest.app/blog?query={search_term_string}', 'query-input': 'required name=search_term_string' } }
  ];

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Pregnancy Due Date Calculator — SageNest"
        description="SageNest pregnancy due date calculator for due date calculator US, pregnancy week calculator, and how to calculate due date safely."
        canonicalPath="/pregnancy-due-date-calculator"
        jsonLd={jsonLd}
      />
      <CalculatorCard />
      <CalculatorSteps />
      <InfoGrid />
      <FAQAccordion items={faq} />
    </main>
  );
};
