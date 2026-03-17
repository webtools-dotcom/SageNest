import { describe, expect, it } from 'vitest';
import { addDays, normalizeDate } from '../src/lib/calc';
import {
  calculatePregnancyFlightSafety,
  validatePregnancyFlightInputs,
} from '../src/lib/pregnancyFlightCalc';

describe('pregnancyFlightCalc', () => {
  it('returns safe verdict below 28 weeks', () => {
    const lmp = new Date('2026-01-01');
    const flight = addDays(lmp, 27 * 7 + 3);
    const result = calculatePregnancyFlightSafety(lmp, flight);

    expect(result.gestationalWeeksAtFlight).toBe(27);
    expect(result.gestationalDaysRemainder).toBe(3);
    expect(result.label).toBe('safe');
  });

  it('returns caution verdict from 32 to 35 weeks', () => {
    const lmp = new Date('2026-01-01');
    const flight = addDays(lmp, 33 * 7);
    const result = calculatePregnancyFlightSafety(lmp, flight);

    expect(result.label).toBe('caution');
    expect(result.verdict).toContain("doctor's letter");
  });

  it('returns restricted verdict at and after 36 weeks', () => {
    const lmp = new Date('2026-01-01');
    const flight = addDays(lmp, 36 * 7);
    const result = calculatePregnancyFlightSafety(lmp, flight);

    expect(result.label).toBe('restricted');
    expect(result.verdict).toContain('36+ weeks');
  });

  it('returns past due verdict when above 40 weeks', () => {
    const lmp = new Date('2026-01-01');
    const flight = addDays(lmp, 41 * 7);
    const result = calculatePregnancyFlightSafety(lmp, flight);

    expect(result.label).toBe('restricted');
    expect(result.verdict).toBe('Past estimated due date. Flying is not recommended.');
  });

  it('validates future flight and LMP range constraints', () => {
    const today = normalizeDate(new Date());
    const oldLmp = addDays(today, -367);
    const invalidFlight = addDays(today, -1);
    const validation = validatePregnancyFlightInputs(oldLmp, invalidFlight);

    expect(validation.valid).toBe(false);
    expect(validation.errors).toContain('LMP date must be within the past 12 months.');
    expect(validation.errors).toContain('Flight date must be in the future.');
  });
});
