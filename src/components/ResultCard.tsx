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

const getBabySize = (weeks: number): { name: string; length: string } => {
  if (weeks < 8) return { name: 'Raspberry', length: '0.6 inches' };
  if (weeks < 12) return { name: 'Lime', length: '2 inches' };
  if (weeks < 16) return { name: 'Lemon', length: '3.5 inches' };
  if (weeks < 20) return { name: 'Banana', length: '6 inches' };
  if (weeks < 24) return { name: 'Corn', length: '10 inches' };
  if (weeks < 28) return { name: 'Eggplant', length: '13 inches' };
  if (weeks < 32) return { name: 'Pineapple', length: '15 inches' };
  if (weeks < 36) return { name: 'Honeydew', length: '17 inches' };
  return { name: 'Watermelon', length: '19 inches' };
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
  
  const babySize = useMemo(() => getBabySize(gestationalWeeks), [gestationalWeeks]);

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

  return (
    <section className={`results-card results-card--reveal ${revealed ? 'is-visible' : ''}`} aria-live="polite">
      <div className="results-header">
        <p className="eyebrow">CALCULATED RESULT</p>
        <h2 style={{ fontSize: '2.5rem', margin: '1rem 0 0.5rem' }}>Your SageNest Journey Begins</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          We've mapped out your path to parenthood. Here is everything you need to know about your pregnancy milestones.
        </p>
      </div>

      {/* Due Date and Countdown */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--sage-soft) 0%, white 100%)', 
        borderRadius: '20px', 
        padding: '2.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <p className="meta-label">Estimated Due Date</p>
          <div className="results-date">
            {formatDateToReadable(dueDate).split(',')[0]}
            <span> {new Date(dueDate).getFullYear()}</span>
          </div>
          <div className="cta-row" style={{ marginTop: '1.5rem' }}>
            <button onClick={handleShare}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share Result
            </button>
            <button onClick={() => window.print()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '180px', 
            height: '180px', 
            borderRadius: '50%', 
            border: '12px solid rgba(83, 226, 54, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: 'white'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '12px solid transparent',
              borderTopColor: 'var(--primary)',
              animation: 'spin 8s linear infinite'
            }} />
            <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {daysToGo}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Days to go
              </div>
            </div>
          </div>
        </div>
      </div>

      {shareStatus && <p className="privacy" role="status">{shareStatus}</p>}

      {/* Metrics Grid */}
      <div className="results-meta">
        <div className="meta-item">
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'var(--primary-light)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--primary)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <p className="meta-label">Current Stage</p>
          <p className="meta-value">Week {gestationalWeeks}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            You are officially {gestationalWeeks < 20 ? 'building the foundation' : gestationalWeeks < 30 ? 'halfway through' : 'in the home stretch'}!
          </p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: 'var(--border-light)', 
            borderRadius: '999px', 
            marginTop: '1rem',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${(gestationalWeeks / 40) * 100}%`, 
              height: '100%', 
              background: 'var(--primary)',
              borderRadius: '999px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <div className="meta-item">
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: 'var(--primary-light)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--primary)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <p className="meta-label">Current Trimester</p>
          <p className="meta-value">
            {trimester === 'First trimester' ? 'First' : trimester === 'Second trimester' ? 'Second' : 'Third'}
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {trimester === 'First trimester' ? 'The foundation of life' : trimester === 'Second trimester' ? 'The "golden period"' : 'The final stretch'}
          </p>
          <div style={{ display: 'flex', gap: '4px', marginTop: '1rem' }}>
            <div style={{ 
              flex: 1, 
              height: '4px', 
              background: trimester === 'First trimester' || trimester === 'Second trimester' || trimester === 'Third trimester' ? 'var(--primary)' : 'var(--border-light)',
              borderRadius: '999px'
            }} />
            <div style={{ 
              flex: 1, 
              height: '4px', 
              background: trimester === 'Second trimester' || trimester === 'Third trimester' ? 'var(--primary)' : 'var(--border-light)',
              borderRadius: '999px'
            }} />
            <div style={{ 
              flex: 1, 
              height: '4px', 
              background: trimester === 'Third trimester' ? 'var(--primary)' : 'var(--border-light)',
              borderRadius: '999px'
            }} />
          </div>
        </div>

        <div className="meta-item">
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--border-light)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem'
          }}>
            🍌
          </div>
          <p className="meta-label">Baby's Size</p>
          <p className="meta-value">{babySize.name}</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            approx. {babySize.length} long
          </p>
        </div>
      </div>

      {/* Progress and Milestone */}
      <div style={{ 
        background: 'var(--sage-soft)', 
        borderRadius: '20px', 
        padding: '2rem',
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <ProgressWheel value={progress} />
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Next Milestone</h3>
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{milestone}</p>
        </div>
      </div>

      {conceptionDate && (
        <p style={{ 
          textAlign: 'center', 
          marginTop: '2rem', 
          color: 'var(--text-secondary)',
          fontSize: '0.95rem'
        }}>
          <strong>Estimated conception date:</strong> {formatDateToReadable(conceptionDate)}
        </p>
      )}

      <p className="privacy" style={{ marginTop: '2rem' }}>
        No personal data collected. All calculations happen securely in your browser.
      </p>
    </section>
  );
};
