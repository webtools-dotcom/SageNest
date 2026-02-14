import { afterEach, describe, expect, test, vi } from 'vitest';

const { getUserMock } = vi.hoisted(() => ({
  getUserMock: vi.fn()
}));

vi.mock('../src/supabase/client', () => ({
  ADMIN_EMAIL: 'admin@example.com',
  supabase: {
    auth: {
      getUser: getUserMock
    }
  }
}));

import { assertAdminUser, runAdminGuardedAction } from '../src/pages/BlogPoster';

describe('BlogPoster admin guard', () => {
  afterEach(() => {
    getUserMock.mockReset();
  });

  test('assertAdminUser allows configured admin email (case-insensitive)', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          email: 'ADMIN@EXAMPLE.COM'
        }
      },
      error: null
    });

    await expect(assertAdminUser()).resolves.toBeUndefined();
  });

  test('assertAdminUser rejects non-admin email', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          email: 'not-admin@example.com'
        }
      },
      error: null
    });

    await expect(assertAdminUser()).rejects.toThrow('You are not authorized to manage blog posts.');
  });

  test('runAdminGuardedAction aborts action and sets message when unauthorized', async () => {
    getUserMock.mockResolvedValue({
      data: {
        user: {
          email: 'blocked@example.com'
        }
      },
      error: null
    });

    const setMessage = vi.fn();
    const action = vi.fn(async () => {});

    const didRun = await runAdminGuardedAction(setMessage, action);

    expect(didRun).toBe(false);
    expect(action).not.toHaveBeenCalled();
    expect(setMessage).toHaveBeenCalledWith('You are not authorized to manage blog posts.');
  });
});
