import { addDays, normalizeDate } from './calc';

const DAY_MS = 86400000;

export interface ColostrumHarvestingResult {
  recommendedStart: Date;
  earliestStart: Date;
  collectionWindowEnd: Date;
  gestationalWeekAtStart: number;
  daysUntilStart: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const calculateColostrumHarvestingDates = (dueDate: Date): ColostrumHarvestingResult => {
  const normalizedDueDate = normalizeDate(dueDate);
  const today = normalizeDate(new Date());
  const recommendedStart = addDays(normalizedDueDate, -28);

  return {
    recommendedStart,
    earliestStart: addDays(normalizedDueDate, -42),
    collectionWindowEnd: normalizedDueDate,
    gestationalWeekAtStart: 36,
    daysUntilStart: Math.max(0, Math.floor((recommendedStart.getTime() - today.getTime()) / DAY_MS)),
  };
};

export const validateColostrumHarvestingInputs = (dueDate: Date): ValidationResult => {
  const errors: string[] = [];

  if (!(dueDate instanceof Date) || Number.isNaN(dueDate.getTime())) {
    errors.push('Please enter a valid due date.');
    return { valid: false, errors };
  }

  const normalizedDueDate = normalizeDate(dueDate);
  const today = normalizeDate(new Date());

  if (normalizedDueDate < today) {
    errors.push('Due date cannot be in the past.');
  }

  if (normalizedDueDate > addDays(today, 42 * 7)) {
    errors.push('Due date must be within the next 42 weeks.');
  }

  return { valid: errors.length === 0, errors };
};
