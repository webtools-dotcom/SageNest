# 📌 SAGENEST PINTEREST VIRAL PIN GENERATION — MASTER GUIDE
> Version 3.0 | For use with Claude + Canva MCP pipeline
> Read this entire guide before starting. Every section is mandatory.
> **FINAL DELIVERABLE = 21 verified Q&As in chat + 3 Canva template images with headline + placeholder slots only.**

---

## 🧠 PHILOSOPHY: WHAT ACTUALLY MAKES A PIN GO VIRAL

Before touching any design or copy, internalize this:

**Pinterest's algorithm rewards SAVES, not clicks.**
A save happens when a user thinks: *"This is too useful to lose."*
A click happens when a user thinks: *"I need to know more."*

Your pin must trigger BOTH — in that order.

The formula is:
```
Verified, specific, surprising information
→ User saves it (algorithm distributes it)
→ Curiosity gap at the bottom ("there's more")
→ User clicks through to blog
```

**Why v3.0 exists — the problem v2.0 had:**
Canva's AI generation cannot reliably render specific body text. Numbers get swapped,
words get scrambled, medical terms get garbled. Sending full pin copy into Canva's
generate tool produced beautiful layouts with broken, unreadable, or dangerously wrong text.

**The v3.0 fix — two-track output:**

| Track | What AI produces | How text gets on the pin |
|---|---|---|
| Track 1 | 21 verified Q&As in chat, grouped into 3 sets of 7 | You read them, pick your favourite 7 per pin, type/paste them yourself |
| Track 2 | 3 Canva template images with headline only + 7 numbered placeholder slots | You open in Canva and fill in the slots manually |

**This completely eliminates AI text rendering errors on the pin.**
The templates are design-only. All factual content goes in by your hand.

**The new rule:**
Every pin must be valuable EVEN IF the user never clicks.
That's what makes them save it. That's what triggers viral distribution.

---

## ⚠️ SECTION 1: ANTI-HALLUCINATION PROTOCOL — NON-NEGOTIABLE

This section must be applied BEFORE writing any Q&A copy. Skipping it is not allowed.

### 1A. TEXT ACCURACY RULES

**RULE 1 — Double-check every word character by character before finalizing**
Common AI hallucination patterns to watch for:
- "about" → "aout", "abut", "abotu"
- "pregnancy" → "pregnany", "pregancy"
- "trimester" → "trimster", "trimaster"
- "nausea" → "nasea", "nauesa"
- "folic" → "foilc", "flocic"
- Numbers getting swapped: "400mcg" → "40mcg" (DANGEROUS — medical doses must be exact)

**RULE 2 — Never use decorative phrasing for medical numbers or doses**
Medical figures must be stated plainly and unambiguously.
Example: "400mcg of folic acid daily" — state it exactly like this, no rounding, no shorthand.

**RULE 3 — No abbreviations that could be misread**
- "mg" is acceptable (universal)
- "IU" — write "International Units" in full the first time it appears
- "OB/GYN" — acceptable
- Never use abbreviations not found in the original Tier 1 source

**RULE 4 — Verify every Q&A answer against the source URL one final time before outputting**
If a single number or word differs from the source — fix it before presenting to user.

**RULE 5 — Track 1 text (the 21 Q&As) is what you are responsible for being accurate.**
Track 2 (Canva templates) contains ONLY the headline and placeholder numbers — no factual claims.
This is intentional. The user fills in factual content themselves from Track 1.

---

### 1B. SOURCE VERIFICATION PROTOCOL — MANDATORY BEFORE EVERY CLAIM

**Approved Sources (Tier 1 — Always prefer these):**
1. **ACOG** — acog.org (American College of Obstetricians and Gynecologists)
2. **WHO** — who.int (World Health Organization)
3. **CDC** — cdc.gov (Centers for Disease Control)
4. **NIH / NCBI** — nih.gov / ncbi.nlm.nih.gov / PubMed
5. **IOM / NAM** — nationalacademies.org (Institute of Medicine / National Academies)
6. **Mayo Clinic** — mayoclinic.org
7. **WomensHealth.gov (OWH)** — womenshealth.gov
8. **FDA Pregnancy** — fda.gov (pregnancy-specific sections only)

**Approved Sources (Tier 2 — Use only if Tier 1 unavailable):**
- Cleveland Clinic — clevelandclinic.org
- Johns Hopkins Medicine — hopkinsmedicine.org
- Stanford Medicine — stanfordmedicine.org

**Banned Sources:**
- BabyCenter, What to Expect, Healthline, Verywell Family, mommy blogs
- Any source that does not itself cite a Tier 1 source for medical claims
- Reddit, forums, YouTube
- Any blog post (including SageNest itself as a primary source)

**Verification Workflow:**
```
Step 1: Read the blog post to identify all key claims and facts
Step 2: For each claim, search the Tier 1 source directly
Step 3: Find the exact page/article that confirms it
Step 4: Copy the URL of that source page into your working notes
Step 5: Only include the claim in Track 1 output if found on a Tier 1 source
Step 6: If a claim cannot be verified on Tier 1, DROP IT — do not include it
```

**Example of a VERIFIED claim (use this):**
> Q: How much folic acid do I need before pregnancy?
> A: 400mcg daily, starting at least one month before conception. The neural tube closes by day 28 of pregnancy, often before a woman knows she is pregnant.
> ✅ Source: CDC — cdc.gov/folicacid

**Example of an UNVERIFIED claim (never use this):**
> "Eating ginger helps with morning sickness."
> ❌ This is commonly repeated but needs a specific Tier 1 source confirming dosage and efficacy before using.

---

## 📋 SECTION 2: BLOG ANALYSIS PROTOCOL

When you receive a blog post, do this before writing any Q&As:

### Step 1 — Extract the Core Topic
Answer these questions from the blog:
- What is the main topic in one sentence?
- What trimester or pregnancy stage is it about?
- What is the #1 problem this blog helps solve?
- What are the 10-15 most specific, actionable facts in the blog?

### Step 2 — Identify Q&A-Worthy Claims
From the extracted facts, identify which ones are:
- **Specific** (has a number, timeframe, or measurable outcome)
- **Surprising** (most people don't already know this)
- **Actionable** (reader can do something with it today)
- **Verifiable** (confirmed on a Tier 1 source)
- **Scroll-stopping** (a pregnant woman would stop mid-scroll to read this)

### Step 3 — Expand Beyond the Blog
The blog gives you a starting point, but 21 Q&As is a large set. After extracting from the blog, search for additional high-potential questions on the same topic that pregnant women commonly ask. Use Google's "People Also Ask" logic — what are the real fears, confusions, and decisions women face on this topic?

### Step 4 — Verify Every Single Claim (follow Section 1B protocol exactly)

### Step 5 — Group Into Three Sets
Before outputting, mentally group your 21 Q&As into three logical clusters of 7 each. Each cluster should have a coherent theme that could stand alone as one pin. Label each group clearly so the user immediately understands which 7 go together.

---

## 🏗️ SECTION 3: Q&A OUTPUT FORMAT — TRACK 1

This is what Claude outputs in chat — plain text, no images, no Canva. Just clean, accurate, grouped Q&As the user can read and choose from.

### Format Rules
- Always output exactly 21 Q&As — no more, no less
- Always grouped into 3 sets of 7, with a suggested pin headline for each group
- Each Q&A formatted exactly as shown below
- Source cited inline for every answer — not in a separate list at the bottom
- Answer length: 1-2 sentences maximum — short enough to fit in a pin slot when the user types it in

### Output Template

```
══════════════════════════════════════════════════════════════
TRACK 1 — 21 VERIFIED Q&As FOR: [TOPIC]
══════════════════════════════════════════════════════════════

── GROUP 1 OF 3 ──
SUGGESTED PIN HEADLINE: "7 [Topic] Facts Every Pregnant Mom Should Know"
(These 7 work best together — use these for Pin Template 1)

Q1: [Question written the way a pregnant woman would actually type it]
A: [1-2 sentence answer, specific, plain language, no jargon] — Source: [Tier 1 name]

Q2: [Question]
A: [Answer] — Source: [Tier 1 name]

Q3: [Question]
A: [Answer] — Source: [Tier 1 name]

Q4: [Question]
A: [Answer] — Source: [Tier 1 name]

Q5: [Question]
A: [Answer] — Source: [Tier 1 name]

Q6: [Question]
A: [Answer] — Source: [Tier 1 name]

Q7: [Question]
A: [Answer] — Source: [Tier 1 name]

── GROUP 2 OF 3 ──
SUGGESTED PIN HEADLINE: "7 Things About [Topic] Most Doctors Don't Have Time to Explain"
(These 7 work best together — use these for Pin Template 2)

Q8: [Question]
A: [Answer] — Source: [Tier 1 name]

[... Q9 through Q14 in same format ...]

── GROUP 3 OF 3 ──
SUGGESTED PIN HEADLINE: "7 [Topic] Questions Every Pregnant Mom Is Googling Right Now"
(These 7 work best together — use these for Pin Template 3)

Q15: [Question]
A: [Answer] — Source: [Tier 1 name]

[... Q16 through Q21 in same format ...]

══════════════════════════════════════════════════════════════
VERIFIED SOURCE URLS (for your records — not for the pin):
[List all Tier 1 URLs used, one per line]
══════════════════════════════════════════════════════════════

HOW TO USE THESE:
→ Read all 21. Pick the 7 that feel most surprising or useful to YOU.
→ You do not have to follow the group suggestions — mix and match if you want.
→ Open your Canva template (from Track 2 below), click each numbered slot,
  and type or paste the Answer text from your chosen Q&As.
→ Keep each answer to 1-2 short sentences so it fits cleanly in the slot.
→ The question itself does NOT go on the pin — only the answer text does.
```

### Q&A Quality Rules
- Questions must sound like a real pregnant woman typed them — not like a medical textbook
- Answers must be standalone-useful — the reader should learn something from the answer alone, without needing to visit the blog
- Every answer must include at least one specific detail (a number, a week, a percentage, a named nutrient) — generic answers are not allowed
- Never write "it depends" as an answer — give the most common/general Tier 1 answer and note exceptions briefly
- If an answer requires a disclaimer ("talk to your doctor"), include it in one short phrase at the end, not as the whole answer

---

## 🎨 SECTION 4: CANVA TEMPLATE SPEC — TRACK 2

### What the Templates Contain
Each of the 3 Canva templates contains:

```
1. HEADLINE TEXT (large, bold, pre-written by Claude matching Section 5 formula)
   Example: "7 Most Important Pregnancy Nutrition Facts"

2. SEVEN NUMBERED PLACEHOLDER SLOTS (empty boxes or lines, clearly numbered 1-7)
   These are where the user will type or paste their chosen Q&A answers

3. STATIC FOOTER (pre-written, not a placeholder):
   "sagenesthealth.com" — centered, small, bottom of pin

4. OPTIONAL SOURCE BADGE AREA (bottom-left corner, empty — user fills if needed)
```

### What the Templates DO NOT Contain
- No body text of any kind (no facts, no tips, no answers)
- No stock photos
- No decorative text overlaying the placeholder slots
- No lorem ipsum or dummy text in the slots

### Why This Structure
The user fills in factual content by hand. This eliminates all AI text rendering errors.
The design (colors, fonts, layout, spacing) is handled by Canva. The facts are handled by the user.
These two things never mix inside an AI generation process.

---

### Canvas Setup
```
Dimensions: 1000 x 1500 px (2:3 ratio — Pinterest optimal)
Resolution: 300 DPI for export
Format: PNG (not JPEG — PNG preserves text sharpness)
```

### Color Palette — EXACT VALUES
```
Background:       #FAF7F2  (soft warm cream — never pure white)
Primary Text:     #2C2420  (warm dark brown — never pure black)
Accent Green:     #7B9E87  (muted sage green — headline, slot numbers, footer)
Placeholder Slot: #F0EBE3  (slightly darker cream — slot background box)
Slot Border:      #E8E0D5  (barely-there warm grey — thin border on each slot)
Divider Lines:    #E8E0D5  (same warm grey — thin lines between sections)
```

### Typography Rules
```
HEADLINE FONT:    Playfair Display Bold OR Cormorant Garamond Bold (serif editorial)
SLOT NUMBER FONT: DM Sans Medium (the ① ② ③ markers inside each slot)
FOOTER FONT:      DM Sans Regular (small, for sagenesthealth.com at bottom)

HEADLINE SIZE:    72-88px (must be readable in Pinterest feed thumbnail)
SLOT NUMBER SIZE: 32-36px (sage green, left-aligned inside each slot)
FOOTER SIZE:      22-26px

Fallback fonts if unavailable:
- Headline: Libre Baskerville Bold, EB Garamond Bold, or Lora Bold
- Body/slots: Nunito Regular, Poppins Regular, or Source Sans Pro Regular
- Never use: Arial, Helvetica, Roboto, or any system default font
```

### Layout Rules
```
Top padding:          80px
Side padding:         60px
Bottom padding:       100px

Headline zone:        Top ~380px of the canvas (headline text + small subtitle if needed)
Slots zone:           Remaining ~980px (7 slots stacked vertically with equal spacing)
Footer zone:          Bottom 120px (URL + source badge area)

Each slot height:     ~110px
Between slots:        16px gap
Slot border radius:   8px (soft rounded corners)
Slot left padding:    20px (number marker sits here)
Slot content padding: 20px left, 12px top and bottom
```

### Visual Elements
```
Slot Number Markers:  ① ② ③ ④ ⑤ ⑥ ⑦ in sage green (#7B9E87), DM Sans Medium
Slot Background:      #F0EBE3 filled rounded rectangle
Slot Border:          1px solid #E8E0D5
Headline Divider:     Thin horizontal line below headline, full width minus side padding, #E8E0D5
Footer Divider:       Thin horizontal line above footer zone
Logo/Brand:           "sagenesthealth.com" small centered text at very bottom
```

### What NOT to Do — Design Anti-Patterns
- ❌ No dark backgrounds (kills the warm editorial feel)
- ❌ No neon or saturated colors anywhere
- ❌ No more than 2 fonts on one pin
- ❌ No stock photo backgrounds
- ❌ No text inside the placeholder slots — they must be empty and inviting
- ❌ No drop shadows on text
- ❌ No font smaller than 22px on any element
- ❌ No more than 3 colors used visibly (background, text, one accent)
- ❌ No placeholder text like "Add your tip here" — just an empty styled box

### Three Template Variants
Generate 3 slightly different templates so each pin looks distinct on the user's Pinterest profile:

**Template 1 — Clean Editorial (default)**
Headline centered. Slots stacked full-width. Thin sage green line under headline.
Minimal — no decorative elements beyond the slot boxes.

**Template 2 — Accent Header**
Sage green (#7B9E87) filled rectangle behind the headline area only (top ~380px).
Headline text in cream (#FAF7F2) reversed out of the green background.
Slots below on cream background as normal. Adds visual punch at thumbnail size.

**Template 3 — Soft Warm**
Same as Template 1 but with a very faint sage green leaf watermark in the background (10% opacity).
Adds warmth without cluttering. Slot boxes in #F0EBE3 as normal.

---

## ✍️ SECTION 5: HEADLINE FORMULA FOR TEMPLATES

The only text Claude writes directly into the Canva template is the headline.
It must follow this formula exactly.

### Headline Formula
```
"7 [Specific Topic Descriptor] [Target Audience Frame]"
```

The headline must:
1. Start with "7" (matches the 7 placeholder slots — headline and slot count must always match)
2. Include the specific topic from the blog (not a generic word like "pregnancy tips")
3. Frame it around the pregnant woman's situation, not around the information itself

**Good headline examples:**
- "7 Most Important Pregnancy Nutrition Facts"
- "7 Things About Flying While Pregnant You Need to Know"
- "7 Iron Deficiency Signs During Pregnancy — And What They Mean"
- "7 Second Trimester Changes That Catch New Moms Off Guard"
- "7 Folic Acid Facts Every Mom Should Know Before Week 12"

**Bad headline examples (never use):**
- "7 Amazing Pregnancy Tips!" — vague, no value promise
- "7 Things About Pregnancy" — too broad, no specificity
- "You Won't Believe These 7 Pregnancy Facts" — clickbait, Pinterest penalizes
- "Everything You Need to Know About Pregnancy in 7 Points" — weak, unfocused

### Headline Consistency Rule
The three templates for the same blog get three different headlines (matching their three Q&A groups).
Never use the same headline on two templates that will be uploaded to the same Pinterest board.

---

## 🔍 SECTION 6: WEB SEARCH PROTOCOL FOR FACT-FINDING

When given a blog post, Claude must do the following search sequence:

### Search Step 1 — Topic Verification Search
Search: `[blog topic] site:acog.org`
OR: `[blog topic] site:cdc.gov`
Goal: Find the primary Tier 1 page that covers this topic

### Search Step 2 — Common Questions Mining
Search: `[blog topic] pregnancy questions commonly asked`
AND: `[blog topic] pregnancy site:nih.gov`
Goal: Find the real questions pregnant women are searching, and find surprising stats

### Search Step 3 — Claim Confirmation
For each claim before including it in Track 1:
Search: `"[exact claim keyword]" site:mayoclinic.org OR site:acog.org OR site:who.int`
Goal: Confirm the claim appears on a Tier 1 source

### Search Step 4 — Gap Finding (find what the blog doesn't cover)
Search: `[blog topic] pregnancy facts most people don't know`
Goal: Find 3-5 additional Q&As beyond what the blog contains — these expand the 21 set

---

## 📊 SECTION 7: QUALITY CHECKLIST

Run through this before finalizing Track 1 output and before finalizing Canva templates.

### Track 1 — Q&A Checklist
- [ ] Exactly 21 Q&As output — not 18, not 25
- [ ] Grouped into exactly 3 sets of 7 with a suggested headline for each
- [ ] Every answer is verified on a Tier 1 source
- [ ] Every answer includes at least one specific detail (number, week, dose, stat)
- [ ] No answer is longer than 2 sentences
- [ ] No answer says "it depends" without giving the general answer first
- [ ] Questions read like a real pregnant woman typed them
- [ ] Source name cited inline for every answer
- [ ] All Tier 1 source URLs listed at the bottom of Track 1 output
- [ ] "HOW TO USE THESE" instruction block included at the bottom

### Track 2 — Canva Template Checklist
- [ ] Three templates generated (Clean Editorial, Accent Header, Soft Warm)
- [ ] Each template is exactly 1000 x 1500px
- [ ] Headline text only — no body text anywhere
- [ ] Exactly 7 numbered placeholder slots visible
- [ ] Slots are empty — no dummy text inside them
- [ ] Background is #FAF7F2 (not pure white)
- [ ] Slot background is #F0EBE3
- [ ] Headline readable at thumbnail size (test: zoom out to 30%)
- [ ] "sagenesthealth.com" visible at bottom in small text
- [ ] Exported or shareable as PNG
- [ ] No stock photos, no background images obscuring slots
- [ ] Each of the 3 templates has a visually distinct headline matching its Q&A group

---

## 🚫 SECTION 8: ABSOLUTE PROHIBITIONS

These are hard stops. If any of these apply, the Q&A cannot be included in Track 1.

1. **Never make a diagnostic claim.** "This symptom means you have X" — prohibited.
2. **Never recommend a specific medication by brand name.** Generic nutrient names only.
3. **Never give dosage advice beyond what Tier 1 sources explicitly state for general pregnancy.**
4. **Never use before/after language.** No "this fixed my morning sickness."
5. **Never fabricate a statistic.** If you cannot find it on a Tier 1 source, it does not appear.
6. **Never use fear-mongering phrasing.** "This could harm your baby" style language — never.
7. **Never imply SageNest is a medical authority.** Always position as educational resource.
8. **Never use testimonial language.** No "moms say", "many women report" unless citing a specific Tier 1 study.
9. **Never put factual claims inside the Canva template.** Templates carry headline and placeholders only.
10. **Never generate only one track and call it done.** Both Track 1 and Track 2 are mandatory every session.

---

## 🖼️ SECTION 9: CANVA EXECUTION — HOW TO BUILD THE THREE TEMPLATES

> ⚠️ The Canva templates in v3.0 are DESIGN-ONLY.
> Do NOT attempt to put any Q&A answer text, facts, or numbers into the Canva generation query.
> The query describes LAYOUT and VISUAL DESIGN only.
> All factual content is in Track 1 — the user adds it manually.

### 9A. Canva Generation Query Structure

Use the Canva generate-design tool with `design_type: "pinterest_pin"` and pass this query format for each of the 3 templates:

**For Template 1 (Clean Editorial):**
```
Create a Pinterest pin (1000x1500px) with warm editorial magazine aesthetic.
Background: #FAF7F2 (soft warm cream). Primary text: #2C2420 (warm dark brown).
Accent: #7B9E87 (muted sage green).

TOP SECTION (~380px):
HEADLINE (Playfair Display Bold, 80px, centered, color #2C2420):
"[exact headline from Group 1 of Track 1]"
Thin horizontal divider line below headline, full width, color #E8E0D5.

MIDDLE SECTION — 7 PLACEHOLDER SLOTS (stacked vertically, equal spacing):
Each slot: rounded rectangle, background #F0EBE3, border 1px #E8E0D5, border-radius 8px.
Each slot height: ~110px. Side padding: 60px from canvas edge.
Inside each slot, left side: circled number in sage green (①, ②, ③, ④, ⑤, ⑥, ⑦), DM Sans Medium 34px.
The rest of each slot is EMPTY — no text content, no dummy text, no placeholder words.

BOTTOM SECTION (~120px):
Thin horizontal divider line, full width, color #E8E0D5.
"sagenesthealth.com" — DM Sans Regular, 24px, centered, color #7B9E87.

No stock photos. No background images. No decorative elements. Clean, minimal, editorial.
```

**For Template 2 (Accent Header):**
Same as Template 1 but with this change to the top section:
```
TOP SECTION (~380px):
Filled rectangle covering entire top ~380px, background color #7B9E87 (sage green).
HEADLINE text reversed out in cream (#FAF7F2) centered in this green zone.
(All other elements identical to Template 1.)
```

**For Template 3 (Soft Warm):**
Same as Template 1 but with this addition:
```
BACKGROUND DETAIL:
Very faint sage green organic leaf or botanical shape watermarked across the full canvas at 8-10% opacity.
This sits BEHIND everything — it must not interfere with slot readability.
(All other elements identical to Template 1.)
```

### 9B. After Canva Generates Candidates

**STEP C2 — Review the generated design**
When Canva returns design candidates:
- Check headline text is correct word for word
- Confirm exactly 7 numbered slots are visible
- Confirm slots are EMPTY (no text content inside them)
- Confirm colors match the spec above
- Confirm "sagenesthealth.com" is visible at bottom
- If the headline text is wrong or slots have content in them — fix before accepting

**STEP C3 — Create from candidate**
Use `create-design-from-candidate` with the correct job_id and candidate_id.

**STEP C4 — Fix headline text if incorrect**
If the headline rendered incorrectly:
- Use `start-editing-transaction` → `perform-editing-operations` → `commit-editing-transaction`
- Fix only the headline text element
- Do not touch layout or other elements

**STEP C5 — Export as PNG**
Use `export-design`:
- Format: PNG
- Quality: highest available
- Confirm dimensions are 1000 x 1500px

**STEP C6 — Present to user**
Share the Canva design link or exported PNG so the user can:
- See the template
- Open it in Canva
- Click each numbered slot and type or paste their chosen Q&A answers from Track 1
- Export the finished pin when done

### 9C. Font Fallbacks
If Playfair Display or DM Sans are unavailable:
- Headline fallback: Libre Baskerville Bold, EB Garamond Bold, or Lora Bold
- Slot number/footer fallback: Nunito Regular, Poppins Regular, or Source Sans Pro Regular
- Never use: Arial, Helvetica, Roboto, or any system default font

---

## 🔁 SECTION 10: FULL GENERATION WORKFLOW (Step-by-Step)

When you receive a blog post, follow these steps in exact order:

```
STEP 1  — Read the full blog post
STEP 2  — Extract 10-15 key facts and claims from the blog
STEP 3  — Search Tier 1 sources to verify each claim (Section 6 search protocol)
STEP 4  — Search for additional common questions on this topic beyond the blog
STEP 5  — Build a pool of 25+ potential Q&As (you will trim to 21 verified ones)
STEP 6  — Drop any Q&A that cannot be verified on a Tier 1 source
STEP 7  — Rank remaining Q&As by: specificity + surprise factor + actionability
STEP 8  — Select the top 21 and group into 3 clusters of 7 (each cluster = one pin)
STEP 9  — Write a headline for each cluster following Section 5 formula
STEP 10 — Format and output Track 1 (Section 3 format — all 21 Q&As in chat)
STEP 11 — Run Track 1 through the Section 7 Q&A checklist
STEP 12 — Execute Canva workflow for Template 1 (Section 9A — Clean Editorial)
STEP 13 — Execute Canva workflow for Template 2 (Section 9A — Accent Header)
STEP 14 — Execute Canva workflow for Template 3 (Section 9A — Soft Warm)
STEP 15 — Run each template through the Section 7 Canva checklist
STEP 16 — Present Track 1 Q&As (already output in Step 10) and all 3 template images
STEP 17 — Remind user: open template in Canva → click each numbered slot →
           paste your chosen answers from Track 1 → export as PNG → upload to Pinterest
```

**The session is complete only when BOTH of these are true:**
- Track 1: 21 verified Q&As are visible in chat, grouped and sourced
- Track 2: All 3 Canva template images are generated and accessible

---

## 📌 SECTION 11: EXAMPLE OUTPUT (Reference Standard)

**Blog Topic:** Iron Deficiency During Pregnancy

---

### Track 1 Example (what appears in chat):

```
══════════════════════════════════════════════════════════════
TRACK 1 — 21 VERIFIED Q&As FOR: IRON DEFICIENCY DURING PREGNANCY
══════════════════════════════════════════════════════════════

── GROUP 1 OF 3 ──
SUGGESTED PIN HEADLINE: "7 Iron Deficiency Facts Every Pregnant Mom Should Know"
(Use these 7 for Pin Template 1)

Q1: How much iron do I actually need during pregnancy?
A: Pregnant women need 27mg of iron per day — nearly double the amount for non-pregnant women (18mg). — Source: NIH Office of Dietary Supplements

Q2: What are the first signs of low iron during pregnancy?
A: Fatigue, pale skin, and shortness of breath on mild exertion are common early signs of iron-deficiency anemia in pregnancy. — Source: Mayo Clinic

Q3: Can low iron affect my baby too?
A: Yes. Severe iron deficiency is linked to preterm birth and low birth weight. — Source: WHO

Q4: What foods are highest in iron during pregnancy?
A: Lean red meat, fortified cereals, lentils, and spinach are among the highest dietary sources of iron. — Source: NIH ODS

Q5: Does vitamin C actually help with iron absorption?
A: Yes. Pairing iron-rich foods with vitamin C sources (like orange juice) can significantly increase absorption. — Source: NIH ODS

Q6: What is the difference between heme and non-heme iron?
A: Heme iron (from meat) is absorbed at roughly 15-35%, while non-heme iron (from plants) absorbs at 2-20%. — Source: NIH ODS

Q7: Can iron supplements cause constipation during pregnancy?
A: Yes, iron supplements commonly cause constipation and dark stools — both are normal side effects, not signs of a problem. — Source: Mayo Clinic

── GROUP 2 OF 3 ──
SUGGESTED PIN HEADLINE: "7 Things About Iron in Pregnancy Most Doctors Don't Have Time to Explain"
(Use these 7 for Pin Template 2)

Q8: When does iron demand increase the most during pregnancy?
A: Iron needs increase most in the second and third trimesters, when your blood volume expands by up to 50%. — Source: NIH

Q9: Is it possible to get enough iron from diet alone during pregnancy?
A: Most pregnant women cannot meet the 27mg daily requirement from diet alone, which is why prenatal vitamins with iron are recommended. — Source: ACOG

Q10: Who is most at risk for iron deficiency during pregnancy?
A: Women carrying twins, those with a history of heavy periods, and vegetarians/vegans are at highest risk. — Source: ACOG

Q11: How is iron deficiency diagnosed in pregnancy?
A: A complete blood count (CBC) blood test measures hemoglobin and hematocrit levels — your OB will typically order this at your first prenatal visit. — Source: ACOG

Q12: Can I take my iron supplement at the same time as my prenatal vitamin?
A: If your prenatal already contains 27mg of iron, an additional iron supplement may not be needed — always confirm with your provider before adding one. — Source: NIH ODS

Q13: Does coffee or tea affect iron absorption during pregnancy?
A: Yes. Tannins in tea and polyphenols in coffee can reduce non-heme iron absorption — avoid drinking them within one hour of iron-rich meals. — Source: NIH ODS

Q14: What hemoglobin level is considered anemia during pregnancy?
A: A hemoglobin level below 11g/dL in the first or third trimester, or below 10.5g/dL in the second trimester, is classified as anemia in pregnancy. — Source: WHO

── GROUP 3 OF 3 ──
SUGGESTED PIN HEADLINE: "7 Iron Questions Every Pregnant Mom Is Googling Right Now"
(Use these 7 for Pin Template 3)

Q15: Is feeling tired in pregnancy always a sign of low iron?
A: Not always — fatigue is common in pregnancy for many reasons. But if it's extreme or accompanied by paleness or breathlessness, ask your provider to check your iron levels. — Source: Mayo Clinic

Q16: Can I eat liver to boost iron during pregnancy?
A: Liver is very high in iron but is generally not recommended during pregnancy due to its very high vitamin A content, which can be harmful in large amounts. — Source: NHS UK / WHO

Q17: What happens if iron deficiency anemia goes untreated during pregnancy?
A: Untreated anemia increases the risk of preterm delivery, low birth weight, and postpartum depression. — Source: WHO

Q18: Are iron-fortified cereals a good source during pregnancy?
A: Yes — many fortified breakfast cereals provide 18-100% of the daily iron recommendation per serving, making them one of the most convenient sources. — Source: NIH ODS

Q19: Does iron absorption change as pregnancy progresses?
A: Yes. The body naturally increases iron absorption efficiency as pregnancy advances — in the third trimester you may absorb up to 3x more iron than before pregnancy. — Source: NIH

Q20: Is dark leafy greens iron enough if I'm vegetarian and pregnant?
A: Plant-based iron alone is rarely sufficient at 27mg/day. Vegetarian pregnant women are strongly advised to discuss iron supplementation with their provider. — Source: ACOG

Q21: Can I have too much iron during pregnancy?
A: Yes. The tolerable upper limit is 45mg per day. Taking very high doses without testing can cause gastrointestinal damage and other issues. — Source: NIH ODS

══════════════════════════════════════════════════════════════
VERIFIED SOURCE URLS (for your records):
- https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/
- https://www.acog.org/womens-health/faqs/anemia-and-pregnancy
- https://www.who.int/nutrition/publications/micronutrients/anaemia_iron_deficiency/en/
- https://www.mayoclinic.org/diseases-conditions/anemia/symptoms-causes/syc-20351360
══════════════════════════════════════════════════════════════

HOW TO USE THESE:
→ Read all 21. Pick the 7 answers that feel most surprising or useful to YOU.
→ You don't have to follow the group suggestions — mix and match if you prefer.
→ Open your Canva template (from the 3 templates below), click each numbered slot,
  and type or paste the Answer text from your chosen Q&As.
→ Keep each answer to 1-2 short sentences so it fits cleanly in the slot.
→ The question itself does NOT go on the pin — only the answer text goes in the slot.
→ When all 7 slots are filled, export as PNG and upload to Pinterest.
```

---

### Track 2 Example (what Canva generates):
Three templates, each 1000x1500px, each with:
- Their respective headline at the top
- Seven empty numbered slots in the middle
- "sagenesthealth.com" at the bottom
- No body text whatsoever

---

## 📌 SECTION 12: PINTEREST METADATA — FOR EACH PIN AFTER FILLING TEMPLATE

Once the user has filled in their template and is ready to upload to Pinterest, provide this:

### Pin Title Formula
```
[Specific stat or claim from the pin] | SageNest Health
Example: "27mg Iron Daily During Pregnancy — Here's What That Means | SageNest Health"
```

### Pin Description Formula (100-200 characters)
```
[Primary keyword phrase] + [what they'll learn or get] + CTA + URL
Example: "Iron during pregnancy: how much you need, best sources, and signs of deficiency.
Full trimester guide at sagenesthealth.com"
```

### Tag Suggestions (8-12 tags per pin, no hashtags — just topic words)
Provide 10 relevant topic tags based on the blog content.
Example for iron: pregnancy nutrition, iron deficiency pregnancy, prenatal vitamins, pregnancy anemia, second trimester tips, pregnancy symptoms, healthy pregnancy, iron rich foods, pregnancy tips, first trimester

### Rules
- No hashtags — Pinterest 2026 does not reward hashtag use
- Pin title: treat like a blog title with primary keyword naturally included
- Description: write naturally, not keyword-stuffed
- Always end description with the blog URL

---

## 📁 APPENDIX: QUICK REFERENCE CARD

| Check | Rule |
|---|---|
| Track 1 output | Exactly 21 Q&As, 3 groups of 7, each answer 1-2 sentences |
| Sources | Must be Tier 1 — ACOG, WHO, CDC, NIH, Mayo, OWH, FDA |
| Numbers | Copy exactly from source — no rounding unless source rounds |
| Track 2 output | 3 Canva templates, headline only + 7 empty numbered slots |
| Canvas size | 1000 x 1500px, PNG, 300 DPI |
| Background | #FAF7F2 — never pure white |
| Slot background | #F0EBE3 — rounded, bordered, numbered, EMPTY |
| Headline | Must start with "7", specific topic, readable at thumbnail |
| Colors | Max 3 visible — BG + text + one accent (sage green) |
| Footer | "sagenesthealth.com" always visible at bottom |
| No body text in Canva | ZERO factual content in the template generation query |
| User fills slots | All answer text typed/pasted by user manually after opening in Canva |
| Disclaimer | Required on ALL warning/symptom pins — user adds when filling slots |
| Both tracks required | Session is incomplete if either track is missing |

---

## ✅ CLOSING LINE RECOMMENDATIONS FOR THE BOTTOM OF EVERY PIN

The user fills this in as part of their slot content or as the footer CTA.
Suggest one of these depending on the pin topic:

**For informational/tip pins:**
> "Full guide with trimester-by-trimester details at sagenesthealth.com ↓"

**For symptom/warning pins:**
> "Know what to tell your doctor — complete guide at sagenesthealth.com ↓"

**For tool/calculator pins:**
> "Use the free [tool name] at sagenesthealth.com — takes 30 seconds ↓"

**For nutrition/supplement pins:**
> "Week-by-week nutrition guide for every trimester at sagenesthealth.com ↓"

**Universal fallback (works for any pin):**
> "Everything your doctor doesn't have time to explain — sagenesthealth.com ↓"

**Rules for the closing line:**
- Always ends with the URL or "↓" pointing downward (toward the link)
- Always tells the reader what they GET at the blog — not just "visit us"
- Never uses "click here" — Pinterest users respond to value statements, not commands
- Keep it under 12 words — it's a CTA, not a sentence

---

*SageNest Pinterest Pin Master Guide — v3.0*
*For use with Claude + Canva MCP pipeline*
*Core change from v2.0: Two-track output — verified Q&As in chat (Track 1) + design-only Canva templates with empty slots (Track 2). User fills factual content manually. Eliminates all AI text rendering errors.*
*Update this guide when Pinterest algorithm changes are confirmed.*
