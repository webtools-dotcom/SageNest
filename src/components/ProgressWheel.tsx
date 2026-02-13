import type { CSSProperties } from 'react';

interface ProgressWheelProps {
  weeks: number;
  days: number;
}

export const ProgressWheel = ({ weeks, days }: ProgressWheelProps) => {
  const totalDays = weeks * 7 + days;
  const progress = Math.min(100, Math.max(0, Math.round((totalDays / 280) * 100)));

  return (
    <div className="progress-wheel" role="status" aria-label={`Pregnancy progress ${progress}%`}>
      <div className="progress-wheel__ring" style={{ '--progress': `${progress}%` } as CSSProperties}>
        <span className="progress-wheel__value">{progress}%</span>
      </div>
      <p className="progress-wheel__label">Progress through 40 weeks</p>
    </div>
  );
};
