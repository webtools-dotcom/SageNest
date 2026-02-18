import { addDays, normalizeDate } from './calc';

const DAY_MS = 86_400_000;

export interface OvulationResult {
  ovulationEstimate: Date;
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  peakFertilityStart: Date;
  peakFertilityEnd: Date;
  nextPeriodEstimate: Date;
}

export interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
  cycleDay: number;
  phaseLabel: string;
  isFertileWindow: boolean;
  isPeakFertility: boolean;
  fertilityProbability: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const getDaysBetween = (a: Date, b: Date): number => Math.floor((normalizeDate(a).getTime() - normalizeDate(b).getTime()) / DAY_MS);

const getCycleDay = (date: Date, lmp: Date, cycleLength: number): number => {
  const daysSinceLMP = getDaysBetween(date, lmp);
  const offset = ((daysSinceLMP % cycleLength) + cycleLength) % cycleLength;
  return offset + 1;
};

export const calculateOvulation = (lmp: Date, cycleLength: number): OvulationResult => {
  const normalizedLMP = normalizeDate(lmp);
  const ovulationEstimate = addDays(normalizedLMP, cycleLength - 14);

  return {
    ovulationEstimate,
    fertileWindowStart: addDays(ovulationEstimate, -5),
    fertileWindowEnd: ovulationEstimate,
    peakFertilityStart: addDays(ovulationEstimate, -2),
    peakFertilityEnd: ovulationEstimate,
    nextPeriodEstimate: addDays(normalizedLMP, cycleLength),
  };
};

const WILCOX_POINTS: Array<[number, number]> = [
  [0, 0.33],
  [1, 0.31],
  [2, 0.27],
  [3, 0.14],
  [4, 0.16],
  [5, 0.1],
];

export const getFertilityProbability = (daysUntilOvulation: number): number => {
  if (!Number.isFinite(daysUntilOvulation) || daysUntilOvulation < 0 || daysUntilOvulation > 5) {
    return 0;
  }

  const lowerDay = Math.floor(daysUntilOvulation);
  const upperDay = Math.ceil(daysUntilOvulation);

  const lowerPoint = WILCOX_POINTS.find(([day]) => day === lowerDay);
  const upperPoint = WILCOX_POINTS.find(([day]) => day === upperDay);

  if (!lowerPoint || !upperPoint) {
    return 0;
  }

  if (lowerDay === upperDay) {
    return lowerPoint[1];
  }

  const weight = daysUntilOvulation - lowerDay;
  return lowerPoint[1] + (upperPoint[1] - lowerPoint[1]) * weight;
};

export const getPhaseLabel = (cycleDay: number, cycleLength: number): string => {
  const ovulationCycleDay = cycleLength - 13;
  const fertileStart = ovulationCycleDay - 5;
  const peakStart = ovulationCycleDay - 2;

  if (cycleDay <= 5) {
    return 'Menstrual';
  }

  if (cycleDay >= peakStart && cycleDay <= ovulationCycleDay) {
    return 'Peak fertility';
  }

  if (cycleDay >= fertileStart && cycleDay <= ovulationCycleDay) {
    return 'Fertile window';
  }

  if (cycleDay < fertileStart) {
    return 'Follicular';
  }

  return 'Luteal';
};

export const generateCalendarMonth = (
  month: Date,
  ovulationResult: OvulationResult,
  lmp: Date,
  cycleLength: number,
): CalendarDay[] => {
  const firstOfMonth = normalizeDate(new Date(month.getFullYear(), month.getMonth(), 1));
  const lastOfMonth = normalizeDate(new Date(month.getFullYear(), month.getMonth() + 1, 0));

  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  const gridEnd = addDays(lastOfMonth, 6 - lastOfMonth.getDay());

  const days: CalendarDay[] = [];

  for (let cursor = gridStart; cursor <= gridEnd; cursor = addDays(cursor, 1)) {
    const currentDate = normalizeDate(cursor);
    const daysUntilOvulation = getDaysBetween(ovulationResult.ovulationEstimate, currentDate);
    const cycleDay = getCycleDay(currentDate, lmp, cycleLength);

    const isFertileWindow = currentDate >= ovulationResult.fertileWindowStart && currentDate <= ovulationResult.fertileWindowEnd;
    const isPeakFertility = currentDate >= ovulationResult.peakFertilityStart && currentDate <= ovulationResult.peakFertilityEnd;

    days.push({
      date: currentDate,
      inCurrentMonth: currentDate.getMonth() === firstOfMonth.getMonth(),
      cycleDay,
      phaseLabel: getPhaseLabel(cycleDay, cycleLength),
      isFertileWindow,
      isPeakFertility,
      fertilityProbability: getFertilityProbability(daysUntilOvulation),
    });
  }

  return days;
};

export const validateOvulationInputs = (lmp: Date, cycleLength: number): ValidationResult => {
  const errors: string[] = [];

  if (!(lmp instanceof Date) || Number.isNaN(lmp.getTime())) {
    errors.push('Please enter a valid last menstrual period date.');
  }

  const normalizedLMP = normalizeDate(lmp);
  const today = normalizeDate(new Date());

  if (normalizedLMP > today) {
    errors.push('Last menstrual period cannot be in the future.');
  }

  if (normalizedLMP < addDays(today, -366)) {
    errors.push('Last menstrual period must be within the past 12 months.');
  }

  if (!Number.isFinite(cycleLength) || cycleLength < 21 || cycleLength > 40) {
    errors.push('Cycle length must be between 21 and 40 days.');
  }

  return { valid: errors.length === 0, errors };
};
