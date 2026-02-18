import { describe, expect, test, vi } from 'vitest';

const { adminEmail } = vi.hoisted(() => ({
  adminEmail: 'admin@example.com'
}));

vi.mock('../src/supabase/client', () => ({
  ADMIN_EMAIL: adminEmail,
  supabase: {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
      signInWithOAuth: vi.fn()
    }
  }
}));

import { getSessionCheckOutcome, SESSION_VERIFY_ERROR_MESSAGE } from '../src/pages/AdminLogin';

describe('AdminLogin session check outcome', () => {
  test('returns user-safe error state when getUser fails', () => {
    const outcome = getSessionCheckOutcome({
      data: { user: null },
      error: new Error('network issue')
    });

    expect(outcome).toEqual({
      type: 'error',
      message: SESSION_VERIFY_ERROR_MESSAGE
    });
  });

  test('returns no-user state when there is no authenticated user', () => {
    const outcome = getSessionCheckOutcome({
      data: { user: null },
      error: null
    });

    expect(outcome).toEqual({ type: 'no-user' });
  });

  test('returns authorized state for admin email case-insensitively', () => {
    const outcome = getSessionCheckOutcome({
      data: { user: { email: 'ADMIN@EXAMPLE.COM' } },
      error: null
    });

    expect(outcome).toEqual({ type: 'authorized' });
  });

  test('returns unauthorized state for non-admin users', () => {
    const outcome = getSessionCheckOutcome({
      data: { user: { email: 'user@example.com' } },
      error: null
    });

    expect(outcome).toEqual({ type: 'unauthorized' });
  });
});
