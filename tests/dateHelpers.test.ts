import { describe, expect, test } from 'vitest';
import { formatWeeksAndDays } from '../src/lib/dateHelpers';

describe('formatWeeksAndDays', () => {
  test('formats standard week/day values', () => {
    expect(formatWeeksAndDays(12, 3)).toBe('12w 3d');
  });

  test('normalizes overflow days into weeks', () => {
    expect(formatWeeksAndDays(10, 9)).toBe('11w 2d');
  });

  test('clamps invalid and negative values', () => {
    expect(formatWeeksAndDays(-2, -1)).toBe('0w 0d');
    expect(formatWeeksAndDays(Number.NaN, Number.POSITIVE_INFINITY)).toBe('0w 0d');
  });
});
