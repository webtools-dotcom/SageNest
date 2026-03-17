# SageNest — Tool Build Prompts

Use each prompt below in a fresh chat. Always attach `newtool.md` to the chat before sending the prompt. The prompt is self-contained — the AI will know exactly what to build.

---

## PROMPT 1 — Morning Sickness End Date Estimator

```
You are adding a new tool to SageNest Health. Read newtool.md fully before writing any code. Follow every instruction in it exactly.

---

TOOL SPEC:

Tool name: Morning Sickness End Date Estimator
URL slug: /morning-sickness-end-date-estimator
Page component file: src/pages/MorningSicknessEstimator.tsx
Calc lib file: src/lib/morningSicknessCalc.ts
Export name: MorningSicknessEstimatorPage
tools.ts id: morning-sickness-estimator

---

CALCULATION LOGIC (source: ACOG Practice Bulletin #189):

Input: LMP date (first day of last menstrual period)

Outputs to calculate using addDays(normalizedLMP, n):
- nausea_start:      LMP + 42 days  (week 6 — when nausea typically begins)
- nausea_peak:       LMP + 63 days  (week 9 — when nausea is typically worst)
- likely_end:        LMP + 84 days  (week 12 — resolves for ~50% of women)
- expected_end:      LMP + 98 days  (week 14 — resolves for ~90% of women)
- outer_bound:       LMP + 140 days (week 20 — resolves for nearly all women)

Validation rules:
- LMP must be a valid date
- LMP must not be in the future
- LMP must be within the past 12 months (else likely postpartum, not applicable)

Result display:
- Show all 5 dates as a visual timeline with labels
- Highlight likely_end and expected_end most prominently (these are what people search for)
- Show current gestational week at the time of calculation
- Add a reassurance note: "Most women see significant improvement around week 12"

---

SEO SPEC:

Primary keyword: "when does morning sickness end"
Secondary keywords: "morning sickness end date", "when does nausea stop in pregnancy", "morning sickness week 12"
Trust badge: "Free morning sickness end date estimate"

Title tag (pass to SEOHead title prop):
"When Does Morning Sickness End Calculator — Free Pregnancy Estimator"

Meta description (pass to SEOHead description prop):
"Find out when your morning sickness will likely end. Enter your LMP to get your personalized nausea peak date and expected end date, based on ACOG guidelines. Free, no signup required."

H1:
<h1 className="hero-title">Morning Sickness <span>End Date Estimator</span></h1>

H2 structure for educational section (in this order):
1. "How does this morning sickness estimator work?"
2. "When does morning sickness typically end in pregnancy?"
3. "When should you talk to your doctor about nausea in pregnancy?"
4. "Frequently asked questions"

FAQ_ITEMS (use these exact questions — they are keyword targets):
1. Q: "Does morning sickness end at exactly 12 weeks?"
   A: "Not for everyone. About 50% of women find nausea improves by week 12, and around 90% see it resolve by week 14. A small percentage experience nausea throughout pregnancy. This estimator shows the most likely window for your specific LMP date."

2. Q: "Why is week 9 the worst for morning sickness?"
   A: "hCG (human chorionic gonadotropin), the hormone primarily responsible for pregnancy nausea, typically peaks around week 9–10 of pregnancy. As hCG levels start to plateau and then decline after this peak, most women notice gradual improvement in nausea symptoms."

3. Q: "Can morning sickness last all 9 months of pregnancy?"
   A: "In rare cases, yes. A condition called hyperemesis gravidarum affects approximately 0.3–3% of pregnancies and can cause severe nausea and vomiting throughout pregnancy. If you are vomiting multiple times daily and cannot keep fluids down, contact your healthcare provider promptly."

4. Q: "Does this estimator work if I have an irregular cycle?"
   A: "This tool uses your LMP date and standard gestational age calculations. If your cycles are irregular or you have a known conception date, the estimates may vary by a week or two. Your midwife or OB can give a more precise timeline based on your ultrasound dating."

5. Q: "Is morning sickness a sign of a healthy pregnancy?"
   A: "Some studies suggest a correlation between nausea and lower miscarriage rates, but the absence of morning sickness does not indicate a problem. Many women have entirely healthy pregnancies with no nausea at all. This tool is for planning and reassurance, not for assessing pregnancy health."

6. Q: "What can I do to feel better while waiting for morning sickness to end?"
   A: "Common evidence-supported strategies include eating small, frequent meals, avoiding an empty stomach, ginger in any form, vitamin B6 (pyridoxine), and staying hydrated. Talk to your provider before starting any supplements or medications."

---

Source citation (render this on the page near the result):
Source: ACOG Practice Bulletin #189 — Nausea and Vomiting of Pregnancy (acog.org)
Link to: https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/01/nausea-and-vomiting-of-pregnancy

---

Internal links to include:
1. From results section → link to /pregnancy-due-date-calculator
   Anchor text: "Calculate your full pregnancy due date"
2. From educational section → link to /blog/morning-sickness-remedies-that-actually-work
   Anchor text: "morning sickness remedies that actually work"

---

_redirects entries to add:
/morning-sickness          /morning-sickness-end-date-estimator 301
/nausea-calculator         /morning-sickness-end-date-estimator 301
/morning-sickness-end-date-estimator/  /morning-sickness-end-date-estimator 301
```

---

## PROMPT 2 — Postpartum Hair Loss Timeline Calculator

```
You are adding a new tool to SageNest Health. Read newtoolMAIN.md fully before writing any code. Follow every instruction in it exactly.

---

TOOL SPEC:

Tool name: Postpartum Hair Loss Timeline Calculator
URL slug: /postpartum-hair-loss-calculator
Page component file: src/pages/PostpartumHairLossCalculator.tsx
Calc lib file: src/lib/postpartumHairLossCalc.ts
Export name: PostpartumHairLossCalculatorPage
tools.ts id: postpartum-hair-loss-calculator

---

CALCULATION LOGIC (source: AAD — American Academy of Dermatology, telogen effluvium overview):

Input: delivery date

Outputs to calculate using addDays(normalizedDeliveryDate, n):
- shedding_start:    delivery date + 60 days   (2 months — shedding typically begins)
- shedding_peak:     delivery date + 105 days  (3.5 months — heaviest shedding period)
- shedding_end:      delivery date + 180 days  (6 months — shedding resolves for most)
- regrowth_visible:  delivery date + 270 days  (9 months — new growth clearly visible)
- full_recovery:     delivery date + 365 days  (12 months — hair typically fully restored)

Validation rules:
- Delivery date must be a valid date
- Delivery date must not be in the future
- Delivery date must be within the past 24 months (hair typically recovers within 12 months; 24 month window allows for late presentations)

Result display:
- Show all 5 dates as a visual timeline
- Prominently display shedding_peak (what most people are panicking about) and full_recovery
- Add a reassurance note: "Postpartum hair loss is temporary. Full recovery typically happens within 12 months of delivery."
- Show how many weeks postpartum the user currently is at time of calculation

---

SEO SPEC:

Primary keyword: "postpartum hair loss calculator"
Secondary keywords: "when does postpartum hair loss stop", "postpartum hair loss timeline", "postpartum hair shedding when does it end"
Trust badge: "Based on AAD clinical guidelines"

Title tag:
"Postpartum Hair Loss Calculator — When Will It Stop?"

Meta description:
"Find out when your postpartum hair loss will peak and stop. Enter your delivery date for a personalized recovery timeline based on AAD dermatology guidelines. Free, no signup required."

H1:
<h1 className="hero-title">Postpartum Hair Loss <span>Timeline Calculator</span></h1>

H2 structure for educational section:
1. "How does this postpartum hair loss calculator work?"
2. "When does postpartum hair loss stop?"
3. "When should you see a doctor about postpartum hair loss?"
4. "Frequently asked questions"

FAQ_ITEMS:
1. Q: "When does postpartum hair loss start after giving birth?"
   A: "Most women notice increased shedding between 2 and 4 months after delivery. This is because the high estrogen levels during pregnancy temporarily prevent normal hair shedding, and after delivery when hormones normalize, all that retained hair sheds at once. This is called telogen effluvium."

2. Q: "When does postpartum hair loss peak?"
   A: "Postpartum hair loss typically peaks around 3 to 4 months after delivery. This is often the most alarming stage because large clumps of hair may fall out at once. This peak period usually lasts 4 to 6 weeks before shedding gradually slows down."

3. Q: "Is postpartum hair loss permanent?"
   A: "No. Postpartum hair loss caused by telogen effluvium is almost always temporary. Most women see shedding slow by 6 months postpartum and noticeable regrowth by 9 months. Full recovery typically occurs within 12 months of delivery."

4. Q: "Will I go bald from postpartum hair loss?"
   A: "Actual baldness from postpartum telogen effluvium is extremely rare. Although the volume of shedding can be alarming, most women lose a fraction of their total hair density. The appearance of thinning is usually most noticeable at the temples and hairline but is not permanent."

5. Q: "When should I see a doctor about postpartum hair loss?"
   A: "See a doctor if: shedding is still severe after 12 months postpartum, you are losing hair in patches, the hair loss is accompanied by other symptoms like fatigue, weight changes, or skin changes (which can indicate thyroid dysfunction), or you had hair loss before pregnancy. A GP or dermatologist can rule out other causes like postpartum thyroiditis."

6. Q: "Does breastfeeding affect postpartum hair loss?"
   A: "Breastfeeding may slightly delay or prolong postpartum hair shedding for some women, as it maintains elevated prolactin levels that can influence hair cycles. However, this is individual and there is no strong evidence that breastfeeding significantly worsens hair loss. The overall timeline is similar whether or not you are breastfeeding."

---

Source citation:
Source: American Academy of Dermatology (AAD) — Hair Loss in New Moms
Link to: https://www.aad.org/public/diseases/hair-loss/causes/new-moms

---

Internal links to include:
1. From results section → link to /pregnancy-due-date-calculator
   Anchor text: "Check your pregnancy due date"
2. From educational section → link to /blog/morning-sickness-remedies-that-actually-work (closest related blog post currently on site; can be updated when a more relevant post exists)
   Anchor text: "common postpartum recovery questions"

---

_redirects entries to add:
/hair-loss-after-pregnancy     /postpartum-hair-loss-calculator 301
/postpartum-hair-shedding      /postpartum-hair-loss-calculator 301
/postpartum-hair-loss-calculator/  /postpartum-hair-loss-calculator 301
```

---

## PROMPT 3 — Pregnancy Flight Safety Calculator

```
You are adding a new tool to SageNest Health. Read newtoolMAIN.md fully before writing any code. Follow every instruction in it exactly.

---

TOOL SPEC:

Tool name: Pregnancy Flight Safety Calculator
URL slug: /pregnancy-flight-calculator
Page component file: src/pages/PregnancyFlightCalculator.tsx
Calc lib file: src/lib/pregnancyFlightCalc.ts
Export name: PregnancyFlightCalculatorPage
tools.ts id: pregnancy-flight-calculator

---

CALCULATION LOGIC:
Sources:
- ACOG Committee Opinion #746 (2018): "Air Travel During Pregnancy"
- Published airline policies (major carriers)

Inputs:
- LMP date (to calculate gestational age at flight)
- Flight date

Calculated values:
- gestational_weeks_at_flight: Math.floor((flightDate - lmpDate) / 7 days)
- gestational_days_remainder: remainder after weeks

Safety verdict logic (based on ACOG + airline policy):
- weeks < 28: verdict = "Generally safe to fly" — label = "safe"
- weeks >= 28 && weeks < 32: verdict = "Safe for most domestic flights. Some international carriers require a doctor's letter." — label = "caution"
- weeks >= 32 && weeks < 36: verdict = "Many airlines require a doctor's letter. Some long-haul carriers restrict travel. Confirm with your airline before booking." — label = "caution"
- weeks >= 36: verdict = "Most airlines do not permit travel at 36+ weeks. Do not book without written airline approval and OB clearance." — label = "restricted"
- weeks > 40: verdict = "Past estimated due date. Flying is not recommended." — label = "restricted"

Display a reference table of major airline policies as static data (render as a table below the result):
const AIRLINE_POLICIES = [
  { airline: 'IndiGo', domestic: '36 weeks', international: '32 weeks', letter: 'Required from 28 weeks' },
  { airline: 'Air India', domestic: '36 weeks', international: '32 weeks', letter: 'Required from 32 weeks' },
  { airline: 'SpiceJet', domestic: '35 weeks', international: '32 weeks', letter: 'Required from 28 weeks' },
  { airline: 'Emirates', domestic: 'N/A', international: '36 weeks', letter: 'Required from 29 weeks' },
  { airline: 'British Airways', domestic: '36 weeks', international: '36 weeks', letter: 'Required from 28 weeks' },
  { airline: 'Air France', domestic: '36 weeks', international: '36 weeks', letter: 'Required from 28 weeks' },
];

Validation rules:
- LMP date must be valid and not in the future and not more than 12 months ago
- Flight date must be valid and must be in the future (cannot check past flights)
- Flight date must not be more than 42 weeks after LMP (beyond viability window)

---

SEO SPEC:

Primary keyword: "can I fly while pregnant"
Secondary keywords: "flying while pregnant safe", "pregnancy flight restrictions by week", "airline policy pregnant passengers"
Trust badge: "Based on ACOG guidelines + airline policies"

Title tag:
"Can I Fly While Pregnant? Free Pregnancy Flight Calculator"

Meta description:
"Find out if you can fly at your stage of pregnancy. Enter your LMP and flight date to see your gestational week, safety verdict, and major airline policy rules. Free, instant, no signup."

H1:
<h1 className="hero-title">Pregnancy Flight <span>Safety Calculator</span></h1>

H2 structure for educational section:
1. "How does this pregnancy flight calculator work?"
2. "Is it safe to fly during pregnancy?"
3. "When do airlines restrict pregnant passengers?"
4. "Frequently asked questions"

FAQ_ITEMS:
1. Q: "Is it safe to fly in the first trimester of pregnancy?"
   A: "Flying in the first trimester is generally considered safe for uncomplicated pregnancies. ACOG notes no evidence that air travel causes miscarriage or harm to the developing fetus. The main concerns in early pregnancy are nausea and fatigue, which altitude and cabin pressure can worsen for some women."

2. Q: "How many weeks pregnant can you fly internationally?"
   A: "Most international airlines restrict pregnant passengers from flying at or after 28–32 weeks without a doctor's letter, and most will not allow travel after 36 weeks at all. Policies vary by airline, so always check directly with your carrier before booking."

3. Q: "Do I need a doctor's letter to fly while pregnant?"
   A: "Most airlines require a doctor's letter confirming your expected due date and that you are fit to fly, typically from around 28 weeks onwards. Some carriers require it earlier for international routes. This tool shows the policy for major airlines but always verify directly with your carrier before travel."

4. Q: "Can flying cause early labor?"
   A: "There is no strong evidence that flying triggers early labor in healthy pregnancies. However, ACOG recommends that women with pregnancy complications, placenta previa, or a history of preterm labor avoid air travel. Always consult your OB or midwife before flying in the third trimester."

5. Q: "What is the best time to fly during pregnancy?"
   A: "The second trimester (weeks 14–27) is generally considered the most comfortable time to fly. Morning sickness has typically improved, the risk of miscarriage is lower than in the first trimester, and you are not yet in the late-pregnancy restriction window. Most airlines have no restrictions during this period."

6. Q: "What precautions should I take when flying pregnant?"
   A: "ACOG recommends: wearing a seatbelt below the belly, walking or stretching every hour to reduce DVT risk, staying hydrated, choosing an aisle seat for easier movement, and wearing compression stockings on long flights. Carry a copy of your prenatal records when flying in the third trimester."

---

Source citation:
Source: ACOG Committee Opinion #746 — Air Travel During Pregnancy (2018)
Link to: https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/08/air-travel-during-pregnancy

---

Internal links to include:
1. From results section → link to /pregnancy-due-date-calculator
   Anchor text: "Calculate your exact due date"
2. From educational section → link to /pregnancy-week-by-week
   Anchor text: "week-by-week pregnancy milestones"

---

_redirects entries to add:
/flying-while-pregnant     /pregnancy-flight-calculator 301
/pregnant-flying           /pregnancy-flight-calculator 301
/pregnancy-flight-calculator/  /pregnancy-flight-calculator 301
```

---

## PROMPT 4 — Fundal Height Calculator

```
You are adding a new tool to SageNest Health. Read newtoolMAIN.md fully before writing any code. Follow every instruction in it exactly.

---

TOOL SPEC:

Tool name: Fundal Height Calculator
URL slug: /fundal-height-calculator
Page component file: src/pages/FundalHeightCalculator.tsx
Calc lib file: src/lib/fundalHeightCalc.ts
Export name: FundalHeightCalculatorPage
tools.ts id: fundal-height-calculator

---

CALCULATION LOGIC (source: McDonald's Rule — published in Williams Obstetrics):

Inputs:
- gestational_weeks (number, 20–40)
- measured_fundal_height_cm (number, optional — if provided, shows whether measurement is within range)

Calculation:
- expected_cm = gestational_weeks  (McDonald's Rule: 1 cm per week after 20 weeks, ±3 cm is normal)
- range_min = gestational_weeks - 3
- range_max = gestational_weeks + 3

If measured_fundal_height_cm is provided:
- difference = measured_fundal_height_cm - expected_cm
- verdict:
  - within range (measured >= range_min && measured <= range_max): "Within normal range"
  - small for dates (measured < range_min): "Measures smaller than expected — mention at your next appointment"
  - large for dates (measured > range_max): "Measures larger than expected — mention at your next appointment"
- IMPORTANT: Never use alarming language. Both "small" and "large" verdicts must end with "mention at your next appointment" not any alarm language. This tool is not diagnostic.

Validation:
- gestational_weeks must be between 20 and 42 (McDonald's Rule is not reliable before 20 weeks)
- measured_fundal_height_cm if provided must be between 10 and 55

Result display:
- Show expected range clearly: e.g. "For 28 weeks: expected range is 25–31 cm"
- If measurement provided: show where it falls with a simple visual bar/range indicator
- Always show the disclaimer that actual measurement technique and fetal position affect readings

---

SEO SPEC:

Primary keyword: "fundal height calculator"
Secondary keywords: "fundal height by week", "what should fundal height be at 28 weeks", "McDonald rule pregnancy"
Trust badge: "Based on McDonald's Rule — Williams Obstetrics"

Title tag:
"Fundal Height Calculator — Expected Range by Week of Pregnancy"

Meta description:
"Calculate your expected fundal height range by week of pregnancy using McDonald's Rule. Enter your gestational week to see the normal cm range, or check if your measurement is within range. Free, no signup."

H1:
<h1 className="hero-title">Fundal Height <span>Calculator</span></h1>

H2 structure for educational section:
1. "How is fundal height calculated?"
2. "What is normal fundal height by week of pregnancy?"
3. "When should you ask your doctor about fundal height measurements?"
4. "Frequently asked questions"

FAQ_ITEMS:
1. Q: "What is fundal height and why does it matter?"
   A: "Fundal height is the distance in centimeters from your pubic bone to the top of your uterus (the fundus). Your midwife or OB measures it at prenatal appointments from around 20 weeks to track fetal growth. It provides a quick, non-invasive way to check that the baby is growing as expected."

2. Q: "What is McDonald's Rule for fundal height?"
   A: "McDonald's Rule is the clinical standard for estimating expected fundal height: after 20 weeks of pregnancy, the fundal height in centimeters should roughly equal the number of gestational weeks, plus or minus 3 cm. So at 28 weeks, a measurement between 25 and 31 cm is considered normal."

3. Q: "What does it mean if my fundal height is measuring small?"
   A: "A measurement more than 3 cm below the expected value may indicate intrauterine growth restriction (IUGR), incorrect gestational dating, or simply a variation in measuring technique or fetal position. A single measurement outside the range is not necessarily a problem — your provider will usually monitor over several appointments or order an ultrasound to investigate further."

4. Q: "What does it mean if my fundal height is measuring large?"
   A: "A measurement more than 3 cm above expected may indicate a larger baby, excess amniotic fluid (polyhydramnios), or a multiple pregnancy. Like small measurements, one reading outside the range is not automatically concerning. Your OB or midwife will assess in the context of your full pregnancy history."

5. Q: "Is fundal height accurate?"
   A: "Fundal height is a screening tool, not a diagnostic measurement. Accuracy is affected by the examiner's technique, fetal position, amount of amniotic fluid, maternal body habitus, and whether the bladder was empty. It is most useful when tracked over multiple appointments for trends, not as a single isolated reading. Ultrasound provides a more accurate assessment of fetal size."

6. Q: "When does fundal height measurement stop being useful?"
   A: "McDonald's Rule applies most reliably between 20 and 36 weeks. After 36 weeks, as the baby descends into the pelvis (engagement), the fundal height may decrease or plateau and becomes less predictive. Most providers rely more on ultrasound in the third trimester for growth assessment."

---

Source citation:
Source: Cunningham FG et al. Williams Obstetrics, 25th edition. McGraw-Hill, 2018. McDonald's Rule, Chapter 9.
Note: This is a textbook reference, not a URL. Render as plain text, not a link.
Render as: <p>Calculation based on McDonald's Rule, as described in Williams Obstetrics (Cunningham et al., McGraw-Hill). For informational use only.</p>

---

Internal links to include:
1. From results section → link to /pregnancy-week-by-week
   Anchor text: "see what's happening in your pregnancy this week"
2. From educational section → link to /pregnancy-due-date-calculator
   Anchor text: "calculate your gestational age from your LMP"

---

_redirects entries to add:
/fundal-height              /fundal-height-calculator 301
/mcdonalds-rule-calculator  /fundal-height-calculator 301
/fundal-height-calculator/  /fundal-height-calculator 301
```

---

## PROMPT 5 — C-Section Recovery Timeline Calculator

```
You are adding a new tool to SageNest Health. Read newtoolMAIN.md fully before writing any code. Follow every instruction in it exactly.

---

TOOL SPEC:

Tool name: C-Section Recovery Timeline Calculator
URL slug: /c-section-recovery-calculator
Page component file: src/pages/CSectionRecoveryCalculator.tsx
Calc lib file: src/lib/cSectionRecoveryCalc.ts
Export name: CSectionRecoveryCalculatorPage
tools.ts id: c-section-recovery-calculator

---

CALCULATION LOGIC (source: NHS — Caesarean section recovery, nhs.uk):

Input: c_section_date (surgery date)

Milestone calculations using addDays(normalizedSurgeryDate, n):
Each milestone has: label, date, description, and a category (mobility/activity/health)

const MILESTONES = [
  { label: 'Hospital discharge', days: 3, description: 'Most women go home 2–4 days after a c-section.', category: 'health' },
  { label: 'Wound check', days: 7, description: 'Wound is checked around day 7. Dissolvable stitches begin absorbing.', category: 'health' },
  { label: 'Short walks outside', days: 14, description: 'Most women can manage short, gentle walks by 2 weeks.', category: 'mobility' },
  { label: 'Driving', days: 42, description: 'You can usually return to driving at 6 weeks, once you can perform an emergency stop comfortably. Confirm with your GP.', category: 'activity' },
  { label: 'Light exercise', days: 42, description: 'Light exercise such as walking, swimming, or gentle yoga is usually safe from 6 weeks.', category: 'activity' },
  { label: 'Sex', days: 42, description: 'Most guidelines suggest waiting at least 6 weeks before resuming sexual activity, once you feel ready.', category: 'health' },
  { label: 'Return to work (desk job)', days: 42, description: 'Many women return to desk work around 6 weeks, though this varies by individual recovery.', category: 'activity' },
  { label: 'Lifting heavy objects', days: 84, description: 'Avoid lifting anything heavier than your baby for the first 6 weeks. Full lifting capacity typically returns by 12 weeks.', category: 'activity' },
  { label: 'Strenuous exercise', days: 84, description: 'Running, gym workouts, and core exercises are typically safe to resume gradually from 12 weeks. Listen to your body.', category: 'activity' },
  { label: 'Scar fully healed', days: 180, description: 'The external scar typically takes 6 months to fully heal. Internal healing continues beyond this.', category: 'health' },
];

Display as a vertical timeline — each milestone shows: milestone label, the specific date, and the description. Group by past/upcoming milestones relative to today's date.

Validation:
- Surgery date must be valid
- Surgery date must not be in the future (you can only recover from a surgery that happened)
- Surgery date must be within the past 24 months

---

SEO SPEC:

Primary keyword: "c-section recovery timeline"
Secondary keywords: "c section recovery week by week", "how long does c-section recovery take", "c section recovery calculator"
Trust badge: "Based on NHS caesarean recovery guidelines"

Title tag:
"C-Section Recovery Timeline Calculator — Week by Week Milestones"

Meta description:
"Enter your c-section date to see your personalized recovery timeline. Get specific dates for driving, exercise, lifting, and full recovery milestones based on NHS guidelines. Free, no signup."

H1:
<h1 className="hero-title">C-Section Recovery <span>Timeline Calculator</span></h1>

H2 structure for educational section:
1. "How does this c-section recovery calculator work?"
2. "What is the typical c-section recovery timeline week by week?"
3. "When should you contact your doctor during c-section recovery?"
4. "Frequently asked questions"

FAQ_ITEMS:
1. Q: "How long does c-section recovery take?"
   A: "Most women feel significantly better within 6 weeks of a c-section, though full recovery — including internal healing — can take up to 6 months. The 6-week mark is when most activity restrictions (driving, exercise, sex) are lifted. Individual recovery varies based on overall health, complications, and how you rest in the early weeks."

2. Q: "When can I drive after a c-section?"
   A: "Most guidelines say to wait at least 6 weeks before driving. The key test is whether you can perform an emergency stop comfortably without pain. Your insurance may also be invalidated if you drive before you are physically fit to do so. Always confirm with your GP before getting behind the wheel."

3. Q: "When can I exercise after a c-section?"
   A: "Gentle walking is safe from about 2 weeks. Light exercise such as swimming and yoga is usually appropriate from 6 weeks. Running, gym workouts, and core exercises should wait until around 12 weeks. Always start gradually and stop if you experience pain, bleeding, or discomfort."

4. Q: "When can I lift heavy things after a c-section?"
   A: "For the first 6 weeks, avoid lifting anything heavier than your newborn. This protects the internal abdominal repair as it heals. By 12 weeks, most women can return to normal lifting. Heavy gym lifts or strenuous physical labor should be discussed with your GP or physiotherapist."

5. Q: "What are signs of c-section wound infection to watch for?"
   A: "Contact your midwife or GP if you notice: increased redness, swelling, warmth, or pain around the wound; pus or discharge; wound edges separating; fever over 38°C; or increasing rather than decreasing pain. These may indicate infection, which is treatable if caught early."

6. Q: "How long does the c-section scar take to fade?"
   A: "The scar typically takes 6 months to a year to fade from red or pink to a paler silvery color. Many women find scar massage (gentle circular pressure once the wound is fully closed, around 6–8 weeks) helps reduce scar tissue and improve appearance. A GP or physiotherapist can advise on technique."

---

Source citation:
Source: NHS — Caesarean section: Recovery
Link to: https://www.nhs.uk/conditions/caesarean-section/recovery/

---

Internal links to include:
1. From results section → link to /pregnancy-weight-gain-calculator
   Anchor text: "track your postpartum weight recovery"
2. From educational section → link to /pregnancy-week-by-week
   Anchor text: "pregnancy week by week milestones"

---

_redirects entries to add:
/c-section-recovery          /c-section-recovery-calculator 301
/csection-recovery           /c-section-recovery-calculator 301
/cesarean-recovery           /c-section-recovery-calculator 301
/c-section-recovery-calculator/  /c-section-recovery-calculator 301
```

---

## PROMPT 6 — Colostrum Harvesting Start Date Calculator

```
You are adding a new tool to SageNest Health. Read newtoolMAIN.md fully before writing any code. Follow every instruction in it exactly.

---

TOOL SPEC:

Tool name: Colostrum Harvesting Start Date Calculator
URL slug: /colostrum-harvesting-calculator
Page component file: src/pages/ColostrumHarvestingCalculator.tsx
Calc lib file: src/lib/colostrumHarvestingCalc.ts
Export name: ColostrumHarvestingCalculatorPage
tools.ts id: colostrum-harvesting-calculator

---

CALCULATION LOGIC:
Sources:
- NHS — Antenatal expressing of colostrum (nhs.uk)
- UNICEF UK Baby Friendly Initiative — guidance on antenatal milk expression

Input: due_date (estimated due date)

Outputs calculated using addDays(normalizedDueDate, n) where n is NEGATIVE (subtracting days):
- recommended_start: due_date - 28 days  (36 weeks gestation — NHS recommended start point)
- earliest_start:    due_date - 42 days  (34 weeks gestation — absolute earliest, only on midwife advice)
- collection_window_end: due_date        (stop collecting and refrigerate/freeze once labor begins)

Also calculate and display:
- gestational_week_at_start: 36 (this is fixed — always display "36 weeks" as the start point)
- days_until_start: Math.max(0, Math.floor((recommended_start - today) / DAY_MS))
  → If days_until_start > 0: show "Your harvesting start date is in X days"
  → If days_until_start <= 0 and today < due_date: show "You can start harvesting now" (they are past 36 weeks)
  → If today >= due_date: show "You are at or past your due date — harvesting is no longer needed"

Storage guidance (static, display always):
- Fresh colostrum: store in fridge up to 48 hours
- Frozen colostrum: store in freezer up to 6 months
- Bring frozen colostrum to hospital in a cool bag

IMPORTANT WARNING to display prominently before results (not as a disclaimer — as a styled warning box):
"Antenatal colostrum harvesting is not recommended before 36 weeks without explicit midwife or consultant advice, as nipple stimulation can trigger uterine contractions. Always discuss with your midwife before starting."

Validation:
- Due date must be valid
- Due date must not be in the past (tool is for upcoming births only)
- Due date must not be more than 42 weeks in the future (not yet pregnant or very early)

---

SEO SPEC:

Primary keyword: "colostrum harvesting calculator"
Secondary keywords: "when to start colostrum harvesting", "antenatal colostrum harvesting start date", "colostrum harvesting 36 weeks"
Trust badge: "Based on NHS antenatal guidance"

Title tag:
"Colostrum Harvesting Calculator — When to Start Antenatal Expression"

Meta description:
"Find out exactly when to start harvesting colostrum before your due date. Enter your due date for your recommended start date, based on NHS antenatal expressing guidance. Free, no signup."

H1:
<h1 className="hero-title">Colostrum Harvesting <span>Start Date Calculator</span></h1>

H2 structure for educational section:
1. "How does this colostrum harvesting calculator work?"
2. "When should you start harvesting colostrum during pregnancy?"
3. "When should you talk to your midwife before starting colostrum harvesting?"
4. "Frequently asked questions"

FAQ_ITEMS:
1. Q: "When should I start harvesting colostrum?"
   A: "NHS guidance recommends starting antenatal colostrum harvesting at 36 weeks of pregnancy, which is typically 4 weeks before your estimated due date. Starting earlier is not generally advised unless your midwife or consultant specifically recommends it, as nipple stimulation before 36 weeks can stimulate contractions."

2. Q: "What is colostrum and why harvest it before birth?"
   A: "Colostrum is the first milk your body produces, starting in pregnancy. It is highly concentrated in antibodies, growth factors, and nutrients. Harvesting it before birth means you have a supply ready if your baby needs extra feeding support in the first days — particularly useful for babies born to diabetic mothers, or those with a cleft lip or other feeding challenges."

3. Q: "How do I harvest colostrum at home?"
   A: "Hand expression is the recommended method. After washing your hands, gently massage the breast toward the nipple in a rolling motion. Collect any drops in a sterile syringe (usually 1ml syringes available from pharmacies or midwife teams). Sessions of 5–10 minutes, 2–3 times per day, are typical. Your midwife will demonstrate the technique."

4. Q: "How much colostrum is normal to collect before birth?"
   A: "Very small amounts are entirely normal — often just a few drops per session. Colostrum is extremely nutrient-dense, so even 1–2 ml is valuable for a newborn. The amount produced varies widely between women and is not an indicator of how much milk you will make after birth."

5. Q: "Is colostrum harvesting safe for all pregnancies?"
   A: "No. Colostrum harvesting is not recommended if you have a history of preterm labor, cervical incompetence, or are carrying multiples, unless your consultant has specifically approved it. Nipple stimulation releases oxytocin, which can cause uterine contractions. Always discuss with your midwife before starting."

6. Q: "How do I store colostrum I collect before birth?"
   A: "Colostrum can be stored in the fridge for up to 48 hours, or frozen for up to 6 months. Use sterile labelled syringes and store them flat in a sealed bag. When the time comes, bring your frozen syringes to the hospital in a cool bag — most maternity wards have freezers for patient milk."

---

Source citation:
Source: NHS — Antenatal expressing of colostrum
Link to: https://www.nhs.uk/pregnancy/keeping-well/expressing-and-storing-colostrum/

---

Internal links to include:
1. From results section → link to /pregnancy-due-date-calculator
   Anchor text: "calculate your due date"
2. From educational section → link to /pregnancy-week-by-week
   Anchor text: "what happens at 36 weeks of pregnancy"

---

_redirects entries to add:
/colostrum-harvesting          /colostrum-harvesting-calculator 301
/antenatal-colostrum           /colostrum-harvesting-calculator 301
/colostrum-harvesting-calculator/  /colostrum-harvesting-calculator 301
```

---

## HOW TO USE THESE PROMPTS

1. Open a new chat (separate from this one)
2. Upload your `newtoolMAIN.md` file as a document attachment
3. Paste the entire prompt block for the tool you want to build
4. The AI has everything it needs — tool spec, calc logic, SEO spec, FAQ content, source citations, redirects

Each prompt is fully self-contained. The AI does not need to ask you questions — all decisions are already made in the prompt. If it asks something, point it back to the relevant section of `newtoolMAIN.md`.
