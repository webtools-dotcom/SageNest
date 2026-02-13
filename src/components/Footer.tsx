import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div>
        <p className="site-footer__brand">SageNest</p>
        <p className="site-footer__description">
          Supporting the next generation of mothers with science-backed tools and heart-centered community.
        </p>
      </div>
      <div>
        <h5>Explore</h5>
        <div className="site-footer__links">
          <Link to="/pregnancy-due-date-calculator">Calculator</Link>
          <Link to="/blog">Blog</Link>
        </div>
      </div>
      <div>
        <h5>Company</h5>
        <div className="site-footer__links">
          <Link to="/about">About Us</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </div>
    </div>
    <p className="site-footer__copyright">
      © 2026 SageNest. All rights reserved. For informational purposes only. Consult your physician for medical advice.
    </p>
  </footer>
);
