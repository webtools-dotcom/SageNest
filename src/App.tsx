import { Link, Route, Routes } from 'react-router-dom';
import { HeroCard } from './components/HeroCard';
import { CalculatorForm } from './components/CalculatorForm';
import { BlogList } from './components/BlogList';
import { BlogPost } from './components/BlogPost';
import { SEOHead } from './components/SEOHead';
import { blogPosts } from './data/blogPosts';
import { Footer } from './components/Footer';
import { AdminLogin } from './pages/AdminLogin';
import { BlogPosterPage } from './pages/BlogPoster';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BlogPoster } from './components/BlogPoster';

const faq = [
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

const HomePage = () => {
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Pregnancy Due Date Calculator — SageNest', url: 'https://sagenest.app/pregnancy-due-date-calculator' },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) },
    { '@context': 'https://schema.org', '@type': 'Blog', name: 'SageNest Blog', url: 'https://sagenest.app/blog' },
    ...blogPosts.map((post) => ({ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, url: `https://sagenest.app/blog/${post.slug}` })),
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'SageNest', potentialAction: { '@type': 'SearchAction', target: 'https://sagenest.app/blog?query={search_term_string}', 'query-input': 'required name=search_term_string' } }
  ];

  return (
    <main id="main-content" className="container">
      <SEOHead title="Pregnancy Due Date Calculator — SageNest" description="SageNest pregnancy due date calculator for due date calculator US, pregnancy week calculator, and how to calculate due date safely." canonicalPath="/pregnancy-due-date-calculator" jsonLd={jsonLd} />
      <HeroCard>
        <h1>Pregnancy Due Date Calculator</h1>
        <p>A calm, medically cautious way to estimate when you may be due, understand gestational age, and prepare thoughtful questions for your prenatal visits.</p>
        <CalculatorForm />
      </HeroCard>
      <section className="editorial">
        <h2>How to calculate due date with confidence</h2>
        <p>Pregnancy timelines can feel emotional and practical at the same time. You may be planning care visits, work leave, travel limits, and family support while also processing uncertainty. A due date calculator offers a grounded starting point that helps you anchor those conversations. In clinical settings, professionals usually begin with standard dating methods and then refine as needed using imaging or cycle context. The goal is not perfection on one day; the goal is thoughtful planning with realistic windows and medically informed follow-up.</p>
        <h2>What this due date calculator does</h2>
        <p>SageNest supports three common paths: last menstrual period (LMP), conception date, and IVF embryo transfer. For LMP entries, Naegele’s rule adds 280 days and then adjusts for cycle length differences. For conception entries, the tool adds 266 days. For IVF, it applies transfer date plus 280 minus embryo age in days. These methods mirror common clinical frameworks used for early planning before full chart review.</p>
        <h3>Why cycle length matters</h3>
        <p>If your cycle is longer than 28 days, ovulation may occur later, shifting the estimate forward. If shorter, timing can move earlier. That is why the calculator accepts cycles from 21 to 40 days and defaults to 28. This keeps the estimate practical for irregular but still common cycle patterns.</p>
        <h3>Gestational age made simple</h3>
        <p>Gestational age is usually counted from LMP, not conception, so pregnancy week numbers are approximately two weeks ahead of fertilization timing. This convention helps align screening schedules, trimester milestones, and documentation standards across care teams.</p>
        <h2>Understanding trimester milestones</h2>
        <p>Each trimester has a different planning focus. In the first trimester, people often discuss baseline labs, supplements, and symptom management. In the second trimester, anatomy imaging and growth checks become central. In the third trimester, attention shifts to movement monitoring, labor preparation, and postpartum support. Your exact path may differ, especially with prior history, medical conditions, or fertility treatment.</p>
        <h2>When estimates change</h2>
        <p>Due dates can move after early ultrasound if cycle history is uncertain or if measured growth suggests a different dating baseline. This is normal and does not mean something is wrong. Dating updates are part of tailoring care to better evidence as pregnancy progresses.</p>
        <h2>Using this tool safely</h2>
        <p>Use the result as an educational estimate, then bring it to your clinician for confirmation. Keep a note of the date source you used and any cycle assumptions. If symptoms feel concerning, do not wait for calculator outputs—seek medical advice promptly.</p>
        <h2>Planning checklist after you calculate</h2>
        <p>After estimating a due date, schedule prenatal intake, review medications and supplements, gather prior records if needed, and map support for appointments. Consider discussing nutrition, movement, sleep, stress support, and workplace planning early. You can also use the conception window and trimester summary as prompts for better questions at your next visit.</p>
        <h2>Privacy and trust</h2>
        <p>SageNest is fully static and client-side. No backend database is required and no personal health data is collected. Your browser performs date math locally so you can estimate timelines privately.</p>
        <h2>Explore more guides</h2>
        <p>Read our detailed guides in the <Link to="/blog">SageNest blog</Link> to learn how providers calculate dates, how IVF timing works, and what week-by-week milestones can look like. These articles are designed for calm decision support and better appointment conversations.</p>
      </section>
      <section>
        <h2>Frequently asked questions</h2>
        {faq.map(([q, a]) => (
          <article key={q}><h3>{q}</h3><p>{a}</p></article>
        ))}
      </section>
    </main>
  );
};

const SimplePage = ({ title }: { title: string }) => <main id="main-content" className="container"><h1>{title}</h1><p>This static page is part of SageNest.</p></main>;

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
        <Link to="/pregnancy-due-date-calculator" className="brand">SageNest</Link>
        <nav>
          <Link to="/pregnancy-due-date-calculator">Calculator</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/blogposter">BlogPoster</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pregnancy-due-date-calculator" element={<HomePage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blogposter" element={<BlogPoster />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/blogposter"
          element={
            <ProtectedRoute>
              <BlogPosterPage />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<SimplePage title="About SageNest" />} />
        <Route path="/privacy" element={<SimplePage title="Privacy" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
