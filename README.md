# SageNest

SageNest is a fully static, production-ready React + TypeScript web app for pregnancy due date estimation and SEO-focused educational blog content. It is designed for Cloudflare Pages with zero backend, zero database, and zero data collection.

## Core Features

- Pregnancy Due Date Calculator with three modes:
  - LMP (Naegele’s rule + cycle-length adjustment)
  - Conception date (+266 days)
  - IVF transfer date (+280 minus embryo age)
- Gestational age output (weeks + days)
- Trimester status and conception window (±3 days around ovulation estimate)
- Local timezone date formatting
- Client-side `.ics` calendar export
- Native share with clipboard fallback
- Static blog system:
  - `/blog` listing
  - `/blog/:slug` detail pages
  - `/blogposter` static publishing helper
- JSON-LD SEO schema for WebPage, FAQPage, Blog, Article, and SearchAction
- Accessibility baseline (skip link, htmlFor labels, keyboard focus styles, aria-live)
- Vitest unit tests for all required date scenarios

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

## Static Route Strategy

The app uses SPA routing with `_redirects` fallback:

- `/`
- `/pregnancy-due-date-calculator`
- `/blog`
- `/blog/:slug`
- `/blogposter`
- `/about`
- `/privacy`

Cloudflare serves `index.html` for route hydration.

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

- Weight gain range estimator (static)
- Prenatal visit timeline planner (static)
- Kick-count journal template (local storage optional)
- Hospital bag checklist tool (downloadable)

### Sitemap and indexing

- `public/sitemap.xml` includes canonical HTTPS URLs
- `public/robots.txt` allows all crawlers and references sitemap

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
 codex/generate-static-pregnancy-due-date-calculator-app-g1llqp

## Supabase Admin Setup

Add these variables in `.env.local` and Cloudflare Pages environment variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Configure Supabase Google OAuth redirect URLs:

- `http://localhost:5173/admin/login`
- `https://sagenest.pages.dev/admin/login`

Security guidance:

- Enable RLS on `blog` table.
- Add policies so only `testforsavr@gmail.com` can `INSERT`, `UPDATE`, and `DELETE`.
- Protect `blog` storage bucket so only admin can upload and public can read published assets.

 main
