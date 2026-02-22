\# Week-by-Week Pregnancy Tracker Implementation Prompt

\## Context & Project Standards

You are implementing a week-by-week pregnancy tracker for SageNest, a
privacy-first pregnancy calculator web app. Before starting ANY code,
you MUST read these project documentation files in this order:

1\. \*\*SECURITY.md\*\* - Review sections 1.1-1.4 (Anti-Mess Protocol,
Pattern Matching, Dependency Minimalism, Complexity Check)

2\. \*\*frontend.md\*\* - Review the complete design system, color
palette, typography scale, component library, and spacing system

3\. \*\*codex.md\*\* - Review behavioral guidelines for LLM coding

4\. \*\*newtool.md\*\* - Review the tool addition guide (though this is
more content than tool) 5. \*\*README.md\*\* - Review the tech stack and
build commands

\## Feature Overview

Implement a comprehensive week-by-week pregnancy guide covering weeks
1-40, with: - A hub page at \`/pregnancy-week-by-week\` with visual week
selector

\- 40 individual week pages at \`/pregnancy-week-by-week/week-{1-40}\` -
Integration with existing due date calculator

\- Full SEO optimization with JSON-LD structured data - Accessibility
compliance (WCAG 2.1 AA)

\## Implementation Plan (4 Phases)

\### Phase 1: Data Structure & Core Infrastructure

\#### File: \`src/data/pregnancyWeeks.ts\`

Create a TypeScript data structure following these patterns from
\`src/data/blogPosts.ts\` and \`src/data/tools.ts\`:

\`\`\`typescript

export interface PregnancyWeek { weekNumber: number; trimester: 1 \| 2
\| 3;

> title: string; // e.g., "Week 12: Fetal Development Milestone"
> babyDevelopment: {
>
> summary: string; // 2-3 sentences size: {
>
> comparison: string; // e.g., "lime" lengthCm: number;
>
> weightGrams: number; };
>
> keyMilestones: string\[\]; // 3-5 bullet points };
>
> maternalChanges: {
>
> symptoms: string\[\]; // 3-5 common symptoms bodyChanges: string; //
> 1-2 sentences
>
> }; whatToDo: {
>
> appointments: string\[\]; // Upcoming appointments if any preparation:
> string\[\]; // 2-3 actionable items
>
> }; medicalGuidance: {
>
> whenToCallDoctor: string\[\]; // 3-4 red flags screeningTests?:
> string\[\]; // If applicable this week
>
> };

funFact: string; // Engaging, short fact }

export const pregnancyWeeks: PregnancyWeek\[\] = \[ {

> weekNumber: 1, trimester: 1,
>
> title: "Week 1: Conception Preparation", babyDevelopment: {

summary: "Week 1 is technically before conception. Your body is
preparing for ovulation, and pregnancy dating begins from the first day
of your last menstrual period.",

> size: {
>
> comparison: "Not yet conceived", lengthCm: 0,
>
> weightGrams: 0 },
>
> keyMilestones: \[
>
> "Menstrual period begins",
>
> "Uterine lining sheds in preparation for new cycle", "Follicle
> development begins in ovaries"
>
> \] },
>
> maternalChanges: { symptoms: \[
>
> "Menstrual bleeding", "Mild cramping", "Lower energy levels"
>
> \],

bodyChanges: "Your body is in its menstrual phase. Hormone levels are at
their lowest, preparing to rise for ovulation."

> }, whatToDo: {
>
> appointments: \[\], preparation: \[
>
> "Start taking prenatal vitamins with folic acid (400-800 mcg)", "Avoid
> alcohol and smoking if trying to conceive",
>
> "Track your cycle to identify ovulation" \]
>
> }, medicalGuidance: {
>
> whenToCallDoctor: \[
>
> "Extremely heavy bleeding (soaking through a pad every hour)", "Severe
> pain that doesn't respond to over-the-counter medication", "Fever
> above 100.4°F (38°C)"
>
> \] },

funFact: "Pregnancy is dated from your last menstrual period, even
though conception hasn't occurred yet. This means you're 'pregnant' for
about two weeks before actual conception!"

> },

// ... continue for weeks 2-40 \];

// Helper functions

export const getWeekByNumber = (weekNumber: number): PregnancyWeek \|
undefined =\> { return pregnancyWeeks.find(w =\> w.weekNumber ===
weekNumber);

};

export const getWeeksByTrimester = (trimester: 1 \| 2 \| 3):
PregnancyWeek\[\] =\> { return pregnancyWeeks.filter(w =\> w.trimester
=== trimester);

};

export const getTrimesterForWeek = (weekNumber: number): 1 \| 2 \| 3 =\>
{ if (weekNumber \<= 13) return 1;

> if (weekNumber \<= 27) return 2; return 3;

}; \`\`\`

\*\*Content Requirements for All 40 Weeks:\*\*

\- Week 1-13: Focus on early development, morning sickness, first
trimester screening - Week 14-27: Emphasis on fetal movement, anatomy
scan, glucose testing

\- Week 28-40: Birth preparation, weekly appointments, labor signs

\*\*Specific Milestone Weeks to Emphasize:\*\* - Week 12: NT scan, end
of first trimester

\- Week 20: Anatomy scan

\- Week 24: Viability milestone

\- Week 28: Third trimester begins

\- Week 36: Group B strep test, weekly appointments - Week 37: Full term

\- Week 40: Due date

---

\### Phase 2: Hub Page Component

\#### File: \`src/pages/PregnancyWeekByWeek.tsx\`

Create the main hub page following the pattern from
\`src/pages/SimilarTools.tsx\` and \`src/pages/Calculator.tsx\`:

\`\`\`typescript

import { useMemo, useState } from 'react'; import { Link } from
'react-router-dom';

import { SEOHead } from '../components/SEOHead';

import { pregnancyWeeks, getTrimesterForWeek } from
'../data/pregnancyWeeks';

export const PregnancyWeekByWeekPage = () =\> {

> const \[activeTab, setActiveTab\] = useState\<1 \| 2 \| 3 \|
> 'all'\>('all'); const \[currentWeekInput, setCurrentWeekInput\] =
> useState('');
>
> const filteredWeeks = useMemo(() =\> {
>
> if (activeTab === 'all') return pregnancyWeeks;
>
> return pregnancyWeeks.filter(w =\> w.trimester === activeTab); },
> \[activeTab\]);
>
> const jumpToWeek = () =\> {
>
> const week = Number(currentWeekInput); if (week \>= 1 && week \<= 40)
> {
>
> window.location.href = \`/pregnancy-week-by-week/week-\${week}\`; }
>
> };
>
> const jsonLd = {
>
> '@context': 'https://schema.org', '@type': 'WebPage',
>
> name: 'Week-by-Week Pregnancy Guide',

description: 'Complete week-by-week pregnancy guide covering fetal
development, maternal changes, and medical guidance for all 40 weeks.',

> url: 'https://sagenest.pages.dev/pregnancy-week-by-week' };
>
> return (
>
> \<main id="main-content" className="container"\> \<SEOHead
>
> title="Week-by-Week Pregnancy Guide"

description="Track your pregnancy week by week with detailed fetal
development, symptoms, medical guidance, and preparation tips for all 40
weeks."

> canonicalPath="/pregnancy-week-by-week" jsonLd={jsonLd}
>
> /\>
>
> \<section className="hero-section"\>
>
> \<div className="tool-header tool-header-inline"\>
>
> \<div className="trust-badge"\>Comprehensive pregnancy
> reference\</div\> \</div\>
>
> \<h1 className="hero-title"\>Week-by-Week \<span\>Pregnancy
> Guide\</span\>\</h1\> \<p className="hero-description"\>

Follow your pregnancy journey with detailed weekly guides covering fetal
development, maternal changes, and medical milestones.

> \</p\> \</section\>
>
> {/\* Quick Week Finder \*/}
>
> \<div className="calculator-card" style={{ marginBottom:
> 'var(--space-xl)' }}\> \<div className="calculator-header"\>
>
> \<h2 className="calculator-title"\>Find Your Week\</h2\>

\<p className="calculator-subtitle"\>Enter your current pregnancy week
to jump directly to your guide\</p\>

> \</div\>

\<div style={{ display: 'flex', gap: 'var(--space-md)', alignItems:
'flex-end', maxWidth: '400px', margin: '0 auto' }}\>

> \<div className="field-row" style={{ flex: 1, marginBottom: 0 }}\>
> \<label htmlFor="week-input"\>Current Week (1-40)\</label\> \<input
>
> id="week-input" type="number" min={1} max={40}
>
> value={currentWeekInput}
>
> onChange={(e) =\> setCurrentWeekInput(e.target.value)}
> placeholder="e.g., 20"
>
> onKeyDown={(e) =\> e.key === 'Enter' && jumpToWeek()} /\>
>
> \</div\> \<button
>
> className="primary" onClick={jumpToWeek}

disabled={!currentWeekInput \|\| Number(currentWeekInput) \< 1 \|\|
Number(currentWeekInput) \> 40}

> style={{ marginBottom: 0 }} \>
>
> Go to Week \</button\>
>
> \</div\> \</div\>
>
> {/\* Trimester Tabs \*/}

\<div style={{ display: 'flex', justifyContent: 'center', gap:
'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap'
}}\>

> {\[
>
> { value: 'all' as const, label: 'All Weeks' },
>
> { value: 1 as const, label: 'First Trimester (1-13)' },
>
> { value: 2 as const, label: 'Second Trimester (14-27)' }, { value: 3
> as const, label: 'Third Trimester (28-40)' }
>
> \].map(tab =\> ( \<button
>
> key={tab.value} type="button"
>
> onClick={() =\> setActiveTab(tab.value)} style={{
>
> padding: '0.75rem 1.5rem',
>
> background: activeTab === tab.value ? 'var(--sage-primary)' :
> 'var(--off-white)', color: activeTab === tab.value ?
> 'var(--off-white)' : 'var(--charcoal)',
>
> borderColor: activeTab === tab.value ? 'var(--sage-primary)' :
> 'var(--border-subtle)', width: 'auto'
>
> }} \>
>
> {tab.label} \</button\>
>
> ))} \</div\>
>
> {/\* Week Grid \*/} \<div
>
> className="tools-grid" style={{
>
> gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap:
> 'var(--space-md)'
>
> }} \>
>
> {filteredWeeks.map(week =\> ( \<Link
>
> key={week.weekNumber}
>
> to={\`/pregnancy-week-by-week/week-\${week.weekNumber}\`}
> className="tool-card"
>
> style={{
>
> textDecoration: 'none', display: 'flex', flexDirection: 'column',
> alignItems: 'center', justifyContent: 'center', minHeight: '140px',
> textAlign: 'center', padding: 'var(--space-lg)'
>
> }} \>
>
> \<div style={{ fontSize: '2.5rem',
>
> fontFamily: "'Playfair Display', serif", fontWeight: 700,
>
> color: 'var(--sage-primary)', marginBottom: 'var(--space-xs)'
>
> }}\> {week.weekNumber}
>
> \</div\>
>
> \<div style={{ fontSize: '0.75rem', fontWeight: 600,
>
> letterSpacing: '0.05em', textTransform: 'uppercase', color:
> 'var(--text-tertiary)', marginBottom: 'var(--space-xs)'
>
> }}\>
>
> Week {week.weekNumber} \</div\>
>
> \<div style={{
>
> fontSize: '0.875rem',
>
> color: 'var(--text-secondary)' }}\>
>
> {week.babyDevelopment.size.comparison !== 'Not yet conceived' ?
> \`Size: \${week.babyDevelopment.size.comparison}\`
>
> : 'Pre-conception' }
>
> \</div\> \</Link\>
>
> ))} \</div\>
>
> {/\* Educational Content Section \*/}
>
> \<section className="content-section" style={{ marginTop:
> 'var(--space-2xl)' }}\> \<h2 style={{ textAlign: 'center',
> marginBottom: 'var(--space-lg)' }}\>How to Use This

Guide\</h2\>

> \<div className="info-grid"\> \<div className="info-card"\>
>
> \<h3\>Week-by-Week Tracking\</h3\>

\<p\>Each week includes detailed fetal development milestones, maternal
body changes, and symptoms you may experience.\</p\>

> \</div\>
>
> \<div className="info-card"\> \<h3\>Medical Guidance\</h3\>

\<p\>Find important screening tests, prenatal appointments, and red
flags that require immediate medical attention.\</p\>

> \</div\>
>
> \<div className="info-card"\> \<h3\>Preparation Tips\</h3\>

\<p\>Actionable advice for each week to help you prepare for
appointments, delivery, and early parenthood.\</p\>

> \</div\>
>
> \<div className="info-card"\> \<h3\>Evidence-Based\</h3\>

\<p\>All content follows ACOG guidelines and current medical research on
fetal development and prenatal care.\</p\>

> \</div\> \</div\>
>
> \</section\>
>
> {/\* Integration CTA \*/}
>
> \<section className="cta-section"\>
>
> \<p className="eyebrow" style={{ color: 'var(--sage-dark)'
> }}\>Planning Tools\</p\> \<h2\>Calculate Your Due Date\</h2\>

\<p\>Not sure which week you're in? Use our due date calculator to find
your current week and estimated delivery date.\</p\>

> \<div className="cta-buttons"\>
>
> \<button onClick={() =\> window.location.href =
> '/pregnancy-due-date-calculator'}\> Calculate Due Date
>
> \</button\> \</div\>
>
> \</section\>
>
> \<p className="disclaimer"\>

This guide is for informational purposes only and does not replace
professional medical advice. Always consult your healthcare provider
about your specific pregnancy.

> \</p\> \</main\>

); }; \`\`\`

---

\### Phase 3: Individual Week Page Component

\#### File: \`src/pages/PregnancyWeekDetail.tsx\`

Create the individual week page following patterns from
\`src/components/BlogPost.tsx\`:

\`\`\`typescript

import { useMemo } from 'react';

import { Link, useParams } from 'react-router-dom'; import { SEOHead }
from '../components/SEOHead';

import { getWeekByNumber, getTrimesterForWeek } from
'../data/pregnancyWeeks';

export const PregnancyWeekDetailPage = () =\> {

> const { weekNumber } = useParams\<{ weekNumber: string }\>();
>
> const week = useMemo(() =\> getWeekByNumber(Number(weekNumber)),
> \[weekNumber\]);
>
> if (!week \|\| !weekNumber) { return (
>
> \<main className="container"\> \<h1\>Week Not Found\</h1\>
>
> \<p\>The pregnancy week you're looking for doesn't exist.\</p\> \<Link
> to="/pregnancy-week-by-week"\>← Back to all weeks\</Link\>
>
> \</main\> );
>
> }
>
> const prevWeek = week.weekNumber \> 1 ? week.weekNumber - 1 : null;
> const nextWeek = week.weekNumber \< 40 ? week.weekNumber + 1 : null;
>
> const jsonLd = {
>
> '@context': 'https://schema.org', '@type': 'Article',
>
> headline: \`\${week.title} - Pregnancy Week \${week.weekNumber}\`,
> description: week.babyDevelopment.summary,
>
> datePublished: '2026-02-01', dateModified: '2026-02-20',
> mainEntityOfPage:

\`https://sagenest.pages.dev/pregnancy-week-by-week/week-\${week.weekNumber}\`,
publisher: {

> '@type': 'Organization', name: 'SageNest',
>
> url: 'https://sagenest.pages.dev' }
>
> };
>
> return (
>
> \<main id="main-content" className="container article"\> \<SEOHead

title={\`Week \${week.weekNumber} of Pregnancy:
\${week.title.split(':')\[1\]?.trim() \|\| 'Pregnancy Guide'}\`}

> description={week.babyDevelopment.summary}
> canonicalPath={\`/pregnancy-week-by-week/week-\${week.weekNumber}\`}
> jsonLd={jsonLd}
>
> /\>
>
> {/\* Breadcrumb Navigation \*/}
>
> \<nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--space-lg)'
> }}\> \<p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)'
> }}\>
>
> \<Link to="/pregnancy-week-by-week" style={{ color:
> 'var(--sage-primary)' }}\> Week-by-Week Guide
>
> \</Link\> {' '}/{' '}
>
> \<span\>Week {week.weekNumber}\</span\> \</p\>
>
> \</nav\>
>
> {/\* Week Header \*/}
>
> \<header style={{ marginBottom: 'var(--space-xl)' }}\>
>
> \<div style={{ display: 'inline-flex', alignItems: 'center',
>
> gap: 'var(--space-sm)',
>
> padding: 'var(--space-xs) var(--space-md)', background:
> 'var(--sage-softest)', borderRadius: 'var(--radius-pill)',
> marginBottom: 'var(--space-md)',
>
> border: '1px solid var(--sage-light)' }}\>
>
> \<span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing:
> '0.1em',
>
> textTransform: 'uppercase', color: 'var(--sage-dark)'
>
> }}\>

{week.trimester === 1 ? 'First Trimester' : week.trimester === 2 ?
'Second Trimester' : 'Third Trimester'}

> \</span\> \</div\>
>
> \<h1 style={{ marginBottom: 'var(--space-md)' }}\>
>
> Week {week.weekNumber}: {week.title.split(':')\[1\]?.trim() \|\|
> week.title} \</h1\>
>
> {/\* Quick Stats Card \*/} \<div style={{
>
> background: 'var(--sand)', borderRadius: 'var(--radius-md)', padding:
> 'var(--space-lg)',
>
> border: '1px solid var(--border-hairline)', display: 'grid',
>
> gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap:
> 'var(--space-md)',
>
> marginTop: 'var(--space-lg)' }}\>
>
> {week.babyDevelopment.size.comparison !== 'Not yet conceived' && (
> \<\>
>
> \<div\>
>
> \<p className="meta-label"\>Baby's Size\</p\> \<p style={{
>
> fontFamily: "'Playfair Display', serif", fontSize: '1.25rem',
>
> fontWeight: 700, color: 'var(--charcoal)', margin: 0
>
> }}\> {week.babyDevelopment.size.comparison}
>
> \</p\> \</div\> \<div\>
>
> \<p className="meta-label"\>Length\</p\> \<p style={{
>
> fontFamily: "'Playfair Display', serif", fontSize: '1.25rem',
>
> fontWeight: 700, color: 'var(--charcoal)', margin: 0
>
> }}\>
>
> {week.babyDevelopment.size.lengthCm} cm \</p\>
>
> \</div\> \<div\>
>
> \<p className="meta-label"\>Weight\</p\> \<p style={{
>
> fontFamily: "'Playfair Display', serif", fontSize: '1.25rem',
>
> fontWeight: 700, color: 'var(--charcoal)', margin: 0
>
> }}\> {week.babyDevelopment.size.weightGrams}g
>
> \</p\> \</div\>
>
> \</\> )}
>
> \</div\> \</header\>
>
> {/\* Baby Development Section \*/}
>
> \<section style={{ marginBottom: 'var(--space-2xl)' }}\> \<h2\>Your
> Baby's Development\</h2\> \<p\>{week.babyDevelopment.summary}\</p\>

\<h3 style={{ fontSize: '1.125rem', marginTop: 'var(--space-lg)' }}\>Key
Milestones This Week\</h3\>

> \<ul style={{ paddingLeft: 'var(--space-xl)', color:
> 'var(--text-secondary)' }}\>
>
> {week.babyDevelopment.keyMilestones.map((milestone, idx) =\> (
>
> \<li key={idx} style={{ marginBottom: 'var(--space-sm)'
> }}\>{milestone}\</li\> ))}
>
> \</ul\> \</section\>
>
> {/\* Maternal Changes Section \*/}
>
> \<section style={{ marginBottom: 'var(--space-2xl)' }}\> \<h2\>Your
> Body This Week\</h2\> \<p\>{week.maternalChanges.bodyChanges}\</p\>
>
> \<h3 style={{ fontSize: '1.125rem', marginTop: 'var(--space-lg)'
> }}\>Common Symptoms\</h3\> \<ul style={{ paddingLeft:
> 'var(--space-xl)', color: 'var(--text-secondary)' }}\>
>
> {week.maternalChanges.symptoms.map((symptom, idx) =\> (
>
> \<li key={idx} style={{ marginBottom: 'var(--space-sm)'
> }}\>{symptom}\</li\> ))}
>
> \</ul\> \</section\>
>
> {/\* What to Do Section \*/}
>
> \<section style={{ marginBottom: 'var(--space-2xl)' }}\> \<h2\>What to
> Do This Week\</h2\>
>
> {week.whatToDo.appointments.length \> 0 && ( \<\>

\<h3 style={{ fontSize: '1.125rem', marginTop: 'var(--space-lg)'
}}\>Prenatal Appointments\</h3\>

> \<ul style={{ paddingLeft: 'var(--space-xl)', color:
> 'var(--text-secondary)' }}\> {week.whatToDo.appointments.map((appt,
> idx) =\> (
>
> \<li key={idx} style={{ marginBottom: 'var(--space-sm)'
> }}\>{appt}\</li\> ))}
>
> \</ul\> \</\>
>
> )}

\<h3 style={{ fontSize: '1.125rem', marginTop: 'var(--space-lg)'
}}\>Preparation & Self-Care\</h3\>

> \<ul style={{ paddingLeft: 'var(--space-xl)', color:
> 'var(--text-secondary)' }}\> {week.whatToDo.preparation.map((item,
> idx) =\> (
>
> \<li key={idx} style={{ marginBottom: 'var(--space-sm)'
> }}\>{item}\</li\> ))}
>
> \</ul\> \</section\>
>
> {/\* Medical Guidance Section \*/} \<section style={{
>
> background: 'var(--sage-softest)', borderRadius: 'var(--radius-md)',
> padding: 'var(--space-xl)',
>
> border: '1px solid var(--sage-light)', marginBottom:
> 'var(--space-2xl)'
>
> }}\>
>
> \<h2 style={{ marginTop: 0 }}\>When to Call Your Doctor\</h2\>
>
> \<p style={{ marginBottom: 'var(--space-md)', color: 'var(--charcoal)'
> }}\> Contact your healthcare provider immediately if you experience:
>
> \</p\>
>
> \<ul style={{ paddingLeft: 'var(--space-xl)', color:
> 'var(--charcoal)', marginBottom: 0 }}\>
> {week.medicalGuidance.whenToCallDoctor.map((warning, idx) =\> (
>
> \<li key={idx} style={{ marginBottom: 'var(--space-sm)'
> }}\>{warning}\</li\> ))}
>
> \</ul\>

{week.medicalGuidance.screeningTests &&
week.medicalGuidance.screeningTests.length \> 0 && (

> \<\>

\<h3 style={{ fontSize: '1.125rem', marginTop: 'var(--space-lg)'
}}\>Screening Tests This Week\</h3\>

> \<ul style={{ paddingLeft: 'var(--space-xl)', color:
> 'var(--charcoal)', marginBottom: 0 }}\>
> {week.medicalGuidance.screeningTests.map((test, idx) =\> (
>
> \<li key={idx} style={{ marginBottom: 'var(--space-sm)'
> }}\>{test}\</li\> ))}
>
> \</ul\> \</\>
>
> )} \</section\>
>
> {/\* Fun Fact \*/} \<div style={{
>
> background: 'var(--off-white)',
>
> borderLeft: '4px solid var(--sage-primary)', padding:
> 'var(--space-lg)',
>
> borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', marginBottom:
> 'var(--space-2xl)'
>
> }}\>
>
> \<p style={{
>
> fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em',
>
> textTransform: 'uppercase', color: 'var(--sage-primary)',
> marginBottom: 'var(--space-xs)'
>
> }}\>
>
> Did You Know? \</p\>
>
> \<p style={{ margin: 0, fontStyle: 'italic', color: 'var(--charcoal)'
> }}\> {week.funFact}
>
> \</p\> \</div\>
>
> {/\* Week Navigation \*/} \<nav
>
> aria-label="Adjacent weeks" style={{
>
> display: 'flex',
>
> justifyContent: 'space-between', gap: 'var(--space-md)', marginBottom:
> 'var(--space-2xl)'
>
> }} \>
>
> {prevWeek ? ( \<Link
>
> to={\`/pregnancy-week-by-week/week-\${prevWeek}\`} style={{
>
> flex: 1,
>
> padding: 'var(--space-lg)', background: 'var(--off-white)',
>
> border: '1px solid var(--border-hairline)', borderRadius:
> 'var(--radius-md)', display: 'flex',
>
> alignItems: 'center', gap: 'var(--space-sm)',
>
> transition: 'all var(--transition-base)' }}
>
> \>
>
> \<span style={{ fontSize: '1.5rem' }}\>←\</span\> \<div\>
>
> \<div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)'
> }}\>Previous\</div\> \<div style={{ fontWeight: 600, color:
> 'var(--charcoal)' }}\>Week {prevWeek}\</div\>
>
> \</div\> \</Link\>
>
> ) : \<div style={{ flex: 1 }} /\>}
>
> {nextWeek ? ( \<Link
>
> to={\`/pregnancy-week-by-week/week-\${nextWeek}\`} style={{
>
> flex: 1,
>
> padding: 'var(--space-lg)', background: 'var(--off-white)',
>
> border: '1px solid var(--border-hairline)', borderRadius:
> 'var(--radius-md)', display: 'flex',
>
> alignItems: 'center', justifyContent: 'flex-end', gap:
> 'var(--space-sm)',
>
> transition: 'all var(--transition-base)' }}
>
> \>
>
> \<div style={{ textAlign: 'right' }}\>
>
> \<div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)'
> }}\>Next\</div\>
>
> \<div style={{ fontWeight: 600, color: 'var(--charcoal)' }}\>Week
> {nextWeek}\</div\> \</div\>
>
> \<span style={{ fontSize: '1.5rem' }}\>→\</span\> \</Link\>
>
> ) : \<div style={{ flex: 1 }} /\>} \</nav\>
>
> {/\* CTA to Calculator \*/}
>
> \<section className="cta-inline"\> \<h3\>Calculate Your Current
> Week\</h3\>
>
> \<p\>Not sure which week you're in? Use our due date calculator to
> find out.\</p\> \<Link
>
> to="/pregnancy-due-date-calculator" style={{
>
> display: 'inline-block', padding: '0.875rem 2rem',
>
> background: 'var(--sage-primary)', color: '#fff',
>
> borderRadius: 'var(--radius-pill)', fontWeight: 500, textDecoration:
> 'none', marginTop: 'var(--space-sm)'
>
> }} \>
>
> Calculate Due Date → \</Link\>
>
> \</section\>
>
> \<p className="disclaimer"\>

This week-by-week guide is for informational purposes only and does not
replace professional medical advice. Always consult your healthcare
provider about your specific pregnancy.

> \</p\> \</main\>

); };

Phase 4: Integration & Routing 1. Update src/App.tsx

Add routes following the existing pattern: // Add these imports

import { PregnancyWeekByWeekPage } from './pages/PregnancyWeekByWeek';
import { PregnancyWeekDetailPage } from './pages/PregnancyWeekDetail';

// Add these routes in the \<Routes\> component

\<Route path="/pregnancy-week-by-week"
element={\<PregnancyWeekByWeekPage /\>} /\> \<Route
path="/pregnancy-week-by-week/week-:weekNumber"
element={\<PregnancyWeekDetailPage /\>} /\>

2\. Update src/components/Footer.tsx

Add link to week-by-week guide in the Resources section: \<div\>

> \<h5\>Resources\</h5\>
>
> \<div className="site-footer\_\_links"\>
>
> \<Link to="/pregnancy-due-date-calculator"\>Pregnancy Due Date
> Calculator\</Link\> \<Link to="/ovulation-calculator"\>Ovulation
> Calculator\</Link\>
>
> \<Link to="/pregnancy-weight-gain-calculator"\>Pregnancy Weight Gain
> Calculator\</Link\> \<Link to="/pregnancy-week-by-week"\>Week-by-Week
> Pregnancy Guide\</Link\> {/\* NEW \*/} \<Link
> to="/blog"\>Blog\</Link\>

\</div\> \</div\>

3\. Update src/pages/Calculator.tsx

Add contextual link after results to guide users to their current week:
// Inside the CalculatorCard component, after results are displayed:

{dueDate && derived && ( \<\>

> \<ResultCard dueDate={dueDate}
>
> gestationalWeeks={derived.gestationalWeeks}
>
> gestationalDays={derived.gestationalDays}
> trimester={derived.trimester} conceptionDate={derived.conceptionDate}
>
> /\>
>
> {/\* NEW: Week-by-week link \*/} \<div style={{
>
> textAlign: 'center',
>
> margin: 'var(--space-lg) 0', padding: 'var(--space-md)', background:
> 'var(--sage-softest)', borderRadius: 'var(--radius-sm)', border: '1px
> solid var(--sage-light)'
>
> }}\>
>
> \<p style={{ marginBottom: 'var(--space-sm)', color: 'var(--charcoal)'
> }}\> You're currently in \<strong\>Week
> {derived.gestationalWeeks}\</strong\>
>
> \</p\> \<Link
>
> to={\`/pregnancy-week-by-week/week-\${derived.gestationalWeeks}\`}
> style={{
>
> color: 'var(--sage-primary)', fontWeight: 600, textDecoration:
> 'underline'
>
> }} \>
>
> View Week {derived.gestationalWeeks} Guide → \</Link\>
>
> \</div\>
>
> \<div style={{ textAlign: 'center', margin: 'var(--space-xl) 0' }}\>
>
> \<button onClick={resetCalculator} className="primary"\>Calculate New
> Date\</button\> \</div\>
>
> {/\* Continue with existing content... \*/} \</\>

)}

4\. Update src/data/tools.ts

Add the week-by-week guide to the tools registry: const tools: Tool\[\]
= \[

> // ... existing tools {
>
> id: 'week-by-week',
>
> title: 'Week-by-Week Pregnancy Guide', slug: 'pregnancy-week-by-week',

description: 'Track fetal development, symptoms, and medical guidance
for all 40 weeks of pregnancy.',

> path: '/pregnancy-week-by-week' }

\];

5\. Update public/sitemap.xml

Add entries for the hub page and all 40 week pages: \<!-- Add after
existing URLs --\>

\<url\>

> \<loc\>https://sagenest.pages.dev/pregnancy-week-by-week\</loc\>
> \<lastmod\>2026-02-22\</lastmod\>

\<priority\>0.9\</priority\> \</url\>

\<!-- Weeks 1-40 --\> \<url\>

> \<loc\>https://sagenest.pages.dev/pregnancy-week-by-week/week-1\</loc\>
> \<lastmod\>2026-02-22\</lastmod\>

\<priority\>0.8\</priority\> \</url\>

\<!-- ... repeat for weeks 2-40 with same priority 0.8 --\> \<url\>

> \<loc\>https://sagenest.pages.dev/pregnancy-week-by-week/week-40\</loc\>
> \<lastmod\>2026-02-22\</lastmod\>

\<priority\>0.8\</priority\> \</url\>

6\. Update README.md

Add to the Core Features section:

\- Week-by-Week Pregnancy Guide with 40 detailed weekly guides
covering: - Fetal development milestones and size comparisons

> \- Maternal body changes and common symptoms - Prenatal appointments
> and screening tests
>
> \- Preparation tips and medical guidance

\- Red flag symptoms requiring immediate attention Content Writing
Guidelines

For all 40 weeks, follow these content principles: Tone & Style

Calm and reassuring: Pregnancy can be anxiety-inducing; content should
be factual but comforting

Medical accuracy: All development milestones must align with ACOG
guidelines Scannable: Use short paragraphs, bullet points, and clear
headings

Actionable: Each week should have 2-3 concrete things the user can do

Size Comparisons (Baby Development)

Use familiar fruits/objects that accurately represent size: Weeks 1-4:
Pre-conception → poppy seed

Weeks 5-8: Sesame seed → raspberry Weeks 9-13: Cherry → lemon

Weeks 14-18: Avocado → bell pepper Weeks 19-24: Mango → corn

Weeks 25-30: Cauliflower → cabbage Weeks 31-36: Pineapple → honeydew
melon Weeks 37-40: Watermelon

Medical Milestones to Include

Week 10-13: First trimester screening, NT scan availability Week 15-20:
Maternal serum screening, quickening may begin

Week 20-22: Anatomy scan (mention this is when many find out sex) Week
24-28: Glucose challenge test (gestational diabetes screening) Week 28:
Begin bi-weekly appointments

Week 32: May begin weekly appointments depending on provider Week 35-37:
Group B strep test

Week 36+: Weekly appointments standard Week 37: Full term status

Week 39: Brain development complete Week 40: Estimated due date

Week 41+: Post-dates monitoring Red Flags (When to Call Doctor)

Always include for each week, tailored to that week's risks: Heavy
bleeding (soaking pad in \<1 hour)

Severe abdominal pain Fever \>100.4°F (38°C)

Sudden severe swelling (face/hands) Severe headache with vision changes
Decreased fetal movement (after week 20) Fluid leaking (any week)

Contractions before 37 weeks SEO Requirements

Meta Titles (follow exact pattern)

Hub page: "Week-by-Week Pregnancy Guide — SageNest Health – Smart Tools
for Women's Wellness"

Week pages: "Week \[N\] of Pregnancy: \[Short Title\] — SageNest Health
– Smart Tools for Women's Wellness"

Meta Descriptions (150-160 characters)

Hub: "Track your pregnancy week by week with detailed fetal development,
symptoms, medical guidance, and preparation tips for all 40 weeks."

Week: "Week \[N\] pregnancy guide: \[Baby size\], key milestones,
symptoms, prenatal appointments, and medical guidance. Evidence-based
pregnancy tracking."

JSON-LD Structured Data Every week page needs: {

> "@context": "https://schema.org", "@type": "Article",
>
> "headline": "Week \[N\] of Pregnancy: \[Title\]", "description":
> "\[Baby development summary\]", "datePublished": "2026-02-22",
> "dateModified": "2026-02-22",
>
> "mainEntityOfPage":
> "https://sagenest.pages.dev/pregnancy-week-by-week/week-\[N\]",
> "publisher": {
>
> "@type": "Organization", "name": "SageNest",
>
> "url": "https://sagenest.pages.dev" }

}

Internal Linking Strategy

Hub page links to: all 40 weeks, due date calculator

Each week page links to: hub page, previous week, next week, due date
calculator Due date calculator links to: hub page + user's current week

Footer links to: hub page

Accessibility Requirements (WCAG 2.1 AA) Navigation

Use \<nav\> with aria-label="Breadcrumb" for week pages Week grid should
use semantic links with clear link text

Previous/Next navigation should use aria-label="Adjacent weeks" Content
Structure

Heading hierarchy: h1 (page title) → h2 (sections) → h3 (subsections)
Lists use proper \<ul\> and \<li\> markup

No heading levels skipped Interactive Elements

All buttons have clear, descriptive text Focus states visible (2px
outline, 3px offset) Tab order follows visual order

Color is not the only means of conveying information Testing Checklist

\[ \] All images have alt text (if images added later)

\[ \] Keyboard navigation works (Tab, Enter, Arrow keys) \[ \] Screen
reader announces all content properly

\[ \] Color contrast meets 4.5:1 minimum for normal text \[ \] Focus
indicators visible on all interactive elements

Testing & QA Checklist

Before considering this feature complete: Functionality Tests

\[ \] Hub page renders all 40 weeks correctly

\[ \] Trimester filter works (all/first/second/third)

\[ \] "Find Your Week" input accepts 1-40 and navigates correctly \[ \]
"Find Your Week" input rejects invalid input (0, 41, letters)

\[ \] Each week page displays correct data

\[ \] Previous/Next navigation works on all week pages \[ \] Week 1 has
no "Previous" button

\[ \] Week 40 has no "Next" button

\[ \] Links from calculator to current week work \[ \] Breadcrumb
navigation works

\[ \] All internal links resolve correctly Visual Tests

\[ \] Hub page matches design system (colors, spacing, typography) \[ \]
Week pages match design system

\[ \] Week grid displays properly at all viewport sizes \[ \] Mobile
view: week cards stack properly

\[ \] Mobile view: tabs wrap or scroll horizontally \[ \] Quick stats
card responsive on mobile

\[ \] Medical guidance callout box stands out visually SEO Tests

\[ \] All pages have unique meta titles

\[ \] All pages have unique meta descriptions (150-160 chars) \[ \]
Canonical URLs set correctly

\[ \] JSON-LD validates (use Google Rich Results Test) \[ \] Sitemap
includes all 41 pages (hub + 40 weeks)

\[ \] All internal links use correct paths Accessibility Tests

\[ \] All pages pass automated accessibility checker \[ \] Keyboard
navigation works throughout

\[ \] Screen reader announces all content \[ \] Focus indicators visible

\[ \] Heading hierarchy correct (no skipped levels) \[ \] ARIA labels
used where appropriate Performance Tests

\[ \] Hub page loads in \<3 seconds

\[ \] Week pages load in \<2 seconds \[ \] No console errors

\[ \] Images optimized (if added) Content Tests

\[ \] All 40 weeks have complete data \[ \] Size comparisons accurate

\[ \] Medical milestones align with ACOG guidelines \[ \] Red flags
appropriate for each week

\[ \] No typos or grammatical errors

\[ \] Tone is consistent and reassuring Build & Deployment

Local Testing

\# Install dependencies (if needed) npm install

\# Run dev server npm run dev

\# Test routes manually:

\# http://localhost:5173/pregnancy-week-by-week

\# http://localhost:5173/pregnancy-week-by-week/week-1 \#
http://localhost:5173/pregnancy-week-by-week/week-20 \#
http://localhost:5173/pregnancy-week-by-week/week-40

\# Run TypeScript check npm run build

\# Run tests npm run test

Deployment Checklist

\[ \] All TypeScript compiles without errors \[ \] All tests pass

\[ \] npm run check:package passes \[ \] npm run check:conflicts passes

\[ \] Git commit message follows convention: feat(week-by-week): add
pregnancy week-by-week guide with 40 detailed pages

\[ \] Push to GitHub triggers Cloudflare build \[ \] Verify deployment
on Cloudflare Pages \[ \] Test all routes in production

\[ \] Submit sitemap to Google Search Console Success Criteria

This feature is considered complete when:

All routes work: Hub page + all 40 individual week pages load without
errors Navigation functions: All internal links, previous/next buttons,
breadcrumbs work Calculator integration: Due date calculator shows link
to user's current week Design consistency: Matches existing SageNest
design system exactly

SEO optimized: All meta tags, JSON-LD, sitemap entries present
Accessibility compliant: Passes WCAG 2.1 AA automated tests

Mobile responsive: Works perfectly on 320px to 1920px viewports

Content complete: All 40 weeks have medically accurate, well-written
content No regressions: Existing calculator, blog, tools pages still
work

Build succeeds: npm run build completes without errors

Final Notes

Follow SECURITY.md Anti-Mess Protocol: Make surgical changes, touch only
what's needed Match existing patterns: Look at Calculator.tsx,
OvulationCalculator.tsx for reference

Use design tokens: Always use CSS variables from global.css Test
incrementally: Test each phase before moving to the next Ask if unsure:
Don't assume; surface confusion explicitly

Remember: This is the single highest-ROI feature for SageNest. Take time
to do it right. Quality over speed.
