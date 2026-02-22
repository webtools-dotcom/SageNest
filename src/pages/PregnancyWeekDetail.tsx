import { Link, useParams } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { pregnancyWeekByNumber } from '../data/pregnancyWeeks';

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
  const weekData = pregnancyWeekByNumber[weekNumber];
  const previousWeek = weekNumber > MIN_WEEK ? weekNumber - 1 : null;
  const nextWeek = weekNumber < MAX_WEEK ? weekNumber + 1 : null;
  const description = `${weekData.summary} ${weekData.disclaimer}`;
  const canonicalPath = `/pregnancy-week-by-week/week-${weekNumber}`;
  const url = `https://sagenest.pages.dev${canonicalPath}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `Pregnancy Week ${weekNumber}: ${trimester} Guide`,
      description,
      url,
      mainEntityOfPage: url,
      datePublished: '2026-02-22',
      dateModified: '2026-02-22',
      publisher: {
        '@type': 'Organization',
        name: 'SageNest',
        url: 'https://sagenest.pages.dev',
      },
    },
  ];

  return (
    <main id="main-content" className="container">
      <SEOHead
        title={`Pregnancy Week ${weekNumber}: ${trimester} Milestones and Planning`}
        description={description}
        canonicalPath={canonicalPath}
        jsonLd={jsonLd}
      />

      <header className="tool-header">
        <div>
          <nav aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/pregnancy-week-by-week">Pregnancy week-by-week hub</Link>
              </li>
              <li aria-current="page">Week {weekNumber}</li>
            </ol>
          </nav>
          <h1>Pregnancy Week {weekNumber}</h1>
          <p className="muted">{trimester}</p>
        </div>
      </header>

      <section className="content-section" aria-label="Adjacent weeks">
        <h2>Navigate weeks</h2>
        <p>
          {previousWeek ? (
            <Link to={`/pregnancy-week-by-week/week-${previousWeek}`}>Go to week {previousWeek}</Link>
          ) : (
            <span aria-disabled="true">Previous week unavailable at week 1</span>
          )}
        </p>
        <p>
          {nextWeek ? (
            <Link to={`/pregnancy-week-by-week/week-${nextWeek}`}>Go to week {nextWeek}</Link>
          ) : (
            <span aria-disabled="true">Next week unavailable at week 40</span>
          )}
        </p>
      </section>

      <section className="content-section" aria-labelledby="baby-development-heading" style={{ marginTop: 'var(--space-2xl)' }}>
        <h2 id="baby-development-heading">Baby development</h2>
        <p>Estimated size this week: {weekData.baby.sizeComparison}.</p>
        <h3>Development highlights</h3>
        <ul>
          {weekData.baby.development.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="content-section" aria-labelledby="maternal-changes-heading" style={{ marginTop: 'var(--space-2xl)' }}>
        <h2 id="maternal-changes-heading">Maternal changes</h2>
        <h3>Common symptoms</h3>
        <ul>
          {weekData.body.symptoms.common.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>Less common symptoms</h3>
        <ul>
          {weekData.body.symptoms.lessCommon.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="content-section" aria-labelledby="to-do-heading" style={{ marginTop: 'var(--space-2xl)' }}>
        <h2 id="to-do-heading">To-do</h2>
        <ul>
          {weekData.preparation.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="content-section" aria-labelledby="medical-guidance-heading" style={{ marginTop: 'var(--space-2xl)' }}>
        <h2 id="medical-guidance-heading">Medical guidance</h2>
        <h3>Appointment focus</h3>
        <p>{weekData.preparation.appointmentFocus}</p>
        <h3>Call your clinician urgently if you notice</h3>
        <ul>
          {weekData.body.symptoms.redFlags.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{weekData.disclaimer}</p>
        <p><Link to="/pregnancy-week-by-week">Back to all weeks</Link></p>
      </section>
    </main>
  );
};
