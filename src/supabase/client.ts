import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const adminEmailsEnv: string = import.meta.env.VITE_ADMIN_EMAILS ?? import.meta.env.VITE_ADMIN_EMAIL ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

export const ADMIN_CONFIGURATION_ERROR_MESSAGE = 'Admin access is unavailable. Please contact support.';

export const ADMIN_EMAIL_ALLOWLIST = adminEmailsEnv
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const hasAdminAccessConfigured = ADMIN_EMAIL_ALLOWLIST.length > 0;

if (!hasAdminAccessConfigured) {
  // eslint-disable-next-line no-console
  console.warn('Missing admin environment variable. Set VITE_ADMIN_EMAIL or VITE_ADMIN_EMAILS.');
}

export const isAdminEmail = (email?: string | null): boolean => {
  if (!hasAdminAccessConfigured) {
    return false;
  }

  return ADMIN_EMAIL_ALLOWLIST.includes((email ?? '').trim().toLowerCase());
};
