import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import {
  ADMIN_CONFIGURATION_ERROR_MESSAGE,
  hasAdminAccessConfigured,
  isAdminEmail,
  supabase
} from '../supabase/client';

export const SESSION_VERIFY_ERROR_MESSAGE = 'Unable to verify session. Please try again.';

type SessionUser = {
  email?: string | null;
} | null;

type SessionState = {
  data: {
    user: SessionUser;
  };
  error: unknown;
};

type SessionCheckOutcome =
  | { type: 'error'; message: string }
  | { type: 'no-user' }
  | { type: 'authorized' }
  | { type: 'unauthorized' };

export const getSessionCheckOutcome = ({ data, error }: SessionState): SessionCheckOutcome => {
  if (!hasAdminAccessConfigured) {
    return { type: 'error', message: ADMIN_CONFIGURATION_ERROR_MESSAGE };
  }

  if (error) {
    return { type: 'error', message: SESSION_VERIFY_ERROR_MESSAGE };
  }

  if (!data.user) {
    return { type: 'no-user' };
  }

  if (isAdminEmail(data.user.email)) {
    return { type: 'authorized' };
  }

  return { type: 'unauthorized' };
};

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      const outcome = getSessionCheckOutcome({ data, error });

      if (outcome.type === 'error') {
        setError(outcome.message);
        setLoading(false);
        return;
      }

      if (outcome.type === 'no-user') {
        setLoading(false);
        return;
      }

      if (outcome.type === 'authorized') {
        navigate('/admin/blogposter', { replace: true });
        return;
      }

      setError('Unauthorized account. Only approved admin can access this area.');
      await supabase.auth.signOut();
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!hasAdminAccessConfigured) {
        setError(ADMIN_CONFIGURATION_ERROR_MESSAGE);
        void supabase.auth.signOut();
        return;
      }

      const email = session?.user?.email;
      if (!email) return;
      if (isAdminEmail(email)) {
        navigate('/admin/blogposter', { replace: true });
        return;
      }

      setError('Unauthorized account. Access denied.');
      void supabase.auth.signOut();
    });

    void checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const signInWithGoogle = async () => {
    setError('');
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin/login`
      }
    });

    if (signInError) {
      setError(signInError.message);
    }
  };

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Admin Login"
        description="Secure SageNest admin login for authorized team members only."
        canonicalPath="/admin/login"
        robots="noindex,nofollow,noarchive"
      />
      <section className="hero-card admin-card">
        <h1>Admin Login</h1>
        <p>Sign in with Google to manage SageNest blog posts.</p>
        {error ? <p className="error" role="alert">{error}</p> : null}
        <button className="primary" onClick={() => void signInWithGoogle()} disabled={loading}>
          Continue with Google
        </button>
      </section>
    </main>
  );
};
