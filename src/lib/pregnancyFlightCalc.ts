import { addDays, normalizeDate } from './calc';

const DAY_MS = 86_400_000;

export interface PregnancyFlightSafetyResult {
  gestationalWeeksAtFlight: number;
  gestationalDaysRemainder: number;
  verdict: string;
  label: 'safe' | 'caution' | 'restricted';
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const calculatePregnancyFlightSafety = (
  lmpDate: Date,
  flightDate: Date,
): PregnancyFlightSafetyResult => {
  const normalizedLmp = normalizeDate(lmpDate);
  const normalizedFlight = normalizeDate(flightDate);
  const totalDays = Math.floor((normalizedFlight.getTime() - normalizedLmp.getTime()) / DAY_MS);
  const gestationalWeeksAtFlight = Math.floor(totalDays / 7);
  const gestationalDaysRemainder = totalDays % 7;

  if (gestationalWeeksAtFlight > 40) {
    return {
      gestationalWeeksAtFlight,
      gestationalDaysRemainder,
      verdict: 'Past estimated due date. Flying is not recommended.',
      label: 'restricted',
    };
  }

  if (gestationalWeeksAtFlight >= 36) {
    return {
      gestationalWeeksAtFlight,
      gestationalDaysRemainder,
      verdict:
        "Most airlines do not permit travel at 36+ weeks. Do not book without written airline approval and OB clearance.",
      label: 'restricted',
    };
  }

  if (gestationalWeeksAtFlight >= 32) {
    return {
      gestationalWeeksAtFlight,
      gestationalDaysRemainder,
      verdict:
        "Many airlines require a doctor's letter. Some long-haul carriers restrict travel. Confirm with your airline before booking.",
      label: 'caution',
    };
  }

  if (gestationalWeeksAtFlight >= 28) {
    return {
      gestationalWeeksAtFlight,
      gestationalDaysRemainder,
      verdict:
        "Safe for most domestic flights. Some international carriers require a doctor's letter.",
      label: 'caution',
    };
  }

  return {
    gestationalWeeksAtFlight,
    gestationalDaysRemainder,
    verdict: 'Generally safe to fly',
    label: 'safe',
  };
};

export const validatePregnancyFlightInputs = (lmpDate: Date, flightDate: Date): ValidationResult => {
  const errors: string[] = [];

  if (!(lmpDate instanceof Date) || Number.isNaN(lmpDate.getTime())) {
    errors.push('Please enter a valid LMP date.');
    return { valid: false, errors };
  }

  if (!(flightDate instanceof Date) || Number.isNaN(flightDate.getTime())) {
    errors.push('Please enter a valid flight date.');
    return { valid: false, errors };
  }

  const today = normalizeDate(new Date());
  const normalizedLmp = normalizeDate(lmpDate);
  const normalizedFlight = normalizeDate(flightDate);

  if (normalizedLmp > today) {
    errors.push('LMP date cannot be in the future.');
  }

  if (normalizedLmp < addDays(today, -366)) {
    errors.push('LMP date must be within the past 12 months.');
  }

  if (normalizedFlight <= today) {
    errors.push('Flight date must be in the future.');
  }

  if (normalizedFlight > addDays(normalizedLmp, 294)) {
    errors.push('Flight date cannot be more than 42 weeks after LMP.');
  }

  if (normalizedFlight < normalizedLmp) {
    errors.push('Flight date cannot be before your LMP date.');
  }

  return { valid: errors.length === 0, errors };
};
