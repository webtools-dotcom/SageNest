# SageNest

SageNest Health – Smart Tools for Women’s Wellness is a fully static, production-ready React + TypeScript web app for women-focused wellness tools and SEO-focused educational blog content. It is designed for Cloudflare Pages with zero backend, zero database, and zero data collection.

## Core Features

- Pregnancy Due Date Calculator with a guided 3-step LMP flow (date → cycle length → review/calculate)
- Pregnancy Weight Gain Calculator with BMI category, IOM total gain bands, and week-specific gain guidance
- Pregnancy Week by Week milestone tool with all 40 weeks of baby-development and body-change guidance
- Ovulation Calculator with LMP input, cycle-length presets/custom mode, and fertile-window estimate
- Colostrum Harvesting Start Date Calculator with 36-week NHS-aligned start guidance
- Pregnancy Flight Safety Calculator with gestational-age travel verdicts and airline policy table
- Gestational age output with normalized week/day formatting
- Trimester status and conception window (±3 days around ovulation estimate)
- Local timezone date formatting
- Native share with clipboard fallback
- Static blog system:
  - `/blog` listing
  - `/blog/:slug` detail pages
  - `/admin/blogposter` static publishing helper
- `/pregnancy-weight-gain-calculator` interactive page
- `/ovulation-calculator` interactive page
- `/colostrum-harvesting-calculator` interactive page
- `/pregnancy-flight-calculator` interactive page
- JSON-LD SEO schema for WebPage, FAQPage, Blog, Article, and SearchAction
- Accessibility baseline (skip link, htmlFor labels, keyboard focus styles, aria-live)
- Vitest unit tests covering calculator math, date helper formatting, and progress-wheel mapping

## Tech Stack

- Vite
- React 18
- TypeScript
- React Router
- Vitest

## Run locally

```bash
npm install
npm run dev
```

## Build static output

```bash
npm run build
```

## Run tests

```bash
npm run test
```

## Cloudflare Pages Deployment

1. Push repository to GitHub.
2. In Cloudflare Pages, create a new project and connect the repo.
3. Use these build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy.
5. Add your custom domain in Cloudflare Pages > Custom domains.
6. Ensure DNS points to Cloudflare and SSL is enabled.

### Security headers (Cloudflare Pages)

- Security headers are managed in `public/_headers` (Cloudflare Pages `_headers` file format).
- Keep Cloudflare dashboard header/rules configuration aligned with `public/_headers` so production behavior stays consistent across preview and live deployments.
- Current baseline includes:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(), microphone=(), camera=()`
  - `Content-Security-Policy` for self-hosted app assets, Google Fonts, and Supabase (`https://*.supabase.co` and `wss://*.supabase.co`).
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains`

## Static Route Strategy

The app uses SPA routing with `_redirects` fallback:

- `/`
- `/pregnancy-due-date-calculator`
- `/blog`
- `/blog/:slug`
- `/admin/blogposter`
- `/about`
- `/privacy`
- `/pregnancy-weight-gain-calculator`
- `/ovulation-calculator`
- `/colostrum-harvesting-calculator`
- `/pregnancy-flight-calculator`
- `/pregnancy-week-by-week`
- `/pregnancy-week-by-week/:weekSlug`
- `/similar-tools`
- Catch-all app route: `*` (renders in-app not-found page with noindex metadata)

Cloudflare still serves `index.html` for hydration (`/* /index.html 200`), and the React catch-all route handles unknown paths so users and crawlers get proper not-found content instead of a soft-404-like calculator page.

Blog redirect/rewrite entries in `public/_redirects` are generated from `src/data/blogPosts.ts` via `npm run generate:redirects` (and validated by `npm run check:redirects`) to prevent manual rule drift as blog volume grows.

## Programmatic SEO Strategy

### 30 Long-tail keyword ideas

1. pregnancy due date calculator us
2. when am I due calculator
3. how to calculate due date by lmp
4. due date calculator for irregular cycle
5. ivf embryo transfer due date calculator
6. conception date due date estimate
7. pregnancy week calculator by date
8. due date estimate with 32 day cycle
9. first trimester week by week guide
10. second trimester milestone timeline
11. third trimester planning checklist
12. how accurate are due dates
13. ultrasound vs lmp due date differences
14. naegele rule explained
15. local timezone pregnancy calculator
16. no data collection due date calculator
17. private client side pregnancy tool
18. due date and gestational age calculator
19. calculate conception window in pregnancy
20. pregnancy due date calculator without app
21. static pregnancy calculator website
22. prenatal appointment timing by week
23. how many weeks pregnant am I today
24. due date calculator for long cycles
25. due date calculator for short cycles
26. ivf day 5 transfer due date
27. ivf day 3 transfer due date
28. pregnancy faq due date planning
29. pregnancy content hub for due date
30. evidence informed due date article

### Content cluster plan

- Pillar: Pregnancy Due Date Calculator
- Cluster A: Dating methods (LMP, ultrasound, conception)
- Cluster B: IVF-specific timeline content
- Cluster C: Week-by-week planning and trimester education
- Cluster D: FAQs and clinician discussion prompts

### Internal linking map

- Calculator landing links to blog hub
- Blog detail pages link back to calculator CTA
- Blog posts cross-link related posts
- About/privacy remain one-click from main nav

### Future tool expansion plan

- Prenatal visit timeline planner (static)
- Kick-count journal template (local storage optional)
- Hospital bag checklist tool (downloadable)

### Sitemap and indexing

- `src/data/blogPosts.ts` is the source of truth for blog content and slug metadata (`updatedAt`, optional `imageUrl`).
- `public/blog-static/<slug>.html` is generated from that source via `npm run generate:blog`, and this script now auto-resolves a per-slug Cloudinary image URL before rendering each HTML file.
- `public/sitemap.xml` is generated from route sources (`src/data/tools.ts`, fixed routes, week-1..40, and blog slugs from `blogPosts.ts`, with optional Supabase merge when enabled).
- `public/_redirects` blog rules are generated from the same slug source and intentionally include only two `200` rewrites per slug: `/blog/<slug>` and `/blog/<slug>/` to `/blog-static/<slug>.html`.
- Blog HTML is served from the dedicated `blog-static` path to avoid Cloudflare directory slash normalization loops (`/blog/<slug>` ⇄ `/blog/<slug>/`).
- `npm run check:sitemap` and `npm run check:blog-sync` fail when sitemap/redirect/static blog outputs diverge from source content.
- `public/robots.txt` allows all crawlers and references sitemap.

### Blog publishing checklist (for every new post)

1. Add the post object in `src/data/blogPosts.ts` with unique `slug` and `updatedAt` (`YYYY-MM-DD`).
2. Ensure `.env` contains `POLLINATIONS_API_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` so `npm run generate:blog` can generate/upload missing blog images automatically.
3. Run `npm run generate:blog`, `npm run generate:redirects`, and `npm run generate:sitemap`.
4. Run `npm run check:redirects`, `npm run check:sitemap`, and `npm run check:blog-sync`.
5. Deploy to Cloudflare Pages.
6. Purge Cloudflare cache for `/blog/*`.
7. In Google Search Console, submit/refresh sitemap and request indexing for the new blog URL.

## Performance Notes

- Minimal dependency footprint
- Native Date operations (no moment.js/date-fns)
- CSS-only visual styling with lightweight layout
- Google Fonts preconnect configured in `index.html`

## Privacy & Medical Disclaimer

- No personal data collected. All calculations happen in-browser.
- For informational purposes only. Not medical advice. Consult a healthcare provider.

## Lighthouse Intent

- Targeting >90 on desktop by:
  - static generation,
  - small bundles,
  - semantic markup,
  - constrained CSS,
  - no blocking third-party scripts.


## Supabase Admin Setup

Add these variables in `.env.local` and Cloudflare Pages environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
# Use either a single admin email or a comma-separated allowlist.
VITE_ADMIN_EMAIL=admin@example.com
# VITE_ADMIN_EMAILS=admin@example.com,editor@example.com
```

Configure Supabase Google OAuth redirect URLs:

- `http://localhost:5173/admin/login`
- `https://sagenesthealth.com/admin/login`

Security guidance:

- Apply explicit SQL policies for both the `blog` table and `blog` Storage bucket.

Use this SQL in Supabase SQL Editor (replace admin emails with your own allowlist):

```sql
-- 1) Blog table RLS
alter table public.blog enable row level security;

drop policy if exists "public can read published blog" on public.blog;
create policy "public can read published blog"
on public.blog
for select
to public
using (is_published = true);

drop policy if exists "admin can read all blog rows" on public.blog;
create policy "admin can read all blog rows"
on public.blog
for select
to authenticated
using ((auth.jwt() ->> 'email') = any (array['admin@example.com','editor@example.com']));

drop policy if exists "admin can insert blog" on public.blog;
create policy "admin can insert blog"
on public.blog
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = any (array['admin@example.com','editor@example.com']));

drop policy if exists "admin can update blog" on public.blog;
create policy "admin can update blog"
on public.blog
for update
to authenticated
using ((auth.jwt() ->> 'email') = any (array['admin@example.com','editor@example.com']))
with check ((auth.jwt() ->> 'email') = any (array['admin@example.com','editor@example.com']));

drop policy if exists "admin can delete blog" on public.blog;
create policy "admin can delete blog"
on public.blog
for delete
to authenticated
using ((auth.jwt() ->> 'email') = any (array['admin@example.com','editor@example.com']));

-- 2) Storage bucket policies for "blog"
insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read blog assets" on storage.objects;
create policy "public read blog assets"
on storage.objects
for select
to public
using (bucket_id = 'blog');

drop policy if exists "admin upload blog assets" on storage.objects;
create policy "admin upload blog assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blog'
  and (auth.jwt() ->> 'email') = any (array['admin@example.com','editor@example.com'])
);

drop policy if exists "admin update blog assets" on storage.objects;
create policy "admin update blog assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'blog'
  and (auth.jwt() ->> 'email') = any (array['admin@example.com','editor@example.com'])
)
with check (
  bucket_id = 'blog'
  and (auth.jwt() ->> 'email') = any (array['admin@example.com','editor@example.com'])
);

drop policy if exists "admin delete blog assets" on storage.objects;
create policy "admin delete blog assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'blog'
  and (auth.jwt() ->> 'email') = any (array['admin@example.com','editor@example.com'])
);
```

Notes:

- Frontend admin checks are only for UX and route gating; these SQL policies are the real enforcement layer.
- Keep SQL allowlist emails and `VITE_ADMIN_EMAIL`/`VITE_ADMIN_EMAILS` values aligned.

## Cloudflare Deployment Guardrails

To prevent deploy failures from malformed `package.json` or unresolved merge markers, run:

```bash
npm run check:package
npm run check:conflicts
npm run check:redirects
```

`npm run build` now runs these checks first via `prebuild`: package JSON check, merge-conflict check, static blog generation, redirects generation + validation, and sitemap generation + validation.

## Automated README Worktree Sync

- `npm run sync:readme-worktree` regenerates the `## Exact Repository Worktree Structure` block from the current `git ls-files` output.
- `npm run setup:hooks` configures Git to use the repository's `.githooks/` folder.
- `postinstall` runs that setup automatically, and `.githooks/pre-commit` runs the sync script before each commit, then re-stages `README.md` only if the tracked file tree actually changed.
- Git does not provide a native `post-add` hook, so the closest reliable automation point is `pre-commit` after you have staged files with `git add`. If no tracked files were added or removed, the script leaves `README.md` untouched.

## Exact Repository Worktree Structure

Below is the exact tracked file tree of this repository at the time of this update. If this section is missing on another branch, re-sync that branch from the latest `main` before editing manually.

```text
.
├── .githooks/
│   ├── post-checkout
│   ├── post-commit
│   ├── post-merge
│   ├── pre-commit
│   └── pre-push
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── blog-static/
│   │   ├── anovulation-what-it-is-causes-treatment.html
│   │   ├── bbt-charting-ovulation.html
│   │   ├── bleeding-gums-pregnancy-gingivitis.html
│   │   ├── blurry-vision-pregnancy-warning-signs.html
│   │   ├── braxton-hicks-vs-real-contractions.html
│   │   ├── caffeine-200mg-limit-pregnancy-what-counts.html
│   │   ├── cervical-mucus-ovulation-guide.html
│   │   ├── choline-pregnancy-prenatal-vitamins-miss.html
│   │   ├── dizziness-lightheadedness-pregnancy-second-trimester.html
│   │   ├── fish-pregnancy-what-to-eat-avoid-mercury.html
│   │   ├── folic-acid-vs-methylfolate-pregnancy-mthfr.html
│   │   ├── gestational-diabetes-pregnancy-weight-gain.html
│   │   ├── healthy-pregnancy-weight-gain-complete-guide.html
│   │   ├── hemorrhoids-pregnancy-third-trimester.html
│   │   ├── how-due-dates-are-calculated.html
│   │   ├── iodine-pregnancy-sea-salt-prenatal-gap.html
│   │   ├── iron-supplements-pregnancy-side-effects.html
│   │   ├── irregular-cycles-ovulation-conception.html
│   │   ├── itchy-palms-feet-pregnancy-cholestasis.html
│   │   ├── ivf-due-date-guide.html
│   │   ├── luteal-phase-explained-after-ovulation.html
│   │   ├── magnesium-deficiency-pregnancy-leg-cramps.html
│   │   ├── mid-cycle-spotting-ovulation-what-it-means.html
│   │   ├── morning-sickness-remedies-that-actually-work.html
│   │   ├── opk-positive-multiple-days-what-it-means.html
│   │   ├── ovulation-signs-symptoms.html
│   │   ├── pcos-ovulation-tracking-irregular-cycles.html
│   │   ├── pelvic-girdle-pain-pregnancy.html
│   │   ├── pregnancy-carpal-tunnel-numb-fingers-night.html
│   │   ├── pregnancy-dehydration-third-trimester-thirst.html
│   │   ├── pregnancy-headaches-causes-safe-relief-red-flags.html
│   │   ├── pregnancy-heartburn-why-it-gets-worse.html
│   │   ├── pregnancy-ice-craving-pagophagia-iron-deficiency.html
│   │   ├── pregnancy-insomnia-causes-safe-relief.html
│   │   ├── pregnancy-nutrition-guide-what-to-eat-each-trimester.html
│   │   ├── pregnancy-rhinitis-stuffy-nose-not-a-cold.html
│   │   ├── pregnancy-swelling-edema-normal-vs-warning-sign.html
│   │   ├── pregnancy-week-by-week-milestones.html
│   │   ├── pregnancy-weight-gain-myths-facts.html
│   │   ├── puppp-rash-pregnancy-belly-itching.html
│   │   ├── restless-legs-pregnancy-third-trimester.html
│   │   ├── rib-pain-pregnancy-third-trimester.html
│   │   ├── round-ligament-pain-pregnancy.html
│   │   ├── sciatica-shooting-leg-pain-pregnancy.html
│   │   ├── short-luteal-phase-10-days-what-it-means.html
│   │   ├── shortness-of-breath-pregnancy.html
│   │   ├── stress-delayed-ovulation-late-period.html
│   │   ├── two-week-wait-symptoms-progesterone-not-pregnancy.html
│   │   └── vegetarian-pregnancy-dha-nutrient-gaps.html
│   ├── images/
│   │   └── blog/
│   │       └── sagenest-blog-default.jpg
│   ├── _headers
│   ├── _redirects
│   ├── apple-touch-icon.png
│   ├── favicon-96x96.png
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── gtag.js
│   ├── manifest.json
│   ├── pinterest-330c7.html
│   ├── robots.txt
│   ├── sagenest-main-logo.png
│   ├── sitemap.xml
│   ├── web-app-manifest-192x192.png
│   └── web-app-manifest-512x512.png
├── scripts/
│   ├── blog-data.mjs
│   ├── check-blog-static-sync.mjs
│   ├── check-conflicts.sh
│   ├── check-package-json.mjs
│   ├── check-redirects.mjs
│   ├── check-sitemap.mjs
│   ├── generate-blog-html.mjs
│   ├── generate-redirects.mjs
│   ├── generate-sitemap.mjs
│   ├── redirects-utils.mjs
│   ├── setup-git-hooks.mjs
│   ├── sitemap-utils.mjs
│   └── sync-readme-worktree.mjs
├── src/
│   ├── components/
│   │   ├── BlogList.tsx
│   │   ├── BlogPost.tsx
│   │   ├── BlogPoster.tsx
│   │   ├── CalculatorCard.tsx
│   │   ├── CalculatorForm.tsx
│   │   ├── CalculatorSteps.tsx
│   │   ├── DisclaimerBox.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── FertilityCalendar.tsx
│   │   ├── FertilityChart.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroCard.tsx
│   │   ├── InfoGrid.tsx
│   │   ├── PregnancyTimeline.tsx
│   │   ├── ProgressWheel.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ResultCard.tsx
│   │   ├── ResultsCard.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── SEOHead.tsx
│   ├── data/
│   │   ├── blogPosts.ts
│   │   ├── pregnancyWeeks.ts
│   │   ├── tools.ts
│   │   └── weekSummaries.ts
│   ├── lib/
│   │   ├── calc.ts
│   │   ├── colostrumHarvestingCalc.ts
│   │   ├── dateHelpers.ts
│   │   ├── markdown.ts
│   │   ├── morningSicknessCalc.ts
│   │   ├── ovulationCalc.ts
│   │   ├── pregnancyFlightCalc.ts
│   │   └── pregnancyWeightGain.ts
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── BlogPoster.tsx
│   │   ├── Calculator.tsx
│   │   ├── ColostrumHarvestingCalculator.tsx
│   │   ├── EditorialTeamPage.tsx
│   │   ├── MorningSicknessEstimator.tsx
│   │   ├── NotFound.tsx
│   │   ├── OvulationCalculator.tsx
│   │   ├── PregnancyFlightCalculator.tsx
│   │   ├── PregnancyWeekByWeekHub.tsx
│   │   ├── PregnancyWeekDetail.tsx
│   │   ├── PregnancyWeightGainCalculator.tsx
│   │   ├── Privacy.tsx
│   │   └── SimilarTools.tsx
│   ├── styles/
│   │   ├── design-tokens.css
│   │   └── global.css
│   ├── supabase/
│   │   └── client.ts
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── adminLoginAuth.test.ts
│   ├── blogPosterAuth.test.ts
│   ├── blogPosterUploadValidation.test.ts
│   ├── calc.test.ts
│   ├── dateHelpers.test.ts
│   ├── markdown.test.ts
│   ├── ovulationCalc.test.ts
│   ├── pregnancyFlightCalc.test.ts
│   ├── pregnancyWeightGain.test.ts
│   └── progressWheel.test.ts
├── .env.example
├── .gitignore
├── Blogpostsrule.md
├── codex.md
├── frontend.md
├── frontend2.md
├── index.html
├── latestchange.md
├── newtoolMAIN.md
├── package-lock.json
├── package.json
├── README.md
├── SAGENEST BLOG MASTERGUIDE.md
├── sagenest-pinterest-pin-masterguide.md
├── SECURITY.md
├── SECURITY2.md
├── tool-build-prompts.md
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vite.config.ts
```
`npm run build` now runs these checks first via `prebuild`: package JSON check, merge-conflict check, static blog generation, redirects generation + validation, sitemap generation + validation, and blog static-sync validation.
