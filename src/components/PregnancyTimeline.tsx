import { formatDate } from '../lib/calc';

interface PregnancyTimelineProps {
  dueDate: Date;
}

const TOTAL_WEEKS = 40;

export const PregnancyTimeline = ({ dueDate }: PregnancyTimelineProps) => {
  const now = new Date();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const weeksUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / msPerWeek);
  const rawWeek = TOTAL_WEEKS - weeksUntilDue;
  const currentWeek = Math.min(TOTAL_WEEKS, Math.max(1, rawWeek));
  const markerLeft = ((currentWeek - 1) / (TOTAL_WEEKS - 1)) * 100;
  const activeTrimester = currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3;

  return (
    <section className="timeline-card" aria-label="Pregnancy timeline">
      <h3>Pregnancy Timeline</h3>
      <p className="timeline-card__meta">
        You are around week {currentWeek} • Due {formatDate(dueDate)}
      </p>

      <div className="timeline-desktop" aria-hidden="true">
        <div className="timeline-track">
          <div className="timeline-band timeline-band--first">First Trimester<br />Weeks 1-13</div>
          <div className="timeline-band timeline-band--second">Second Trimester<br />Weeks 14-27</div>
          <div className="timeline-band timeline-band--third">Third Trimester<br />Weeks 28-40</div>
          <div className="timeline-marker" style={{ left: `${markerLeft}%` }}>
            <span className="timeline-marker__dot" />
            <span className="timeline-marker__label">Week {currentWeek}</span>
          </div>
        </div>
      </div>

      <div className="timeline-mobile">
        <article className={`timeline-mobile__item ${activeTrimester === 1 ? 'is-active' : ''}`}>
          <h4>First</h4>
          <p>Weeks 1-13</p>
        </article>
        <article className={`timeline-mobile__item ${activeTrimester === 2 ? 'is-active' : ''}`}>
          <h4>Second</h4>
          <p>Weeks 14-27</p>
        </article>
        <article className={`timeline-mobile__item ${activeTrimester === 3 ? 'is-active' : ''}`}>
          <h4>Third</h4>
          <p>Weeks 28-40</p>
        </article>
      </div>
    </section>
  );
};
