import { describe, expect, test } from 'vitest';
import { conceptionToDueDate, gestationalAge, ivfToDueDate, lmpToDueDate, validateLMP } from '../src/lib/calc';

describe('pregnancy calculations', () => {
  test('LMP 2026-02-13 (28 day) => 2026-11-20', () => {
    expect(lmpToDueDate(new Date('2026-02-13T00:00:00'), 28).toISOString().slice(0, 10)).toBe('2026-11-20');
  });

  test('LMP 2025-12-01 (32 day) => +4 days', () => {
    expect(lmpToDueDate(new Date('2025-12-01T00:00:00'), 32).toISOString().slice(0, 10)).toBe('2026-09-11');
  });

  test('Conception 2026-03-01 => +266 days', () => {
    expect(conceptionToDueDate(new Date('2026-03-01T00:00:00')).toISOString().slice(0, 10)).toBe('2026-11-22');
  });

  test('IVF transfer 2026-05-10 embryo 5', () => {
    expect(ivfToDueDate(new Date('2026-05-10T00:00:00'), 5).toISOString().slice(0, 10)).toBe('2027-02-09');
  });

  test('Leap year LMP case', () => {
    expect(lmpToDueDate(new Date('2024-02-29T00:00:00'), 28).toISOString().slice(0, 10)).toBe('2024-12-05');
  });

  test('Future LMP invalid', () => {
    const future = new Date();
    future.setDate(future.getDate() + 10);
    expect(validateLMP(future).valid).toBe(false);
  });

  test('Gestational age correct', () => {
    const ga = gestationalAge(new Date('2026-01-01T00:00:00'), new Date('2026-01-15T00:00:00'));
    expect(ga.weeks).toBe(2);
    expect(ga.days).toBe(0);
  });

  test('Invalid input handling (>12 months old)', () => {
    expect(validateLMP(new Date('2020-01-01T00:00:00')).valid).toBe(false);
  });
});
