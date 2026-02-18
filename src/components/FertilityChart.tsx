import { useId, useMemo } from 'react';
import { getFertilityProbability } from '../lib/ovulationCalc';

type FertilityChartProps = {
  cycleLength: number;
  ovulationCycleDay: number;
  selectedCycleDay: number;
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const FertilityChart = ({ cycleLength, ovulationCycleDay, selectedCycleDay }: FertilityChartProps) => {
  const chartId = useId();
  const titleId = useId();
  const descId = useId();

  const { points, selectedPoint, ovulationPoint } = useMemo(() => {
    const width = 640;
    const height = 220;
    const leftPad = 40;
    const rightPad = 16;
    const topPad = 18;
    const bottomPad = 28;

    const safeCycleLength = Math.max(21, Math.min(40, cycleLength));
    const maxProbability = 0.35;

    const data = Array.from({ length: safeCycleLength }, (_, index) => {
      const day = index + 1;
      const daysUntilOvulation = ovulationCycleDay - day;
      const probability = getFertilityProbability(daysUntilOvulation);

      const x = leftPad + (index * (width - leftPad - rightPad)) / (safeCycleLength - 1);
      const y = topPad + (1 - probability / maxProbability) * (height - topPad - bottomPad);

      return { day, probability, x, y };
    });

    const selected = data[clamp(selectedCycleDay, 1, safeCycleLength) - 1];
    const ovulation = data[clamp(ovulationCycleDay, 1, safeCycleLength) - 1];

    return {
      points: data,
      selectedPoint: selected,
      ovulationPoint: ovulation,
    };
  }, [cycleLength, ovulationCycleDay, selectedCycleDay]);

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');

  return (
    <figure className="fertility-chart" aria-labelledby={`${titleId} ${descId}`}>
      <figcaption id={titleId} className="fertility-chart__title">Estimated fertility probability by cycle day</figcaption>
      <p id={descId} className="fertility-chart__caption">
        This chart estimates conception probability through your cycle. The dot marks your selected day and the ring marks estimated ovulation.
      </p>
      <svg
        id={chartId}
        viewBox="0 0 640 220"
        role="img"
        aria-label="Line chart showing estimated fertility probability for each cycle day"
      >
        <line x1="40" y1="192" x2="624" y2="192" className="fertility-chart__axis" />
        <line x1="40" y1="18" x2="40" y2="192" className="fertility-chart__axis" />
        <path d={pathData} className="fertility-chart__line" />

        {points.filter((point) => point.day % 5 === 0 || point.day === 1 || point.day === points.length).map((point) => (
          <text key={point.day} x={point.x} y="208" textAnchor="middle" className="fertility-chart__tick">
            {point.day}
          </text>
        ))}

        <circle cx={ovulationPoint.x} cy={ovulationPoint.y} r="6" className="fertility-chart__ovulation-ring" />
        <circle cx={selectedPoint.x} cy={selectedPoint.y} r="5" className="fertility-chart__selected-dot" />
      </svg>
    </figure>
  );
};
