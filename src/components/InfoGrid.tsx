import { Link } from 'react-router-dom';

const iconProps = {
  className: 'info-card__icon',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

const cards = [
  {
    title: 'How this calculator works',
    description: 'We use your last menstrual period and cycle length to estimate the expected due date and current pregnancy week.',
    to: '/about',
    action: 'Read more',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M4 5h16v14H4z" />
        <path d="M8 3v4M16 3v4M7 11h10M7 15h6" />
      </svg>
    )
  },
  {
    title: 'What is gestational age',
    description: 'Gestational age counts from the first day of your last period, which is usually about two weeks before conception.',
    to: '/blog',
    action: 'Read more',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    )
  },
  {
    title: 'Why cycle length matters',
    description: 'Longer or shorter cycles can shift ovulation timing, so adding cycle length helps keep estimates closer to your pattern.',
    to: '/blog',
    action: 'Read more',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M4 16c2.5-3 4.5-3 7 0s4.5 3 7 0" />
        <path d="M4 8c2.5-3 4.5-3 7 0s4.5 3 7 0" />
      </svg>
    )
  },
  {
    title: 'Tips after you get your due date',
    description: 'Use the date to schedule your first prenatal visit, list questions for your provider, and set key reminders.',
    to: '/about',
    action: 'Read more',
    icon: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M12 3l2.4 4.8L20 9l-4 3.9.9 5.6L12 16l-4.9 2.5.9-5.6L4 9l5.6-1.2z" />
      </svg>
    )
  }
] as const;

export const InfoGrid = () => (
  <section className="info-section" aria-labelledby="calculator-info-grid-heading">
    <h2 id="calculator-info-grid-heading">What to know about your result</h2>
    <div className="info-grid">
      {cards.map((card) => (
        <article key={card.title} className="cta-inline info-card">
          <header className="info-card__header">
            {card.icon}
            <h3>{card.title}</h3>
          </header>
          <p>{card.description}</p>
          <Link to={card.to} className="info-card__action">{card.action}</Link>
        </article>
      ))}
    </div>
  </section>
);
