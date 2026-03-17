import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { BlogList } from './components/BlogList';
import { BlogPost } from './components/BlogPost';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLogin } from './pages/AdminLogin';
import { BlogPosterPage } from './pages/BlogPoster';
import { CalculatorPage } from './pages/Calculator';
import { AboutPage } from './pages/About';
import { PrivacyPage } from './pages/Privacy';
import { EditorialTeamPage } from './pages/EditorialTeamPage';
import { PregnancyWeightGainCalculatorPage } from './pages/PregnancyWeightGainCalculator';
import PregnancyWeekByWeekHubPage from './pages/PregnancyWeekByWeekHub';
import { PregnancyWeekDetailPage } from './pages/PregnancyWeekDetail';
import { OvulationCalculatorPage } from './pages/OvulationCalculator';
import { MorningSicknessEstimatorPage } from './pages/MorningSicknessEstimator';
import SimilarToolsPage from './pages/SimilarTools';
import { NotFoundPage } from './pages/NotFound';

function App() {
  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
        <Link to="/pregnancy-due-date-calculator" className="brand">
          <div className="brand-icon" aria-hidden="true">
            <img
              src="/sagenest-main-logo.png"
              alt=""
              width="48"
              height="48"
              style={{ borderRadius: '6px' }}
            />
          </div>
          SageNest
        </Link>
        <nav aria-label="Primary">
          <NavLink to="/similar-tools" className="nav-pill">Similar tools</NavLink>
          <NavLink to="/blog" className="nav-pill">Blog</NavLink>
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
        <Route path="/editorial-team" element={<EditorialTeamPage />} />
        <Route path="/pregnancy-weight-gain-calculator" element={<PregnancyWeightGainCalculatorPage />} />
        <Route path="/pregnancy-week-by-week" element={<PregnancyWeekByWeekHubPage />} />
        <Route path="/pregnancy-week-by-week/:weekSlug" element={<PregnancyWeekDetailPage />} />
        <Route path="/ovulation-calculator" element={<OvulationCalculatorPage />} />
        <Route path="/morning-sickness-end-date-estimator" element={<MorningSicknessEstimatorPage />} />
        <Route path="/similar-tools" element={<SimilarToolsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
