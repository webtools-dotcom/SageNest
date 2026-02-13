import type { CSSProperties } from 'react';

interface ProgressWheelProps {
  value: number;
}

export const ProgressWheel = ({ value }: ProgressWheelProps) => {
  const clamped = Math.min(1, Math.max(0, value));
  const percent = Math.round(clamped * 100);

  return (
    <div className="progress-wheel" role="status" aria-label={`Pregnancy progress ${percent}%`}>
      <div className="progress-wheel__ring" style={{ '--progress': `${percent}%` } as CSSProperties}>
        <span className="progress-wheel__value">{percent}%</span>
      </div>
      <p className="progress-wheel__label">Progress through 40 weeks</p>
    </div>
  );
};
