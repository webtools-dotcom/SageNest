export type Trimester = 'first' | 'second' | 'third';

export type BMIBandKey = 'underweight' | 'normal' | 'overweight' | 'obesity';

export type BMIBand = {
  key: BMIBandKey;
  label: string;
  min: number;
  max: number;
  totalGain: [number, number];
  weeklyGain: [number, number];
};

export const bmiBands: BMIBand[] = [
  { key: 'underweight', label: 'Underweight (BMI below 18.5)', min: 0, max: 18.5, totalGain: [12.5, 18], weeklyGain: [0.44, 0.58] },
  { key: 'normal', label: 'Normal weight (BMI 18.5 to 24.9)', min: 18.5, max: 25, totalGain: [11.5, 16], weeklyGain: [0.35, 0.5] },
  { key: 'overweight', label: 'Overweight (BMI 25.0 to 29.9)', min: 25, max: 30, totalGain: [7, 11.5], weeklyGain: [0.23, 0.33] },
  { key: 'obesity', label: 'Obesity (BMI 30.0 and above)', min: 30, max: Number.POSITIVE_INFINITY, totalGain: [5, 9], weeklyGain: [0.17, 0.27] }
];

export const weekRanges: Record<Trimester, [number, number]> = {
  first: [1, 13],
  second: [14, 27],
  third: [28, 42]
};

export const calculatePregnancyWeightGain = (
  prePregnancyWeightKg: number,
  heightCm: number,
  currentWeek?: number,
  currentWeightKg?: number
) => {
  const bmi = prePregnancyWeightKg / Math.pow(heightCm / 100, 2);
  const band = bmiBands.find((entry) => bmi >= entry.min && bmi < entry.max) ?? bmiBands[bmiBands.length - 1];

  const recommendedByWeek = typeof currentWeek === 'number'
    ? currentWeek <= 13
      ? { min: 0.5, max: 2 }
      : {
        min: 0.5 + (currentWeek - 13) * band.weeklyGain[0],
        max: 2 + (currentWeek - 13) * band.weeklyGain[1]
      }
    : null;

  const gainSoFar = typeof currentWeightKg === 'number'
    ? currentWeightKg - prePregnancyWeightKg
    : null;

  return {
    bmi,
    band,
    recommendedByWeek,
    gainSoFar
  };
};

export const formatKg = (value: number): string => `${value.toFixed(1)} kg`;
