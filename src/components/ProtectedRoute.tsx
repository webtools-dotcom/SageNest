import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  ADMIN_CONFIGURATION_ERROR_MESSAGE,
  hasAdminAccessConfigured,
  isAdminEmail,
  supabase
} from '../supabase/client';

type AuthState = 'loading' | 'configuration-error' | 'unauthenticated' | 'forbidden' | 'authorized';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    const checkUser = async () => {
      if (!hasAdminAccessConfigured) {
        setAuthState('configuration-error');
        return;
      }

      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setAuthState('unauthenticated');
        return;
      }

      if (!isAdminEmail(data.user.email)) {
        setAuthState('forbidden');
        return;
      }

      setAuthState('authorized');
    };

    void checkUser();
  }, []);

  if (authState === 'loading') return <main className="container"><p>Checking authorization…</p></main>;
  if (authState === 'configuration-error') return <main className="container"><h1>Configuration error</h1><p>{ADMIN_CONFIGURATION_ERROR_MESSAGE}</p></main>;
  if (authState === 'unauthenticated') return <Navigate to="/admin/login" replace />;
  if (authState === 'forbidden') return <main className="container"><h1>403</h1><p>You are signed in, but not authorized to access this page.</p></main>;

  return <>{children}</>;
};
