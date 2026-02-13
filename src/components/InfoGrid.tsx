import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'How this calculator works',
    description: 'We use your last menstrual period and cycle length to estimate your due date based on the standard 280-day pregnancy model.',
    to: '/about',
    action: 'Learn more'
  },
  {
    title: 'Understanding gestational age',
    description: 'Gestational age counts from the first day of your last period, typically about two weeks before conception occurs.',
    to: '/blog',
    action: 'Learn more'
  },
  {
    title: 'Why cycle length matters',
    description: 'Longer or shorter cycles shift ovulation timing. Including your cycle length creates a more personalized estimate.',
    to: '/blog',
    action: 'Learn more'
  },
  {
    title: 'Next steps after calculation',
    description: 'Use your due date to schedule your first prenatal visit, prepare questions for your provider, and set key reminders.',
    to: '/about',
    action: 'Learn more'
  }
] as const;

export const InfoGrid = () => (
  <section className="info-section" aria-labelledby="calculator-info-grid-heading">
    <h2 id="calculator-info-grid-heading">Understanding your result</h2>
    <div className="info-grid">
      {cards.map((card) => (
        <article key={card.title} className="info-card">
          <div className="info-card__header">
            <h3>{card.title}</h3>
          </div>
          <p>{card.description}</p>
          <Link to={card.to} className="info-card__action">
            {card.action} →
          </Link>
        </article>
      ))}
    </div>
  </section>
);
