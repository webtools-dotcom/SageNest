import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="site-footer">
    <div className="site-footer__inner">
      <div>
        <p className="site-footer__brand">SageNest</p>
        <p className="site-footer__copyright">© 2026 SageNest. All rights reserved</p>
      </div>
      <div className="site-footer__links" aria-label="Footer links">
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy</Link>
      </div>
    </div>
  </footer>
);
