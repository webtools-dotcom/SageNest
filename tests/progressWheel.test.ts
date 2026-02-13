import { describe, expect, test } from 'vitest';
import { progressToCircumference, progressToPercent } from '../src/components/ProgressWheel';

describe('ProgressWheel mapping helpers', () => {
  test('maps progress values to percentage with clamping', () => {
    expect(progressToPercent(0)).toBe(0);
    expect(progressToPercent(0.5)).toBe(50);
    expect(progressToPercent(1)).toBe(100);
    expect(progressToPercent(1.2)).toBe(100);
    expect(progressToPercent(-0.2)).toBe(0);
  });

  test('maps progress values to circumference segment length', () => {
    const radius = 10;
    const full = 2 * Math.PI * radius;

    expect(progressToCircumference(0, radius)).toBeCloseTo(0, 6);
    expect(progressToCircumference(0.25, radius)).toBeCloseTo(full * 0.25, 6);
    expect(progressToCircumference(1, radius)).toBeCloseTo(full, 6);
    expect(progressToCircumference(5, radius)).toBeCloseTo(full, 6);
    expect(progressToCircumference(0.5, -3)).toBeCloseTo(0, 6);
  });
});
