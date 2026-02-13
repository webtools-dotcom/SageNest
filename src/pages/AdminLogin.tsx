import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_EMAIL, supabase } from '../supabase/client';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setLoading(false);
        return;
      }

      if ((data.user.email ?? '').toLowerCase() === ADMIN_EMAIL) {
        navigate('/admin/blogposter', { replace: true });
        return;
      }

      setError('Unauthorized account. Only approved admin can access this area.');
      await supabase.auth.signOut();
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((
      _event: unknown,
      session: { user?: { email?: string | null } | null } | null
    ) => {
      const email = session?.user?.email?.toLowerCase() ?? '';
      if (!email) return;
      if (email === ADMIN_EMAIL) {
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
