# SageNest Blog Writing Master Guide
> The single source of truth for every blog post written for SageNest Health.
> Follow this guide completely for every post — no exceptions.

---

## 1. The Core Philosophy

Every SageNest blog post exists to do three things simultaneously:

1. **Rank on Google** by targeting real questions mothers search for
2. **Build trust** by being more accurate, thorough, and honest than competitor articles
3. **Drive tool usage** by naturally connecting information to SageNest's calculators

A post that ranks but doesn't convert is wasted. A post that converts but doesn't rank is invisible. Both goals must be served in every piece.

---

## 2. Who We Are Writing For

**Primary reader:** Women who are pregnant, trying to conceive, or in early postpartum. She is:
- Anxious and looking for reassurance backed by facts, not vague comfort
- Intelligent — she can handle clinical information if it is explained clearly
- Time-pressed — she may be reading at 2am between feeds or during a waiting room visit
- Skeptical of generic advice — she has already read five mediocre articles and wants something real

**Tone to match:** Calm, knowledgeable, direct. Like a friend who happens to be a very well-read midwife. Not clinical-cold, not influencer-warm. Never condescending. Never alarmist.

---

## 3. No Publish Dates — Ever

**Do not include `publishDate` in any new post object.**

Reason: A date stamps the content as potentially outdated. A mother reading two years from now should feel she is reading current, timeless guidance — not a 2026 article. All clinical information in SageNest posts should be based on guidelines that do not change frequently (ACOG, IOM, WHO), so the content is genuinely evergreen.

For the `BlogPost` TypeScript object, simply omit the `publishDate` field or set it as an empty string. The frontend should be updated to hide dates from display.

---

## 4. The BlogPost Object Format

Every post must be delivered as a TypeScript object ready to paste into `src/data/blogPosts.ts`. No exceptions — this keeps copy-paste instant with zero reformatting.

### ⚠️ Always Paste New Posts at the TOP of the Array

When adding a new post to `blogPosts.ts`, always insert it as the **first item** in the `blogPosts` array — above all existing posts. This ensures the newest content appears first on the `/blog` listing page automatically, without any additional sorting logic.

```typescript
// CORRECT — new post goes first
export const blogPosts: BlogPost[] = [
  {
    slug: 'your-new-post-slug',   // ← NEW POST HERE, at the top
    // ...
  },
  {
    slug: 'pregnancy-weight-gain-myths-facts',  // existing posts follow below
    // ...
  },
  // ... rest of existing posts
];
```

```typescript
{
  slug: 'keyword-focused-url-slug',
  title: 'Primary Keyword: Benefit-Driven Headline That Speaks to the Mother',
  description: 'Meta description: 140–160 characters. Contains the primary keyword, states the benefit clearly, and creates mild urgency or curiosity. No fluff.',
  readingTime: 'X min read',
  faq: [
    {
      question: 'The exact question a mother types into Google',
      answer: 'Direct, complete answer in 2–4 sentences. No "It depends" without immediately explaining what it depends on.'
    },
    // 3–5 FAQ items per post
  ],
  content: `
  // Full markdown content — see Section 6 for structure
  `
}
```

---

## 5. SEO Rules

### Slug
- All lowercase, hyphens only, no stop words unless necessary
- Should contain the primary keyword
- Examples: `morning-sickness-remedies-first-trimester`, `ovulation-signs-irregular-cycle`

### Title
- Format: `[Primary Keyword]: [Benefit or Promise]`
- 55–65 characters ideal for Google display
- Must answer "why should I click this?" in the headline itself
- Examples of strong titles:
  - `Morning Sickness Remedies: What Actually Works (and What Doesn't)`
  - `Ovulation Symptoms: The 7 Signs Your Body Is About to Release an Egg`
  - `Prenatal Vitamins: What Every Pregnant Woman Needs and What's Overhyped`

### Description (meta)
- 140–160 characters
- Contains primary keyword in first half
- Ends with a subtle promise or hook
- Example: `Learn which morning sickness remedies are backed by clinical evidence, which are myths, and when symptoms warrant a call to your provider.`

### Keyword targeting
- One primary keyword per post (the main search term)
- 3–5 secondary keywords woven naturally into headings and body
- Do not stuff — write for the reader, not the crawler
- Target long-tail phrases where possible (see README keyword list for inspiration)

### Internal linking (mandatory)
Every post must link to SageNest tools using natural anchor text:

| Tool | Path | Natural anchor text examples |
|------|------|------------------------------|
| Pregnancy Due Date Calculator | `/pregnancy-due-date-calculator` | "calculate your due date", "estimate your due date", "our due date calculator" |
| Pregnancy Weight Gain Calculator | `/pregnancy-weight-gain-calculator` | "find your target weight gain range", "our pregnancy weight gain calculator", "check your recommended gain" |
| Ovulation Calculator | `/ovulation-calculator` | "estimate your fertile window", "our ovulation calculator", "track your ovulation" |
| Pregnancy Week by Week | `/pregnancy-week-by-week` | "see what's happening this week", "explore your current pregnancy week", "our week-by-week pregnancy guide", "track your baby's development week by week" |

- There should be atleast one Cross-link to related blog posts where genuinely relevant. Never force it.

---

## 6. Content Structure (Required for Every Post)

Use this structure in order. Do not skip sections. Heading text will vary per post — this is the skeleton.

```
[HOOK — 2–3 sentences, no heading]

## What Is [Topic]?

## Why It Matters During Pregnancy (or: Why [Topic] Affects Your Baby/Body)

## [Main Subtopic 1 — specific, useful]

## [Main Subtopic 2 — specific, useful]

## [Main Subtopic 3 — specific, useful]

## [Optional: Main Subtopic 4 if needed]

## Common Questions About [Topic]
### Question 1
### Question 2
### Question 3

## When to Call Your Doctor
[Red flags — specific symptoms, not vague "if something feels wrong"]

## Related Tools on SageNest
[Links to 1–3 relevant calculators/articles]

## The Bottom Line
[3–5 sentence summary + one natural CTA to a tool]

---
*This article is for informational purposes only and is not a substitute for professional medical advice. Always consult your healthcare provider with any concerns about your pregnancy.*
```

### Minimum length
- 1,200 words minimum. Most posts should be 1,500–2,500 words.
- Longer is better only if the content is genuinely useful — no padding.

---

## 7. The Hook (Opening — No Heading)

The first 2–3 sentences appear before any heading. This is the most important copy in the post. It must:

- Speak directly to the reader's real concern or fear
- Not start with "If you are pregnant..." or "Pregnancy is a beautiful journey..."
- Create an immediate reason to keep reading

**Weak hook example:**
> Morning sickness is a common symptom of pregnancy that affects many women. It can be uncomfortable, but there are ways to manage it.

**Strong hook example:**
> You are six weeks pregnant, you cannot keep water down, and every piece of advice you have read online contradicts the last. Morning sickness is the most under-discussed misery of early pregnancy — and the information circulating about how to manage it ranges from genuinely helpful to actively useless. Here is what the evidence actually says.

**Hook formulas that work:**
- State the real fear/frustration → promise to resolve it
- Present a surprising or counterintuitive fact → create curiosity
- Name the conflicting advice problem → position this article as the resolution
- State how common the experience is → create immediate recognition

---

## 8. Writing Quality Standards

### Do
- Use bold text to introduce key terms or important findings within paragraphs (`**like this**`)
- Use specific numbers where they exist: "approximately 27 mg per day" not "more iron"
- Name the source of a claim when it adds authority: "According to ACOG...", "The IOM recommends..."
- Write in plain English. If you use a clinical term, immediately explain it in parentheses
- Use em dashes for emphasis and rhythm — they make clinical content readable
- Write in second person ("you", "your") — the reader is always the subject
- End every major section with a sentence that bridges to the next or reinforces the main point

### Do not
- Use bullet points as a substitute for writing. Lists are allowed but must be earned — use them for genuinely list-like content (symptoms, foods, red flags), not as a lazy way to avoid paragraphs
- Write vague reassurances: "every pregnancy is different" without explaining what that actually means for the reader
- Contradict ACOG, IOM, or WHO guidelines
- Use the word "journey" or "beautiful" in relation to pregnancy — it is cliché and undermines trust
- Make claims that are not backed by a credible source
- Use hedging language like "some experts suggest" without naming which experts or what they suggest
- Pad content with repetitive sentences to hit word count

---

## 9. Evidence Standards and Legal Safety

### Sources to cite by name (adds authority, reduces legal risk)
- **ACOG** — American College of Obstetricians and Gynecologists (acog.org)
- **IOM / NAM** — Institute of Medicine / National Academy of Medicine
- **WHO** — World Health Organization
- **CDC** — Centers for Disease Control and Prevention
- **NIH / NCBI** — National Institutes of Health
- **Mayo Clinic** — acceptable for general clinical summaries
- **ACNM** — American College of Nurse-Midwives

### How to reference without quoting (copyright safe)
Always paraphrase. Never reproduce sentences from source material. Correct approach:

> ACOG recommends that women with uncomplicated pregnancies engage in at least 150 minutes of moderate-intensity aerobic activity per week.

Not:

> According to ACOG's 2020 Practice Bulletin, "Regular physical activity during pregnancy has been shown to improve or maintain physical fitness..."

### Claims that require a source name
Any specific statistic, recommendation, or clinical threshold must be attributed. Example:
- ✅ "The IOM recommends women with a normal pre-pregnancy BMI gain 11.5 to 16 kg total."
- ❌ "Studies show you should gain between 11 and 16 kg."

### Claims that do not need attribution
Well-established physiological facts that any clinician would confirm:
- "Folate is essential for neural tube development."
- "Blood volume increases significantly during pregnancy."

### Legal disclaimer
Every post ends with the disclaimer line (already built into the structure template). This is non-negotiable.

### What to never write
- Specific medication dosages without noting "as directed by your provider"
- Claims that any food, supplement, or practice definitively prevents miscarriage, preterm birth, or birth defects
- Statements that could be read as diagnosing a condition
- Anything that could discourage a woman from seeking medical care

---

## 10. FAQ Section Rules

The FAQ section serves double duty: it answers real questions AND it powers the JSON-LD FAQPage schema for Google rich results.

**Requirements:**
- 3–5 questions per post minimum
- Questions must match how a real person would type them into Google — conversational, not formal
- Answers must be complete and standalone — a reader should not need to read the article to understand the answer
- Answers: 2–5 sentences. Specific. No deflection.

**Good FAQ question formats:**
- "Is it safe to [X] during pregnancy?"
- "What does [symptom] mean in pregnancy?"
- "How do I know if [X] is normal?"
- "Can [condition] affect my baby?"
- "When should I be worried about [X]?"

---

## 11. The "When to Call Your Doctor" Section

This section must be in every post. It serves both reader safety and legal protection.

- List only specific, observable red flags — not vague ones
- Never use this section to create fear — frame it as "your body's signals worth taking seriously"
- Where possible, distinguish between "call within 24 hours" vs "go to emergency" level concerns

**Example (Morning Sickness post):**
> Contact your provider if you experience: inability to keep any fluids down for more than 24 hours; signs of dehydration including dark urine, dizziness, or dry mouth; weight loss of more than 2 kg in the first trimester; vomiting blood; or a high fever accompanying nausea.

---

## 12. Tool Integration (CTA) Rules

Every post must include at least one natural call-to-action linking to a SageNest tool. The goal is to feel like a helpful recommendation, not an advertisement.

**Placement options:**
- Within a relevant section (most natural, most effective)
- In the "Related Tools" section near the end
- In the "Bottom Line" paragraph

**Tone of CTAs:**
- ✅ "Use our [ovulation calculator](/ovulation-calculator) to estimate your fertile window based on your own cycle length."
- ✅ "If you want to check whether your weight gain is on track, our [pregnancy weight gain calculator](/pregnancy-weight-gain-calculator) gives you a personalized range based on your pre-pregnancy BMI."
- ❌ "Click here to try our amazing free tool!"
- ❌ "SageNest has a great calculator for this!"

The tool should solve a problem the reader just encountered in the article. The link should appear at the moment the reader is most likely to want to use it.

---

## 13. Topic Ideas by Category

Use these to pick the next post. Rotate through categories to build topical authority across the full site.

### Category A: Pregnancy Symptoms & What They Mean
- Morning sickness: what actually helps vs what is myth
- Round ligament pain: what it is and when to worry
- Pregnancy insomnia: causes and safe management
- Braxton Hicks vs real contractions: how to tell the difference
- Pregnancy swelling (edema): normal vs warning sign
- Shortness of breath in pregnancy: when it is normal and when it is not
- Pregnancy headaches: causes, safe relief, and red flags
- Pelvic girdle pain: what it is and how to manage it

### Category B: Nutrition & Weight
- Iron deficiency anemia in pregnancy: signs, food sources, and supplementation
- Prenatal vitamins: what they cover and what they miss
- Pregnancy food cravings: what causes them and when to be concerned (pica)
- Safe fish during pregnancy: what to eat and what to avoid
- Pregnancy hydration: how much water you actually need
- Vegetarian and vegan pregnancy nutrition: what to supplement
- Caffeine during pregnancy: how much is actually safe

### Category C: Ovulation & Fertility
- Signs of ovulation: the 7 body signals to know
- Irregular cycles and ovulation: what it means for conception timing
- Cervical mucus and ovulation: the complete guide
- BBT charting for ovulation: how to do it and what the data means
- Luteal phase explained: what happens after ovulation
- Anovulation: what it is, why it happens, and what to do
- Polycystic ovary syndrome (PCOS) and ovulation: the practical guide

### Category D: Due Dates & Gestational Age
- Why your due date might be wrong (and how it gets corrected)
- How ultrasound changes your due date: what to expect
- Irregular cycles and due date accuracy: what the research shows
- Post-dates pregnancy: what happens if you go past 40 weeks
- Gestational age vs fetal age: the difference and why it matters

### Category E: Prenatal Care & Planning
- First prenatal appointment: what to expect and what to ask
- Anatomy scan at 20 weeks: what it checks and what results mean
- Group B strep test in pregnancy: what it is and what a positive result means
- Prenatal genetic testing: the options explained without the overwhelm
- Birth plan basics: what matters and what to let go of
- Hospital bag checklist: what you actually need vs what gets packed and never used

### Category F: Postpartum
- Postpartum weight loss timeline: what is realistic and what is pressure
- Postpartum hair loss: why it happens and when it stops
- Breastfeeding and nutrition: what changes in your diet
- Postpartum mood disorders: the full spectrum beyond "baby blues"
- Returning to exercise postpartum: the evidence-based timeline
- Postpartum thyroiditis: the underdiagnosed condition affecting new mothers

---

## 14. Reading Time Calculation

Use this formula: **word count ÷ 200 = minutes**. Round to nearest whole number.

- 1,200 words → `6 min read`
- 1,800 words → `9 min read`
- 2,400 words → `12 min read`

---

## 15. Final Pre-Publish Checklist

Before delivering any post, verify every item:

- [ ] Slug is lowercase, hyphenated, keyword-focused
- [ ] Title follows `[Keyword]: [Benefit]` format
- [ ] Description is 140–160 characters and contains the primary keyword
- [ ] No `publishDate` field included
- [ ] Hook opens without a heading and speaks directly to the reader's concern
- [ ] All major clinical claims attributed to ACOG, IOM, WHO, CDC, or NIH
- [ ] No direct quotes of 15+ words from any source (paraphrase always)
- [ ] At least one internal link to a SageNest tool, placed naturally
- [ ] "When to Call Your Doctor" section present with specific red flags
- [ ] 3–5 FAQ items, written as real search queries with complete answers
- [ ] "Related Tools" section links to relevant calculators
- [ ] Medical disclaimer present at the end
- [ ] Full TypeScript object format ready to paste into `blogPosts.ts`
- [ ] Reading time is accurate to word count
- [ ] **Post is placed at the TOP of the `blogPosts` array when pasting into `blogPosts.ts`**

---

## 16. Example: Strong vs Weak Version of the Same Section

**Topic: Iron in pregnancy**

**Weak version:**
> Iron is important during pregnancy. You should eat iron-rich foods like spinach and red meat. Talk to your doctor if you think you are deficient.

**Strong version:**
> Iron requirements nearly double during pregnancy — from 18 mg per day to 27 mg — because your blood volume expands by 40 to 50 percent and the fetus draws heavily on maternal iron stores for its own development. Iron deficiency anemia, which affects approximately 15 to 20 percent of pregnant women in the US, is associated with preterm birth and low birth weight when left unmanaged. Heme iron from animal sources — red meat, poultry, fish — is absorbed at a rate of 15 to 35 percent, making it significantly more bioavailable than the non-heme iron in plant foods like lentils and spinach. To enhance non-heme iron absorption, pair plant-based iron sources with vitamin C-rich foods: a lentil soup with a squeeze of lemon, or spinach with sliced strawberries.

The second version gives the reader specific numbers, explains the mechanism, names the risk, and gives actionable advice — all in one paragraph.

---

*Last updated: This guide is the master reference for all SageNest blog content. Update it if site tools change, new calculators are added, or clinical guidelines are revised.*
