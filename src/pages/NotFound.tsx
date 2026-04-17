import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

export const NotFoundPage = () => {
  return (
    <main id="main-content" className="container article" aria-labelledby="not-found-title">
      <SEOHead
        title="Page not found"
        description="The page you requested does not exist. Explore SageNest tools and resources from the links below."
        canonicalPath="/404"
        noIndex
      />

      <h1 id="not-found-title">Page not found</h1>
      <p className="muted" style={{ fontSize: '1.125rem', marginBottom: 'var(--space-xl)' }}>
        We couldn&apos;t find the page you were looking for.
      </p>
      <p>You can continue with one of these popular SageNest pages:</p>
      <ul>
        <li>
          <Link to="/pregnancy-due-date-calculator">Pregnancy Due Date Calculator</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/pregnancy-tools">Pregnancy tools</Link>
        </li>
      </ul>
    </main>
  );
};
