import { KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
import { addDays, normalizeDate } from '../lib/calc';
import { generateCalendarMonth, OvulationResult } from '../lib/ovulationCalc';

type FertilityCalendarProps = {
  lmp: Date;
  cycleLength: number;
  ovulationResult: OvulationResult;
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' });
const dayFormatter = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

const toIso = (value: Date): string => normalizeDate(value).toISOString().slice(0, 10);

const isSameDay = (a: Date, b: Date): boolean => toIso(a) === toIso(b);

const getPhaseClassName = (phaseLabel: string): string => {
  const normalized = phaseLabel.toLowerCase().replace(/\s+/g, '-');
  return `phase-${normalized}`;
};

export const FertilityCalendar = ({
  lmp,
  cycleLength,
  ovulationResult,
  selectedDate,
  onSelectDate,
}: FertilityCalendarProps) => {
  const initialFocusDate = selectedDate ?? ovulationResult.ovulationEstimate;
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(initialFocusDate.getFullYear(), initialFocusDate.getMonth(), 1),
  );
  const [focusedDate, setFocusedDate] = useState(normalizeDate(initialFocusDate));
  const [focusIntent, setFocusIntent] = useState(false);
  const dayButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const headingId = useId();

  useEffect(() => {
    const nextFocus = normalizeDate(selectedDate ?? ovulationResult.ovulationEstimate);
    setFocusedDate(nextFocus);
    setVisibleMonth(new Date(nextFocus.getFullYear(), nextFocus.getMonth(), 1));
  }, [selectedDate, ovulationResult.ovulationEstimate]);

  const days = useMemo(
    () => generateCalendarMonth(visibleMonth, ovulationResult, lmp, cycleLength),
    [visibleMonth, ovulationResult, lmp, cycleLength],
  );

  useEffect(() => {
    if (!focusIntent) {
      return;
    }

    const target = dayButtonRefs.current[toIso(focusedDate)];
    if (target) {
      target.focus();
      setFocusIntent(false);
    }
  }, [days, focusIntent, focusedDate]);

  const moveFocusByDays = (offset: number) => {
    const nextDate = addDays(focusedDate, offset);
    setFocusedDate(nextDate);
    setVisibleMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    setFocusIntent(true);
  };

  const onDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveFocusByDays(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveFocusByDays(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocusByDays(7);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocusByDays(-7);
    }
  };

  return (
    <section className="fertility-calendar" aria-labelledby={headingId}>
      <div className="fertility-calendar__header">
        <h3 id={headingId} className="fertility-calendar__title">Fertility calendar</h3>
        <div className="fertility-calendar__month-nav" aria-label="Calendar month navigation">
          <button
            type="button"
            className="fertility-calendar__month-button"
            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
            aria-label="Show previous month"
          >
            ←
          </button>
          <p className="fertility-calendar__month-label" aria-live="polite">{monthFormatter.format(visibleMonth)}</p>
          <button
            type="button"
            className="fertility-calendar__month-button"
            onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
            aria-label="Show next month"
          >
            →
          </button>
        </div>
      </div>

      <div className="fertility-calendar__weekday-row" role="row" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="fertility-calendar__weekday">{label}</span>
        ))}
      </div>

      <div className="fertility-calendar__grid" role="grid" aria-label="Fertility cycle calendar">
        {days.map((day) => {
          const iso = toIso(day.date);
          const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : isSameDay(day.date, ovulationResult.ovulationEstimate);
          const isFocused = isSameDay(day.date, focusedDate);
          const isOvulation = isSameDay(day.date, ovulationResult.ovulationEstimate);
          const phaseClass = getPhaseClassName(day.phaseLabel);
          const dayAriaLabel = [
            dayFormatter.format(day.date),
            `cycle day ${day.cycleDay}`,
            day.phaseLabel,
            day.isPeakFertility ? 'peak fertility window' : null,
            isOvulation ? 'estimated ovulation day' : null,
            day.fertilityProbability > 0 ? `${Math.round(day.fertilityProbability * 100)}% fertility probability` : 'low fertility probability',
          ]
            .filter(Boolean)
            .join(', ');

          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              ref={(node) => {
                dayButtonRefs.current[iso] = node;
              }}
              onKeyDown={onDayKeyDown}
              onFocus={() => setFocusedDate(day.date)}
              onClick={() => {
                setFocusedDate(day.date);
                onSelectDate?.(day.date);
              }}
              aria-label={dayAriaLabel}
              aria-selected={isSelected}
              tabIndex={isFocused ? 0 : -1}
              className={[
                'fertility-calendar__day',
                phaseClass,
                day.inCurrentMonth ? '' : 'is-outside-month',
                day.isFertileWindow ? 'is-fertile-window phase-fertile' : '',
                day.isPeakFertility ? 'phase-peak' : '',
                isOvulation ? 'phase-ovulation' : '',
                isSelected ? 'is-selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="fertility-calendar__day-number">{day.date.getDate()}</span>
              <span className="fertility-calendar__day-meta">D{day.cycleDay}</span>
              {isOvulation ? <span aria-hidden="true" className="fertility-calendar__indicator">◎</span> : null}
              {day.isPeakFertility && !isOvulation ? <span aria-hidden="true" className="fertility-calendar__indicator">★</span> : null}
              {day.phaseLabel === 'Menstrual' ? <span aria-hidden="true" className="fertility-calendar__indicator">●</span> : null}
            </button>
          );
        })}
      </div>

      <ul className="fertility-calendar__legend" aria-label="Calendar legend">
        <li><span aria-hidden="true">●</span> Menstrual phase</li>
        <li><span aria-hidden="true">◌</span> Fertile window</li>
        <li><span aria-hidden="true">★</span> Peak fertility</li>
        <li><span aria-hidden="true">◎</span> Estimated ovulation day</li>
      </ul>
    </section>
  );
};
