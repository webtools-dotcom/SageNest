import { Link, useParams } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

const MIN_WEEK = 1;
const MAX_WEEK = 40;

const getTrimesterLabel = (weekNumber: number) => {
  if (weekNumber <= 13) return 'First trimester';
  if (weekNumber <= 27) return 'Second trimester';
  return 'Third trimester';
};

const parseWeekNumber = (value?: string): number | null => {
  if (!value) return null;

  const match = /^week-(\d+)$/.exec(value);
  if (!match) return null;

  const parsed = Number(match[1]);
  if (!Number.isInteger(parsed) || parsed < MIN_WEEK || parsed > MAX_WEEK) {
    return null;
  }

  return parsed;
};

export const PregnancyWeekDetailPage = () => {
  const { weekSlug } = useParams();
  const weekNumber = parseWeekNumber(weekSlug);

  if (!weekNumber) {
    return (
      <main id="main-content" className="container">
        <SEOHead
          title="Week Not Found"
          description="The pregnancy week you requested could not be found."
          canonicalPath="/pregnancy-week-by-week"
        />
        <section className="content-section" aria-labelledby="week-not-found-heading">
          <h1 id="week-not-found-heading">Week not found</h1>
          <p>Please enter a week between 1 and 40.</p>
          <p><Link to="/pregnancy-week-by-week">Go back to the week-by-week hub</Link></p>
        </section>
      </main>
    );
  }

  const trimester = getTrimesterLabel(weekNumber);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      name: `Pregnancy Week ${weekNumber}`,
      url: `https://sagenest.pages.dev/pregnancy-week-by-week/week-${weekNumber}`,
      about: `Pregnancy week ${weekNumber} overview`,
      description: `Educational overview of pregnancy week ${weekNumber}, including likely body changes and key prenatal planning notes.`,
    },
  ];

  return (
    <main id="main-content" className="container">
      <SEOHead
        title={`Pregnancy Week ${weekNumber}`}
        description={`Week ${weekNumber} pregnancy overview with trimester context, development highlights, and planning guidance.`}
        canonicalPath={`/pregnancy-week-by-week/week-${weekNumber}`}
        jsonLd={jsonLd}
      />

      <header className="tool-header">
        <div>
          <h1>Pregnancy Week {weekNumber}</h1>
          <p className="muted">{trimester}</p>
        </div>
      </header>

      <section className="content-section" aria-labelledby="week-overview-heading">
        <h2 id="week-overview-heading">What to expect this week</h2>
        <p>
          During week {weekNumber}, your care plan and symptoms can vary person to person. Use this page as a quick educational reference and confirm medical decisions with your prenatal provider.
        </p>
      </section>

      <section className="content-section" aria-labelledby="week-planning-heading" style={{ marginTop: 'var(--space-2xl)' }}>
        <h2 id="week-planning-heading">Planning checklist</h2>
        <ul>
          <li>Track any new symptoms and bring questions to your next prenatal appointment.</li>
          <li>Review hydration, sleep, and nutrition routines that support this trimester.</li>
          <li>Keep using evidence-based tools from SageNest for due date and weight gain planning.</li>
        </ul>
        <p><Link to="/pregnancy-week-by-week">Back to all weeks</Link></p>
      </section>
    </main>
  );
};
