import { describe, expect, test } from 'vitest';
import { calculatePregnancyWeightGain, formatKg } from '../src/lib/pregnancyWeightGain';

type Case = {
  input: {
    prePregnancyWeightKg: number;
    heightCm: number;
    currentWeek?: number;
    currentWeightKg?: number;
  };
  expected: {
    bmi: string;
    category: string;
    totalGainRange: [string, string];
    gainSoFar?: string;
  };
};

const cases: Case[] = [
  {
    input: { prePregnancyWeightKg: 50, heightCm: 170, currentWeek: 20, currentWeightKg: 56 },
    expected: {
      bmi: '17.3',
      category: 'Underweight (BMI below 18.5)',
      totalGainRange: ['12.5 kg', '18.0 kg'],
      gainSoFar: '6.0 kg'
    }
  },
  {
    input: { prePregnancyWeightKg: 65, heightCm: 165, currentWeek: 30, currentWeightKg: 74 },
    expected: {
      bmi: '23.9',
      category: 'Normal weight (BMI 18.5 to 24.9)',
      totalGainRange: ['11.5 kg', '16.0 kg'],
      gainSoFar: '9.0 kg'
    }
  },
  {
    input: { prePregnancyWeightKg: 95, heightCm: 170, currentWeek: 32, currentWeightKg: 101 },
    expected: {
      bmi: '32.9',
      category: 'Obesity (BMI 30.0 and above)',
      totalGainRange: ['5.0 kg', '9.0 kg'],
      gainSoFar: '6.0 kg'
    }
  }
];

describe('pregnancy weight gain calculator numeric cases', () => {
  test.each(cases)('calculates expected values for %o', ({ input, expected }) => {
    const result = calculatePregnancyWeightGain(
      input.prePregnancyWeightKg,
      input.heightCm,
      input.currentWeek,
      input.currentWeightKg
    );

    expect(result.bmi.toFixed(1)).toBe(expected.bmi);
    expect(result.band.label).toBe(expected.category);
    expect([formatKg(result.band.totalGain[0]), formatKg(result.band.totalGain[1])]).toEqual(expected.totalGainRange);

    if (expected.gainSoFar) {
      expect(result.gainSoFar).not.toBeNull();
      expect(formatKg(result.gainSoFar as number)).toBe(expected.gainSoFar);
    }
  });

  test('uses first-trimester range for weeks 1-13', () => {
    const result = calculatePregnancyWeightGain(60, 165, 12, 61);
    expect(result.recommendedByWeek).toEqual({ min: 0.5, max: 2 });
  });
});
