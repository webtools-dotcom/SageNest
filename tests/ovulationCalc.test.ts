import { describe, expect, test } from 'vitest';
import { calculateOvulation, validateOvulationInputs } from '../src/lib/ovulationCalc';

const DAY_MS = 86_400_000;
const asDateOnly = (value: Date): string => value.toISOString().slice(0, 10);

describe('ovulation calculations', () => {
  test('28-day cycle ovulation date (day 14 from LMP baseline)', () => {
    const result = calculateOvulation(new Date('2026-02-13T00:00:00'), 28);
    expect(asDateOnly(result.ovulationEstimate)).toBe('2026-02-27');
  });

  test('32-day cycle ovulation date (day 18 from LMP baseline)', () => {
    const result = calculateOvulation(new Date('2026-02-13T00:00:00'), 32);
    expect(asDateOnly(result.ovulationEstimate)).toBe('2026-03-03');
  });

  test('fertile window duration = 6 days inclusive', () => {
    const result = calculateOvulation(new Date('2026-02-13T00:00:00'), 28);
    const durationDays = Math.round((result.fertileWindowEnd.getTime() - result.fertileWindowStart.getTime()) / DAY_MS) + 1;
    expect(durationDays).toBe(6);
  });

  test('peak fertility duration = 3 days inclusive', () => {
    const result = calculateOvulation(new Date('2026-02-13T00:00:00'), 28);
    const durationDays = Math.round((result.peakFertilityEnd.getTime() - result.peakFertilityStart.getTime()) / DAY_MS) + 1;
    expect(durationDays).toBe(3);
  });

  test('validation failure for future LMP', () => {
    const future = new Date();
    future.setDate(future.getDate() + 1);

    expect(validateOvulationInputs(future, 28).valid).toBe(false);
  });

  test('validation failure for cycle length below 21', () => {
    expect(validateOvulationInputs(new Date('2026-02-13T00:00:00'), 20).valid).toBe(false);
  });

  test('validation failure for cycle length above 40', () => {
    expect(validateOvulationInputs(new Date('2026-02-13T00:00:00'), 41).valid).toBe(false);
  });

  test('validation failure for stale LMP (>12 months)', () => {
    const stale = new Date();
    stale.setDate(stale.getDate() - 367);

    expect(validateOvulationInputs(stale, 28).valid).toBe(false);
  });
});
