// src/pages/PregnancyWeekByWeekHub.tsx
// Full redesign — SageNest Pregnancy Week-by-Week Hub
// Aesthetic: Organic Editorial Luxury — warm ivory, terracotta, sage, Cormorant Garamond

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEOHead } from "../components/SEOHead";
import { pregnancyWeeks } from "../data/pregnancyWeeks";

const HUB_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --cream:      #FDF8F1;
    --cream-dark: #F3EBD9;
    --walnut:     #2E1A0E;
    --walnut-mid: #5C3A20;
    --terra:      #C4704F;
    --terra-light:#E8A882;
    --sage:       #7A9E7E;
    --sage-light: #B5CEB8;
    --blush:      #EDD5C5;
    --gold:       #C9A84C;
    --text-body:  #3D2314;
    --text-muted: #8B6E5A;
  }

  .pwb-hub * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .pwb-hub {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text-body);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .pwb-hero {
    position: relative;
    min-height: 92vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px 60px;
    overflow: hidden;
    background: var(--walnut);
  }

  .pwb-hero-grain {
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
    background-size: 200px;
    opacity: 0.4;
    pointer-events: none;
  }

  .pwb-hero-rings {
    position: absolute;
    inset: 0;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pwb-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(201,168,76,0.12);
    animation: ringPulse 8s ease-in-out infinite;
  }

  .pwb-ring:nth-child(1) { width: 280px; height: 280px; animation-delay: 0s; }
  .pwb-ring:nth-child(2) { width: 460px; height: 460px; animation-delay: 1.2s; border-color: rgba(201,168,76,0.08); }
  .pwb-ring:nth-child(3) { width: 640px; height: 640px; animation-delay: 2.4s; border-color: rgba(201,168,76,0.05); }
  .pwb-ring:nth-child(4) { width: 820px; height: 820px; animation-delay: 3.6s; border-color: rgba(201,168,76,0.03); }

  @keyframes ringPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.02); opacity: 0.7; }
  }

  .pwb-hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 760px;
  }

  .pwb-hero-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 28px;
    opacity: 0;
    animation: fadeUp 0.7s ease forwards 0.2s;
  }

  .pwb-hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(56px, 9vw, 108px);
    font-weight: 300;
    line-height: 0.92;
    color: var(--cream);
    margin-bottom: 8px;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.4s;
  }

  .pwb-hero-title em {
    font-style: italic;
    color: var(--terra-light);
  }

  .pwb-hero-title span.accent-line {
    display: block;
    font-weight: 600;
    color: var(--cream);
  }

  .pwb-hero-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(18px, 2.5vw, 24px);
    font-weight: 300;
    font-style: italic;
    color: rgba(253,248,241,0.6);
    margin-top: 28px;
    margin-bottom: 52px;
    line-height: 1.5;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.65s;
  }

  .pwb-hero-stats {
    display: flex;
    gap: 48px;
    justify-content: center;
    flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.8s ease forwards 0.85s;
  }

  .pwb-stat {
    text-align: center;
  }

  .pwb-stat-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px;
    font-weight: 600;
    color: var(--terra-light);
    line-height: 1;
    display: block;
  }

  .pwb-stat-label {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(253,248,241,0.45);
    margin-top: 6px;
    display: block;
  }

  .pwb-trimester-section {
    padding: 80px 0 60px;
    position: relative;
  }

  .pwb-trimester-section:nth-child(even) {
    background: var(--cream-dark);
  }

  .pwb-trimester-header {
    max-width: 1280px;
    margin: 0 auto 52px;
    padding: 0 32px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .pwb-trimester-label {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pwb-trimester-number {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(72px, 10vw, 120px);
    font-weight: 600;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1.5px currentColor;
  }

  .pwb-trimester-section:nth-child(1) .pwb-trimester-number { color: transparent; -webkit-text-stroke-color: var(--sage); }
  .pwb-trimester-section:nth-child(2) .pwb-trimester-number { color: transparent; -webkit-text-stroke-color: var(--terra); }
  .pwb-trimester-section:nth-child(3) .pwb-trimester-number { color: transparent; -webkit-text-stroke-color: var(--gold); }

  .pwb-trimester-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 500;
    color: var(--walnut);
    line-height: 1.1;
  }

  .pwb-trimester-name em {
    font-style: italic;
    font-weight: 300;
  }

  .pwb-trimester-weeks-range {
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .pwb-trimester-desc {
    max-width: 340px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-muted);
    text-align: right;
  }

  .pwb-weeks-grid {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 32px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }

  .pwb-week-card {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    text-decoration: none;
    display: block;
    background: var(--cream);
    border: 1px solid rgba(61,35,20,0.08);
    transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.28s ease,
                border-color 0.2s ease;
  }

  .pwb-trimester-section:nth-child(even) .pwb-week-card {
    background: var(--cream);
  }

  .pwb-week-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(61,35,20,0.12);
    border-color: rgba(61,35,20,0.15);
  }

  .pwb-week-card:hover .pwb-card-arrow {
    opacity: 1;
    transform: translate(0, 0);
  }

  .pwb-week-card:hover .pwb-card-fruit {
    transform: scale(1.12) rotate(5deg);
  }

  .pwb-card-top {
    padding: 20px 20px 0;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .pwb-card-week-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 52px;
    font-weight: 600;
    line-height: 1;
    color: var(--walnut);
    opacity: 0.12;
    transition: opacity 0.2s;
  }

  .pwb-week-card:hover .pwb-card-week-num {
    opacity: 0.22;
  }

  .pwb-card-fruit {
    font-size: 36px;
    line-height: 1;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    filter: drop-shadow(0 2px 6px rgba(0,0,0,0.08));
    margin-top: 2px;
  }

  .pwb-card-body {
    padding: 8px 20px 20px;
  }

  .pwb-card-week-label {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  .pwb-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 500;
    color: var(--walnut);
    line-height: 1.25;
    margin-bottom: 10px;
  }

  .pwb-card-highlight {
    font-size: 12px;
    line-height: 1.6;
    color: var(--text-muted);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pwb-card-footer {
    padding: 12px 20px 16px;
    border-top: 1px solid rgba(61,35,20,0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pwb-card-size {
    font-size: 11px;
    color: var(--text-muted);
    font-style: italic;
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px;
  }

  .pwb-card-arrow {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    opacity: 0;
    transform: translate(-4px, 4px);
    transition: opacity 0.25s ease, transform 0.25s ease;
    flex-shrink: 0;
  }

  .pwb-trimester-section:nth-child(1) .pwb-card-accent { background: var(--sage); }
  .pwb-trimester-section:nth-child(2) .pwb-card-accent { background: var(--terra); }
  .pwb-trimester-section:nth-child(3) .pwb-card-accent { background: var(--gold); }

  .pwb-card-accent-bar {
    height: 3px;
    width: 0;
    transition: width 0.3s ease;
    border-radius: 0 0 4px 4px;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .pwb-week-card:hover .pwb-card-accent-bar {
    width: 100%;
  }

  .pwb-trimester-section:nth-child(1) .pwb-card-accent-bar { background: var(--sage); }
  .pwb-trimester-section:nth-child(2) .pwb-card-accent-bar { background: var(--terra); }
  .pwb-trimester-section:nth-child(3) .pwb-card-accent-bar { background: var(--gold); }

  .pwb-trimester-section:nth-child(1) .pwb-card-arrow { background: var(--sage); color: white; }
  .pwb-trimester-section:nth-child(2) .pwb-card-arrow { background: var(--terra); color: white; }
  .pwb-trimester-section:nth-child(3) .pwb-card-arrow { background: var(--gold); color: white; }

  .pwb-milestone-card {
    grid-column: span 2;
    background: var(--walnut) !important;
    border-color: transparent !important;
    color: var(--cream);
  }

  .pwb-milestone-card .pwb-card-week-num { color: var(--cream); opacity: 0.08; }
  .pwb-milestone-card .pwb-card-week-label { color: rgba(253,248,241,0.45); }
  .pwb-milestone-card .pwb-card-title { color: var(--cream); }
  .pwb-milestone-card .pwb-card-highlight { color: rgba(253,248,241,0.6); }
  .pwb-milestone-card .pwb-card-size { color: rgba(253,248,241,0.45); }
  .pwb-milestone-card .pwb-card-footer { border-top-color: rgba(253,248,241,0.1); }
  .pwb-milestone-card .pwb-card-accent-bar { background: var(--terra-light) !important; }
  .pwb-milestone-card .pwb-card-arrow { background: var(--terra-light) !important; color: var(--walnut) !important; }
  .pwb-milestone-card:hover { box-shadow: 0 24px 56px rgba(0,0,0,0.28); }

  .pwb-progress-section {
    background: var(--walnut);
    padding: 72px 32px;
    position: relative;
    overflow: hidden;
  }

  .pwb-progress-inner {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .pwb-progress-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 300;
    font-style: italic;
    color: var(--cream);
    margin-bottom: 12px;
  }

  .pwb-progress-sub {
    font-size: 13px;
    color: rgba(253,248,241,0.45);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 48px;
  }

  .pwb-progress-dots {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    max-width: 760px;
    margin: 0 auto;
  }

  .pwb-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s;
    position: relative;
  }

  .pwb-dot:hover {
    transform: scale(1.8);
  }

  .pwb-dot[data-trimester="1"] { background: rgba(122,158,126,0.4); }
  .pwb-dot[data-trimester="1"]:hover { background: var(--sage); }

  .pwb-dot[data-trimester="2"] { background: rgba(196,112,79,0.4); }
  .pwb-dot[data-trimester="2"]:hover { background: var(--terra); }

  .pwb-dot[data-trimester="3"] { background: rgba(201,168,76,0.4); }
  .pwb-dot[data-trimester="3"]:hover { background: var(--gold); }

  .pwb-dot-tooltip {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(253,248,241,0.95);
    color: var(--walnut);
    font-size: 10px;
    white-space: nowrap;
    padding: 4px 8px;
    border-radius: 3px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
  }

  .pwb-dot:hover .pwb-dot-tooltip { opacity: 1; }

  .pwb-progress-legend {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin-top: 28px;
    flex-wrap: wrap;
  }

  .pwb-legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(253,248,241,0.5);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .pwb-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .pwb-cta-section {
    padding: 96px 32px;
    text-align: center;
    background: var(--cream);
    position: relative;
    overflow: hidden;
  }

  .pwb-cta-ornament {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle at center, rgba(196,112,79,0.06), transparent 70%);
    pointer-events: none;
  }

  .pwb-cta-eyebrow {
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--terra);
    margin-bottom: 20px;
  }

  .pwb-cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(38px, 6vw, 68px);
    font-weight: 300;
    line-height: 1.1;
    color: var(--walnut);
    margin-bottom: 20px;
  }

  .pwb-cta-title em {
    font-style: italic;
    color: var(--terra);
  }

  .pwb-cta-sub {
    font-size: 15px;
    color: var(--text-muted);
    max-width: 500px;
    margin: 0 auto 40px;
    line-height: 1.7;
  }

  .pwb-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 36px;
    background: var(--walnut);
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    text-decoration: none;
  }

  .pwb-cta-btn:hover {
    background: var(--terra);
    transform: translateY(-2px);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pwb-reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .pwb-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .pwb-trimester-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .pwb-trimester-desc {
      text-align: left;
      max-width: 100%;
    }

    .pwb-weeks-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
      padding: 0 16px;
    }

    .pwb-milestone-card {
      grid-column: span 1;
    }

    .pwb-hero-stats {
      gap: 28px;
    }

    .pwb-hero {
      min-height: 75vh;
    }
  }

  @media (max-width: 480px) {
    .pwb-weeks-grid {
      grid-template-columns: 1fr 1fr;
    }

    .pwb-trimester-header {
      padding: 0 16px;
    }
  }
`;

const WEEK_FRUITS: Record<number, string> = {
  1: "🌱", 2: "🥚", 3: "🫘", 4: "🌺", 5: "🍎", 6: "🫐",
  7: "🍇", 8: "🫘", 9: "🍇", 10: "🍓", 11: "🍋", 12: "🍈",
  13: "🍑", 14: "🍋", 15: "🍊", 16: "🥑", 17: "🍐", 18: "🫑",
  19: "🥭", 20: "🍌", 21: "🥕", 22: "🧆", 23: "🥭", 24: "🌽",
  25: "🌿", 26: "🥬", 27: "🥦", 28: "🍆", 29: "🎃", 30: "🥬",
  31: "🥥", 32: "🥔", 33: "🍍", 34: "🍈", 35: "🍈", 36: "🥭",
  37: "🫛", 38: "🧅", 39: "🍉", 40: "🎃",
};

const MILESTONE_WEEKS = new Set([4, 12, 13, 20, 24, 28, 37, 40]);

const TRIMESTER_META = {
  1: {
    name: "First",
    weeks: "Weeks 1 – 13",
    desc: "The most critical period of development — all major organs form in this foundational trimester as your body transforms to support new life.",
  },
  2: {
    name: "Second",
    weeks: "Weeks 14 – 27",
    desc: "The golden trimester — energy returns, the bump becomes visible, and your baby develops senses, movement, and personality.",
  },
  3: {
    name: "Third",
    weeks: "Weeks 28 – 40",
    desc: "The final stretch — your baby gains weight rapidly and prepares for birth as your body readies itself for the most transformative moment of your life.",
  },
};

export default function PregnancyWeekByWeekHub() {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  useEffect(() => {
    const id = "pwb-hub-styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = HUB_STYLES;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const targets = document.querySelectorAll(".pwb-reveal");
    targets.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const goToWeek = (week: number) => {
    navigate(`/pregnancy-week-by-week/week-${week}`);
  };

  const trimester1 = pregnancyWeeks.filter((w) => w.trimester === 1);
  const trimester2 = pregnancyWeeks.filter((w) => w.trimester === 2);
  const trimester3 = pregnancyWeeks.filter((w) => w.trimester === 3);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Pregnancy Week-by-Week Hub",
      description:
        "Explore all 40 weeks of pregnancy with a trimester-organized hub covering baby development, body changes, and key milestones.",
      url: "https://sagenesthealth.com/pregnancy-week-by-week",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Pregnancy Week Guides",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: 40,
      itemListElement: Array.from({ length: 40 }, (_, index) => {
        const week = index + 1;
        return {
          "@type": "ListItem",
          position: week,
          name: `Pregnancy Week ${week}`,
          url: `https://sagenesthealth.com/pregnancy-week-by-week/week-${week}`,
        };
      }),
    },
  ];

  return (
    <div className="pwb-hub">
      <SEOHead
        title="Pregnancy Week-by-Week Hub: 40-Week Trimester Guide"
        description="Browse all 40 pregnancy weeks in one place with trimester breakdowns, milestone check-ins, and direct links to each weekly guide."
        canonicalPath="/pregnancy-week-by-week"
        jsonLd={jsonLd}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pwb-hero" aria-label="Pregnancy week by week guide">
        <div className="pwb-hero-grain" aria-hidden="true" />
        <div className="pwb-hero-rings" aria-hidden="true">
          <div className="pwb-ring" />
          <div className="pwb-ring" />
          <div className="pwb-ring" />
          <div className="pwb-ring" />
        </div>

        <div className="pwb-hero-content">
          <p className="pwb-hero-eyebrow">SageNest — Complete Pregnancy Guide</p>

          <h1 className="pwb-hero-title">
            <em>Week by Week</em>
            <span className="accent-line">Pregnancy</span>
          </h1>

          <p className="pwb-hero-subtitle">
            Forty weeks. One extraordinary journey. Detailed milestones,<br />
            symptoms, nutrition, and expert guidance — every single week.
          </p>

          <div className="pwb-hero-stats">
            <div className="pwb-stat">
              <span className="pwb-stat-number">40</span>
              <span className="pwb-stat-label">Weeks covered</span>
            </div>
            <div className="pwb-stat">
              <span className="pwb-stat-number">3</span>
              <span className="pwb-stat-label">Trimesters</span>
            </div>
            <div className="pwb-stat">
              <span className="pwb-stat-number">280</span>
              <span className="pwb-stat-label">Days of wonder</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Progress Dots ────────────────────────────────────────────────── */}
      <section className="pwb-progress-section" aria-label="Pregnancy timeline">
        <div className="pwb-progress-inner">
          <p className="pwb-progress-title">Your complete timeline</p>
          <p className="pwb-progress-sub">Hover any dot to preview — click to explore</p>

          <div className="pwb-progress-dots" role="list">
            {pregnancyWeeks.map((w) => (
              <div
                key={w.week}
                className="pwb-dot"
                data-trimester={w.trimester}
                role="listitem"
                title={`Week ${w.week}: ${w.title}`}
                onClick={() => goToWeek(w.week)}
                onMouseEnter={() => setHoveredDot(w.week)}
                onMouseLeave={() => setHoveredDot(null)}
                aria-label={`Go to week ${w.week}: ${w.title}`}
              >
                {hoveredDot === w.week && (
                  <span className="pwb-dot-tooltip">Week {w.week}</span>
                )}
              </div>
            ))}
          </div>

          <div className="pwb-progress-legend" aria-label="Trimester legend">
            <div className="pwb-legend-item">
              <div className="pwb-legend-dot" style={{ background: "var(--sage)" }} />
              <span>First Trimester</span>
            </div>
            <div className="pwb-legend-item">
              <div className="pwb-legend-dot" style={{ background: "var(--terra)" }} />
              <span>Second Trimester</span>
            </div>
            <div className="pwb-legend-item">
              <div className="pwb-legend-dot" style={{ background: "var(--gold)" }} />
              <span>Third Trimester</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trimester Sections ───────────────────────────────────────────── */}
      <TrimesterSection trimester={1} weeks={trimester1} onSelectWeek={goToWeek} />
      <TrimesterSection trimester={2} weeks={trimester2} onSelectWeek={goToWeek} />
      <TrimesterSection trimester={3} weeks={trimester3} onSelectWeek={goToWeek} />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="pwb-cta-section" aria-labelledby="cta-heading">
        <div className="pwb-cta-ornament" aria-hidden="true" />
        <p className="pwb-cta-eyebrow">Ready to dive in?</p>
        <h2 className="pwb-cta-title" id="cta-heading">
          Start from <em>Week One</em>
        </h2>
        <p className="pwb-cta-sub">
          Whether you just got a positive test or you're deep in the third trimester —
          every week has something new to discover about your growing baby.
        </p>
        <button className="pwb-cta-btn" onClick={() => goToWeek(1)} aria-label="Start from week 1">
          Begin at Week 1
          <span aria-hidden="true">→</span>
        </button>
      </section>
    </div>
  );
}

interface TrimesterSectionProps {
  trimester: 1 | 2 | 3;
  weeks: typeof pregnancyWeeks;
  onSelectWeek: (week: number) => void;
}

function TrimesterSection({ trimester, weeks, onSelectWeek }: TrimesterSectionProps) {
  const meta = TRIMESTER_META[trimester];

  return (
    <section
      className="pwb-trimester-section"
      aria-labelledby={`trimester-${trimester}-heading`}
    >
      <div className="pwb-trimester-header pwb-reveal">
        <div className="pwb-trimester-label">
          <span className="pwb-trimester-number" aria-hidden="true">
            {trimester === 1 ? "I" : trimester === 2 ? "II" : "III"}
          </span>
          <h2 className="pwb-trimester-name" id={`trimester-${trimester}-heading`}>
            <em>{meta.name}</em> Trimester
          </h2>
          <span className="pwb-trimester-weeks-range">{meta.weeks}</span>
        </div>
        <p className="pwb-trimester-desc">{meta.desc}</p>
      </div>

      <div className="pwb-weeks-grid" role="list">
        {weeks.map((w, i) => {
          const isMilestone = MILESTONE_WEEKS.has(w.week);
          const delay = (i % 6) * 60;

          return (
            <div
              key={w.week}
              role="listitem"
              className={`pwb-reveal`}
              style={{ transitionDelay: `${delay}ms` }}
            >
              <WeekCard
                week={w}
                isMilestone={isMilestone}
                fruit={WEEK_FRUITS[w.week] ?? "🌿"}
                onClick={() => onSelectWeek(w.week)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

interface WeekCardProps {
  week: (typeof pregnancyWeeks)[0];
  isMilestone: boolean;
  fruit: string;
  onClick: () => void;
}

function WeekCard({ week, isMilestone, fruit, onClick }: WeekCardProps) {
  return (
    <article
      className={`pwb-week-card${isMilestone ? " pwb-milestone-card" : ""}`}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      role="button"
      tabIndex={0}
      aria-label={`Week ${week.week}: ${week.title}`}
    >
      <div className="pwb-card-top">
        <span className="pwb-card-week-num" aria-hidden="true">
          {week.week}
        </span>
        <span className="pwb-card-fruit" role="img" aria-label={week.babySize}>
          {fruit}
        </span>
      </div>

      <div className="pwb-card-body">
        <p className="pwb-card-week-label">Week {week.week}</p>
        <h3 className="pwb-card-title">{week.title}</h3>
        <p className="pwb-card-highlight">{week.highlight}</p>
      </div>

      <div className="pwb-card-footer">
        <span className="pwb-card-size">{week.babySize}</span>
        <div className="pwb-card-arrow" aria-hidden="true">→</div>
      </div>

      <div className="pwb-card-accent-bar" aria-hidden="true" />
    </article>
  );
}
