import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div>
        <p className="site-footer__brand">SageNest</p>
        <p className="site-footer__description">
          SageNest Health – Smart Tools for Women’s Wellness
        </p>
      </div>
      <div>
        <h5>Resources</h5>
        <div className="site-footer__links">
          <Link to="/pregnancy-due-date-calculator">Pregnancy Due Date Calculator</Link>
          <Link to="/ovulation-calculator">Ovulation Calculator</Link>
          <Link to="/pregnancy-weight-gain-calculator">Pregnancy Weight Gain Calculator</Link>
          <Link to="/pregnancy-week-by-week">Pregnancy Week-by-Week</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </div>
      <div>
        <h5>About</h5>
        <div className="site-footer__links">
          <Link to="/about">About Us</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </div>
    <p className="site-footer__copyright">
      © 2026 SageNest. For informational purposes only. Consult your physician for medical advice.
    </p>
  </footer>
);
