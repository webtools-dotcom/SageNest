import { Link, useParams } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { DisclaimerBox } from '../components/DisclaimerBox';
import { getWeekByNumber } from '../data/pregnancyWeeks';

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
          noIndex
        />
        <section className="content-section" aria-labelledby="week-not-found-heading">
          <h1 id="week-not-found-heading">Week not found</h1>
          <p>Please enter a week between 1 and 40.</p>
          <p><Link to="/pregnancy-week-by-week">Go back to the week-by-week hub</Link></p>
        </section>
        <DisclaimerBox />
      </main>
    );
  }

  const weekData = getWeekByNumber(weekNumber);

  if (!weekData) {
    return (
      <main id="main-content" className="container">
        <SEOHead
          title="Week Not Found"
          description="The pregnancy week you requested could not be found."
          canonicalPath="/pregnancy-week-by-week"
          noIndex
        />
        <section className="content-section" aria-labelledby="week-not-found-heading">
          <h1 id="week-not-found-heading">Week not found</h1>
          <p>Data for this week is unavailable.</p>
          <p><Link to="/pregnancy-week-by-week">Go back to the week-by-week hub</Link></p>
        </section>
        <DisclaimerBox />
      </main>
    );
  }

  const trimester = getTrimesterLabel(weekNumber);
  const previousWeek = weekNumber > MIN_WEEK ? weekNumber - 1 : null;
  const nextWeek = weekNumber < MAX_WEEK ? weekNumber + 1 : null;
  const description = `Week ${weekNumber} of pregnancy: ${weekData.highlight}`;
  const canonicalPath = `/pregnancy-week-by-week/week-${weekNumber}`;
  const url = `https://sagenesthealth.com${canonicalPath}`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `Pregnancy Week ${weekNumber}: ${weekData.title}`,
      description,
      url,
      mainEntityOfPage: url,
      datePublished: '2026-02-22',
      dateModified: '2026-02-22',
      publisher: {
        '@type': 'Organization',
        name: 'SageNest',
        url: 'https://sagenesthealth.com',
      },
    },
  ];

  return (
    <main id="main-content" className="container">
      <SEOHead
        title={`Pregnancy Week ${weekNumber}: ${weekData.title} — ${trimester}`}
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
          <h1>Week {weekNumber}: {weekData.title}</h1>
          <p className="muted">{trimester}</p>
        </div>
      </header>

      {/* Navigate weeks */}
      <section className="content-section" aria-label="Adjacent weeks">
        <h2>Navigate weeks</h2>
        <p>
          {previousWeek ? (
            <Link to={`/pregnancy-week-by-week/week-${previousWeek}`}>← Week {previousWeek}</Link>
          ) : (
            <span aria-disabled="true">← This is week 1</span>
          )}
          {' · '}
          {nextWeek ? (
            <Link to={`/pregnancy-week-by-week/week-${nextWeek}`}>Week {nextWeek} →</Link>
          ) : (
            <span aria-disabled="true">This is week 40 →</span>
          )}
        </p>
      </section>

      {/* Highlight */}
      <section
        className="content-section"
        style={{
          background: 'var(--sage-softest)',
          border: '1px solid var(--sage-light)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
          marginTop: 'var(--space-xl)',
        }}
      >
        <p className="eyebrow">This week's highlight</p>
        <p style={{ margin: 0, fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--charcoal)' }}>
          {weekData.highlight}
        </p>
      </section>

      {/* Baby size */}
      <section className="content-section" style={{ marginTop: 'var(--space-2xl)' }}>
        <h2>Baby size this week</h2>
        <p>{weekData.babySize} · {weekData.babyLength} · {weekData.babyWeight}</p>
      </section>

      {/* Baby development */}
      <section
        className="content-section"
        aria-labelledby="baby-development-heading"
        style={{ marginTop: 'var(--space-2xl)' }}
      >
        <h2 id="baby-development-heading">Baby development</h2>
        <ul>
          {weekData.babyDevelopment.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Mom changes */}
      <section
        className="content-section"
        aria-labelledby="maternal-changes-heading"
        style={{ marginTop: 'var(--space-2xl)' }}
      >
        <h2 id="maternal-changes-heading">Your body this week</h2>
        <ul>
          {weekData.momChanges.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Symptoms */}
      <section
        className="content-section"
        aria-labelledby="symptoms-heading"
        style={{ marginTop: 'var(--space-2xl)' }}
      >
        <h2 id="symptoms-heading">Common symptoms</h2>
        <ul>
          {weekData.symptoms.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Tips */}
      <section
        className="content-section"
        aria-labelledby="tips-heading"
        style={{ marginTop: 'var(--space-2xl)' }}
      >
        <h2 id="tips-heading">Tips for this week</h2>
        <ul>
          {weekData.tips.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Nutrition */}
      <section
        className="content-section"
        aria-labelledby="nutrition-heading"
        style={{ marginTop: 'var(--space-2xl)' }}
      >
        <h2 id="nutrition-heading">Nutrition focus</h2>
        <p>{weekData.nutrition}</p>
      </section>

      {/* Weekly fact */}
      <section
        className="content-section"
        style={{
          background: 'var(--sand)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
          marginTop: 'var(--space-2xl)',
        }}
        aria-labelledby="weekly-fact-heading"
      >
        <h2 id="weekly-fact-heading" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-sm)' }}>
          Did you know?
        </h2>
        <p style={{ margin: 0 }}>{weekData.weeklyFact}</p>
      </section>

      {/* Nav footer */}
      <section className="content-section" style={{ marginTop: 'var(--space-2xl)', textAlign: 'center' }}>
        <p>
          {previousWeek && (
            <Link to={`/pregnancy-week-by-week/week-${previousWeek}`}>← Week {previousWeek}</Link>
          )}
          {previousWeek && nextWeek && ' · '}
          {nextWeek && (
            <Link to={`/pregnancy-week-by-week/week-${nextWeek}`}>Week {nextWeek} →</Link>
          )}
        </p>
        <p style={{ marginTop: 'var(--space-md)' }}>
          <Link to="/pregnancy-week-by-week">← Back to all weeks</Link>
        </p>
      </section>
      <DisclaimerBox />
    </main>
  );
};
