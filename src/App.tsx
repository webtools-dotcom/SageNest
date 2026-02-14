import { Link, Route, Routes } from 'react-router-dom';
import { BlogList } from './components/BlogList';
import { BlogPost } from './components/BlogPost';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLogin } from './pages/AdminLogin';
import { BlogPosterPage } from './pages/BlogPoster';
import { CalculatorPage } from './pages/Calculator';
import { AboutPage } from './pages/About';
import { PrivacyPage } from './pages/Privacy';

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
  <Link to="/pregnancy-due-date-calculator" className="brand">
    <div className="brand-icon">🌿</div>
    SageNest
  </Link>
  <nav>
    <Link to="/pregnancy-due-date-calculator">Calculator</Link>
    <Link to="/blog">Blog</Link>
  </nav>
</header>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/pregnancy-due-date-calculator" element={<CalculatorPage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/blogposter"
          element={
            <ProtectedRoute>
              <BlogPosterPage />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
