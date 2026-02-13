import { useEffect, useMemo, useState } from 'react';
import { formatDateToReadable, formatWeeksAndDays } from '../lib/dateHelpers';
import { ProgressWheel } from './ProgressWheel';

interface ResultCardProps {
  dueDate: Date;
  gestationalWeeks: number;
  gestationalDays: number;
  trimester: string;
  conceptionDate?: Date;
}

interface Milestone {
  week: number;
  label: string;
}

const MILESTONES: Milestone[] = [
  { week: 12, label: 'First trimester screening window' },
  { week: 20, label: 'Anatomy scan window' },
  { week: 28, label: 'Third trimester labs and planning check-in' },
  { week: 36, label: 'Weekly appointment cadence often begins' }
];

const getMilestoneMessage = (weeks: number) => {
  const next = MILESTONES.find((milestone) => weeks < milestone.week);

  if (next) {
    const delta = next.week - weeks;
    const nearText = delta <= 1 ? 'coming up now' : `in about ${delta} weeks`;
    return `${next.label} is ${nearText}.`;
  }

  return 'Final stretch: continue regular check-ins and birth planning with your care team.';
};

const getShareText = ({ dueDate, gestationalWeeks, gestationalDays, trimester, conceptionDate }: ResultCardProps) => {
  const lines = [
    `Estimated due date: ${formatDateToReadable(dueDate)}`,
    `Gestational age: ${gestationalWeeks}w ${gestationalDays}d`,
    `Trimester: ${trimester}`
  ];

  if (conceptionDate) {
    lines.push(`Estimated conception date: ${formatDateToReadable(conceptionDate)}`);
  }

  return lines.join('\n');
};

export const ResultCard = (props: ResultCardProps) => {
  const { dueDate, gestationalWeeks, gestationalDays, trimester, conceptionDate } = props;
  const [revealed, setRevealed] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [dueDate.getTime()]);

  const progress = useMemo(() => {
    const totalDays = gestationalWeeks * 7 + gestationalDays;
    return Math.min(1, Math.max(0, totalDays / 280));
  }, [gestationalDays, gestationalWeeks]);

  const milestone = useMemo(() => getMilestoneMessage(gestationalWeeks), [gestationalWeeks]);

  const handleShare = async () => {
    const shareText = getShareText(props);

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pregnancy due date result',
          text: shareText
        });
        setShareStatus('Shared successfully.');
        return;
      } catch {
        // fall through to clipboard on cancel/failure
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareText);
        setShareStatus('Copied to clipboard.');
        return;
      } catch {
        setShareStatus('Unable to share right now.');
        return;
      }
    }

    setShareStatus('Sharing is unavailable on this browser.');
  };

  return (
    <section className={`results-card results-card--reveal ${revealed ? 'is-visible' : ''}`} aria-live="polite">
      <p className="eyebrow">Estimated due date</p>
      <h2>{formatDateToReadable(dueDate)}</h2>

      <div className="results-card__meta">
        <p><strong>Gestational age:</strong> {formatWeeksAndDays(gestationalWeeks, gestationalDays)}</p>
        <p><strong>Trimester:</strong> <span className="trimester-badge">{trimester}</span></p>
        {conceptionDate ? <p><strong>Estimated conception date:</strong> {formatDateToReadable(conceptionDate)}</p> : null}
      </div>

      <div className="results-card__progress">
        <ProgressWheel value={progress} />
        <p className="results-card__milestone"><strong>Milestone:</strong> {milestone}</p>
      </div>

      <div className="cta-row">
        <button type="button" onClick={handleShare}>Share result</button>
        <button type="button" onClick={() => window.print()}>Print</button>
      </div>
      {shareStatus ? <p className="privacy" role="status">{shareStatus}</p> : null}
      <p className="privacy">No personal data collected. All calculations happen securely in your browser.</p>
    </section>
  );
};
