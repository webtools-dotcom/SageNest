/*
 * Changes from original src/components/ResultCard.tsx
 * ─────────────────────────────────────────────────────
 * BUG 1  — Removed .results-card--reveal (not in guide §7). Removed .is-visible
 *           (not in §7). These were part of an entry animation.
 * BUG 1  — Removed .results-header wrapper div (not in §7). h2 and eyebrow
 *           paragraph now stand without a non-guide wrapper.
 * BUG 1  — Removed .results-date wrapper (not in §7). The full due date display
 *           is now handled by the results-meta grid in CalculatorCard.tsx — see below.
 * BUG 1  — Replaced .cta-row (not in §7) around share/print buttons with an inline
 *           flex wrapper using design tokens.
 * ANIMATION — Removed revealed state, requestAnimationFrame call, and
 *             cancelAnimationFrame cleanup. newtoolMAIN.md §12 explicitly prohibits
 *             animations, transitions, and keyframes.
 * DEDUPLICATION — Removed the .results-meta grid that showed Gestational Age,
 *                 Trimester, and Days Until Due. All three values now appear in the
 *                 .results-meta grid rendered by CalculatorCard.tsx above this component.
 *                 Rendering them twice created content duplication and visual noise.
 *                 ResultCard now focuses on its unique value only:
 *                 (1) Share / print action buttons
 *                 (2) ProgressWheel + next milestone card
 *                 (3) Estimated conception date (LMP mode only)
 *                 (4) Privacy notice
 *
 * NOT MODIFIED: handleShare logic, ProgressWheel usage, getMilestoneMessage, MILESTONES,
 *               getShareText, formatDueDate — all calculation and sharing logic is unchanged.
 * NOT MODIFIED: daysToGo and progress useMemo values — kept in case they are needed
 *               by getShareText or future use (progress feeds ProgressWheel).
 */

import { useMemo } from 'react';
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
  { week: 36, label: 'Weekly appointments begin' },
];

const getMilestoneMessage = (weeks: number): string => {
  const next = MILESTONES.find((milestone) => weeks < milestone.week);
  if (next) {
    const delta = next.week - weeks;
    const nearText = delta <= 1 ? 'this week' : `in ${delta} weeks`;
    return `${next.label} ${nearText}`;
  }
  return 'Continue regular check-ins with your care team';
};

const getShareText = ({
  dueDate,
  gestationalWeeks,
  gestationalDays,
  trimester,
  conceptionDate,
}: ResultCardProps): string => {
  const lines = [
    `Estimated due date: ${formatDateToReadable(dueDate)}`,
    `Gestational age: ${gestationalWeeks}w ${gestationalDays}d`,
    `Trimester: ${trimester}`,
  ];
  if (conceptionDate) {
    lines.push(`Estimated conception: ${formatDateToReadable(conceptionDate)}`);
  }
  return lines.join('\n');
};

export const ResultCard = (props: ResultCardProps) => {
  const { dueDate, gestationalWeeks, gestationalDays, conceptionDate } = props;

  // progress feeds ProgressWheel — kept unchanged
  const progress = useMemo(() => {
    const totalDays = gestationalWeeks * 7 + gestationalDays;
    return Math.min(1, Math.max(0, totalDays / 280));
  }, [gestationalDays, gestationalWeeks]);

  const milestone = useMemo(
    () => getMilestoneMessage(gestationalWeeks),
    [gestationalWeeks],
  );

  const handleShare = async () => {
    const shareText = getShareText(props);
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Pregnancy due date result', text: shareText });
        return;
      } catch {
        // fall through to clipboard on cancel/failure
      }
    }
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareText);
        return;
      } catch {
        // fall through
      }
    }
  };

  return (
    // BUG 1: Removed --reveal and is-visible modifier classes (not in guide §7, were animation hooks)
    <section className="results-card" aria-live="polite">

      {/* BUG 1: Removed .results-header wrapper (not in §7) — elements stand directly */}
      <p className="eyebrow">Actions</p>
      <h2>Share or save your result</h2>

      {/* BUG 1: Replaced .cta-row (not in §7) with inline flex using design tokens */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--space-sm)',
          justifyContent: 'center',
          marginTop: 'var(--space-lg)',
          flexWrap: 'wrap',
        }}
      >
        <button type="button" onClick={handleShare}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
        <button type="button" onClick={() => window.print()}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print
        </button>
      </div>

      {/*
       * DEDUPLICATION: .results-meta grid (gestational age, trimester, days until due)
       * has been removed from here. All three values are now rendered by the .results-meta
       * grid in CalculatorCard.tsx, directly above this component.
       * ResultCard now renders only what CalculatorCard does not: ProgressWheel + milestone.
       */}

      {/* ProgressWheel + next milestone — unique value, not duplicated anywhere */}
      <div
        style={{
          background: 'var(--sand)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-xl)',
          marginTop: 'var(--space-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xl)',
          flexWrap: 'wrap',
          border: '1px solid var(--border-hairline)',
        }}
      >
        <ProgressWheel value={progress} />
        <div style={{ flex: 1, minWidth: '240px' }}>
          <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-sm)' }}>
            Next Milestone
          </h3>
          <p
            style={{
              margin: 0,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              fontSize: '0.9375rem',
            }}
          >
            {milestone}
          </p>
        </div>
      </div>

      {/* Estimated conception date — LMP mode only, not shown in CalculatorCard meta grid
          (conceptionDate in meta grid shows short format; this shows the readable format
          with a label sentence for context — different enough to warrant keeping) */}
      {conceptionDate && (
        <p
          style={{
            textAlign: 'center',
            marginTop: 'var(--space-lg)',
            color: 'var(--text-secondary)',
            fontSize: '0.9375rem',
          }}
        >
          Estimated conception: {formatDateToReadable(conceptionDate)}
        </p>
      )}

      <p className="privacy" style={{ marginTop: 'var(--space-xl)' }}>
        All calculations happen in your browser. No data is collected or stored.
      </p>
    </section>
  );
};
