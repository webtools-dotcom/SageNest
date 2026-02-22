import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

const TOTAL_WEEKS = 40;

const getTrimesterLabel = (weekNumber: number) => {
  if (weekNumber <= 13) return 'First trimester';
  if (weekNumber <= 27) return 'Second trimester';
  return 'Third trimester';
};

export const PregnancyWeekByWeekHubPage = () => {
  const weeks = Array.from({ length: TOTAL_WEEKS }, (_, index) => index + 1);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Pregnancy Week-by-Week Guide',
      url: 'https://sagenest.pages.dev/pregnancy-week-by-week',
      description: 'Browse each pregnancy week from 1 to 40 with guidance on fetal development, body changes, and planning checkpoints.',
      mainEntity: {
        '@type': 'ItemList',
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: TOTAL_WEEKS,
        itemListElement: weeks.map((weekNumber) => ({
          '@type': 'ListItem',
          position: weekNumber,
          name: `Pregnancy week ${weekNumber}`,
          url: `https://sagenest.pages.dev/pregnancy-week-by-week/week-${weekNumber}`,
        })),
      },
    },
  ];

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Pregnancy Week-by-Week Hub: Weeks 1-40 Guide"
        description="Explore every pregnancy week from 1 to 40 with focused guidance on baby development, body changes, and planning checkpoints in one organized hub."
        canonicalPath="/pregnancy-week-by-week"
        jsonLd={jsonLd}
      />

      <header className="tool-header">
        <div>
          <h1>Pregnancy Week-by-Week Guide</h1>
          <p className="muted">Explore every week from 1 to 40 and open a focused page for details.</p>
        </div>
      </header>

      <section className="content-section" aria-labelledby="pregnancy-week-list-heading">
        <h2 id="pregnancy-week-list-heading">Choose your pregnancy week</h2>
        <p>Use these links for quick educational guidance by gestational week.</p>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-sm)', listStyle: 'none', padding: 0 }}>
          {weeks.map((weekNumber) => (
            <li key={weekNumber}>
              <Link to={`/pregnancy-week-by-week/week-${weekNumber}`}>
                Week {weekNumber} <span className="muted" style={{ display: 'block' }}>{getTrimesterLabel(weekNumber)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};
