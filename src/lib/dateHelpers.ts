import { formatDate, gestationalAge, lmpToDueDate } from './calc';

export const formatDateToReadable = (date: Date): string => formatDate(date);

export const weeksAndDaysFromLMP = (lmp: Date, onDate: Date = new Date()) => gestationalAge(lmp, onDate);

export const dueDateFromLMP = (lmp: Date, cycleLength: number): Date => lmpToDueDate(lmp, cycleLength);

export const formatWeeksAndDays = (weeks: number, days: number): string => {
  const safeWeeks = Number.isFinite(weeks) ? Math.max(0, Math.floor(weeks)) : 0;
  const safeDays = Number.isFinite(days) ? Math.max(0, Math.floor(days)) : 0;
  const totalDays = safeWeeks * 7 + safeDays;

  return `${Math.floor(totalDays / 7)}w ${totalDays % 7}d`;
};
