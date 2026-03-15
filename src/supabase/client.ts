import { createClient } from '@supabase/supabase-js';

async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const adminEmailsEnv: string = import.meta.env.VITE_ADMIN_EMAILS ?? import.meta.env.VITE_ADMIN_EMAIL ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

export const ADMIN_CONFIGURATION_ERROR_MESSAGE = 'Admin access is unavailable. Please contact support.';

/**
 * SECURITY NOTE: This allowlist is compiled into the client bundle because
 * it uses the VITE_ prefix. While Supabase RLS policies are the actual
 * enforcement layer, prefer migrating to VITE_ADMIN_EMAIL_HASH /
 * VITE_ADMIN_EMAIL_HASHES to avoid exposing admin email identities.
 * See .env.example for migration instructions.
 */
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

export const isAdminEmailAsync = async (email?: string | null): Promise<boolean> => {
  if (!hasAdminAccessConfigured) return false;
  if (!email) return false;

  // Primary: plaintext comparison (for backward compatibility during migration)
  if (isAdminEmail(email)) return true;

  // Secondary: hash-based comparison (preferred — no plaintext email in bundle)
  const hashEnv: string = import.meta.env.VITE_ADMIN_EMAIL_HASHES
    ?? import.meta.env.VITE_ADMIN_EMAIL_HASH
    ?? '';
  const allowedHashes = hashEnv
    .split(',')
    .map((h: string) => h.trim().toLowerCase())
    .filter(Boolean);

  if (allowedHashes.length === 0) return false;

  const inputHash = await sha256Hex(email);
  return allowedHashes.includes(inputHash);
};
