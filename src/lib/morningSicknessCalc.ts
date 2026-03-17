import { addDays, normalizeDate } from './calc';

const DAY_MS = 86_400_000;

export interface MorningSicknessTimeline {
  nauseaStart: Date;
  nauseaPeak: Date;
  likelyEnd: Date;
  expectedEnd: Date;
  outerBound: Date;
  gestationalWeek: number;
  gestationalDays: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const calculateMorningSicknessTimeline = (lmp: Date): MorningSicknessTimeline => {
  const normalizedLMP = normalizeDate(lmp);
  const today = normalizeDate(new Date());
  const totalDays = Math.max(0, Math.floor((today.getTime() - normalizedLMP.getTime()) / DAY_MS));

  return {
    nauseaStart: addDays(normalizedLMP, 42),
    nauseaPeak: addDays(normalizedLMP, 63),
    likelyEnd: addDays(normalizedLMP, 84),
    expectedEnd: addDays(normalizedLMP, 98),
    outerBound: addDays(normalizedLMP, 140),
    gestationalWeek: Math.floor(totalDays / 7),
    gestationalDays: totalDays % 7,
  };
};

export const validateMorningSicknessInputs = (lmp: Date): ValidationResult => {
  const errors: string[] = [];

  if (!(lmp instanceof Date) || Number.isNaN(lmp.getTime())) {
    errors.push('Please enter a valid last menstrual period date.');
    return { valid: false, errors };
  }

  const normalizedLMP = normalizeDate(lmp);
  const today = normalizeDate(new Date());

  if (normalizedLMP > today) {
    errors.push('Last menstrual period cannot be in the future.');
  }

  if (normalizedLMP < addDays(today, -366)) {
    errors.push('Last menstrual period must be within the past 12 months.');
  }

  return { valid: errors.length === 0, errors };
};
