import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import tools from '../data/tools';

export default function SimilarToolsPage() {
  return (
    <main id="main-content" className="container" aria-labelledby="similar-tools-title">
      <SEOHead
        title="Similar tools — SageNest"
        description="Discover all pregnancy calculators and planning tools available on SageNest."
        canonicalPath="/similar-tools"
      />

      <header className="tool-header">
        <div>
          <h1 id="similar-tools-title">Similar tools</h1>
          <p className="muted">Discover all helpful calculators and tools we provide.</p>
        </div>
      </header>

      <section aria-labelledby="tools-list-heading" className="content-section" style={{ marginTop: 'var(--space-xl)' }}>
        <h2 id="tools-list-heading" className="visually-hidden">Tools list</h2>
        {tools.length === 0 ? (
          <p className="muted">No tools available yet — check back later.</p>
        ) : (
          <ul className="tools-grid" role="list">
            {tools.map((tool) => (
              <li key={tool.id} className="tool-card" role="listitem">
                <Link to={tool.path} className="tool-link" aria-label={`Open ${tool.title}`}>
                  <h3>{tool.title}</h3>
                  {tool.description ? <p className="muted">{tool.description}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
