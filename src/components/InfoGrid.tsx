import { Link } from 'react-router-dom';

export const InfoGrid = () => (
  <section className="info-section">
    <h2>Planning after you calculate</h2>
    <div className="info-grid">
      <article className="cta-inline">
        <h3>Book prenatal intake</h3>
        <p>Share your estimate with your care team so dating can be confirmed and care can be scheduled.</p>
      </article>
      <article className="cta-inline">
        <h3>Track milestones</h3>
        <p>Use trimester checkpoints to plan screening, travel, and support with more confidence.</p>
      </article>
      <article className="cta-inline">
        <h3>Read deeper guides</h3>
        <p>Visit the <Link to="/blog">SageNest blog</Link> for practical explainers you can discuss at appointments.</p>
      </article>
    </div>
  </section>
);
