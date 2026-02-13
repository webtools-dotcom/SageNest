import type { CSSProperties } from 'react';

interface ProgressWheelProps {
  value: number;
}

const clampProgress = (value: number): number => Math.min(1, Math.max(0, value));

export const progressToPercent = (value: number): number => Math.round(clampProgress(value) * 100);

export const progressToCircumference = (value: number, radius: number): number => {
  const safeRadius = Math.max(0, radius);
  const circumference = 2 * Math.PI * safeRadius;
  return circumference * clampProgress(value);
};

export const ProgressWheel = ({ value }: ProgressWheelProps) => {
  const percent = progressToPercent(value);

  return (
    <div className="progress-wheel" role="status" aria-label={`Pregnancy progress ${percent}%`}>
      <div className="progress-wheel__ring" style={{ '--progress': `${percent}%` } as React.CSSProperties}>
        <div className="progress-wheel__inner">
          <div className="progress-wheel__value">{percent}%</div>
        </div>
      </div>
      <p className="progress-wheel__label">Progress through 40 weeks</p>
    </div>
  );
};
