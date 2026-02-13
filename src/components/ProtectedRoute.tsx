import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ADMIN_EMAIL, supabase } from '../supabase/client';

type AuthState = 'loading' | 'unauthenticated' | 'forbidden' | 'authorized';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setAuthState('unauthenticated');
        return;
      }

      if ((data.user.email ?? '').toLowerCase() !== ADMIN_EMAIL) {
        setAuthState('forbidden');
        return;
      }

      setAuthState('authorized');
    };

    void checkUser();
  }, []);

  if (authState === 'loading') return <main className="container"><p>Checking authorization…</p></main>;
  if (authState === 'unauthenticated') return <Navigate to="/admin/login" replace />;
  if (authState === 'forbidden') return <main className="container"><h1>403</h1><p>You are signed in, but not authorized to access this page.</p></main>;

  return <>{children}</>;
};
