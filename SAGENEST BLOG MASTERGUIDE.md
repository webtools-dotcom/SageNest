# SageNest Blog Writing Master Guide
> The single source of truth for every blog post written for SageNest Health.
> Follow this guide completely for every post — no exceptions.

---

## 1. The Core Philosophy

Every SageNest blog post exists to do three things simultaneously:

1. **Stop the scroll on Google Discover** by leading with titles and hooks that speak directly to the emotional state of a pregnant woman in that exact moment
2. **Build trust** by being more accurate, thorough, and honest than competitor articles
3. **Drive tool usage** by naturally connecting information to SageNest's calculators

SageNest has shifted from a search-ranking model to a Google Discover model. Discover is a feed — not a search results page. A woman does not type a query to find our content. She is scrolling and our title and image must make her stop within one second. A post that does not stop the scroll will never be read, regardless of how good the content is. A post that stops the scroll but does not deliver on its promise will be closed in ten seconds and will be penalised by Discover's engagement signals. Both the scroll-stop and the delivery must be present in every piece.

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
  title: 'Your Discover-optimised title following Section 20 rules',
  description: 'Meta description: 140–160 characters. Contains the primary keyword, states the benefit clearly, and creates mild urgency or curiosity. No fluff.',
  readingTime: 'X min read',
  imageUrl: '/images/blog/sagenest-blog-default.jpg', // keep this image path same for all the blogs dont change this
  imagePrompt: 'Detailed scene description for Pollinations image generation — see Section 21 for the rules on how to write this prompt.',
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
- **Do not use the `[Keyword]: [Benefit]` format.** That is an SEO search-results format. On Google Discover, it reads like a textbook chapter heading and does not stop a scroll.
- Titles are written for a woman scrolling a feed on her phone, not for a crawler reading a page. The title must create an immediate emotional reaction — recognition, curiosity, or a mild surprise — in under two seconds.
- Keep the core emotional hook within the first 60 characters. The Discover feed on most Android screens truncates titles around 70 characters. Front-load the hook.
- Total title length: up to 90 characters is acceptable if the first 60 carry the hook.
- See **Section 20 — Discover Title Strategy** for the full formula, templates, and examples. That section is now the primary title rule. The slug and description rules in this section remain unchanged.

### Description (meta)
- 140–160 characters
- Contains primary keyword in first half
- Ends with a subtle promise or hook
- Example: `Learn which morning sickness remedies are backed by clinical evidence, which are myths, and when symptoms warrant a call to your provider.`

### Keyword targeting
- Write for the reader, not the crawler. Discover does not surface content based on keyword density in headings — it surfaces content based on topic relevance and user engagement signals.
- Choose one core topic per post and cover it completely and honestly. Natural language that fully addresses the topic will surface correctly without keyword engineering.
- Do not write headings to contain keywords. Write headings to tell the reader exactly what the next section answers for her.

### Internal linking (mandatory)
Every post must link to SageNest tools using natural anchor text:

| Tool | Path | Natural anchor text examples |
|------|------|------------------------------|
| Pregnancy Due Date Calculator | `/pregnancy-due-date-calculator` | "calculate your due date", "estimate your due date", "our due date calculator" |
| Pregnancy Weight Gain Calculator | `/pregnancy-weight-gain-calculator` | "find your target weight gain range", "our pregnancy weight gain calculator", "check your recommended gain" |
| Ovulation Calculator | `/ovulation-calculator` | "estimate your fertile window", "our ovulation calculator", "track your ovulation" |
| Pregnancy Week by Week | `/pregnancy-week-by-week` | "see what's happening this week", "explore your current pregnancy week", "our week-by-week pregnancy guide", "track your baby's development week by week" |
| Morning Sickness End Date Estimator | `/morning-sickness-end-date-estimator` | "estimate when morning sickness may end", "our morning sickness estimator", "see when nausea may improve" |
| Colostrum Harvesting Start Date Calculator | `/colostrum-harvesting-calculator` | "calculate when to start colostrum harvesting", "our colostrum harvesting calculator", "find your antenatal expressing start date" |
| Pregnancy Flight Safety Calculator | `/pregnancy-flight-calculator` | "check if your flight timing is safe", "our pregnancy flight calculator", "see if it is safe to fly during pregnancy" |

- There should be atleast one Cross-link to related blog posts where genuinely relevant. Never force it.

---

## 6. Content Structure (Required for Every Post)

Use this structure in order. Do not skip sections. Heading text will vary per post — this is the skeleton.

```
[HOOK — 2–3 sentences, no heading]

## Why This Happens (or: What's Actually Going On)

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

```

### First Heading Rule for Discover
The first heading after the hook must not be a definition. A reader who clicked from the Discover feed already knows what the topic is — she clicked because the title spoke to her experience. Opening with "What Is Round Ligament Pain?" after a hook that just described the exact sharp shooting pain she felt is a trust-breaking mismatch. The first heading should orient her inside the experience — why it is happening, what her body is doing, what this means for her — not define the term she already searched for. The heading text will vary per post. The rule is: never define first, always explain or orient first.

### Minimum length
- Target 1,400–1,800 words. This produces a 7–9 min read, which is the Discover sweet spot — substantive enough to build trust, short enough to hold attention to the end. Go longer only if a topic genuinely requires it and every extra word earns its place. Never pad.
- Longer is better only if the content is genuinely useful — no padding.

---
## Section 7: The Hook (Opening — No Heading)

The hook is the two to three sentences that appear before any heading. No heading precedes them. They are the first thing the reader sees after the title, and they are the single most important copy in the entire post. A reader who is not compelled by the hook will not read the article regardless of how good the rest of it is. A reader who is compelled by the hook will almost always read at least the next three paragraphs. Everything else in the post only gets read because the hook worked.

This section explains how professional hook writers think, what psychological mechanisms they are deliberately activating, and exactly how to apply that to SageNest posts where the reader is almost always in an anxious, uncertain, or emotionally elevated state.

---

### 7.1 How a Professional Hook Writer Thinks

A professional hook writer does not start by thinking about the topic. They start by thinking about the exact emotional state of the person who will read the first sentence.

This is the foundational shift. Most content writers think: "I am writing about anovulation, so I will introduce anovulation." A professional hook writer thinks: "A woman reading this post is probably sitting with months of unexplained difficulty conceiving, has been told her periods are regular and everything looks fine, and is desperately trying to understand why she is not pregnant yet. What sentence makes her feel immediately seen?"

Those two starting points produce completely different first sentences. The first produces an explanation. The second produces recognition — and recognition is what makes a person feel that this article was written for them specifically, which is the psychological event that converts a skimmer into a reader.

The four psychological mechanisms a professional hook writer is deliberately activating are:

**Recognition** — the reader feels described, not addressed. They feel the writer already knows what they are experiencing without having been told. This is the most powerful hook mechanism in health content because anxious readers are desperate to feel understood.

**Curiosity gap** — the hook creates an incomplete thought that the brain is compelled to close. The reader knows there is information they need and they cannot get it without reading further. This is why hooks that reveal a surprising truth and then withhold the explanation outperform hooks that summarise the article.

**Disrupted assumption** — the hook challenges something the reader believed was true. When a belief is challenged, the brain enters a state of mild cognitive dissonance that can only be resolved by engaging with the new information. For health content, the most effective disrupted assumptions are ones the reader has been acting on without realising they were assumptions.

**Placed in a moment** — the hook drops the reader into a specific physical or emotional scene. When a reader can locate themselves in the scenario being described — the time of day, the physical sensation, the exact thought they were having — the article stops being information and becomes a mirror. Mirrors hold attention in a way that summaries never do.

---

### 7.2 The SageNest Reader's Emotional State — The Starting Point for Every Hook

Before writing a single word of any hook, identify which emotional state the reader is most likely in when they search for this topic. The SageNest reader is not in a neutral information-seeking state. She is in one of a small number of specific emotional states, and the hook must speak directly to whichever one applies to this topic.

**The anxious night-reader state.** She is reading at 2am, between feeds or unable to sleep, and a symptom or concern is escalating in her mind because she cannot talk to her provider until morning. Her emotional state is fear mixed with the need for reassurance that is backed by something real, not generic comfort. Hooks for this state name the symptom, the time, and the silence.

**The confused researcher state.** She has already read four or five articles on this topic and they either contradicted each other or all said the same vague thing. She is frustrated and suspicious of health content. Her emotional state is scepticism mixed with determination to find a real answer. Hooks for this state acknowledge the failure of what she has already read and explicitly promise something different.

**The quietly alarmed state.** She has noticed something — a pattern on her BBT chart, a symptom that does not match what she expected, a cycle that is behaving differently — and she does not yet know whether to be worried. Her emotional state is low-level dread held at arm's length. Hooks for this state name the specific thing she has noticed before she has had to describe it.

**The desperate-for-an-explanation state.** She has been trying to conceive for longer than expected, or she has received a diagnosis, or she has experienced a loss. She is not looking for general information — she is looking for something that explains her specific situation and tells her there is a path forward. Her emotional state is grief mixed with determination. Hooks for this state avoid false reassurance entirely and instead offer clarity as the thing of value.

**The physically miserable state.** She is in the middle of a pregnancy symptom — nausea, insomnia, pelvic pain, headaches — and she wants to know whether it is normal, what is causing it, and whether anything will help. Her emotional state is discomfort mixed with frustration at generic advice that has already failed. Hooks for this state drop her into the physical experience before saying anything clinical.

Identifying the correct emotional state before writing the hook is not optional. It is the entire job. The topic determines the information. The emotional state determines the first sentence.

---

### 7.3 The Five Hook Structures That Work for SageNest

Each of these structures maps to one of the emotional states above. Select the structure that matches the emotional state of the reader for this specific topic.

---

**Structure 1: The Physical Moment Drop**
*Best for: pregnancy symptoms, physical experiences the reader is currently in the middle of*

Drop the reader into a specific sensory or physical moment before saying anything else. Use a specific time of day, a specific body sensation, a specific small action. The specificity is what makes the recognition land. Vague physical descriptions do not produce recognition. Specific ones do.

The formula: [Specific physical moment or sensation] → [The reader's exact thought in that moment] → [The gap between that thought and what is actually true — which this article will close]

Example of the formula applied:
> You are thirty-two weeks pregnant and your entire abdomen has just gone hard as a rock. It lasted about thirty seconds and then released. Now you are sitting very still, waiting to see if it happens again, wondering whether you should be calling someone.

What this hook does: places the reader in a specific scene she has either already experienced or can vividly imagine. It names the exact behaviour — sitting very still, waiting — that reveals it was written by someone who knows what this experience actually feels like, not someone who read about it.

The failure mode to avoid: generic physical description. "You feel a tightening in your abdomen" produces no recognition. "Your entire abdomen just went hard as a rock" does.

---

**Structure 2: The Disrupted Assumption**
*Best for: topics where the reader has a widespread misconception that is directly affecting what she does*

Identify the one thing the reader believes about this topic that is wrong, or more precisely, that is incomplete in a way that has consequences. State it as something she has been operating on — not as an accusation but as an observation — and then immediately disrupt it. The disruption must be specific enough to create genuine cognitive dissonance, not just vague surprise.

The formula: [State the assumption the reader has been acting on as if it is understandable that she has it] → [The specific way this assumption is incomplete or wrong] → [The stakes — what she may have missed as a result]

Example of the formula applied:
> You have had a period every month for as long as you can remember. You assumed that meant you were ovulating. It is a reasonable assumption — and for many women it is correct. But a period and ovulation are not the same event, and the gap between them is where anovulation hides.

Note what this hook does: it does not make the reader feel stupid for having the assumption. It validates the assumption as reasonable before disrupting it. That sequence — validate then disrupt — is essential in health content because a reader who feels accused of ignorance stops reading. A reader who feels understood and then surprised keeps reading.

What would make this hook stronger: naming the emotional consequence of the gap more directly. "And that gap may be the reason the last several months have not produced the result you expected" would connect the disrupted assumption to the reader's current experience of frustration.

---

**Structure 3: The Named Frustration**
*Best for: topics where the reader has already consumed bad advice, contradictory information, or generic guidance and found it inadequate*

Name the specific failure of the existing information landscape on this topic. Do not criticise other sites by name — criticise the quality of the category. Then position this article as the one that will not repeat those failures. The promise must be specific: not "real information" but the specific type of real information this article provides.

The formula: [Name the specific type of bad advice or conflicting information the reader has already encountered] → [Why the advice was bad or why the contradiction exists] → [The specific thing this article does differently]

Example of the formula applied:
> You are six weeks pregnant, you cannot keep water down, and every piece of advice you have read online contradicts the last. Morning sickness is the most under-discussed misery of early pregnancy — and the information circulating about how to manage it ranges from genuinely helpful to actively useless. Here is what the evidence actually says.

Note what makes this hook work: "ranges from genuinely helpful to actively useless" is specific enough to feel true. It is not "there is a lot of bad information out there" — it is a characterisation that matches the experience of a reader who has tried four remedies and had two work and two do nothing.

---

**Structure 4: The Quietly Alarming Observation**
*Best for: topics where the reader has noticed something specific and is uncertain whether to be worried*

Name the specific thing the reader has noticed — the chart pattern, the symptom, the cycle behaviour — in the exact terms she would use to describe it to herself, not in clinical language. Then name the uncertainty she is holding. Then offer orientation rather than reassurance: not "this is probably fine" but "here is how to know what this actually is."

The formula: [Name the specific observation the reader has made, in her terms] → [Name the uncertainty she is sitting with] → [Promise orientation — clarity about what it means and what to do — rather than false comfort]

Example of the formula applied:
> Your BBT chart for the last three cycles has no clear temperature rise. You have been measuring every morning before getting out of bed. You are doing it correctly. And yet the chart looks flat. Here is what a monophasic chart can mean, what it cannot tell you on its own, and what actually warrants a provider conversation.

What this structure avoids: jumping to reassurance. "This is usually nothing to worry about" as a hook for a reader whose chart shows no ovulation is not reassuring — it is dismissive. Orientation is more respectful and more useful than comfort.

---

**Structure 5: The Counterintuitive Opening Fact**
*Best for: topics where the most important thing the reader needs to know contradicts what they expect going in*

Lead with the single most counterintuitive true fact about this topic — the one that, if the reader understood it properly at the start, would change how they read everything else in the article. State it plainly, without hedging, in the first sentence. Then give the reader one sentence of context that makes it credible rather than just surprising. Then name what this means for them practically.

The formula: [The counterintuitive fact, stated plainly] → [One sentence that makes it credible — the mechanism or the source] → [What this means for the reader's specific situation right now]

Example of the formula applied:
> Basal body temperature charting cannot tell you that ovulation is about to happen. The temperature rise that confirms ovulation occurs after the egg has already been released — typically twelve to twenty-four hours later. If you are waiting for your temperature to rise before timing intercourse, you are timing it after your fertile window has already closed.

What this structure does: the reader who came in believing BBT charting helps her time conception is immediately in a state of needing to understand what she should be doing instead. That need drives the entire rest of the article.

---

### 7.3 Title-Hook Continuity Rule

The title makes an emotional promise. The hook must keep that promise in its first sentence. This is not optional — it is the structural rule that prevents bounces from Discover traffic.

When a reader taps a post in the Discover feed, she arrives having been sold on a specific emotional experience by the title. If the hook opens with a different energy, a definition, or a scene that does not match what the title implied, her brain registers a mismatch and she closes the tab. This bounce is logged as a negative engagement signal and reduces how often Discover surfaces that post.

The continuity test: read the title, then read the first sentence of the hook. Does the first sentence feel like the natural next line after the title — like the conversation the title started is continuing? If yes, the continuity is intact. If the first sentence could belong to a different article on the same topic, rewrite it.

**Examples:**

Title: *"Why You Can't Sleep at 32 Weeks (And What Actually Helps)"*
✅ Continuous hook opening: *"It is 2am and you are more exhausted than you have ever been in your life, and yet here you are — completely awake, unable to find a position, waiting for a baby who has decided this is the hour to practise gymnastics."*
❌ Broken continuity: *"Sleep disturbances are extremely common in the third trimester of pregnancy, affecting a significant proportion of women."*

Title: *"The Real Reason Your BBT Chart Looks Flat"*
✅ Continuous hook opening: *"You have been measuring your temperature every morning before you move, before you speak, before you even open your eyes — and the chart still shows no rise."*
❌ Broken continuity: *"Basal body temperature charting is a method of tracking ovulation by measuring your resting body temperature each morning."*

The failure mode is always the same: the writer switches from the reader's emotional experience (which the title addressed) to a clinical explanation (which no title promised). Write the hook in the same register as the title. Stay in the reader's experience until she has been fully placed in it — then explain.

### 7.4 What Every Hook Must Accomplish in Three Sentences or Fewer

Regardless of which structure is used, every SageNest hook must accomplish all four of the following within its two to three sentences. If any one is missing, rewrite the hook.

**It must name the reader's current experience specifically enough that she feels described, not addressed.** The test: would a reader who is not experiencing this topic skip this opening feeling like it was not written for her? If yes, it is too generic.

**It must create a reason to read the next sentence that is more specific than general curiosity.** The test: can the reader close the tab after the hook and feel she has gotten something? If yes, the curiosity gap has not been opened. The hook should create an itch, not scratch one.

**It must not begin with a definition, a statistic, a question, or the words "If you are," "Pregnancy is," or any variation of "many women experience."** These openings signal generic health content. They are the pattern the reader has already seen on the previous five sites she visited.

**It must not offer false reassurance as its primary function.** "This is usually nothing to worry about" as an opening is not a hook — it is a dismissal. A reader who is genuinely worried will distrust it. A reader who is not worried did not need it. Reassurance belongs inside the article, earned by explanation. It does not belong in the hook.

---

### 7.5 The Emotional Calibration Rule

Health content hooks carry a specific responsibility that general copywriting hooks do not. The reader is not evaluating a product — she is in the middle of a medical experience, often an anxious or frightening one. The hook must meet her emotional state precisely, not exceed it.

**Matching the emotional state** produces recognition and trust. The reader feels understood.

**Exceeding the emotional state** — writing a hook that is more alarming than the reader's current level of concern — creates unnecessary fear and undermines trust. A reader who was mildly curious and finishes the hook feeling frightened has been harmed by the writing, not helped.

**Underestimating the emotional state** — writing a hook that is calmer than the reader's current concern — produces the feeling that the writer does not understand what this is like. The reader closes the tab.

The calibration is precise. For a post on round ligament pain, the reader's emotional state is startled and uncertain but not deeply frightened. A hook that names the sharp shooting pain and the moment of freezing matches her state. A hook that warns of serious complications she might have would exceed it. A hook that says round ligament pain is a common pregnancy experience would underestimate it.

For a post on anovulation where the reader may have been trying to conceive for months without understanding why, the emotional state is quiet desperation and the need for a clear explanation. A hook that names the frustration of having regular periods and still not conceiving matches it. A hook that offers quick reassurance underestimates it.

---

### 7.6 Failure Modes — What Makes a Hook Not Work

These are the most common hook failures. Every hook must be checked against each of these before the post is finalised.

**The definition opening.** Starting with "Anovulation is the absence of ovulation" or "Basal body temperature is your resting temperature measured after sleep" is the single most common failure in health content hooks. It signals reference material, not guidance. The reader already knows she can get a definition anywhere. She came here for something more specific to her situation.

**The false universal.** "Many women experience shortness of breath during pregnancy." This sentence is true but it applies to no one specifically. It creates no recognition. Replace it with a specific scene in which one woman is experiencing this thing right now.

**The reassurance-first structure.** Opening with "This is usually harmless" or "Most cases resolve on their own" before the reader has been given any reason to trust that assessment is not reassuring — it is dismissive. Earn the reassurance by explaining the mechanism first.

**The clinical summary.** A hook that reads like the introduction paragraph of a medical abstract — objective, third-person, organised around what the article covers — reads like content written for a database, not for a person. If the hook could appear unchanged on a Wikipedia article, it is not a SageNest hook.

**The question hook used lazily.** "Have you ever wondered why your BBT chart looks flat?" is weak because it invites the reader to say no and leave. Questions only work as hooks when the reader cannot honestly answer no — when the question names something she has definitely thought or felt. The test: would ninety percent of the target readers for this specific post answer yes to this question? If not, it is not the right question.

---

### 7.7 Quick Reference — Hook Writing Sequence

When writing the hook for any SageNest post, execute these steps in order:

**Step 1:** Identify the emotional state of the reader who would search for this specific topic at the moment they are searching for it. Name it specifically — not "anxious" but "has been trying to conceive for eight months and just got another negative test and is starting to wonder if something is wrong with her cycles."

**Step 2:** Identify the one thing she most needs to feel in the first sentence — recognised, oriented, surprised, understood, or validated before being disrupted.

**Step 3:** Select the hook structure from Section 7.3 that matches her emotional state and that thing she needs to feel.

**Step 4:** Write the hook in two to three sentences. Do not exceed three. The pressure of three sentences forces the specificity that makes the hook work. More sentences allow the writer to be vague.

**Step 5:** Check the hook against the four requirements in Section 7.4 and the six failure modes in Section 7.6. If it fails any check, rewrite it before proceeding to the rest of the post. The hook is written last if necessary — but it must be written correctly before the final output is produced.

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

### ⚠️ The Numbers Rule — Read This Before Writing Any Statistic

**This is the highest-risk area in every post.** AI-generated content can produce numbers that look authoritative but are slightly wrong, outdated, or completely fabricated. In a pregnancy niche, a wrong number is not just a credibility problem — it is a liability.

Apply these rules strictly whenever a specific number, percentage, or threshold appears in a post:

1. **Never invent a specific statistic.** If you cannot recall the exact figure with high confidence from a named, traceable source, do not use it. Replace it with qualitative language instead — *"iron requirements increase substantially during pregnancy"* is always safer than *"iron requirements increase by 50 percent"* when the exact figure is uncertain.

2. **Every specific number must carry its source inline — and that source must be traceable.** "ACOG recommends" is not enough on its own. The claim must be specific enough that a reader could find the original guideline: *"ACOG recommends at least 150 minutes of moderate-intensity aerobic activity per week for women with uncomplicated pregnancies."*

3. **When in doubt, round or qualify.** *"Roughly 1 in 5 pregnant women"* is safer than *"19.3 percent"* when the exact figure has not been verified against a primary source. Approximations that are directionally correct are always preferable to precise-sounding numbers that might be wrong.

4. **The Section 16 "strong version" example is a writing style model, not pre-verified data.** The specific figures in that example — such as prevalence rates and absorption percentages — illustrate how to write with specificity and authority. They must be independently verified against a named source before being used in any published post. Do not copy them as if they are confirmed facts.

### Sourcing and Citation Protocol
For the full sourcing rules — how to find confirmed URLs, how to handle unverifiable claims, and the required Sources section format — follow Section 19 exactly. Section 19 is the authoritative reference for all citation work. The rules in this section are the principle; Section 19 is the process.

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

Use these to pick the next post. Rotate through categories to build topical authority across the full site. dont build posts on the exact title given below, these are just topics to take an idea from, make the blogposts related to these topics not exactly these topics, try to get some niche specific so that we can get rank for those niche specific keywords where others are not making blogs for.

### 21. Keyword & Topic Selection Rules

Before picking any topic from the categories below, apply these three filters in order. A topic that fails any filter must be reworked before writing begins.

**Rule 1 — Discover Relevance Check**
Ask: would a pregnant woman stop scrolling if she saw this title in her Discover feed right now? Discover does not surface content based on domain authority — it surfaces content based on how relevant and engaging it is for a specific user. This means a new site with strong engagement signals can reach the same feed as Healthline. The filter is not "can we outrank them?" — it is "does this topic create an immediate emotional reaction in the reader we are writing for?"

Apply the specificity test second: is there a specific scenario, trimester, symptom variant, or emotional moment within this topic that is more vivid and more stoppable than the generic version? That specific version is always the better Discover topic. Not because it avoids competition, but because it speaks to a more precise emotional state — and precision is what stops a scroll.

**Rule 2 — Scenario Specificity Test for Titles**
Every post title must target a specific scenario or condition, not a general topic. The test: could this title appear as a chapter heading in a generic pregnancy textbook? If yes, it is too broad. Rework it to name a specific situation the reader is actually in.

- ❌ Too broad: "PCOS and Ovulation"
- ✅ Specific enough: "PCOS Ovulation Tracking When Your Cycles Are Longer Than 35 Days"
- ❌ Too broad: "Pregnancy Headaches"
- ✅ Specific enough: "Pregnancy Headaches Behind the Eyes: Causes and When to Worry"
- ❌ Too broad: "Iron in Pregnancy"
- ✅ Specific enough: "Iron Deficiency in the Third Trimester: Why It Spikes and What to Do"

The specific version targets a reader who is in that exact situation. The broad version targets no one in particular.

**Rule 3 — Slug Clarity Rule**
The slug is invisible to readers arriving from Google Discover — nobody sees it in a feed card. Its only function is a clean, readable URL and basic topical signal for Google's indexing system.

Keep slugs lowercase, hyphenated, and descriptive of the post's core topic. Add a qualifier (trimester, symptom variant, condition) when it makes the URL more accurate — not to game a niche keyword, but because accurate URLs are cleaner. Do not spend time engineering slugs for search positioning. That effort now belongs in the title.

- ✅ Acceptable: `pregnancy-headaches-third-trimester`, `pcos-ovulation-irregular-cycles`
- ❌ Avoid: `pregnancy-headaches` (too vague to be a useful URL), anything over 7 words

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

## 15. Final Pre-Publish Checklist

Before delivering any post, verify every item:

- [ ] Slug is lowercase, hyphenated, keyword-focused
- [ ] Title follows Discover format — emotional hook front-loaded in first 60 characters, no `[Keyword]: [Benefit]` structure (see Section 20)
- [ ] imagePrompt field is present in the TypeScript object and follows the rules in Section 21
- [ ] Description is 140–160 characters and contains the primary keyword
- [ ] No `publishDate` field included
- [ ] Hook opens without a heading and speaks directly to the reader's concern
- [ ] All major clinical claims attributed to ACOG, IOM, WHO, CDC, or NIH
- [ ] Every specific statistic has a named, traceable source — no invented numbers
- [ ] No direct quotes of 15+ words from any source (paraphrase always)
- [ ] At least one internal link to a SageNest tool, placed naturally
- [ ] "When to Call Your Doctor" section present with specific red flags
- [ ] 3–5 FAQ items, written as real search queries with complete answers
- [ ] "Related Tools" section links to relevant calculators
- [ ] Medical disclaimer present at the end
- [ ] Sources section present with real confirmed URLs — not search terms (see Section 19)
- [ ] Full TypeScript object format ready to paste into `blogPosts.ts`
- [ ] Reading time is accurate to word count — calculated as word count ÷ 200, rounded to nearest whole number. Target is 7–9 min read (1,400–1,800 words). If the reading time exceeds 9 min, trim before delivering — remove transitional summaries, repetitive reinforcement sentences, and any section that doesn't directly answer something the reader would actively wonder about.
- [ ] **Post is placed at the TOP of the `blogPosts` array when pasting into `blogPosts.ts`**

---

## 16. Example: Strong vs Weak Version of the Same Section

**Topic: Iron in pregnancy**

**Weak version:**
> Iron is important during pregnancy. You should eat iron-rich foods like spinach and red meat. Talk to your doctor if you think you are deficient.

**Strong version:**
> Iron requirements nearly double during pregnancy — from 18 mg per day to 27 mg — because your blood volume expands by 40 to 50 percent and the fetus draws heavily on maternal iron stores for its own development. Iron deficiency anemia, which affects approximately 15 to 20 percent of pregnant women in the US, is associated with preterm birth and low birth weight when left unmanaged. Heme iron from animal sources — red meat, poultry, fish — is absorbed at a rate of 15 to 35 percent, making it significantly more bioavailable than the non-heme iron in plant foods like lentils and spinach. To enhance non-heme iron absorption, pair plant-based iron sources with vitamin C-rich foods: a lentil soup with a squeeze of lemon, or spinach with sliced strawberries.

> ⚠️ **Note:** The figures above are illustrative of the writing *style* this guide aims for — specific, sourced, actionable. Before using any statistic in a published post, verify it against a primary source (IOM, ACOG, NIH). See Section 9 — The Numbers Rule.

The second version gives the reader specific numbers, explains the mechanism, names the risk, and gives actionable advice — all in one paragraph.

---

## 17. The Hard Line on Personal Advice
- Never write content that functions as a personal recommendation, even if it is framed as general information. The test is simple: could a reader follow this content as instructions without calling their provider? If yes, rewrite it.
Specific rules:
Any dietary threshold, carbohydrate target, calorie range, or macronutrient percentage for a medical condition (GDM, anemia, preeclampsia, thyroid) must be described as "the approach a dietitian or provider would discuss with you" — never stated as something the reader should implement on their own.
Any supplement or medication — including over-the-counter options like doxylamine, B6, or iron — must be framed as requiring a provider conversation before use. The phrase "generally safe" or "considered acceptable" is not sufficient on its own. Always follow it with "confirm with your provider before taking anything during pregnancy."
Any self-monitoring guidance (BBT charts, kick counts, blood glucose patterns) that could lead a reader to self-diagnose or delay care must include a hard redirect: "this is information to bring to your provider, not to act on independently."
If a specific number, threshold, or range does not appear verbatim on the ACOG, WHO, CDC, NIH, or IOM website, do not use it. Qualitative language is always safer than a precise figure you cannot directly trace to a primary source URL.

---

## 18. Already Published — Do Not Repeat Any of These
 - gestational-diabetes-pregnancy-weight-gain
 - how-due-dates-are-calculated
 - ivf-due-date-guide
 - morning-sickness-remedies-that-actually-work
 - pregnancy-weight-gain-myths-facts
 - pregnancy-nutrition-guide-what-to-eat-each-trimester
 - healthy-pregnancy-weight-gain-complete-guide
 - pregnancy-week-by-week-milestones
 - ovulation-signs-symptoms
 - braxton-hicks-vs-real-contractions 
 - pregnancy-swelling-edema-normal-vs-warning-sign
 - pregnancy-headaches-causes-safe-relief-red-flags
 - round-ligament-pain-pregnancy
 - irregular-cycles-ovulation-conception
 - luteal-phase-explained-after-ovulation
 - pregnancy-insomnia-causes-safe-relief
 - shortness-of-breath-pregnancy
 - pelvic-girdle-pain-pregnancy
 - bbt-charting-ovulation
 - cervical-mucus-ovulation-guide
 - anovulation-what-it-is-causes-treatment
 - pcos-ovulation-tracking-irregular-cycles
 - iron-supplements-pregnancy-side-effects
 - choline-pregnancy-prenatal-vitamins-miss
 - iodine-pregnancy-sea-salt-prenatal-gap
 - fish-pregnancy-what-to-eat-avoid-mercury
 - caffeine-200mg-limit-pregnancy-what-counts
 - pregnancy-dehydration-third-trimester-thirst


## Section 19: Source Verification, Citation, and the Self-Check Protocol

This section governs how every claim in every SageNest post gets sourced, verified, and cited. These are not optional steps. They are part of the writing process itself. **No post is complete until the Sources section contains real, confirmed URLs — found and verified by the AI itself through active web search. Outputting search terms for the user to look up manually is not acceptable.**

---

### 19.1 The Core Principle

Every factual claim in a SageNest post must be traceable to a specific page on a primary source website. Not a general health website. Not a secondary article that summarises the original. The original document itself — a guideline, a fact sheet, a recommendation page, or a clinical resource published directly by ACOG, WHO, CDC, NIH, FDA, or IOM.

Before writing any claim, ask: can I identify the specific primary source page that contains this figure or recommendation? If the answer is no, do not write the claim as a specific figure. Write it in qualified language instead. A directionally correct approximation attributed to a named organisation is always safer and more honest than a precise-sounding number that cannot be traced.

---

### 19.2 The Approved Primary Source List

Only these sources qualify as primary citations in SageNest posts. No other source — including Mayo Clinic, WebMD, Healthline, BabyCenter, or any other health publisher — may be cited as a source, even if they are useful for general orientation.

**ACOG — American College of Obstetricians and Gynecologists**
Domain: acog.org
Use: Practice Bulletins, Committee Opinions, Patient FAQs, and the womens-health resource library. The patient-facing pages at acog.org/womens-health are the most consistently useful because they reflect current ACOG positions in accessible language.
How to locate: Perform a web search using `site:acog.org [topic]` to find the specific page.

**CDC — Centers for Disease Control and Prevention**
Domain: cdc.gov
Use: The Reproductive Health section, the Pregnancy hub, and specific condition pages. CDC pages carry direct government authority and are updated on a defined schedule.
How to locate: cdc.gov/pregnancy is the main hub. Use `site:cdc.gov [topic] pregnancy` to find specific pages.

**NIH — National Institutes of Health and sub-institutes**
Domain: nih.gov, medlineplus.gov, ods.od.nih.gov, nichd.nih.gov
Use: MedlinePlus for general health topics. The Office of Dietary Supplements fact sheets at ods.od.nih.gov/factsheets for any nutrient-specific claim — these pages list exact recommended intake figures by life stage including pregnancy and are the authoritative source for all nutrient quantities. NICHD for pregnancy and fetal development topics.
How to locate: ods.od.nih.gov/factsheets lists individual fact sheets for every major vitamin and mineral. medlineplus.gov has a full A-Z health topics index.

**WHO — World Health Organization**
Domain: who.int
Use: WHO recommendations pages, the Reproductive Health library, and specific guideline documents. Most useful for global prevalence figures and for recommendations that apply across populations rather than US-specific guidance.
How to locate: who.int/health-topics has an A-Z index.

**IOM / NAM — Institute of Medicine / National Academy of Medicine**
Domain: nationalacademies.org
Use: Dietary Reference Intakes for all nutrient quantity claims during pregnancy. This is the definitive source for how much of any vitamin, mineral, or nutrient is recommended. Any nutrient figure written in a SageNest post must be checked against the IOM DRI tables before being included.
How to locate: nationalacademies.org/our-work/dietary-reference-intakes

**FDA — US Food and Drug Administration**
Domain: fda.gov
Use: Food safety in pregnancy — mercury in fish, listeria risk, safe food handling. The specific page fda.gov/food/consumers/advice-about-eating-fish is the authoritative source for fish consumption guidance during pregnancy.

---

### 19.3 Before Writing: Identify the Source Pages First

Before drafting any post, identify the three to five core factual claims the post will make. For each claim, identify the specific primary source page that contains the supporting figure or recommendation. This must happen before writing begins, not after.

For a post on iron deficiency in pregnancy, the core claims would be: the recommended daily iron intake during pregnancy, the prevalence of iron deficiency anemia in pregnant women, the difference in absorption rates between heme and non-heme iron, and the effect of vitamin C on non-heme iron absorption. Each of these requires a specific source page to be identified before a single sentence is written.

If a core claim cannot be matched to a specific primary source page, it must be written in qualified language — naming the organisation and the general recommendation without a specific figure — or removed from the post entirely.

---

### 19.4 During Writing: How to Handle Claims and Numbers

Every specific number, percentage, threshold, or clinical recommendation written in the post must be accompanied mentally by the source page it came from. When writing a sentence that contains a figure, the source page must already have been identified in the pre-writing step.

Do not extrapolate. If the source says "associated with increased risk" write "associated with increased risk." Do not write "causes." If the source says "may reduce" write "may reduce." Do not write "prevents." Overstated certainty is the most common way health content crosses from informative to harmful, and it is not permitted in any SageNest post.

Do not upgrade approximations to precise figures. If the exact number is not confirmed against the source page, use qualified language: "roughly one in five," "approximately," "estimates suggest." These are not weaknesses — they are accurate representations of what is actually known.

---

### 19.5 The Self-Check Protocol — Execute Before Producing Final Output

After drafting the full post and before producing the final output, execute this self-check sequence in order. Do not skip any step. The post is not complete until all steps have been passed.

**Self-Check 1: Claims audit**
Read through the entire draft. Identify every sentence that contains a specific number, percentage, clinical threshold, named guideline, or prevalence figure. For each one, confirm the source page that supports it. If any claim cannot be matched to a specific source page, apply the correction options from Section 19.7 before proceeding.

**Self-Check 2: Overstatement audit**
Re-read every sentence that describes a risk, outcome, or causal relationship. Check that the language used matches the strength of the evidence the source actually presents. Replace any causal language with associative language where the source uses association. Replace any absolute language with qualified language where the source uses probability.

**Self-Check 3: Personal advice audit**
Re-read every sentence that mentions a supplement, medication, OTC product, dietary approach for a medical condition, or self-monitoring protocol. Apply the Section 19 test to each one: could a reader follow this sentence as an instruction without contacting their provider? If yes, rewrite the sentence so it describes what a provider or dietitian would discuss, not what the reader should do.

**Self-Check 4: Nutrient figure audit**
If the post mentions any recommended intake for any vitamin, mineral, or nutrient during pregnancy, confirm each figure against the IOM DRI tables or the relevant NIH Office of Dietary Supplements fact sheet. If a figure cannot be confirmed against one of these two sources specifically, replace it with qualified language.

**Self-Check 5: Live URL verification — mandatory, replaces the old search-term method**
For every source that will appear in the Sources section, perform an active web search to confirm the URL. Do not construct a URL that looks plausible without searching. Do not output search terms for the user to look up — that workflow is retired. Search for each page, confirm it resolves to a real, specific page on the correct primary source domain that actually contains the relevant claim, and record the full confirmed URL and exact page title. If a URL cannot be confirmed as real and specific through an active search, do not include it — apply Section 19.7 options instead.

---

### 19.6 Source Verification Process — How to Find and Confirm Real URLs

This is the process that replaced the old search-term handoff. The AI writing the post is responsible for actively searching and confirming every URL before the post is delivered. The user receives a finished Sources section with real working links — not a list of terms to search manually.

**For each major claim in the post, execute this sequence:**

1. Identify which primary source domain owns this type of claim: ACOG for obstetric guidelines, NIH ODS for nutrient quantities, CDC for prevalence and public health data, WHO for global recommendations, FDA for food safety.

2. Perform an active web search using a targeted query: `site:acog.org [topic]`, `site:ods.od.nih.gov [nutrient]`, `site:cdc.gov [topic] pregnancy`, `site:who.int [topic]`, etc.

3. From the results, identify the specific page — not a category hub, not a homepage — that actually contains the claim being cited.

4. Confirm the exact page title as it appears in the search result, the full URL, and that the page genuinely contains information relevant to the claim.

5. Record these details for inclusion in the Sources section.

**What counts as a confirmed URL:**
- A URL returned by an active web search that resolves to a named, specific document or page on an approved domain
- The page title is known from the search result and matches the content
- The page actually contains information relevant to the specific claim being cited

**What does not count as a confirmed URL:**
- A URL constructed by guessing a plausible path without searching
- A category hub page without a specific sub-page (e.g., cdc.gov/pregnancy without further path)
- Any URL on a non-approved domain
- A URL that was not actively searched and confirmed

If a search returns no specific page for a given claim, the claim must be qualified or removed per Section 19.7. Under no circumstances should a URL appear in the Sources section that was not found through an active search.

---

### 19.7 The Required Sources Section Format

Every post must end with a Sources section formatted exactly as follows. This section is part of the post content and must appear in the final TypeScript object inside the content field, after the medical disclaimer. Every URL in this section must be a real, confirmed link found during Self-Check 5 — not a search term, not a guessed path.

```


**Sources**

This post draws on guidance from the following primary sources:

- **ACOG** — [Exact Page Title As It Appears On The Page](https://www.acog.org/confirmed-url)
- **CDC** — [Exact Page Title As It Appears On The Page](https://www.cdc.gov/confirmed-url)
- **NIH Office of Dietary Supplements** — [Exact Page Title](https://ods.od.nih.gov/confirmed-url)
- **IOM / National Academies** — [Exact Page Title](https://www.nationalacademies.org/confirmed-url)

**Clinical recommendations reflect guidance from these sources. This article is for informational purposes only and is not a substitute for professional medical advice. Always consult your healthcare provider with any concerns about your pregnancy.**
```

Rules for the Sources section:

List only sources that directly support a specific claim made in the post. Do not list sources consulted for background orientation that did not contribute a specific cited claim.

If the post draws on multiple pages from the same organisation, list each page separately with its individual title and URL. Do not collapse multiple ACOG pages into a single entry.

Do not cite PubMed study entries unless the study abstract has been verified to contain the specific claim the post attributes to it. A PubMed URL without verified content behind it is not a citation — it is a liability.

Sources appear only at the very end of the post — after the medical disclaimer. They are not inline links within body paragraphs. The only clickable links within body text are internal SageNest tool links.

---

### 19.8 When a Claim Cannot Be Sourced

If the self-check process identifies a claim that cannot be matched to a specific primary source page, apply one of these three options in order of preference:

**Option 1: Replace with qualified language.**
Remove the specific figure and replace with an attributed approximation. "The IOM recommends substantially more iron during pregnancy than the standard adult intake" instead of a specific milligram figure that cannot be verified. This is always acceptable and never reduces the quality of the post.

**Option 2: Remove the claim.**
If the claim is supplementary and the post is complete without it, cut it entirely. A post with fewer claims that are all verified is a stronger post than one with more claims where some are uncertain.

**Option 3: Hold the post.**
If the claim is central to the post's argument and cannot be verified or replaced with qualified language, note in the output that this specific claim requires verification against [named source] before the post is ready to publish. Do not silently include an unverified central claim.

What must never happen: an unverified specific figure reaching the final output with no flag and no qualification, and no real confirmed URL in the Sources section for any claim presented as sourced. In a pregnancy health context this is not an acceptable outcome under any circumstances.

---

### 19.9 Evergreen Maintenance Note

The `lastReviewed` field in the BlogPost object exists to signal when content was last checked against current guidelines. When writing a new post, set this field to the current month and year. When a major guideline update from any primary source affects the topic of an existing post, that post's content and citations must be updated and the `lastReviewed` field revised accordingly. Guidelines from ACOG, CDC, and WHO are updated periodically and content that was accurate at time of writing can become outdated. The sources section and the lastReviewed field together create the audit trail that demonstrates the content is actively maintained.

---   
 
---

## Section 20: Discover Title Strategy

This section replaces the `[Keyword]: [Benefit]` title format from Section 5. These rules govern every blog post title written for SageNest from this point forward.

---

### 20.1 Why Titles Changed

SageNest content is now optimised for Google Discover, not Google Search. On a search results page, a keyword-first title signals relevance to a query. On the Discover feed, a keyword-first title signals generic health content — and a woman scrolling on her phone skips it in under a second.

Discover is a scroll. The title competes against posts from every category the reader follows — not just pregnancy content. The title must win that competition in one second or it loses. Winning means creating an immediate emotional reaction: recognition ("that's exactly what I'm experiencing"), curiosity ("I need to know what that means"), or mild surprise ("I didn't know that").

Google's February 2026 Discover core update also explicitly penalises sensationalism and "withholding crucial information required to understand what the content is about." The old-style curiosity gap — titles that tease without delivering — now actively hurts distribution. The new formula is honest specificity with emotional framing.

---

### 20.2 The Formula

**[Specific detail or number] + [Emotionally resonant situation or feeling] + [Promise of a real answer]**

The three elements do not need to appear in that exact order, and not every title needs all three explicitly. But every title must contain the emotional resonance and the promise. The specific detail is what makes it credible.

---

### 20.3 The Title Rules

**Rule 1 — Specificity over vagueness. Always.**
Include a week number, trimester, specific symptom, named condition, or concrete detail whenever one exists. A specific title speaks to one reader precisely. A vague title speaks to everyone loosely and stops no one.
- ✅ `"Why You Can't Sleep at 32 Weeks (And What Actually Helps)"`
- ❌ `"Pregnancy Sleep Problems and Solutions"`

**Rule 2 — Speak to her current moment.**
The reader is pregnant right now, or trying to conceive right now, or postpartum right now. Use "you", "your baby", "this week", "right now" to make the title feel like it was written for her specific situation, not for a general audience.
- ✅ `"Your Baby's Brain Is Developing Fastest Right Now — What Week 24 Actually Looks Like"`
- ❌ `"Fetal Brain Development at 24 Weeks"`

**Rule 3 — Curiosity gaps are allowed, but you must fully deliver.**
Creating a curiosity gap in the title is effective — but the article must completely answer whatever the title implies. Google's 2026 update now detects mismatch between title promise and content delivery, and reduces distribution when it finds one. Never promise something the article does not fully give.
- ✅ `"The One Third Trimester Symptom Most Doctors Don't Warn You About"` — acceptable if the article names and fully explains that symptom
- ❌ Same title if the article just lists five generic symptoms without a specific reveal

**Rule 4 — Numbers stop the scroll.**
Use specific, honest numbers wherever they exist in the content.
- ✅ `"7 Signs Your Third Trimester Fatigue Is Normal (And 3 That Aren't)"`
- ✅ `"Week 20: Your Baby Is Now the Size of a Banana — Here's What Changed"`
- ❌ `"Signs of Fatigue in Late Pregnancy"`

**Rule 5 — These phrases are banned from titles.**
They were effective in 2022. They are flagged by the 2026 Discover algorithm and they have been overused to the point of producing no emotional reaction:
- "You Won't Believe..."
- "This One Trick..."
- "Doctors Hate This..."
- "What Nobody Tells You..." (unless the article genuinely reveals something unexpected and specific — then it must be phrased to signal the specific reveal, not just the withholding)
- Any phrasing that implies medical authority is hiding something from the reader

**Rule 6 — Front-load the emotional hook.**
The Discover feed on most Android screens shows approximately 60–70 characters of a title before truncating. Put the most emotionally resonant part of the title in the first 60 characters. Additional context can follow up to 90 characters total.

**Rule 7 — Emotional verbs that work on Discover.**
These verbs produce engagement on Discover health content: reveals, warns, changes, confirms, explains, happens, means, causes, affects, feels like, looks like, actually does. Use them.

---

### 20.4 Discover Title Templates for Pregnancy Content

Use these as starting frameworks. Do not copy them verbatim — adapt to the specific topic and emotional state of the reader.

- `"What's Actually Happening to Your [Body Part] at Week [X]"`
- `"[X] Signs of [Symptom] in Pregnancy That Are Completely Normal"`
- `"Why [Common Worry] at [Trimester / Week] Isn't What You Think"`
- `"Your Baby at Week [X]: [Specific Milestone] — And What Comes Next"`
- `"The Real Reason You're [Feeling X] in the [Trimester]"`
- `"[Number] Things That Change After [Milestone] That No One Prepares You For"`
- `"Why [Symptom] Gets Worse at Night in the [Trimester] (And What Helps)"`
- `"What [Symptom] in Week [X] Actually Means — And When to Call Your Doctor"`
- `"Is [Symptom] Normal at [Week / Trimester]? Here's How to Tell"`

---

### 20.5 Weak vs Strong Title Examples

| Topic | Weak (SEO format) | Strong (Discover format) |
|---|---|---|
| Pregnancy insomnia | `Pregnancy Insomnia: Causes and Safe Management` | `Why You're Wide Awake at 3am in the Third Trimester (And What Actually Helps)` |
| Round ligament pain | `Round Ligament Pain: What It Is and When to Worry` | `That Sharp Shooting Pain at 20 Weeks — What Your Body Is Actually Doing` |
| BBT charting | `BBT Charting for Ovulation: How to Do It` | `Your BBT Chart Looks Flat — Here's What That Actually Means` |
| Iron in pregnancy | `Iron Deficiency in the Third Trimester` | `Why Iron Deficiency Spikes in the Third Trimester (And the Signs Most Women Miss)` |
| Anovulation | `Anovulation: What It Is, Causes and Treatment` | `You're Getting a Period Every Month — But You Might Not Be Ovulating` |

---

## Section 21: Image Prompt Standard

Every blog post TypeScript object must include an `imagePrompt` field. This field is the prompt that the `generate-blog-html.mjs` script sends directly to the Pollinations API to generate the post's image. Claude writes this field as part of every post output — it is a required field in the TypeScript object, not a separate note.

The script reads `post.imagePrompt` at build time, sends it to Pollinations to generate a clean photorealistic image, then programmatically adds a short text overlay on top before uploading to Cloudinary. Claude's job is to write the scene — the script handles the text overlay automatically from the post title.

### 21.1 Why imagePrompt Exists

The old pipeline used a keyword-matching map to pick a fixed generic prompt based on the post slug. This produced the same few images repeatedly across many posts. A post about pregnancy insomnia and a post about postpartum insomnia would get the same image because both slugs contained "sleep."

The new approach: Claude knows exactly what each post is about, what emotional state the reader is in, and what scene would resonate with the title. Claude writes a precise, post-specific prompt. The result is a unique image for every post that matches the emotional tone of the title.

### 21.2 The imagePrompt Rules

**Rule 1 — Always describe a real human scene.**
The prompt must describe a person in a specific physical situation. Never describe objects alone (a pill bottle, a vegetable, a calendar with no person). Never describe diagrams or medical illustrations.
✅ `a visibly exhausted pregnant woman lying awake in a dark bedroom at 3am, eyes open, one hand resting on her belly, soft moonlight through curtains, warm and real, photorealistic`
❌ `a calendar and a clock on a bedside table with soft lighting`

**Rule 2 — The person's emotional state must match the title's emotional tone.**
Read the title. Identify the emotional state of the reader it targets. The person in the image should be in that same emotional state.
- Post about 3am insomnia → woman looks exhausted, awake, quiet
- Post about baby movement at Week 20 → woman looks wondering, gently amazed, hand on belly
- Post about BBT chart showing no rise → woman looking at her phone or chart with a slight frown, uncertain but calm
- Post about round ligament pain → woman pausing mid-movement, hand on lower abdomen, surprised expression

**Rule 3 — For invisible internal processes, show the external experience.**
If the post is about something the reader cannot see — ovulation, fetal development, iron absorption, hormonal changes — show how the woman experiences it from the outside. Her posture, her expression, her environment.
- Post about iron deficiency → woman sitting on sofa looking pale and fatigued, hand on forehead, warm indoor light
- Post about fetal brain development at Week 24 → woman lying on her side with headphones on her belly, gentle smile, soft light

**Rule 4 — Avoid stock-photo perfection.**
Do not describe perfectly lit, perfectly styled scenes. Real-feeling, slightly candid images perform better on Discover than polished advertisement-style images.
✅ `soft candid feel, natural indoor light, not overly styled`
❌ `professional studio photography, perfect lighting, flawless`

**Rule 5 — Always end the prompt with these exact words:**
`photorealistic, warm tones, sage green palette, no text, no watermark, no logo`

This ensures the image is clean — the script adds the text overlay separately.

**Rule 6 — Keep the prompt to one or two sentences maximum.**
Pollinations performs best with focused, specific prompts. Do not write long multi-clause descriptions.

### 21.3 imagePrompt Format in the TypeScript Object

The field sits between `readingTime` and `faq` in the object:

```typescript
{
  slug: 'why-you-cant-sleep-32-weeks',
  title: 'Why You Can't Sleep at 32 Weeks (And What Actually Helps)',
  description: '...',
  readingTime: '8 min read',
  imageUrl: '/images/blog/sagenest-blog-default.jpg',
  imagePrompt: 'a visibly exhausted pregnant woman lying awake in a dark bedroom at 3am, eyes open, one hand resting on her belly, soft moonlight through curtains, candid and real, photorealistic, warm tones, sage green palette, no text, no watermark, no logo',
  faq: [ ... ],
  content: `...`
}
```

### 21.4 What the Script Does With imagePrompt

Claude does not need to think about this — it is documented here for transparency. After Claude delivers the TypeScript object:
- The `generate-blog-html.mjs` script reads `post.imagePrompt`
- Sends it to Pollinations to generate a clean 1200×630 image with no text
- Downloads the image buffer
- Uses the `sharp` library to add a text overlay — the first 5–6 words of `post.title`, white bold font, semi-transparent dark strip, positioned in the upper third of the image
- Uploads the final composite to Cloudinary under `sagenest-blog/{slug}.jpg`
- Uses the Cloudinary URL in the HTML file

Claude's only responsibility is writing a good `imagePrompt`. The overlay, upload, and URL resolution are fully automated.

---

## Section 22: Discover Consistency Rule

Google Discover trains its crawl frequency and topical relevance model on publishing cadence. A site that publishes daily signals to the Discover system that it is an active, maintained source of content in its topic area — and the system crawls it more frequently, which means new posts enter the recommendation pool faster.

This is why SageNest's daily publishing cadence is not just a "more content = more chances" strategy. It is a direct input into how quickly any individual post gets picked up by the Discover feed. A post published on a site that publishes daily can appear in feeds within hours of indexing. A post published on a site that publishes twice a month may wait days or weeks.

**The rule:** maintain daily or near-daily publishing. If publishing falls below three posts per week for more than two weeks, Discover crawl frequency will drop and recovery time will increase. Consistency compounds. Gaps compound too.

This rule is documented here so it is never treated as a "nice to have." The cadence is infrastructure, not hustle.

*Last updated: This guide is the master reference for all SageNest blog content. Update it if site tools change, new calculators are added, or clinical guidelines are revised.*
