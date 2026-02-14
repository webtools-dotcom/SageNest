import { describe, expect, test, vi } from 'vitest';

vi.mock('../src/supabase/client', () => ({
  ADMIN_EMAIL: 'admin@example.com',
  supabase: {
    auth: {
      getUser: vi.fn()
    }
  }
}));

import { validateBlogImageUpload } from '../src/pages/BlogPoster';

const makeFile = (type: string, size: number) =>
  new File([new Uint8Array(size)], 'my-image.jpg', {
    type
  });

describe('validateBlogImageUpload', () => {
  test('allowed image passes validation', () => {
    const file = makeFile('image/png', 1024);

    expect(validateBlogImageUpload(file)).toBeNull();
  });

  test('disallowed MIME type is rejected', () => {
    const file = makeFile('application/pdf', 1024);

    expect(validateBlogImageUpload(file)).toBe(
      'Unsupported image type. Please upload one of: image/jpeg, image/png, image/webp.'
    );
  });

  test('oversized image is rejected', () => {
    const file = makeFile('image/jpeg', 2 * 1024 * 1024 + 1);

    expect(validateBlogImageUpload(file)).toBe('Image is too large. Maximum allowed size is 2MB.');
  });
});
