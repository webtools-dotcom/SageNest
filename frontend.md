# SageNest Frontend Design System

**Version:** 1.0  
**Last Updated:** February 14, 2026

This document captures the complete UI/UX design system, patterns, and principles used in SageNest. Use this as the definitive guide when creating new features, tools, or pages to maintain perfect visual and interaction consistency.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Interaction Patterns](#interaction-patterns)
7. [Accessibility Standards](#accessibility-standards)
8. [Responsive Design](#responsive-design)
9. [Animation & Transitions](#animation--transitions)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Design Philosophy

### Core Principles

**1. Privacy-First Communication**
- Trust indicators are prominent but subtle (badges, icons)
- Privacy messaging integrated naturally into UI ("All calculations happen in your browser")
- No aggressive data collection messaging

**2. Editorial Minimalism**
- Generous whitespace is intentional, not wasteful
- Clean, uncluttered layouts prioritize content hierarchy
- Sophistication over decoration

**3. Tactile Interactions**
- Form elements feel substantial (generous padding, clear focus states)
- Hover states provide subtle elevation and color shifts
- Buttons and interactive elements have clear affordances

**4. Calm Confidence**
- Medical/pregnancy context requires reassuring design language
- Soft colors, rounded corners, gentle transitions
- Results presented with authority but without alarm

**5. Progressive Disclosure**
- Multi-step flows reveal complexity gradually
- Results appear with reveal animations
- FAQ accordions collapse content intelligently

---

## Color System

### Primary Palette

```css
/* Sage Family - Primary Brand Colors */
--sage-primary: #9AA88D;     /* Main brand color, CTAs, highlights */
--sage-dark: #7A8872;         /* Hover states, emphasis */
--sage-light: #C5D0BA;        /* Borders, subtle accents */
--sage-softest: #E8EDE3;      /* Background tints, CTA sections */

/* Neutral Foundation */
--cream: #FAF9F6;             /* Main page background */
--sand: #F5F2ED;              /* Secondary backgrounds, cards */
--off-white: #FEFDFB;         /* Card backgrounds, inputs */
--warm-gray: #E8E6E1;         /* Timeline bands, dividers */

/* Text Hierarchy */
--charcoal: #2D2D2D;          /* Primary text, headings */
--charcoal-light: #505050;    /* Subheadings, labels */
--text-secondary: #6B6B6B;    /* Body text, descriptions */
--text-tertiary: #9B9B9B;     /* Metadata, captions */

/* Borders */
--border-hairline: #E5E7EB;   /* Subtle dividers, card outlines */
--border-subtle: #D1D5DB;     /* Input borders, stronger dividers */
```

### Usage Guidelines

**Backgrounds:**
- Page: `--cream`
- Cards/modules: `--off-white`
- Secondary sections: `--sand`
- Highlighted sections (CTAs): `--sage-softest`

**Text:**
- Headings: `--charcoal`
- Body: `--text-secondary`
- Labels: `--charcoal-light`
- Metadata/disclaimers: `--text-tertiary`

**Interactive Elements:**
- Primary buttons: `--sage-primary` background, `--off-white` text
- Secondary buttons: `--off-white` background, `--charcoal` text
- Hover: `--sage-dark` or `--sand` depending on context
- Links: `--charcoal` → `--sage-primary` on hover

**Never:**
- Use pure black (#000000)
- Use saturated primary colors (no bright reds, blues, yellows)
- Mix warm and cool grays in the same component

---

## Typography

### Font Families

```css
/* Serif - For Display & Headings */
font-family: 'Playfair Display', Georgia, serif;

/* Sans-Serif - For Body & UI */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

```css
/* Headings (Playfair Display) */
h1: clamp(2.5rem, 5vw, 4.5rem)    /* 40-72px */
h2: clamp(2rem, 4vw, 3rem)         /* 32-48px */
h3: clamp(1.5rem, 3vw, 2rem)       /* 24-32px */
h4: 1.25rem                        /* 20px */

/* Body Text (Inter) */
p: 1rem                            /* 16px base */
Large body: 1.125rem               /* 18px for hero descriptions */
Small: 0.9375rem                   /* 15px */
Caption: 0.875rem                  /* 14px */
Fine print: 0.8125rem              /* 13px */
Micro: 0.6875rem                   /* 11px for badges */
```

### Typography Patterns

**Headings:**
```css
h1, h2, h3 {
  font-family: 'Playfair Display', serif;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--charcoal);
  margin: 0 0 var(--space-md) 0;
}

h1 {
  font-weight: 700;
  letter-spacing: -0.03em;
}
```

**Body Text:**
```css
p {
  margin: 0 0 var(--space-md) 0;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 1rem;
}
```

**Eyebrow Labels (Uppercase accents):**
```css
.eyebrow {
  display: block;
  font-size: 0.6875rem;      /* 11px */
  font-weight: 600;
  letter-spacing: 0.12em;    /* Generous tracking */
  text-transform: uppercase;
  color: var(--sage-primary);
  margin-bottom: var(--space-sm);
}
```

**Usage Guidelines:**
- Playfair Display: All h1-h4 tags, large numeric displays (due dates, progress percentages)
- Inter: All body text, labels, buttons, form inputs
- Eyebrow labels: Section headers, step indicators, metadata
- Line-height: 1.2 for headings, 1.6-1.8 for body text
- Never use font weights outside: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

---

## Spacing & Layout

### Spacing Scale

```css
--space-xs: 0.5rem    /* 8px - tight gaps */
--space-sm: 1rem      /* 16px - standard gaps */
--space-md: 1.5rem    /* 24px - component spacing */
--space-lg: 2.5rem    /* 40px - section spacing */
--space-xl: 4rem      /* 64px - major sections */
--space-2xl: 6rem     /* 96px - page sections */
```

**Responsive Adjustments:**
```css
@media (max-width: 768px) {
  --space-xl: 3rem    /* 48px */
  --space-2xl: 4rem   /* 64px */
}
```

### Border Radius (Squircle System)

```css
--radius-sm: 16px     /* Small cards, inputs */
--radius-md: 24px     /* Standard cards */
--radius-lg: 32px     /* Hero cards, sections */
--radius-xl: 40px     /* CTA sections */
--radius-pill: 999px  /* Buttons, badges */
```

**Usage:**
- Buttons: `--radius-pill` (fully rounded)
- Form inputs: `--radius-pill` (date pickers, text inputs)
- Cards: `--radius-md` to `--radius-lg` depending on size
- CTA sections: `--radius-xl`
- Small UI elements (badges): `--radius-sm`

### Shadows

```css
--shadow-subtle: 0 1px 3px rgba(45, 45, 45, 0.04)   /* Minimal depth */
--shadow-soft: 0 4px 12px rgba(45, 45, 45, 0.06)     /* Cards at rest */
--shadow-medium: 0 8px 24px rgba(45, 45, 45, 0.08)   /* Hover states */
```

**Usage:**
- Default cards: `--shadow-soft`
- Hover elevation: `--shadow-medium`
- Subtle dividers: `--shadow-subtle`
- Never stack multiple shadows

### Layout Container

```css
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-xl);
}

@media (max-width: 768px) {
  .container {
    padding: var(--space-lg) var(--space-md);
  }
}
```

**Grid Patterns:**
```css
/* Auto-fit responsive grid */
display: grid;
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
gap: var(--space-lg);

/* 3-column footer */
grid-template-columns: 1.5fr 1fr 1fr;

/* Single column on mobile */
@media (max-width: 768px) {
  grid-template-columns: 1fr;
}
```

---

## Component Library

### 1. Buttons

**Primary Button:**
```css
button.primary {
  padding: 1rem 2rem;
  border: 1px solid var(--sage-primary);
  border-radius: var(--radius-pill);
  background: var(--sage-primary);
  color: var(--off-white);
  font-family: inherit;
  font-weight: 500;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.01em;
}

button.primary:hover {
  background: var(--sage-dark);
  border-color: var(--sage-dark);
  transform: translateY(-1px);
}
```

**Secondary Button:**
```css
button {
  padding: 1rem 2rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  background: var(--off-white);
  color: var(--charcoal);
  /* ... same properties as primary */
}

button:hover {
  background: var(--sand);
  border-color: var(--sage-light);
  transform: translateY(-1px);
}
```

**Button with Icon:**
```css
button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  justify-content: center;
}

/* Icon sizing */
button svg {
  width: 20px;
  height: 20px;
}
```

**Disabled State:**
```css
button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
```

### 2. Form Elements

**Input Fields:**
```css
input,
select,
textarea {
  width: 100%;
  padding: 1.125rem 1.5rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  font-family: inherit;
  font-size: 1rem;
  background: var(--off-white);
  color: var(--charcoal);
  transition: all 0.2s ease;
  appearance: none;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--sage-primary);
  background: var(--off-white);
  box-shadow: 0 0 0 3px var(--sage-softest);
}

/* Textareas are not pill-shaped */
textarea {
  border-radius: var(--radius-md);
  min-height: 140px;
  resize: vertical;
  line-height: 1.6;
}
```

**Labels:**
```css
label {
  display: block;
  margin-bottom: var(--space-sm);
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--charcoal);
  letter-spacing: 0.01em;
}
```

**Field Structure:**
```jsx
<div className="field-row">
  <label htmlFor="field-id">Label Text</label>
  <input 
    id="field-id" 
    type="text" 
    aria-invalid={hasError}
    aria-describedby={hasError ? "field-error" : undefined}
  />
  {error && (
    <p id="field-error" className="error" role="alert">
      {error}
    </p>
  )}
</div>
```

### 3. Cards

**Standard Card:**
```css
.card {
  background: var(--off-white);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  border: 1px solid var(--border-hairline);
  box-shadow: var(--shadow-soft);
}
```

**Calculator Card:**
```css
.calculator-card {
  background: var(--off-white);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  border: 1px solid var(--border-hairline);
  box-shadow: var(--shadow-soft);
  margin-bottom: var(--space-2xl);
}

@media (max-width: 768px) {
  .calculator-card {
    padding: var(--space-lg);
  }
}
```

**Info Card (Grid Item):**
```css
.info-card {
  background: var(--off-white);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  border: 1px solid var(--border-hairline);
  transition: all 0.2s ease;
}

.info-card:hover {
  border-color: var(--sage-light);
  transform: translateY(-2px);
}
```

**Blog Card:**
```css
.blog-card {
  background: var(--off-white);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  border: 1px solid var(--border-hairline);
  box-shadow: var(--shadow-subtle);
  transition: all 0.3s ease;
}

.blog-card:hover {
  box-shadow: var(--shadow-soft);
  border-color: var(--sage-light);
  transform: translateY(-2px);
}
```

### 4. Results Card

**Structure:**
```jsx
<section className="results-card results-card--reveal">
  <div className="results-header">
    <p className="eyebrow">Your Result</p>
    <h2>Your estimated due date</h2>
  </div>

  <div className="results-date">
    {monthDay}
    <span>, {year}</span>
  </div>

  <div className="results-meta">
    <div className="meta-item">
      <p className="meta-label">Gestational Age</p>
      <p className="meta-value">12w 3d</p>
    </div>
    {/* ... more meta items */}
  </div>
</section>
```

**Styling:**
```css
.results-date {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  color: var(--charcoal);
  line-height: 1.1;
  margin: var(--space-md) 0;
  letter-spacing: -0.02em;
  text-align: center;
}

.results-date span {
  color: var(--sage-primary);
  font-weight: 600;
}

.results-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-lg);
  margin: var(--space-xl) 0;
}

.meta-item {
  padding: var(--space-lg);
  background: var(--sand);
  border-radius: var(--radius-md);
  text-align: center;
  border: 1px solid var(--border-hairline);
}

.meta-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--sage-primary);
  margin-bottom: var(--space-sm);
}

.meta-value {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--charcoal);
  line-height: 1.2;
}
```

### 5. Progress Wheel

**Structure:**
```jsx
<div className="progress-wheel" role="status" aria-label={`Pregnancy progress ${percent}%`}>
  <div className="progress-wheel__ring" style={{ '--progress': `${percent}%` }}>
    <div className="progress-wheel__inner">
      <div className="progress-wheel__value">{percent}%</div>
    </div>
  </div>
  <p className="progress-wheel__label">Progress through 40 weeks</p>
</div>
```

**Styling:**
```css
.progress-wheel__ring {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: conic-gradient(
    var(--sage-primary) var(--progress, 0%),
    var(--sand) 0%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}

.progress-wheel__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--off-white);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-hairline);
}

.progress-wheel__value {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--charcoal);
}
```

### 6. Step Indicators

**Structure:**
```jsx
<div className="steps-progress" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={2}>
  <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
    {currentStep > 1 ? (
      <svg><!-- checkmark --></svg>
    ) : '1'}
  </div>
  <div className={`step-line ${currentStep > 1 ? 'completed' : ''}`} />
  <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>2</div>
</div>
```

**Styling:**
```css
.steps-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  margin: var(--space-xl) 0;
}

.step-indicator {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--sand);
  border: 1px solid var(--border-hairline);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.step-indicator.active {
  background: var(--sage-primary);
  border-color: var(--sage-primary);
  color: var(--off-white);
}

.step-indicator.completed {
  background: var(--sage-softest);
  border-color: var(--sage-light);
  color: var(--sage-dark);
}

.step-line {
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: var(--border-hairline);
}

.step-line.completed {
  background: var(--sage-light);
}
```

### 7. Timeline Visualization

**Desktop Timeline:**
```jsx
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
```

**Styling:**
```css
.timeline-track {
  position: relative;
  padding: var(--space-xl) 0;
}

.timeline-band {
  position: absolute;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-hairline);
}

.timeline-band--first {
  left: 0;
  width: 32.5%;
  background: var(--sage-softest);
  color: var(--sage-dark);
}

.timeline-band--second {
  left: 33.75%;
  width: 32.5%;
  background: var(--sand);
  color: var(--charcoal-light);
}

.timeline-band--third {
  right: 0;
  width: 32.5%;
  background: var(--warm-gray);
  color: var(--charcoal-light);
}

.timeline-marker__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--sage-primary);
  border: 2px solid var(--off-white);
  display: block;
  box-shadow: 0 0 0 4px var(--sage-softest);
}
```

**Mobile Timeline:**
```css
.timeline-mobile {
  display: none;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

@media (max-width: 768px) {
  .timeline-desktop {
    display: none;
  }
  .timeline-mobile {
    display: grid;
  }
}
```

### 8. FAQ Accordion

**Structure:**
```jsx
<div className="faq-list">
  <article className="faq-item">
    <h3 className="faq-item__heading">
      <button
        className="faq-item__trigger"
        aria-expanded={isExpanded}
        aria-controls={panelId}
      >
        {question}
      </button>
    </h3>
    <div
      id={panelId}
      className="faq-item__panel"
      role="region"
      aria-labelledby={triggerId}
      hidden={!isExpanded}
    >
      <p>{answer}</p>
    </div>
  </article>
</div>
```

**Styling:**
```css
.faq-item {
  background: var(--off-white);
  border: 1px solid var(--border-hairline);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
  overflow: hidden;
}

.faq-item__trigger {
  width: 100%;
  padding: var(--space-lg);
  background: transparent;
  border: none;
  border-radius: 0;
  text-align: left;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease;
  color: var(--charcoal);
}

.faq-item__trigger:hover {
  background: var(--sand);
}

.faq-item__trigger::after {
  content: '+';
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--sage-primary);
  transition: transform 0.2s ease;
}

.faq-item__trigger[aria-expanded="true"]::after {
  transform: rotate(45deg);
}

.faq-item__panel {
  padding: 0 var(--space-lg) var(--space-lg);
}
```

### 9. Trust Badges

**Structure:**
```jsx
<div className="trust-badge">
  <svg width="14" height="14">
    {/* icon */}
  </svg>
  Trusted by Parents
</div>
```

**Styling:**
```css
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background: var(--sage-softest);
  border-radius: var(--radius-pill);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sage-dark);
  border: 1px solid var(--sage-light);
}
```

### 10. CTA Sections

**Structure:**
```jsx
<section className="cta-section">
  <p className="eyebrow">Stay Informed</p>
  <h2>Explore our pregnancy guides</h2>
  <p>Read evidence-based articles...</p>
  <div className="cta-buttons">
    <button onClick={handleAction}>
      Browse Articles
    </button>
  </div>
</section>
```

**Styling:**
```css
.cta-section {
  background: var(--sage-softest);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
  text-align: center;
  border: 1px solid var(--sage-light);
  margin: var(--space-2xl) 0;
}

.cta-inline {
  background: var(--sage-softest);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  margin: var(--space-2xl) 0;
  text-align: center;
  border: 1px solid var(--sage-light);
}
```

### 11. Header & Navigation

**Structure:**
```jsx
<header className="site-header">
  <Link to="/" className="brand">
    <div className="brand-icon">🌿</div>
    SageNest
  </Link>
  <nav>
    <Link to="/pregnancy-due-date-calculator">Calculator</Link>
    <Link to="/blog">Blog</Link>
  </nav>
</header>
```

**Styling:**
```css
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-xl);
  background: var(--off-white);
  border-bottom: 1px solid var(--border-hairline);
  position: sticky;
  top: 0;
  z-index: 100;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--charcoal);
  letter-spacing: -0.01em;
}

nav a {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--charcoal);
  letter-spacing: 0.01em;
  transition: all 0.2s ease;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-pill);
  background: var(--sand);
  border: 1px solid var(--border-hairline);
}

nav a:hover {
  background: var(--sage-primary);
  color: var(--off-white);
  border-color: var(--sage-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-soft);
}
```

### 12. Footer

**Structure:**
```jsx
<footer className="site-footer">
  <div className="site-footer__inner">
    <div>
      <p className="site-footer__brand">SageNest</p>
      <p className="site-footer__description">
        Supporting pregnancy planning...
      </p>
    </div>
    <div>
      <h5>Resources</h5>
      <div className="site-footer__links">
        <Link to="/calculator">Calculator</Link>
        <Link to="/blog">Blog</Link>
      </div>
    </div>
    {/* ... more columns */}
  </div>
  <p className="site-footer__copyright">
    © 2026 SageNest...
  </p>
</footer>
```

**Styling:**
```css
.site-footer {
  background: var(--off-white);
  border-top: 1px solid var(--border-hairline);
  padding: var(--space-2xl) var(--space-xl);
  margin-top: var(--space-2xl);
}

.site-footer__inner {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: var(--space-2xl);
}

@media (max-width: 768px) {
  .site-footer__inner {
    grid-template-columns: 1fr;
  }
}
```

---

## Interaction Patterns

### Hover States

**Standard Pattern:**
```css
.interactive-element {
  transition: all 0.2s ease;
}

.interactive-element:hover {
  transform: translateY(-1px);
  /* Plus color/background changes */
}
```

**Card Hover:**
```css
.card:hover {
  border-color: var(--sage-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}
```

**Button Hover:**
```css
button.primary:hover {
  background: var(--sage-dark);
  transform: translateY(-1px);
}

button:hover {
  background: var(--sand);
  border-color: var(--sage-light);
}
```

**Link Hover:**
```css
a {
  color: var(--charcoal);
  transition: color 0.2s ease;
}

a:hover {
  color: var(--sage-primary);
}
```

### Focus States

**Form Elements:**
```css
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--sage-primary);
  box-shadow: 0 0 0 3px var(--sage-softest);
}
```

**Buttons:**
```css
button:focus-visible {
  outline: 2px solid var(--sage-primary);
  outline-offset: 2px;
}
```

### Active States

```css
button:active {
  transform: translateY(0);
}
```

### Disabled States

```css
button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
```

---

## Accessibility Standards

### Semantic HTML

**Always use:**
- `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`
- `<h1>` through `<h6>` in hierarchical order
- `<button>` for actions, `<a>` for navigation
- `<form>`, `<fieldset>`, `<legend>` for grouped inputs

### ARIA Patterns

**Form Fields:**
```jsx
<label htmlFor="field-id">Label</label>
<input
  id="field-id"
  aria-invalid={hasError}
  aria-describedby={hasError ? "error-id" : undefined}
/>
{error && <p id="error-id" role="alert">{error}</p>}
```

**Progress Indicators:**
```jsx
<div
  role="progressbar"
  aria-label="Calculator step progress"
  aria-valuenow={currentStep}
  aria-valuemin={1}
  aria-valuemax={totalSteps}
>
  {/* content */}
</div>
```

**Live Regions:**
```jsx
<section aria-live="polite">
  {/* Results that appear dynamically */}
</section>
```

**Accordion:**
```jsx
<button
  aria-expanded={isExpanded}
  aria-controls={panelId}
>
  Question
</button>
<div
  id={panelId}
  role="region"
  aria-labelledby={triggerId}
  hidden={!isExpanded}
>
  Answer
</div>
```

### Keyboard Navigation

**Tab Order:**
- Natural DOM order is keyboard order
- No `tabindex` values > 0
- Interactive elements are keyboard-accessible

**Keyboard Handlers:**
```jsx
// FAQ accordion
const onKeyDown = (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    focusNext();
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    focusPrevious();
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggle();
  }
};
```

### Skip Links

```jsx
<a href="#main-content" className="skip-link">
  Skip to content
</a>

<main id="main-content">
  {/* content */}
</main>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
  background: var(--off-white);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  z-index: 1000;
}

.skip-link:focus {
  left: var(--space-md);
  top: var(--space-md);
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile-first approach */

/* Tablet and up */
@media (min-width: 768px) {
  /* Larger layouts */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full desktop experience */
}

/* Mobile (max-width patterns for overrides) */
@media (max-width: 768px) {
  /* Mobile adjustments */
}

@media (max-width: 480px) {
  /* Very small screens */
}
```

### Common Responsive Patterns

**Typography:**
```css
h1 {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
}

.hero-description {
  font-size: clamp(0.9375rem, 2vw, 1.125rem);
}
```

**Spacing:**
```css
@media (max-width: 768px) {
  .calculator-card {
    padding: var(--space-lg);
  }
  
  .container {
    padding: var(--space-lg) var(--space-md);
  }
}
```

**Grids:**
```css
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
```

**Navigation:**
```css
@media (max-width: 768px) {
  nav {
    gap: var(--space-sm);
  }
  
  nav a {
    font-size: 0.8125rem;
    padding: 0.4rem 1rem;
  }
}
```

**Buttons:**
```css
@media (max-width: 768px) {
  .cta-row {
    flex-direction: column;
  }
  
  button {
    width: 100%;
  }
}
```

---

## Animation & Transitions

### Transition Timing

```css
/* Standard transitions */
transition: all 0.2s ease;

/* Longer for complex animations */
transition: all 0.3s ease;

/* Specific properties */
transition: color 0.2s ease, transform 0.2s ease;
```

### Reveal Animation

```css
.results-card--reveal {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.results-card--reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Implementation:**
```jsx
const [revealed, setRevealed] = useState(false);

useEffect(() => {
  const frame = requestAnimationFrame(() => setRevealed(true));
  return () => cancelAnimationFrame(frame);
}, []);

return (
  <div className={`results-card results-card--reveal ${revealed ? 'is-visible' : ''}`}>
    {/* content */}
  </div>
);
```

### Hover Transforms

```css
.card:hover {
  transform: translateY(-2px);
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
```

### Never Animate

- Width/height changes (use transform: scale instead if needed)
- Layout-triggering properties excessively
- Multiple properties unnecessarily (be specific)

---

## Implementation Guidelines

### When Creating New Tools/Features

**1. Start with the Container:**
```jsx
<main id="main-content" className="container">
  <SEOHead {...metadata} />
  {/* Your content */}
</main>
```

**2. Use Consistent Section Structure:**
```jsx
<section className="hero-section">
  <div className="trust-badge">
    <svg>{/* icon */}</svg>
    Trust Message
  </div>
  <h1 className="hero-title">
    Main Title <span>Accent</span>
  </h1>
  <p className="hero-description">
    Supporting description text
  </p>
</section>
```

**3. Follow Card Patterns:**
```jsx
<div className="calculator-card">
  <div className="calculator-header">
    <h2 className="calculator-title">Title</h2>
    <p className="calculator-subtitle">Subtitle</p>
  </div>
  {/* Form or content */}
</div>
```

**4. Use Standard Form Structure:**
```jsx
<form onSubmit={handleSubmit}>
  <fieldset style={{ border: 'none', padding: 0 }}>
    <legend className="eyebrow">Step Label</legend>
    <div className="field-row">
      <label htmlFor="field">Label</label>
      <input id="field" type="text" />
    </div>
  </fieldset>
  <button className="primary" type="submit">
    Submit
  </button>
</form>
```

**5. Present Results Consistently:**
```jsx
<section className="results-card results-card--reveal">
  <div className="results-header">
    <p className="eyebrow">Result</p>
    <h2>Main Result Value</h2>
  </div>
  
  <div className="results-meta">
    <div className="meta-item">
      <p className="meta-label">Label</p>
      <p className="meta-value">Value</p>
    </div>
  </div>
</section>
```

### Color Usage Checklist

- [ ] Page background is `--cream`
- [ ] Cards use `--off-white`
- [ ] Primary actions use `--sage-primary`
- [ ] Text hierarchy: `--charcoal` → `--text-secondary` → `--text-tertiary`
- [ ] Borders use `--border-hairline` or `--border-subtle`
- [ ] Hover states darken or shift to `--sage-dark`
- [ ] No pure black or pure white

### Typography Checklist

- [ ] Headings use Playfair Display
- [ ] Body text uses Inter
- [ ] Fluid sizing with `clamp()` for large headings
- [ ] Line-height 1.2 for headings, 1.6-1.8 for body
- [ ] Eyebrow labels are uppercase with tracking
- [ ] Letter-spacing: negative for large headings, positive for small caps

### Spacing Checklist

- [ ] Consistent use of spacing scale variables
- [ ] Cards use `--space-2xl` or `--space-xl` padding
- [ ] Sections separated by `--space-2xl`
- [ ] Form fields separated by `--space-lg`
- [ ] Button groups use `--space-md` gap
- [ ] Mobile reduces `--space-xl` to `--space-lg`

### Accessibility Checklist

- [ ] Semantic HTML throughout
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] Labels associated with inputs via `htmlFor`
- [ ] ARIA attributes on custom widgets
- [ ] `role="alert"` on error messages
- [ ] `aria-live` on dynamic content
- [ ] Keyboard navigation supported
- [ ] Focus states visible
- [ ] Skip link present
- [ ] Color contrast meets WCAG AA

### Interaction Checklist

- [ ] Transitions are 0.2s ease (or 0.3s for complex)
- [ ] Hover transforms use `translateY(-1px)` or `(-2px)` for cards
- [ ] Active state returns to `translateY(0)`
- [ ] Disabled elements have `opacity: 0.4`
- [ ] Focus states use box-shadow, not outline (except buttons)
- [ ] All interactive elements have cursor: pointer

### Component Naming

**Follow BEM-inspired naming:**
```css
/* Block */
.calculator-card { }

/* Element */
.calculator-card__header { }
.calculator-card__title { }

/* Modifier */
.results-card--reveal { }
.step-indicator.active { }
.step-indicator.completed { }
```

**State classes:**
- `.is-active`
- `.is-visible`
- `.is-expanded`
- `.is-disabled`

### File Organization

When creating new components:

```
src/
  components/
    NewComponent.tsx          # Component logic
  styles/
    global.css                # Add styles here (organized by component)
  pages/
    NewPage.tsx               # Page-level components
```

---

## Design Patterns Summary

### Information Architecture

1. **Hero Section** - Trust badge, title with accent, description
2. **Primary Tool/Calculator** - Main interaction card
3. **Results Display** - Large, prominent result card
4. **Supporting Info** - Info grid, timeline, progress wheel
5. **Educational Content** - FAQ accordion
6. **CTA Section** - Next steps, related content
7. **Footer** - Navigation, copyright

### Visual Hierarchy

1. **Large serif display** (due dates, main results)
2. **Eyebrow labels** (section markers)
3. **Sans-serif headings** (h2, h3)
4. **Body text** (descriptions, explanations)
5. **Metadata** (timestamps, small caps labels)
6. **Fine print** (disclaimers, privacy notes)

### User Flow Patterns

1. **Multi-step forms** - Progressive disclosure with step indicators
2. **Instant feedback** - Inline validation, error messages
3. **Result revelation** - Animated entry, generous spacing
4. **Social proof** - Trust badges, privacy messaging
5. **Clear actions** - Primary/secondary button hierarchy
6. **Progressive enhancement** - Works without JavaScript for content

---

## Quick Reference

### Most Common Components

1. **Standard Card:** `calculator-card`, `results-card`, `info-card`
2. **Buttons:** `button.primary`, `button` (secondary)
3. **Form:** `field-row` > `label` + `input`
4. **Section:** `hero-section`, `info-section`, `cta-section`
5. **Typography:** `eyebrow`, `hero-title`, standard h1-h6
6. **Layout:** `container`, grids with `auto-fit`

### Most Used Colors

- Background: `--cream`, `--off-white`, `--sand`
- Text: `--charcoal`, `--text-secondary`
- Brand: `--sage-primary`, `--sage-dark`
- Borders: `--border-hairline`

### Most Used Spacing

- Card padding: `--space-2xl` (desktop), `--space-lg` (mobile)
- Section gaps: `--space-2xl`
- Element gaps: `--space-lg`
- Form fields: `--space-md` bottom margin

### Most Used Transitions

```css
transition: all 0.2s ease;
transform: translateY(-1px);
box-shadow: var(--shadow-soft);
```

---

## Conclusion

This design system prioritizes:
- **Consistency** - Reusable patterns across all features
- **Accessibility** - Semantic, keyboard-navigable, screen-reader friendly
- **Performance** - Minimal animations, optimized rendering
- **Trust** - Privacy-first messaging, professional polish
- **Flexibility** - Responsive, scales to any screen size

When in doubt, reference existing components in the codebase. If a pattern exists, reuse it. If you need something new, follow the principles outlined here.

**Key principle:** Every new component should feel like it was always part of SageNest.
