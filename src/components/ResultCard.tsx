import { useEffect, useMemo, useState } from 'react';
import { formatDateToReadable } from '../lib/dateHelpers';
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
  { week: 12, label: 'First trimester screening' },
  { week: 20, label: 'Anatomy scan' },
  { week: 28, label: 'Third trimester planning' },
  { week: 36, label: 'Weekly appointments begin' }
];

const getMilestoneMessage = (weeks: number) => {
  const next = MILESTONES.find((milestone) => weeks < milestone.week);

  if (next) {
    const delta = next.week - weeks;
    const nearText = delta <= 1 ? 'this week' : `in ${delta} weeks`;
    return `${next.label} ${nearText}`;
  }

  return 'Continue regular check-ins with your care team';
};

const getShareText = ({ dueDate, gestationalWeeks, gestationalDays, trimester, conceptionDate }: ResultCardProps) => {
  const lines = [
    `Estimated due date: ${formatDateToReadable(dueDate)}`,
    `Gestational age: ${gestationalWeeks}w ${gestationalDays}d`,
    `Trimester: ${trimester}`
  ];

  if (conceptionDate) {
    lines.push(`Estimated conception: ${formatDateToReadable(conceptionDate)}`);
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

  const daysToGo = useMemo(() => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [dueDate]);

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

  const formatDueDate = () => {
    const date = formatDateToReadable(dueDate);
    const parts = date.split(',');
    return { monthDay: parts[0], year: parts[1]?.trim() || new Date(dueDate).getFullYear() };
  };

  const { monthDay, year } = formatDueDate();

  return (
    <section className={`results-card results-card--reveal ${revealed ? 'is-visible' : ''}`} aria-live="polite">
      <div className="results-header">
        <p className="eyebrow">Your Result</p>
        <h2>Your estimated due date</h2>
      </div>

      <div className="results-date">
        {monthDay}
        <span>, {year}</span>
      </div>

      <div className="cta-row" style={{ justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
        <button onClick={handleShare}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
        <button onClick={() => window.print()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print
        </button>
      </div>

      {shareStatus && <p className="privacy" role="status">{shareStatus}</p>}

      <div className="results-meta" style={{ marginTop: 'var(--space-xl)' }}>
        <div className="meta-item">
          <p className="meta-label">Gestational Age</p>
          <p className="meta-value">{gestationalWeeks}w {gestationalDays}d</p>
        </div>

        <div className="meta-item">
          <p className="meta-label">Trimester</p>
          <p className="meta-value">
            {trimester === 'First trimester' ? 'First' : trimester === 'Second trimester' ? 'Second' : 'Third'}
          </p>
        </div>

        <div className="meta-item">
          <p className="meta-label">Days Until Due</p>
          <p className="meta-value">{daysToGo}</p>
        </div>
      </div>

      <div style={{ 
        background: 'var(--sand)', 
        borderRadius: 'var(--radius-md)', 
        padding: 'var(--space-xl)',
        marginTop: 'var(--space-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-xl)',
        flexWrap: 'wrap',
        border: '1px solid var(--border-hairline)'
      }}>
        <ProgressWheel value={progress} />
        <div style={{ flex: 1, minWidth: '240px' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-sm)' }}>Next Milestone</h3>
          <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            {milestone}
          </p>
        </div>
      </div>

      {conceptionDate && (
        <p style={{ 
          textAlign: 'center', 
          marginTop: 'var(--space-lg)', 
          color: 'var(--text-secondary)',
          fontSize: '0.9375rem'
        }}>
          Estimated conception: {formatDateToReadable(conceptionDate)}
        </p>
      )}

      <p className="privacy" style={{ marginTop: 'var(--space-xl)' }}>
        All calculations happen in your browser. No data is collected or stored.
      </p>
    </section>
  );
};
