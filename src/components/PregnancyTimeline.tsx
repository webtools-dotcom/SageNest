import { formatDate } from '../lib/calc';

interface PregnancyTimelineProps {
  dueDate: Date;
}

export const PregnancyTimeline = ({ dueDate }: PregnancyTimelineProps) => {
  const firstTrimesterEnd = new Date(dueDate.getTime() - 27 * 7 * 86400000);
  const secondTrimesterEnd = new Date(dueDate.getTime() - 13 * 7 * 86400000);

  return (
    <section className="timeline-card">
      <h3>Pregnancy timeline checkpoints</h3>
      <ul>
        <li><strong>First trimester ends:</strong> {formatDate(firstTrimesterEnd)}</li>
        <li><strong>Second trimester ends:</strong> {formatDate(secondTrimesterEnd)}</li>
        <li><strong>Estimated due date:</strong> {formatDate(dueDate)}</li>
      </ul>
    </section>
  );
};
