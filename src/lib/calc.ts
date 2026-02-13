export interface GestationalAgeResult {
  totalDays: number;
  weeks: number;
  days: number;
}

export interface ConceptionWindowResult {
  start: Date;
  ovulationEstimate: Date;
  end: Date;
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export const normalizeDate = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, n: number): Date => {
  const d = normalizeDate(date);
  d.setDate(d.getDate() + n);
  return d;
};

export const addWeeks = (date: Date, n: number): Date => addDays(date, n * 7);

export const formatDate = (date: Date): string => {
  const zone = new Intl.DateTimeFormat('en-US', { timeZoneName: 'longOffset' }).formatToParts(date).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT';
  const abbr = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(date).find((p) => p.type === 'timeZoneName')?.value ?? '';
  const text = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  return `${text} (${zone} ${abbr})`;
};

export const lmpToDueDate = (lmp: Date, cycleLength: number): Date => addDays(normalizeDate(lmp), 280 + (cycleLength - 28));

export const conceptionToDueDate = (conception: Date): Date => addDays(normalizeDate(conception), 266);

export const ivfToDueDate = (transfer: Date, embryoAgeDays: number): Date => addDays(normalizeDate(transfer), 280 - embryoAgeDays);

export const gestationalAge = (lmp: Date, onDate: Date = new Date()): GestationalAgeResult => {
  const totalDays = Math.max(0, Math.floor((normalizeDate(onDate).getTime() - normalizeDate(lmp).getTime()) / 86400000));
  return { totalDays, weeks: Math.floor(totalDays / 7), days: totalDays % 7 };
};

export const conceptionWindow = (lmp: Date, cycleLength: number): ConceptionWindowResult => {
  const ovulationEstimate = addDays(normalizeDate(lmp), cycleLength - 14);
  return { start: addDays(ovulationEstimate, -3), ovulationEstimate, end: addDays(ovulationEstimate, 3) };
};

export const validateLMP = (lmp: Date): ValidationResult => {
  const today = normalizeDate(new Date());
  const d = normalizeDate(lmp);
  if (d > today) return { valid: false, message: 'Last menstrual period cannot be in the future.' };
  if (d < addDays(today, -366)) return { valid: false, message: 'Last menstrual period must be within the past 12 months.' };
  return { valid: true };
};

export const trimesterFromDueDate = (dueDate: Date, today: Date = new Date()): string => {
  const daysRemaining = Math.floor((normalizeDate(dueDate).getTime() - normalizeDate(today).getTime()) / 86400000);
  const gestDays = 280 - daysRemaining;
  if (gestDays < 13 * 7) return 'First trimester';
  if (gestDays < 27 * 7) return 'Second trimester';
  return 'Third trimester';
};
