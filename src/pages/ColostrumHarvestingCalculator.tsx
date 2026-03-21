import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DisclaimerBox } from "../components/DisclaimerBox";
import { SEOHead } from "../components/SEOHead";
import { addDays, normalizeDate } from "../lib/calc";
import {
  calculateColostrumHarvestingDates,
  validateColostrumHarvestingInputs,
} from "../lib/colostrumHarvestingCalc";

type FieldErrors = {
  dueDate?: string;
};

const FAQ_ITEMS = [
  {
    question: "When should I start harvesting colostrum?",
    answer:
      "NHS guidance recommends starting antenatal colostrum harvesting at 36 weeks of pregnancy, which is typically 4 weeks before your estimated due date. Starting earlier is not generally advised unless your midwife or consultant specifically recommends it, as nipple stimulation before 36 weeks can trigger uterine contractions.",
  },
  {
    question: "What is colostrum and why harvest it before birth?",
    answer:
      "Colostrum is the first milk your body produces, rich in antibodies, white blood cells, and growth factors. Harvesting it before birth means you have a stored supply ready if your baby needs supplemental feeding in the first hours or days — particularly valuable for babies born to mothers with gestational diabetes, those at risk of low blood sugar (hypoglycemia), babies with a cleft lip or palate, or those with a tongue tie that makes latching difficult.",
  },
  {
    question: "How do I harvest colostrum at home?",
    answer:
      "Hand expression is the recommended method for antenatal harvesting — not a pump. After washing your hands thoroughly, warm your breast with a warm cloth for 1–2 minutes. Place your thumb and index finger about 2–3 cm back from the base of the nipple in a C-shape. Press gently back toward your chest, then compress toward the nipple in a rolling motion. Collect any drops in a sterile 1ml syringe. Sessions of 5–10 minutes, 2–3 times per day, are typical. Ask your midwife to demonstrate the technique at your next appointment.",
  },
  {
    question: "How much colostrum is normal to collect before birth?",
    answer:
      "Very small amounts are entirely normal — often just a few drops per session, sometimes nothing at all in the first few sessions. A few drops to 0.5ml per session is completely typical. Even 1–2ml total across several sessions is a meaningful supply for a newborn, because colostrum is extraordinarily nutrient-dense. The amount you collect before birth is not a predictor of your milk supply after birth. If you collect nothing, do not worry — this is common and does not mean anything is wrong.",
  },
  {
    question: "Is colostrum harvesting safe for all pregnancies?",
    answer:
      "No. Antenatal colostrum harvesting is not recommended without explicit midwife or consultant clearance if you have a history of preterm labour, cervical incompetence or a short cervix, placenta previa or placental abruption, an ongoing threatened miscarriage, are carrying multiples (twins or more), or have had a previous premature birth. Nipple stimulation releases oxytocin, which can cause uterine contractions. Always discuss with your midwife before starting, regardless of your risk level.",
  },
  {
    question: "How do I store colostrum I collect before birth?",
    answer:
      "Store each session in a labelled sterile 1ml syringe. Fresh colostrum can be kept in the fridge for up to 48 hours. For longer storage, freeze syringes flat in a sealed freezer bag — colostrum can be safely frozen for up to 6 months. Label each syringe clearly with your full name and the date collected. When you go into labour, transport frozen syringes to the hospital in a cool bag with an ice pack. Most maternity wards have freezers available for patient milk — let your midwife team know you have colostrum on arrival.",
  },
  {
    question:
      "Nothing is coming out when I try to harvest colostrum — is that normal?",
    answer:
      "Yes, completely. Many women collect nothing in their first several sessions, especially early at 36 weeks. Colostrum is produced in very small quantities before birth. Try applying a warm flannel to the breast for 1–2 minutes before expressing, make sure your technique positions fingers 2–3cm back from the nipple base rather than on the areola, and try expressing after a warm shower. If you are still collecting nothing after a week of consistent attempts, mention it to your midwife — but in the vast majority of cases this is entirely normal.",
  },
  {
    question: "Can I use a breast pump to harvest colostrum before birth?",
    answer:
      "No. Breast pumps are not recommended for antenatal colostrum harvesting. Hand expression is the only technique advised before birth. Pumps can be too stimulating, are not designed for the tiny volumes involved, and increase the risk of triggering contractions. After birth, pumps are appropriate — but for antenatal harvesting, hand expression into a 1ml syringe is the method recommended by the NHS and UNICEF Baby Friendly Initiative.",
  },
];

const PREP_CHECKLIST = [
  {
    label:
      "Ask your midwife to confirm colostrum harvesting is safe for your pregnancy",
  },
  {
    label: "Obtain sterile 1 ml syringes (from your midwife team or pharmacy)",
  },
  { label: "Wash hands thoroughly before each session" },
  { label: "Label each syringe with your name and date collected" },
  { label: "Store fresh colostrum in the fridge within 1 hour of collection" },
  { label: "Pack frozen syringes in a cool bag for your hospital bag" },
  {
    label: "Note your recommended start date in your pregnancy diary or phone",
  },
];

const toInputDate = (value: Date): string => {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (value: Date): string =>
  value.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const formatDateShort = (value: Date): string =>
  value.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

// ─── Timeline — mobile-safe flex layout, no absolute label positioning ────────

const PregnancyTimeline = ({
  earliestStart,
  recommendedStart,
  dueDate,
  today,
}: {
  earliestStart: Date;
  recommendedStart: Date;
  dueDate: Date;
  today: Date;
}) => {
  const isPast = (d: Date) => today >= d;

  // Each milestone: label, sublabel, date, whether it's the "recommended" highlighted one
  const milestones = [
    {
      label: "Today",
      sublabel: formatDateShort(today),
      date: today,
      isToday: true,
      isRecommended: false,
    },
    {
      label: "Earliest",
      sublabel: "34 wks",
      date: earliestStart,
      isToday: false,
      isRecommended: false,
    },
    {
      label: "Start",
      sublabel: "36 wks",
      date: recommendedStart,
      isToday: false,
      isRecommended: true,
    },
    {
      label: "Due date",
      sublabel: formatDateShort(dueDate),
      date: dueDate,
      isToday: false,
      isRecommended: false,
    },
  ];

  // Harvest window % (recommended start → due date) for the coloured fill
  const totalMs = dueDate.getTime() - today.getTime();
  const safeTotal = Math.max(totalMs, 1);

  const pct = (d: Date) =>
    Math.min(
      100,
      Math.max(0, ((d.getTime() - today.getTime()) / safeTotal) * 100),
    );

  const windowStartPct = isPast(recommendedStart) ? 0 : pct(recommendedStart);
  const isInWindow = today >= recommendedStart && today < dueDate;

  return (
    <div
      style={{
        marginTop: "var(--space-lg)",
        background: "var(--off-white)",
        border: "1px solid var(--border-hairline)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-md) var(--space-sm)",
      }}
      aria-label="Pregnancy harvesting timeline"
    >
      <p
        className="eyebrow"
        style={{ marginBottom: "var(--space-lg)", textAlign: "center" }}
      >
        Your harvesting timeline
      </p>

      {/*
        Flex row: 4 equal columns.
        Each column: top label → dot (on track) → bottom label.
        Labels for col 0 & 1 go above the track; col 2 & 3 go below.
        The track is a thin absolute line through the dot row.
      */}
      <div style={{ position: "relative", padding: "0 4px" }}>
        {/* Track line — sits at vertical midpoint of the dot row (40px from top of this div) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "40px",
            left: "4px",
            right: "4px",
            height: "5px",
            background: "var(--border-hairline)",
            borderRadius: "3px",
            zIndex: 0,
          }}
        >
          {/* Harvest window highlight */}
          <div
            style={{
              position: "absolute",
              left: `${windowStartPct}%`,
              right: "0%",
              top: 0,
              height: "100%",
              background: isInWindow
                ? "var(--sage-primary)"
                : "var(--sage-light)",
              borderRadius: "3px",
            }}
          />
        </div>

        {/* Milestone columns */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {milestones.map((m, i) => {
            const dotSize = m.isRecommended ? 18 : 13;
            const dotBg = m.isToday
              ? "var(--charcoal)"
              : isPast(m.date)
                ? "var(--sage-primary)"
                : m.isRecommended
                  ? "var(--sage-primary)"
                  : "var(--off-white)";
            const dotBorder = m.isToday
              ? "2px solid var(--charcoal)"
              : m.isRecommended || isPast(m.date)
                ? "2px solid var(--sage-primary)"
                : "2px solid var(--border-subtle)";

            // Top labels: cols 0 & 1 (Today, Earliest)
            // Bottom labels: cols 2 & 3 (Start, Due date)
            const isTop = i < 2;

            return (
              <div
                key={m.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {/* Top label area — fixed height so dot row aligns */}
                <div
                  style={{
                    height: "36px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingBottom: "4px",
                    textAlign: "center",
                  }}
                >
                  {isTop && (
                    <>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          color: m.isRecommended
                            ? "var(--sage-dark)"
                            : "var(--text-secondary)",
                          lineHeight: 1.2,
                          display: "block",
                        }}
                      >
                        {m.label}
                      </span>
                      <span
                        style={{
                          fontSize: "0.58rem",
                          color: "var(--text-tertiary)",
                          lineHeight: 1.2,
                          display: "block",
                          marginTop: "1px",
                        }}
                      >
                        {m.sublabel}
                      </span>
                    </>
                  )}
                </div>

                {/* Dot */}
                <div
                  aria-hidden="true"
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`,
                    borderRadius: "50%",
                    background: dotBg,
                    border: dotBorder,
                    flexShrink: 0,
                    boxShadow: m.isRecommended
                      ? "0 0 0 3px var(--sage-softest)"
                      : "none",
                  }}
                />

                {/* Bottom label area */}
                <div
                  style={{
                    height: "44px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingTop: "4px",
                    textAlign: "center",
                    padding: "4px 2px 0",
                  }}
                >
                  {!isTop && (
                    <>
                      <span
                        style={{
                          fontSize: "0.6rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          color: m.isRecommended
                            ? "var(--sage-dark)"
                            : "var(--text-secondary)",
                          lineHeight: 1.2,
                          display: "block",
                        }}
                      >
                        {m.label}
                      </span>
                      <span
                        style={{
                          fontSize: "0.58rem",
                          color: "var(--text-tertiary)",
                          lineHeight: 1.2,
                          display: "block",
                          marginTop: "1px",
                        }}
                      >
                        {m.sublabel}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-md)",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: "var(--space-sm)",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.72rem",
            color: "var(--text-tertiary)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "20px",
              height: "4px",
              background: "var(--sage-light)",
              borderRadius: "2px",
            }}
          />
          Harvest window
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.72rem",
            color: "var(--text-tertiary)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "var(--sage-primary)",
            }}
          />
          Key milestone
        </span>
      </div>
    </div>
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({
  daysUntilStart,
  today,
  dueDate,
}: {
  daysUntilStart: number;
  today: Date;
  dueDate: Date;
}) => {
  const isPastDue = today >= dueDate;
  const canStartNow = !isPastDue && daysUntilStart <= 0;
  const notYet = daysUntilStart > 0;

  const scheme = isPastDue
    ? {
        bg: "var(--off-white)",
        border: "var(--border-subtle)",
        iconBg: "#e0e0e0",
        iconColor: "var(--text-tertiary)",
        labelColor: "var(--text-tertiary)",
        countColor: "var(--text-secondary)",
        icon: "✓",
        statusLabel: "Past due date",
        message: "Harvesting is no longer needed.",
      }
    : canStartNow
      ? {
          bg: "var(--sage-softest)",
          border: "var(--sage-light)",
          iconBg: "var(--sage-primary)",
          iconColor: "#fff",
          labelColor: "var(--sage-dark)",
          countColor: "var(--sage-primary)",
          icon: "▶",
          statusLabel: "You can start now",
          message:
            "You have reached 36 weeks. Begin colostrum harvesting after discussing with your midwife.",
        }
      : {
          bg: "#fffbf0",
          border: "#f0d080",
          iconBg: "#f5c842",
          iconColor: "#fff",
          labelColor: "#7a5c00",
          countColor: "#7a5c00",
          icon: "◷",
          statusLabel: "Not yet — coming up",
          message:
            "Your recommended start date is approaching. Mark it in your calendar.",
        };

  return (
    <div
      style={{
        background: scheme.bg,
        border: `1px solid ${scheme.border}`,
        borderRadius: "var(--radius-md)",
        padding: "var(--space-md)",
        marginTop: "var(--space-md)",
        display: "flex",
        alignItems: "center",
        gap: "var(--space-md)",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: scheme.iconBg,
          color: scheme.iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {scheme.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 2px",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: scheme.labelColor,
          }}
        >
          {scheme.statusLabel}
        </p>
        {notYet && (
          <p
            className="meta-value"
            style={{
              margin: "0 0 2px",
              color: scheme.countColor,
              lineHeight: 1.1,
            }}
          >
            {daysUntilStart}{" "}
            <span style={{ fontSize: "1rem", fontWeight: 400 }}>
              days to go
            </span>
          </p>
        )}
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
          }}
        >
          {scheme.message}
        </p>
      </div>
    </div>
  );
};

// ─── Skeleton placeholder ─────────────────────────────────────────────────────

const ResultsSkeleton = () => (
  <div aria-hidden="true">
    <style>{`
      @keyframes sn-shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position:  400px 0; }
      }
      .sn-ghost {
        background: linear-gradient(90deg, var(--border-hairline) 25%, var(--off-white) 50%, var(--border-hairline) 75%);
        background-size: 800px 100%;
        animation: sn-shimmer 1.6s ease-in-out infinite;
        border-radius: var(--radius-xs);
      }
    `}</style>
    <div className="results-meta" style={{ marginBottom: "var(--space-md)" }}>
      {[120, 140, 100, 80].map((w, i) => (
        <div className="meta-item" key={i}>
          <div
            className="sn-ghost"
            style={{
              height: "12px",
              width: `${w * 0.5}px`,
              marginBottom: "8px",
            }}
          />
          <div
            className="sn-ghost"
            style={{ height: "22px", width: `${w}px` }}
          />
        </div>
      ))}
    </div>
    <div
      className="sn-ghost"
      style={{
        height: "72px",
        borderRadius: "var(--radius-md)",
        marginBottom: "var(--space-md)",
      }}
    />
    <div
      className="sn-ghost"
      style={{
        height: "110px",
        borderRadius: "var(--radius-md)",
        marginBottom: "var(--space-md)",
      }}
    />
  </div>
);

// ─── Prep checklist ───────────────────────────────────────────────────────────

const PrepChecklist = () => (
  <div
    style={{
      background: "var(--sage-softest)",
      border: "1px solid var(--sage-light)",
      borderRadius: "var(--radius-md)",
      padding: "var(--space-md)",
      marginTop: "var(--space-md)",
    }}
  >
    <p
      className="eyebrow"
      style={{ marginBottom: "var(--space-sm)", color: "var(--sage-dark)" }}
    >
      What to prepare
    </p>
    <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {PREP_CHECKLIST.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            padding: "6px 0",
            borderBottom:
              i < PREP_CHECKLIST.length - 1
                ? "1px solid var(--sage-light)"
                : "none",
          }}
        >
          <span
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "4px",
              border: "1.5px solid var(--sage-primary)",
              flexShrink: 0,
              marginTop: "1px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-hidden="true"
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "2px",
                background: "var(--sage-softest)",
              }}
            />
          </span>
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              lineHeight: 1.45,
            }}
          >
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

export const ColostrumHarvestingCalculatorPage = () => {
  const [dueDate, setDueDate] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touched, setTouched] = useState({ dueDate: false });

  const jsonLd = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Colostrum Harvesting Start Date Calculator",
        url: "https://sagenesthealth.com/colostrum-harvesting-calculator",
        applicationCategory: "HealthApplication",
        operatingSystem: "Any",
        description:
          "Find out exactly when to start harvesting colostrum before your due date. Enter your due date for your recommended start date, based on NHS antenatal expressing guidance. Free, no signup.",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to harvest colostrum before birth",
        description:
          "Step-by-step guide to antenatal colostrum harvesting using hand expression, based on NHS guidance.",
        step: [
          {
            "@type": "HowToStep",
            name: "Confirm it is safe with your midwife",
            text: "Before starting, check with your midwife that antenatal colostrum harvesting is appropriate for your pregnancy. It is not recommended before 36 weeks or for certain high-risk pregnancies.",
          },
          {
            "@type": "HowToStep",
            name: "Obtain sterile 1ml syringes",
            text: "Get sterile 1ml syringes from your midwife team, a pharmacy, or online. These are the correct size for collecting the small volumes produced before birth.",
          },
          {
            "@type": "HowToStep",
            name: "Warm the breast",
            text: "Apply a warm flannel or cloth to your breast for 1–2 minutes before each session. This can help stimulate flow.",
          },
          {
            "@type": "HowToStep",
            name: "Position your fingers correctly",
            text: "Place your thumb and index finger in a C-shape approximately 2–3 cm back from the base of the nipple. Do not squeeze the nipple itself.",
          },
          {
            "@type": "HowToStep",
            name: "Express using a rolling motion",
            text: "Press gently back toward your chest, then roll your fingers forward toward the nipple. Repeat rhythmically. Collect any drops directly into the syringe.",
          },
          {
            "@type": "HowToStep",
            name: "Label and store each syringe",
            text: "Cap the syringe, label it with your name and the date collected, and store in the fridge (up to 48 hours) or freeze flat in a sealed bag (up to 6 months).",
          },
        ],
      },
    ],
    [],
  );

  const errors = useMemo<FieldErrors>(() => {
    const next: FieldErrors = {};
    if (!dueDate) {
      next.dueDate = "Enter your due date.";
      return next;
    }
    const validation = validateColostrumHarvestingInputs(new Date(dueDate));
    const dueDateError = validation.errors.find((e) =>
      e.toLowerCase().includes("due date"),
    );
    if (dueDateError) next.dueDate = dueDateError;
    return next;
  }, [dueDate]);

  const showDueDateError =
    Boolean(errors.dueDate) && (touched.dueDate || hasSubmitted);

  const result = useMemo(() => {
    if (!dueDate || errors.dueDate) return null;
    return calculateColostrumHarvestingDates(new Date(dueDate));
  }, [dueDate, errors.dueDate]);

  const today = useMemo(() => normalizeDate(new Date()), []);
  const dueDateValue = result
    ? normalizeDate(result.collectionWindowEnd)
    : null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasSubmitted(true);
    setTouched({ dueDate: true });
  };

  return (
    <main id="main-content" className="container">
      <SEOHead
        title="Colostrum Harvesting: When to Start + Step-by-Step Guide (36-Week Calculator)"
        description="Find out exactly when to start harvesting colostrum before birth. Includes a week-by-week guide, who should harvest, how to hand express, how much is normal, storage instructions, and a free 36-week start date calculator based on NHS and UNICEF guidance."
        canonicalPath="/colostrum-harvesting-calculator"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="hero-section">
        <div className="tool-header tool-header-inline">
          <div className="trust-badge">Based on NHS antenatal guidance</div>
        </div>
        <h1 className="hero-title">
          Colostrum Harvesting: <span>When to Start + Complete Guide</span>
        </h1>
        <p className="hero-description">
          Enter your due date to calculate your recommended colostrum harvesting
          start date at 36 weeks — then read our complete guide covering who
          should harvest, when to start by week, how to hand express step by
          step, how much colostrum is normal, storage instructions, and what to
          bring to hospital. Based on NHS, UNICEF, and Academy of Breastfeeding
          Medicine guidance.
        </p>
      </section>

      {/* Warning box — above calculator card */}
      <section
        style={{
          marginBottom: "var(--space-lg)",
          background: "#fffbf0",
          border: "1px solid #f0d080",
          borderLeft: "4px solid #f5c842",
          borderRadius: "var(--radius-sm)",
          padding: "var(--space-md)",
        }}
        aria-label="Important safety warning"
      >
        <p style={{ marginBottom: 0, color: "#5a4200" }}>
          <strong>Important:</strong> Antenatal colostrum harvesting is not
          recommended before 36 weeks without explicit midwife or consultant
          advice, as nipple stimulation can trigger uterine contractions. Always
          discuss with your midwife before starting.
        </p>
      </section>

      {/* Calculator card */}
      <div className="calculator-card" aria-labelledby="form-title">
        <div className="calculator-header">
          <h2 id="form-title" className="calculator-title">
            Enter Your Details
          </h2>
          <p className="calculator-subtitle">
            Find your antenatal colostrum harvesting start date in seconds.
          </p>
        </div>
        <form noValidate onSubmit={onSubmit}>
          <div className="field-row">
            <label htmlFor="due-date">Estimated due date</label>
            <input
              id="due-date"
              type="date"
              value={dueDate}
              min={toInputDate(normalizeDate(new Date()))}
              max={toInputDate(addDays(normalizeDate(new Date()), 42 * 7))}
              onChange={(event) => setDueDate(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, dueDate: true }))}
              aria-invalid={showDueDateError}
              aria-describedby={
                showDueDateError ? "due-date-error" : "due-date-help"
              }
            />
            {showDueDateError ? (
              <p id="due-date-error" className="error" role="alert">
                {errors.dueDate}
              </p>
            ) : (
              <p id="due-date-help" className="field-help">
                Enter a due date from today up to 42 weeks ahead.{" "}
                <Link
                  to="/pregnancy-due-date-calculator"
                  style={{ color: "var(--sage-primary)", fontWeight: 500 }}
                >
                  Don't know your due date yet? Find it here →
                </Link>
              </p>
            )}
          </div>
          <button type="submit">Calculate start date</button>
        </form>
      </div>

      {/* Results card */}
      <section
        className="results-card"
        aria-live="polite"
        aria-labelledby="results-heading"
      >
        <h2 id="results-heading">Your Result</h2>

        {!hasSubmitted && (
          <>
            <ResultsSkeleton />
            <p
              style={{
                marginTop: "var(--space-md)",
                color: "var(--text-tertiary)",
                fontSize: "0.875rem",
              }}
            >
              Submit your due date above to see your personalized colostrum
              harvesting dates.
            </p>
          </>
        )}

        {hasSubmitted && result && dueDateValue ? (
          <>
            {/* Meta grid */}
            <div className="results-meta">
              <div className="meta-item">
                <p className="meta-label">Recommended start</p>
                <p className="meta-value">
                  {formatDate(result.recommendedStart)}
                </p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Earliest start</p>
                <p className="meta-value">{formatDate(result.earliestStart)}</p>
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-tertiary)",
                    margin: "2px 0 0",
                  }}
                >
                  Midwife advice only
                </p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Collection window end</p>
                <p className="meta-value">
                  {formatDate(result.collectionWindowEnd)}
                </p>
              </div>
              <div className="meta-item">
                <p className="meta-label">Gestational week at start</p>
                <p className="meta-value">
                  {result.gestationalWeekAtStart} weeks
                </p>
              </div>
            </div>

            {/* Status badge */}
            <StatusBadge
              daysUntilStart={result.daysUntilStart}
              today={today}
              dueDate={dueDateValue}
            />

            {/* Timeline — now mobile-safe */}
            <PregnancyTimeline
              earliestStart={result.earliestStart}
              recommendedStart={result.recommendedStart}
              dueDate={dueDateValue}
              today={today}
            />

            {/* Storage guidance */}
            <div
              style={{
                background: "var(--sage-softest)",
                borderRadius: "var(--radius-sm)",
                padding: "var(--space-md)",
                border: "1px solid var(--sage-light)",
                marginTop: "var(--space-md)",
              }}
            >
              <p
                className="eyebrow"
                style={{
                  marginBottom: "var(--space-xs)",
                  color: "var(--sage-dark)",
                }}
              >
                Storage guidance
              </p>
              <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
                <li style={{ marginBottom: "4px" }}>
                  Fresh colostrum: store in fridge up to 48 hours.
                </li>
                <li style={{ marginBottom: "4px" }}>
                  Frozen colostrum: store in freezer up to 6 months.
                </li>
                <li>Bring frozen colostrum to hospital in a cool bag.</li>
              </ul>
            </div>

            {/* Prep checklist */}
            <PrepChecklist />

            {/* Internal link — due date calculator */}
            <div style={{ marginTop: "var(--space-md)" }}>
              <p style={{ marginBottom: "var(--space-xs)" }}>
                Need to confirm dates first?
              </p>
              <Link
                to="/pregnancy-due-date-calculator"
                style={{ color: "var(--sage-primary)", fontWeight: 600 }}
              >
                calculate your due date →
              </Link>
            </div>
          </>
        ) : (
          hasSubmitted && (
            <p>
              Please correct the errors above to see your personalized colostrum
              harvesting dates.
            </p>
          )
        )}
      </section>

      {/* Educational content */}
      <section
        className="content-section"
        style={{ marginTop: "var(--space-xl)" }}
        aria-labelledby="edu-heading"
      >
        <h2 id="edu-heading">
          What is colostrum harvesting and why does it matter?
        </h2>
        <p>
          Colostrum is the first milk your body produces during pregnancy — a
          thick, concentrated fluid rich in antibodies, immunoglobulins, white
          blood cells, and growth factors. Unlike mature breast milk, colostrum
          is produced in very small amounts and is often called "liquid gold"
          because of its extraordinary nutritional density. Your body begins
          producing colostrum from around 16 weeks of pregnancy, though it is
          not typically expressed until later.
        </p>
        <p>
          Antenatal colostrum harvesting means collecting and storing this
          colostrum before your baby is born, so you have a ready supply for the
          first hours and days after birth. It is particularly recommended for
          situations where breastfeeding may be delayed or where newborn blood
          sugar management is a priority — but it is also increasingly chosen by
          mothers who simply want to be prepared.
        </p>

        <h2>Who should consider harvesting colostrum before birth?</h2>
        <p>
          The NHS, UNICEF Baby Friendly Initiative, and Academy of Breastfeeding
          Medicine all specifically recommend antenatal colostrum harvesting for
          certain groups. If any of the following apply to you, bring it up with
          your midwife at your next appointment — harvesting may be especially
          valuable.
        </p>

        <h3>Gestational diabetes and colostrum harvesting</h3>
        <p>
          This is the most widely cited reason for antenatal harvesting. Babies
          born to mothers with gestational diabetes are at higher risk of
          neonatal hypoglycemia (low blood sugar) in the first hours after
          birth. Having a stored supply of colostrum means your care team can
          offer your baby expressed colostrum via syringe before formula
          supplementation is considered. The NHS specifically recommends
          antenatal harvesting for all women with gestational diabetes unless
          contraindicated. If you have gestational diabetes, ask your midwife
          about colostrum harvesting at your next diabetes clinic appointment.
        </p>

        <h3>Babies at risk of neonatal hypoglycemia</h3>
        <p>
          Beyond gestational diabetes, other factors that increase a baby's
          hypoglycemia risk include being born large for gestational age
          (macrosomia), being born small for gestational age (SGA), preterm
          birth, and certain maternal medications. Having colostrum already
          collected means feeding can begin immediately without waiting for milk
          to come in.
        </p>

        <h3>Cleft lip or palate</h3>
        <p>
          Babies born with a cleft lip or palate often have significant
          difficulty latching and breastfeeding directly. Having a stored supply
          of colostrum means they can receive expressed breast milk via a
          specialised feeding system (such as a Haberman feeder) from birth,
          rather than formula. If a cleft has been identified at your anomaly
          scan, antenatal harvesting is strongly recommended — discuss with your
          specialist midwife or cleft team.
        </p>

        <h3>Tongue tie (ankyloglossia)</h3>
        <p>
          Tongue tie cannot be definitively diagnosed before birth, but if there
          is a family history or you have been advised there may be feeding
          concerns, having colostrum stored provides a buffer while any tongue
          tie is assessed and treated in the early days. Colostrum harvesting
          gives you a supply during the period before feeding is established.
        </p>

        <h3>IVF pregnancy and colostrum harvesting</h3>
        <p>
          Women who have conceived through IVF are sometimes advised to consider
          antenatal harvesting, particularly those who have had a difficult
          journey to pregnancy and want to maximise the chances of successful
          breastfeeding. There is no specific clinical contraindication to
          harvesting in IVF pregnancies, but always confirm with your fertility
          team or midwife that your pregnancy is stable before starting.
        </p>

        <h3>Twin and multiple pregnancies</h3>
        <p>
          Multiple pregnancies are generally considered a contraindication to
          antenatal harvesting without explicit consultant approval, because of
          the higher risk of preterm labour and the additional sensitivity of
          the cervix in multiple pregnancies. However, some consultants do
          approve harvesting from 37 weeks in stable twin pregnancies. Do not
          start without written confirmation from your consultant in this case.
        </p>

        <h3>Planned caesarean section</h3>
        <p>
          Women planning an elective caesarean may find it takes slightly longer
          for mature milk to come in compared to vaginal birth, and colostrum
          harvesting provides a bridge supply for the immediate post-birth
          period. It is also useful if the baby needs to go to NICU — expressed
          colostrum can be given even when direct breastfeeding is not
          immediately possible.
        </p>

        <h3>Previous breastfeeding difficulties</h3>
        <p>
          If you had significant difficulty establishing breastfeeding with a
          previous baby — including low supply, latch problems, or early
          cessation — antenatal harvesting in this pregnancy gives you more
          options in the critical first hours. Having even 2–3ml of stored
          colostrum can reduce the pressure and give you more time to establish
          feeding without immediately resorting to formula.
        </p>

        <h2>When to start colostrum harvesting — by week</h2>
        <p>
          The standard NHS recommendation is to begin at 36 weeks. Here is what
          the guidance says about each week in the relevant window.
        </p>

        <h3>Colostrum harvesting at 34 weeks</h3>
        <p>
          34 weeks is considered the earliest acceptable start point — and only
          if your midwife or consultant has specifically advised you to begin
          early. This might apply if you have a known feeding challenge (such as
          a confirmed cleft palate on scan) and your pregnancy is otherwise
          stable and low-risk. Do not start at 34 weeks without explicit written
          or verbal clearance from your care team. If you do start this early,
          keep sessions short (3–5 minutes maximum) and stop immediately if you
          notice any tightening, cramping, or contractions.
        </p>

        <h3>Colostrum harvesting at 35 weeks</h3>
        <p>
          35 weeks remains earlier than the standard recommendation. Some
          consultants approve harvesting at 35 weeks for women with gestational
          diabetes or a confirmed feeding challenge, particularly if the
          pregnancy is progressing well. Again, this requires specific midwife
          or consultant approval. The same caution applies — stop if you feel
          any uterine tightening.
        </p>

        <h3>Colostrum harvesting at 36 weeks — the recommended start</h3>
        <p>
          36 weeks is the standard NHS-recommended start point for most
          pregnancies. At this gestational age, the risks associated with nipple
          stimulation are substantially lower, and the baby would be considered
          late-preterm if born now. Most women who have been advised to harvest
          will begin here. The calculator above gives you the exact calendar
          date for your 36-week milestone based on your due date.
        </p>

        <h3>Colostrum harvesting at 37 weeks</h3>
        <p>
          37 weeks is full term. Starting here is perfectly appropriate and
          still gives you 3 weeks of collection time before a 40-week due date.
          If you only found out about antenatal harvesting at your 37-week
          appointment, do not worry — there is still plenty of time to build up
          a useful supply. Begin with 1–2 short sessions per day and work up to
          2–3.
        </p>

        <h3>Colostrum harvesting at 38 weeks</h3>
        <p>
          38 weeks is still a good time to start. You have approximately 2 weeks
          until your due date. Most women can collect a meaningful supply in
          this window with consistent sessions. If you are being induced or have
          a planned caesarean at 39 weeks, starting at 38 weeks gives you a full
          week of collection time.
        </p>

        <h3>Colostrum harvesting at 39 weeks</h3>
        <p>
          Starting at 39 weeks is fine — even one week of consistent sessions
          can produce a small but valuable supply. If your baby is due soon, aim
          for 3 sessions per day and prioritise freezing each syringe promptly
          so you build up a buffer even from a short collection window.
        </p>

        <h2>
          Who should NOT start colostrum harvesting without consultant clearance
        </h2>
        <p>
          Nipple stimulation triggers the release of oxytocin, which causes
          uterine contractions. For most women at 36 weeks this is not a
          significant risk, but for certain pregnancies it can be serious. Do
          not start without explicit approval from your midwife or consultant if
          any of the following apply.
        </p>

        <h3>History of preterm labour</h3>
        <p>
          If you have had a previous preterm birth, or if this pregnancy has
          shown signs of preterm labour (contractions before 37 weeks, cervical
          changes), antenatal harvesting is contraindicated unless your
          consultant specifically approves it. The oxytocin released by nipple
          stimulation may trigger contractions that are clinically significant
          in this context.
        </p>

        <h3>Short cervix or cervical incompetence</h3>
        <p>
          A short cervix or diagnosed cervical incompetence (also called
          cervical insufficiency) significantly increases the risk that any
          nipple stimulation will cause cervical changes or contractions. If you
          are being monitored for cervical length or have had a cervical stitch
          (cerclage), do not start colostrum harvesting without written
          clearance from your obstetrician.
        </p>

        <h3>Placenta previa</h3>
        <p>
          Placenta previa (where the placenta partially or fully covers the
          cervix) is a contraindication to any nipple stimulation that could
          cause contractions. If you have been diagnosed with placenta previa at
          any point in your pregnancy, check with your consultant before
          starting — even if a follow-up scan showed partial resolution.
        </p>

        <h3>Multiple pregnancy (twins or more) without consultant approval</h3>
        <p>
          As noted in the section above, multiple pregnancies carry a higher
          baseline risk of preterm labour. Colostrum harvesting in a twin or
          higher-order pregnancy should only be undertaken with explicit
          consultant approval, typically no earlier than 37 weeks in a stable
          pregnancy.
        </p>

        <h3>Active bleeding or placental abruption</h3>
        <p>
          Any active antepartum bleeding is an absolute contraindication to
          colostrum harvesting until the cause has been investigated and your
          care team has confirmed it is safe to continue. Contact your maternity
          unit immediately if you experience any bleeding, and do not resume
          harvesting without direct advice from your obstetric team.
        </p>

        <h2>How to hand express colostrum: step-by-step</h2>
        <p>
          Hand expression is the only technique recommended for antenatal
          harvesting. Do not use a breast pump before birth.
        </p>
        <ol
          style={{ paddingLeft: "var(--space-md)", color: "var(--charcoal)" }}
        >
          <li style={{ marginBottom: "var(--space-sm)" }}>
            <strong>Wash your hands thoroughly</strong> with soap and water for
            at least 20 seconds before every session.
          </li>
          <li style={{ marginBottom: "var(--space-sm)" }}>
            <strong>Warm the breast</strong> using a warm flannel or cloth
            applied for 1–2 minutes. A warm shower beforehand also helps. Gentle
            breast massage toward the nipple can stimulate flow.
          </li>
          <li style={{ marginBottom: "var(--space-sm)" }}>
            <strong>Position your fingers in a C-shape</strong> with your thumb
            above and index finger below, approximately 2–3 cm back from the
            base of the nipple — not on the nipple itself and not on the areola
            edge. The exact position varies by person; experiment to find what
            produces drops.
          </li>
          <li style={{ marginBottom: "var(--space-sm)" }}>
            <strong>Press back gently toward your chest wall</strong>, then
            compress your fingers together in a rolling motion toward the
            nipple. Do not squeeze or pull the nipple. Repeat rhythmically.
          </li>
          <li style={{ marginBottom: "var(--space-sm)" }}>
            <strong>Collect drops directly into a 1ml syringe</strong>. Hold the
            syringe tip at the nipple to catch drops as they appear. If drops
            form but fall before you can collect them, a small sterile bowl or
            spoon can help.
          </li>
          <li style={{ marginBottom: "var(--space-sm)" }}>
            <strong>Switch breasts every few minutes</strong> and repeat up to
            2–3 times per side per session. Sessions should last no longer than
            10 minutes in total to start.
          </li>
          <li style={{ marginBottom: "var(--space-sm)" }}>
            <strong>Cap, label, and store immediately</strong>. Label each
            syringe with your full name and the date. Refrigerate within 1 hour
            if using within 48 hours, or freeze immediately if storing longer.
          </li>
          <li style={{ marginBottom: "var(--space-sm)" }}>
            <strong>Stop immediately</strong> if you experience any uterine
            tightening, cramping, or contractions during or after a session and
            contact your midwife.
          </li>
        </ol>

        <h2>How much colostrum is normal to collect per session?</h2>
        <p>
          This is one of the most searched questions about colostrum harvesting
          — and the answer reassures most women once they know it.
        </p>
        <p>
          A few drops to 0.5ml per session is completely normal, especially in
          the first week of harvesting. Some women collect 1–2ml per session by
          the time they reach 38–39 weeks; others collect only drops throughout
          their entire harvesting window. Both are normal. The amount varies
          enormously between women and is influenced by factors including
          gestational age, time of day, hydration, stress levels, and how
          recently you last expressed.
        </p>
        <p>
          Collecting nothing at all in the first few sessions is also normal.
          Colostrum is present in your breasts from around 16 weeks, but it does
          not always flow readily with manual expression — especially early on.
          Consistency is more important than volume. Two or three short sessions
          per day will typically produce more total colostrum than one long
          frustrated attempt.
        </p>
        <p>
          To put the volumes in context: a newborn's stomach at birth holds
          approximately 5–7ml. Even 1–2ml of colostrum provides a meaningful
          feed. Because colostrum is so concentrated in immunoglobulins and
          growth factors, small amounts have a disproportionate impact.
        </p>
        <p>
          If you are genuinely collecting nothing after two weeks of consistent
          daily attempts at 36+ weeks, mention it to your midwife — but in the
          vast majority of cases there is nothing wrong.
        </p>

        <h2>How to store colostrum syringes before birth</h2>
        <p>
          Use sterile 1ml syringes for all antenatal colostrum collection. These
          are available from your midwife team, many NHS trusts supply them free
          on request, or they can be purchased from pharmacies or online.
        </p>
        <p>
          <strong>Fridge storage:</strong> Fresh colostrum can be stored in the
          fridge at 2–4°C for up to 48 hours. Keep syringes in a clean sealed
          bag at the back of the fridge, away from the door.
        </p>
        <p>
          <strong>Freezer storage:</strong> For longer storage, freeze syringes
          flat in a labelled sealed freezer bag. Frozen colostrum remains safe
          to use for up to 6 months. Defrost in the fridge overnight or by
          holding the syringe in your hand — do not microwave or place in
          boiling water.
        </p>
        <p>
          <strong>Labelling:</strong> Each syringe must be clearly labelled with
          your full name and the date it was collected. If you have multiples or
          are in a shared fridge environment, also add your date of birth or
          hospital number. Your midwife team will advise on the labelling format
          they prefer.
        </p>

        <h2>What to do with your colostrum at the hospital</h2>
        <p>
          When you go into labour, or on the morning of a planned caesarean,
          pack your frozen colostrum syringes in a small cool bag with ice
          packs. Keep it separate from the rest of your hospital bag so it is
          easy to hand over on arrival.
        </p>
        <p>
          Tell your midwife or the admissions team as early as possible that you
          have colostrum with you. Most UK, Australian, Canadian, and US
          maternity wards have freezers available for patient breast milk — your
          midwife will store it for you and ensure it is accessible to the
          neonatal or postnatal team when needed.
        </p>
        <p>
          If you have a longer-than-expected gap between arriving at hospital
          and needing the colostrum, the cool bag will typically keep syringes
          frozen for 4–6 hours with adequate ice packs. If you are concerned it
          may be thawing, ask a midwife to transfer it to a hospital freezer on
          arrival rather than waiting.
        </p>
        <p>
          When your baby is born and feeding begins, colostrum is given via
          syringe — a midwife or neonatal nurse will show you how to administer
          it directly into your baby's cheek. This is particularly important if
          your baby has low blood sugar readings in the early hours.
        </p>

        <h2>How does this colostrum harvesting calculator work?</h2>
        <p>
          The calculator counts back 28 days from your due date to give your
          recommended start date at 36 weeks. It also shows an earlier 34-week
          start date (42 days before due date) for cases where your midwife has
          advised earlier expression. The days-until-start countdown updates
          daily so you can bookmark the page and check back as your due date
          approaches. All calculations run in your browser — nothing you enter
          is stored or transmitted.
        </p>

        {/* Internal links */}
        <p>
          Calculate your due date with our{" "}
          <Link
            to="/pregnancy-due-date-calculator"
            style={{ color: "var(--sage-primary)" }}
          >
            pregnancy due date calculator
          </Link>
          , or read about what is happening at{" "}
          <Link
            to="/pregnancy-week-by-week"
            style={{ color: "var(--sage-primary)" }}
          >
            36 weeks of pregnancy
          </Link>
          .
        </p>

        {/* Source citations — keep existing sources, add new ones below */}
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-tertiary)",
            marginTop: "var(--space-md)",
          }}
        >
          Sources:{" "}
          <a
            href="https://www.nth.nhs.uk/resources/colostrum-harvesting/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text-tertiary)",
              textDecoration: "underline",
            }}
          >
            NHS Northern Tees — Antenatal expressing of colostrum
          </a>{" "}
          and{" "}
          <a
            href="https://www.southtees.nhs.uk/resources/expressing-colostrum-during-pregnancy-2/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text-tertiary)",
              textDecoration: "underline",
            }}
          >
            NHS South Tees — Expressing colostrum during pregnancy
          </a>{" "}
          and{" "}
          <a
            href="https://www.unicef.org.uk/babyfriendly/wp-content/uploads/sites/2/2022/03/Expressing-milk-for-your-baby-on-the-neonatal-unit.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text-tertiary)",
              textDecoration: "underline",
            }}
          >
            UNICEF UK Baby Friendly Initiative — Antenatal expression of
            colostrum
          </a>{" "}
          and{" "}
          <a
            href="https://www.health.gov.au/topics/pregnancy-birth-and-baby/breastfeeding-infant-nutrition"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text-tertiary)",
              textDecoration: "underline",
            }}
          >
            Australian Government Department of Health — Breastfeeding guidance
          </a>{" "}
          and{" "}
          <a
            href="https://www.canada.ca/en/health-canada/services/canada-food-guide/resources/nutrition-healthy-term-infants/nutrition-healthy-term-infants-recommendations-birth-six-months.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--text-tertiary)",
              textDecoration: "underline",
            }}
          >
            Health Canada — Nutrition for healthy term infants
          </a>
          . For informational use only.
        </p>
      </section>

      {/* Medical disclaimer */}
      <p
        className="disclaimer"
        style={{
          textAlign: "left",
          marginTop: "var(--space-lg)",
          maxWidth: "unset",
        }}
      >
        <strong>Medical disclaimer:</strong> This tool is for educational use
        only and does not replace professional medical advice, diagnosis, or
        treatment.
      </p>

      {/* Privacy banner */}
      <section
        aria-label="Privacy"
        style={{
          marginTop: "var(--space-lg)",
          background: "var(--sage-softest)",
          border: "1px solid var(--sage-light)",
          borderRadius: "var(--radius-sm)",
          padding: "var(--space-md)",
        }}
      >
        <p
          className="privacy"
          style={{
            margin: 0,
            maxWidth: "unset",
            textAlign: "left",
            color: "var(--sage-dark)",
          }}
        >
          <strong>Privacy:</strong> SageNest performs all calculations in your
          browser. We do not store your inputs or results.
        </p>
      </section>

      {/* FAQ */}
      <section
        className="content-section"
        style={{ marginTop: "var(--space-xl)" }}
        aria-labelledby="faq-heading"
      >
        <h2 id="faq-heading">Frequently asked questions</h2>
        {FAQ_ITEMS.map((item) => (
          <article
            key={item.question}
            style={{ marginBottom: "var(--space-md)" }}
          >
            <h3
              style={{ fontSize: "1.25rem", marginBottom: "var(--space-xs)" }}
            >
              {item.question}
            </h3>
            <p style={{ marginBottom: 0 }}>{item.answer}</p>
          </article>
        ))}
      </section>

      <DisclaimerBox />
    </main>
  );
};
