import { Link } from 'react-router-dom';

export default function SimilarToolsButton({ className = '' }: { className?: string }) {
  return (
    <Link to="/similar-tools" className={`nav-pill nav-pill-small ${className}`.trim()} aria-label="Open similar tools list">
      Similar tools
    </Link>
  );
}
