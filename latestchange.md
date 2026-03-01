## 2026-03-01 (Admin crawl controls: robots disallow + noindex directives)

- Updated `public/robots.txt` to explicitly disallow crawling under `/admin/` while keeping global allow and sitemap declaration unchanged.
- Extended `src/components/SEOHead.tsx` with an optional `robots` prop so pages can set explicit robots directives beyond the existing boolean `noIndex` switch.
- Added `SEOHead` metadata on `src/pages/AdminLogin.tsx` and `src/pages/BlogPoster.tsx` with `robots="noindex,nofollow,noarchive"` so both admin entry and protected admin content stay out of indexing.
- Re-validated sitemap behavior through script checks to confirm admin routes are not present in generated/validated sitemap entries.

## 2026-03-01 (Search Console migration redirect hardening)

- Added explicit legacy-to-current `301` mappings at the top of `public/_redirects` for common old calculator and blog URL patterns (including trailing-slash variants) so migrated URLs resolve to canonical live paths before catch-all rules.
- Added targeted `301` fallbacks for retired/unknown pregnancy-week detail URLs to route users and crawlers to the active week-by-week hub instead of a generic homepage redirect.
- Kept intentional content-serving `200` file rewrite rules unchanged and below the new explicit `301` section.

## 2026-03-01 (Sitemap blog source aligned with published runtime data)

- Updated `scripts/sitemap-utils.mjs` to support Supabase-backed published blog slug loading (`blog` table with `is_published = true`) for sitemap generation, with local fallback to `src/data/blogPosts.ts` when Supabase env vars are not available.
- Added `SITEMAP_BLOG_SOURCE` support (`hybrid` default, `local`, `supabase`) so build/CI can control blog URL source while keeping deterministic validation.
- Converted sitemap scripts to async (`generate-sitemap.mjs`, `check-sitemap.mjs`) so DB-backed blog URL loading is included in both generation and validation paths.
- Updated README sitemap docs to reflect optional Supabase blog sourcing.

## 2026-03-01 (CI lockfile compatibility fix)

- Updated `.github/workflows/ci.yml` to remove npm cache usage in `actions/setup-node` because this repo does not commit a lockfile.
- Switched CI dependency installation from `npm ci` to `npm install` so `validate-and-test` runs successfully without `package-lock.json`/`yarn.lock`.
- Kept the sitemap validation, tests, and build steps unchanged.

## 2026-03-01 (Build-time sitemap generator + CI divergence validation)

- Added `scripts/generate-sitemap.mjs` and shared `scripts/sitemap-utils.mjs` to generate `public/sitemap.xml` from a single route source strategy: tool paths in `src/data/tools.ts`, fixed routes (`/blog`, `/about`, `/privacy`, `/similar-tools`), `/pregnancy-week-by-week/week-1..40`, and blog slugs from `src/data/blogPosts.ts`.
- Added `scripts/check-sitemap.mjs` plus npm scripts (`generate:sitemap`, `check:sitemap`, `ci:validate`) so route-list and sitemap divergence fails fast in CI.
- Updated build pipeline (`prebuild`) to generate and validate sitemap automatically before Vite build.
- Added GitHub Actions workflow `.github/workflows/ci.yml` with an explicit sitemap validation step.
- Regenerated `public/sitemap.xml` from the new generator and kept `public/robots.txt` unchanged.

## 2026-02-23 (Blog list query column selection tightened)

- Updated `loadPosts` in `src/pages/BlogPoster.tsx` to replace wildcard `select('*')` with an explicit column list: `id, title, slug, description, content, image_url, is_published, created_at, updated_at`.
- Kept existing ordering (`updated_at` descending) and load behavior unchanged while aligning fetched fields with the `BlogRow` interface.

## 2026-02-23 (Blog authorization hardening for CRUD + storage)

- Hardened `src/pages/BlogPoster.tsx` privileged action handling so Supabase CRUD/storage errors no longer leak raw backend details to admins in UI; privileged failures now resolve to a generic safe message.
- Kept existing frontend admin guard behavior as UX gating while documenting that server-side SQL policies are the source of truth for enforcement.
- Expanded `README.md` Supabase setup with reproducible SQL for `public.blog` RLS and `storage.objects` policies on bucket `blog`, covering admin-only insert/update/delete and public read behavior for published content.

## 2026-02-23 (Admin identity moved to environment config)

- Replaced hardcoded admin email usage with env-driven admin helpers in `src/supabase/client.ts`, supporting either `VITE_ADMIN_EMAIL` or comma-separated `VITE_ADMIN_EMAILS`.
- Added safe fallback behavior for missing admin env config: admin routes now deny access and show a generic configuration error instead of permitting access.
- Updated `AdminLogin`, `ProtectedRoute`, and `BlogPoster` to use shared helper checks (`isAdminEmail`, `hasAdminAccessConfigured`) for consistent authorization logic.
- Added `.env.example` with required Supabase keys plus admin-email env placeholders.
- Updated README admin setup to document the new admin env configuration and allowlist-based policy guidance.

## 2026-02-23 (Cloudflare Pages headers format + deprecated header removal)

- Updated `public/_headers` to a valid Cloudflare Pages route-prefixed block under `/*` with properly indented header lines and no comment wrappers.
- Removed deprecated `X-XSS-Protection` and added `Strict-Transport-Security: max-age=63072000; includeSubDomains`.
- Kept CSP `connect-src` restricted to Supabase hosts only (`https://*.supabase.co` and `wss://*.supabase.co`).

## 2026-02-23 (Tailwind check + frontend2 token mapping)

- Verified the project does not use Tailwind CSS (`tailwindcss` dependency/config is absent), so no `tailwind.config.js` was created or edited.
- Added explicit frontend2 CSS token aliases in `src/styles/global.css` for colors, shadows, and radius values under `:root`.
- Kept implementation non-breaking by mapping new frontend2 tokens to existing design tokens via `var(...)` references.

## 2026-02-23 (Global app mount background transparency)

- Added a new base-level global CSS rule in `src/styles/global.css` for both `#root` and `#app`.
- Set `background: transparent;` on the app mount elements so container-level background handling remains consistent.
- Included `min-height: 100%;` in the same shared rule to preserve full-height layout behavior.

## 2026-02-22 (Pregnancy week detail accessibility navigation + heading hierarchy)

- Added an accessible breadcrumb (`nav[aria-label="Breadcrumb"]`) on the pregnancy week detail page linking back to the week-by-week hub and marking the current week.
- Added adjacent-week navigation (`section[aria-label="Adjacent weeks"]`) with descriptive previous/next links and non-interactive disabled text at week boundaries (week 1 and week 40).
- Reworked week-detail content into a strict heading hierarchy with one `h1`, major `h2` sections (baby development, maternal changes, to-do, medical guidance), and `h3` subsection labels.
- Replaced generic static week text with structured, data-driven sections from `pregnancyWeekByNumber` for development, symptoms, checklist items, and red-flag guidance.

## 2026-02-22 (Pregnancy week-by-week SEO + sitemap expansion)

- Updated the pregnancy week-by-week hub SEO metadata to use a unique title/description/canonical and added CollectionPage + ItemList JSON-LD for all 40 week links.
- Updated each pregnancy week detail page to generate week-specific SEO fields (title, summary-based description, and canonical URL) and emit Article JSON-LD including publisher, URL, and publish/modified dates.
- Expanded `public/sitemap.xml` with `/pregnancy-week-by-week` and `/pregnancy-week-by-week/week-1` through `/pregnancy-week-by-week/week-40`.
- Verified generated canonical paths are unique per week and week descriptions are not reused generic text.

## 2026-02-22 (Week-by-week internal linking expansion)

- Added a contextual result CTA in `src/components/CalculatorCard.tsx` that links to `/pregnancy-week-by-week/week-{calculatedWeek}` when gestational week is in range, with fallback to `/pregnancy-week-by-week`.
- Added a section-level internal link in `src/pages/Calculator.tsx` from the planning tools section to the pregnancy week-by-week hub page.
- Added a new footer resource link in `src/components/Footer.tsx` for “Pregnancy Week-by-Week”.


## 2026-02-22 (Pregnancy week dataset added)

- Added `src/data/pregnancyWeeks.ts` with a strongly typed `PregnancyWeek` interface and a complete week-by-week dataset covering gestational weeks 1 through 40.
- Included medically cautious, educational week content with nested keys for `funFact`, symptom red flags, symptoms, milestones, preparation checklist, and related guidance.
- Added `pregnancyWeekByNumber` for O(1) week lookup and a runtime validation guard to ensure all weeks 1-40 are present in order.


## 2026-02-22 (Week detail route parsing hotfix)

- Fixed React Router matching for pregnancy week detail URLs by changing the route from a non-parameterized mixed segment to `/pregnancy-week-by-week/:weekSlug`.
- Preserved public URL format (`/pregnancy-week-by-week/week-<number>`) and updated detail parsing to accept only `week-1` through `week-40`.
- Ensured invalid formats and out-of-range values still render the existing in-page not-found fallback.


## 2026-02-22 (Pregnancy week-by-week routes)

- Added `src/pages/PregnancyWeekByWeekHub.tsx` with a new week-by-week hub page that uses the shared container/section/SEO layout style and links to all weeks 1 through 40.
- Added `src/pages/PregnancyWeekDetail.tsx` with param parsing and strict week validation so only integer weeks 1-40 render detail content.
- Implemented an in-page not-found fallback on the week detail route for invalid week values and linked users back to the hub page.
- Registered new routes in `src/App.tsx` for `/pregnancy-week-by-week` and `/pregnancy-week-by-week/week-:weekNumber`.

 
# Latest Change Log



## 2026-02-20 (Fixes 8 and 9: static due date page + weight gain metadata alignment)

- Added `public/pregnancy-due-date-calculator/index.html` with the full static pre-rendered HTML from the SEO prompt so crawlers can index complete due-date content without JS.
- Updated `public/pregnancy-weight-gain-calculator/index.html` canonical URL to `https://sagenest.pages.dev/pregnancy-weight-gain-calculator`.
- Replaced the weight gain page meta description with the requested keyword-targeted copy and inserted OG/Twitter tags immediately after canonical.


## 2026-02-20 (Redirect rules sync for blog slugs + due date calculator)

- Updated `public/_redirects` to include all seven Fix 7c blog slug-to-static-index rewrite rules before the SPA catch-all.
- Added `/pregnancy-due-date-calculator /pregnancy-due-date-calculator/index.html 200` before the final catch-all route.
- Kept `/* /index.html 200` as the last line to preserve SPA fallback behavior.


## 2026-02-20 (Fix 7 deployment hotfix: robust BlogPost interface stripping)

- Fixed `scripts/generate-blog-html.mjs` TypeScript stripping logic to remove the full `BlogPost` interface block (including nested inline object type braces) before `new Function(...)` evaluation.
- Resolved Cloudflare build failure (`SyntaxError: Unexpected token '>'`) in `npm run generate:blog` during `prebuild`.
- Re-ran blog static generation successfully for all 7 blog slugs.

## 2026-02-20 (Fix 7 blog static HTML generator + build hook)

- Added `scripts/generate-blog-html.mjs` with the full Fix 7 generator implementation to pre-render blog post HTML from `src/data/blogPosts.ts` into `public/blog/[slug]/index.html`.
- Updated `package.json` scripts by adding `generate:blog` and extending `prebuild` to run the blog generation step after package/conflict checks.
- Generated and committed static `index.html` files for all seven blog slugs under `public/blog/` for crawlable no-JS blog content.


## 2026-02-20 (SEO domain + metadata string alignment)

- Updated JSON-LD URL strings in `src/pages/Calculator.tsx` from `https://sagenest.app...` to `https://sagenest.pages.dev...`, including the WebPage URL, Blog URL, article URL template, and SearchAction target URL.
- Updated `src/pages/OvulationCalculator.tsx` JSON-LD WebApplication URL from `https://sagenest.app/ovulation-calculator` to `https://sagenest.pages.dev/ovulation-calculator`.
- Updated JSON-LD blog/article URL strings in `src/components/BlogList.tsx` and `src/components/BlogPost.tsx` to use `https://sagenest.pages.dev`.
- Replaced only `SEOHead` `description` prop strings in `src/pages/Calculator.tsx`, `src/pages/OvulationCalculator.tsx`, and `src/pages/PregnancyWeightGainCalculator.tsx` with the exact long-tail copy specified in `sagenest-seo-codex-prompt.md`.


## 2026-02-18 (Admin login session error handling)

- Updated `src/pages/AdminLogin.tsx` `checkSession` flow to read `{ data, error }` from `supabase.auth.getUser()` and handle auth-read failures first with a user-safe message: “Unable to verify session. Please try again.” while ending loading state.
- Preserved existing authorized/unauthorized branching behavior after the new error-first handling path by routing session evaluation through `getSessionCheckOutcome(...)`.
- Added `tests/adminLoginAuth.test.ts` to cover admin session outcome states, including a `getUser` error case asserting the user-facing error message contract and non-loading outcome path.


## 2026-02-18 (Markdown URL protocol decoding hardening)

- Updated `src/lib/markdown.ts` `sanitizeUrl(...)` to decode repeated HTML entity and percent-encoded protocol obfuscation before protocol validation, normalize casing/controls for comparison, and block `file:` alongside existing dangerous schemes while preserving safe original cleaned links.
- Added regression tests in `tests/markdown.test.ts` for entity-encoded (`&#58;`/`&#x3A;`), percent-encoded (`%3A`), and mixed-case/whitespace-obfuscated `javascript:` payloads plus a safe `https://...` rendering check.




## 2026-02-18 (Cloudflare Pages security headers baseline)

- Added `public/_headers` with required sitewide security headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`, and `Permissions-Policy`.
- Added an enforced baseline `Content-Security-Policy` for same-origin scripts, Google Fonts, Supabase API/WebSocket connections, and safe image/font sources used by the current app.
- Updated `README.md` Cloudflare deployment documentation to state that security headers are managed via `public/_headers` and should match Cloudflare dashboard configuration.

## 2026-02-18 (Ovulation calculator unit test coverage)

- Added `tests/ovulationCalc.test.ts` with eight Vitest cases covering 28-day and 32-day ovulation estimates, fertile-window and peak-fertility inclusive duration assertions, and invalid-input checks for future/stale LMP plus cycle lengths outside 21–40 days.


## 2026-02-18 (Ovulation-to-due-date calculator state handoff)

- Updated `src/pages/OvulationCalculator.tsx` to add a CTA button after ovulation results that navigates to `/pregnancy-due-date-calculator` with route state (`mode: conception`, `conceptionDate`, `autoCalculate`, and `sourceContext`).
- Updated `src/pages/Calculator.tsx` to read `useLocation().state` and forward typed navigation state into `CalculatorCard`.
- Updated `src/components/CalculatorCard.tsx` to hydrate from conception-state once (idempotent), auto-calculate when requested, and show a contextual “Based on ovulation date …” banner with a link back to `/ovulation-calculator`.





## 2026-02-18 (Tool registry + footer link alignment for ovulation calculator)

- Updated `src/data/tools.ts` so the ovulation tool uses `id: "ovulation-calculator"` and refreshed the card copy to: "Find your fertile window and peak conception days with an interactive calendar.".
- Updated `src/components/Footer.tsx` Resources links to include `/ovulation-calculator` between the due date and weight gain calculator links.
- Confirmed `src/pages/SimilarTools.tsx` auto-renders the updated ovulation card because it maps directly over the `tools` array from `src/data/tools.ts`.

## 2026-02-18 (New ovulation calculator tool page + route)

- Added `src/pages/OvulationCalculator.tsx` with full tool-page layout, including SEO metadata, canonical path, JSON-LD (`WebApplication` + `FAQPage`), and a header `SimilarToolsButton`.
- Implemented LMP date input and cycle-length presets (28/30/32) plus custom cycle input with blur/submit inline validation behavior.
- Added accessible result rendering with `aria-live="polite"`, fertile window details, educational guidance, medical disclaimer text, and a privacy banner.
- Updated `src/App.tsx` to register the new `/ovulation-calculator` route.
- Updated `README.md` feature list and route list to include the ovulation calculator page.


## 2026-02-18 (Ovulation calculation utility module)

- Added `src/lib/ovulationCalc.ts` with typed ovulation outputs (`OvulationResult`), month-grid day modeling (`CalendarDay`), and user-facing validation output (`ValidationResult`).
- Implemented normalized-date ovulation math for ovulation estimate, fertile window, peak fertility range, and next period estimate via `calculateOvulation(...)`.
- Added `getFertilityProbability(...)` using Wilcox-style day-to-ovulation probabilities with linear interpolation for fractional day values and a safe zero fallback outside the fertile interval.
- Added `generateCalendarMonth(...)` to produce a full Sunday-through-Saturday calendar grid including cycle day, phase label, fertile/peak flags, and daily fertility probability values.
- Added `getPhaseLabel(...)` and `validateOvulationInputs(...)` enforcing no-future LMP, 12-month recency, and cycle-length bounds of 21–40 days.

## 2026-02-16 (Pregnancy weight gain calculator QA docs + numeric test coverage)

- Added shared calculator logic in `src/lib/pregnancyWeightGain.ts` for BMI band selection, total gain ranges, week-based gain targets, and gain-so-far outputs.
- Updated `src/pages/PregnancyWeightGainCalculator.tsx` to reuse the shared helper so UI output and test expectations stay aligned.
- Added `tests/pregnancyWeightGain.test.ts` with at least three concrete numeric scenarios validating BMI, BMI category, total gain range, and gain-so-far values.
- Appended rollback + local test guidance to `README_UI_UPDATE.md`, including touched files and quick route/page/sitemap revert steps.


## 2026-02-16 (Static pregnancy weight gain content expansion + FAQ schema sync)

- Expanded `public/pregnancy-weight-gain-calculator/index.html` with 600–800 words of plain-English educational content, including a 40–60 word intro caveat, an extended "How it works" section, and clearer counseling context.
- Kept a compact recommended-ranges table for singleton pregnancies with category rows for underweight, normal weight, overweight, and obese BMI groups plus total gain ranges in kilograms.
- Added a related-tools section with direct links to `/pregnancy-due-date-calculator`, `/blog`, and `/about`.
- Added five visible FAQ items below the main content and updated the inline `FAQPage` JSON-LD so each `mainEntity` question/answer exactly mirrors visible FAQ text.
- Verified consistency so FAQ numeric gain values match the visible ranges table (normal: 11.5–16 kg, overweight: 7–11.5 kg, obesity: 5–9 kg).


## 2026-02-16 (React pregnancy weight gain calculator accessibility + guidance)

- Added `src/pages/PregnancyWeightGainCalculator.tsx` with native labeled form controls for pre-pregnancy weight, height, trimester, optional week, and optional current weight.
- Implemented accessibility wiring for helper text + inline validation (`aria-describedby`, `aria-invalid`, and `role="alert"` for field errors).
- Added live-updating result output using `role="status"` + `aria-live="polite"` to announce BMI, BMI category, IOM total gain range, and week-specific gain recommendations.
- Added optional gain-so-far output when current weight is entered and included a clear clinical caveat to contact a practitioner for personalized care.
- Wired a new React route in `src/App.tsx` for `/pregnancy-weight-gain-calculator` and added helper-text styling in `src/styles/global.css`.
- Updated `README.md` feature and route documentation to reflect the live pregnancy weight gain calculator page.

## 2026-02-13

- Added guidance for handling the Codex limitation: when a pull request has been modified outside Codex, create a brand-new PR from the latest branch head instead of trying to update the original PR.
- Confirmed this repository contains no unresolved git conflict markers.
- Fixed malformed `package.json` that was breaking Cloudflare/npm installs (`EJSONPARSE`) by removing duplicated keys and restoring valid JSON structure for scripts and dependencies.
- Repaired broken TypeScript/TSX files (`src/App.tsx`, `src/components/BlogList.tsx`, `src/components/BlogPost.tsx`, `tsconfig.json`) that had duplicated merge content causing Cloudflare `npm run build` compiler errors.
- Made `scripts/check-conflicts.sh` Cloudflare-compatible by falling back to `grep` when `rg` is unavailable.

### Vibe-coder friendly steps to create a new PR safely

1. Commit all current local changes.
2. Push your working branch to GitHub.
3. Open GitHub and click **Compare & pull request** for that branch.
4. Use a fresh PR title/description (do not reopen the old locked PR flow).
5. Verify the PR diff has no conflict symbols and `package.json` is valid JSON.
6. Merge only after Cloudflare build passes.

## 2026-02-14

- Verified codebase is clean of git conflict markers using the repository conflict check script.
- Added explicit GitHub conflict-resolution steps for PR UI so merge-marker text is not committed by mistake.

## 2026-02-13 (Calculator page refactor)

- Added a dedicated `CalculatorPage` at `src/pages/Calculator.tsx` and moved calculator-page content/SEO/FAQ composition out of `App.tsx`.
- Added new UI components: `CalculatorCard`, `CalculatorSteps`, `ResultCard`, `ProgressWheel`, `PregnancyTimeline`, `InfoGrid`, and `FAQAccordion`.
- Updated routing so `/pregnancy-due-date-calculator` (and `/`) render the new calculator page while keeping the existing header/footer links unchanged.
- Kept calculation logic sourced from `src/lib/calc.ts` by consuming existing utility imports from UI components.
- Added supporting styles for the new calculator layout sections (progress wheel, timeline card, info grid, FAQ accordion).


## 2026-02-13 (Calculator accessibility step flow)

- Rebuilt `CalculatorSteps` to accept a `currentStep` prop and expose accessible progress semantics via `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- Refactored `CalculatorCard` into a 3-step LMP flow (date, cycle length with presets, review/calculate) using semantic `<form>`, `<fieldset>`, `<legend>`, and explicit `<label htmlFor>` wiring.
- Added inline validation alerts for required LMP date and cycle-length bounds (21–40) while keeping due-date computation on the existing `lmpToDueDate` and gestational helper path.
- Moved step rendering inside `CalculatorCard` and removed the standalone page-level `CalculatorSteps` usage so step state is always synchronized with the active calculator form.


## 2026-02-13 (Result experience enhancements)

- Rebuilt `src/components/ResultCard.tsx` to accept explicit due-date detail props (`dueDate`, gestational weeks/days, trimester, optional conception date) and render a stronger due-date-focused summary layout.
- Updated `src/components/ProgressWheel.tsx` to a reusable SVG-free circular progress API based on `value` in the `0..1` range with an accessible `aria-label` percentage.
- Added milestone messaging (including the anatomy scan around week 20), share action with Web Share API + clipboard fallback, print action, and subtle reveal transition animation for result presentation.
- Moved medical disclaimer text below the result card while keeping privacy/disclaimer messaging visible in the results flow.
- Updated calculator wiring/styles so gestational metadata feeds the new result card shape and responsive layout remains stable.


## 2026-02-13 (Timeline + info content refresh)

- Rebuilt `PregnancyTimeline` with trimester bands for weeks 1-13, 14-27, and 28-40, including a calculated current-week marker and a stacked mobile fallback view.
- Reworked `InfoGrid` into four educational cards with icon-led headers and short explainers for calculator method, gestational age, cycle-length impact, and post-result next steps.
- Added `Read more` links on each info card that route to existing `/about` or `/blog` pages.
- Extended global styles with timeline band/marker styles and responsive info card styling for the new components.

## 2026-02-13 (FAQ accordion accessibility + schema injection)

- Rebuilt `FAQAccordion` to a controlled React accordion with one expanded item at a time and keyboard support for Arrow Up/Down navigation and Enter/Space toggling.
- Added proper ARIA wiring for FAQ triggers and panels (`aria-expanded`, `aria-controls`, panel `id`, and `aria-labelledby`).
- Added and exported `getFAQJsonLD(faqs)` from `FAQAccordion` to generate stringified FAQPage JSON-LD from the same Q/A source of truth.
- Updated calculator page SEO behavior to safely inject FAQ JSON-LD via a dedicated `faq-jsonld-root` script tag in `Calculator.tsx` while preserving existing `SEOHead` metadata.
- Updated FAQ styles in `global.css` to support the new button/panel accordion structure.

## 2026-02-13 (Date helper module + calculator metadata/test updates)

- Added `src/lib/dateHelpers.ts` with UI-facing helper functions (`formatDateToReadable`, `weeksAndDaysFromLMP`, `dueDateFromLMP`, `formatWeeksAndDays`) that delegate core pregnancy math to `src/lib/calc.ts`.
- Updated calculator and results wiring to use the new helper layer without changing core math logic.
- Updated calculator page metadata description copy while keeping title as `Pregnancy Due Date Calculator — SageNest`.
- Added Vitest coverage for `formatWeeksAndDays()` normalization behavior and `ProgressWheel` percentage/circumference mapping helpers.
- Added `README_UI_UPDATE.md` with a calculator component map, local test checklist, and manual QA steps.
- Updated `README.md` calculator feature bullets to match the current LMP-first UI flow and current test coverage.

## 2026-02-14 (Markdown sanitization hardening)

- Hardened `markdownToHtml` to sanitize raw HTML input by stripping `<script>/<style>` tags, removing inline event-handler attributes, escaping user text, and blocking unsafe URL protocols such as `javascript:`/`data:`/`vbscript:`.
- Kept markdown support for headings, bold text, links, paragraphs, and list rendering while routing all blog post HTML through sanitized conversion output.
- Updated `BlogPost` to compute sanitized HTML via `markdownToHtml` before passing it to `dangerouslySetInnerHTML`.
- Added focused Vitest coverage for malicious markdown payloads and safe markdown rendering, including fallback post content and Supabase-like content samples.

## 2026-02-14 (BlogPoster admin guard parity)

- Added `assertAdminUser` in `src/pages/BlogPoster.tsx` to validate Supabase `auth.getUser()` against `ADMIN_EMAIL` before admin blog operations.
- Added `runAdminGuardedAction` helper and applied it at the start of `loadPosts`, `onUpload`, `savePost`, and `deletePost` so unauthorized attempts stop immediately and surface clear messages via `setMessage(...)`.
- Added unit tests in `tests/blogPosterAuth.test.ts` to cover helper authorization logic and an unauthorized action-abort path.

## 2026-02-14 (Git ignore secret patterns hardening)

- Updated the repository root `.gitignore` to keep existing frontend build/test ignores (`node_modules`, `dist`, `.vite`, `coverage`) and add required secret-safe entries from `SECURITY.md`: `.env`, `.env.local`, `.env.*.local`, `*.key`, `*.pem`, and `secrets/`.
- Ran tracked-file checks to verify no files matching secret patterns are currently committed.

## 2026-02-14 (BlogPoster upload validation hardening)

- Added MIME allowlist validation in `src/pages/BlogPoster.tsx` for image uploads (`image/jpeg`, `image/png`, `image/webp`) with clear user-facing rejection messaging.
- Added max image size enforcement (2MB) before Supabase Storage upload and abort behavior for invalid files.
- Updated upload filename extension generation to use a trusted MIME-to-extension mapping rather than raw filename extension parsing.
- Added `tests/blogPosterUploadValidation.test.ts` coverage for allowed uploads, disallowed MIME rejection, and oversized file rejection.

## 2026-02-16 (Static pre-rendered pregnancy weight gain route)

- Added a fully pre-rendered HTML page at `public/pregnancy-weight-gain-calculator/index.html` so `/pregnancy-weight-gain-calculator` serves crawlable content without JavaScript.
- Included required SEO tags in initial HTML (`<title>`, 150–160 char description meta, canonical URL) and visible on-page content sections (H1, intro, explainer, ranges table, FAQ).
- Embedded FAQ JSON-LD directly in the static HTML with question/answer text matching the visible FAQ copy exactly.
- Added optional client-side enhancement JavaScript for interactive weight-gain estimates while preserving meaningful no-JS content.
- Updated `public/_redirects` to map `/pregnancy-weight-gain-calculator` directly to the static HTML before SPA fallback.
- Added the new calculator URL to `public/sitemap.xml`.

## 2026-02-16 (Internal linking update for pregnancy calculators)

- Added contextual educational copy on the due-date calculator page that links directly to `/pregnancy-weight-gain-calculator` from main content (not nav/footer).
- Expanded footer resource links with descriptive anchor text and added a direct inbound link to `/pregnancy-weight-gain-calculator`.
- Added a new "Related tools" section on the static pregnancy weight gain calculator page linking to `/pregnancy-due-date-calculator` and `/about`.
- Kept all new links as standard React `Link` or HTML `<a>` elements with clear, descriptive anchor text.

## 2026-02-16 (Similar tools hub + due date hero removal)

- Added a new single-source tool registry in `src/data/tools.ts` for all calculator metadata (id, slug, title, description, route path).
- Added a new `/similar-tools` route and `src/pages/SimilarTools.tsx` that renders a semantic, accessible tools list from `tools.ts`, including an empty-state fallback message.
- Replaced header nav pill label/link from `Calculator` to `Similar tools`, preserving the existing pill visual style and active-page state.
- Added reusable `src/components/SimilarToolsButton.tsx` and integrated it into both tool pages for quick cross-navigation.
- Removed the large center hero block from the due date calculator page and replaced it with a compact tool header so the calculator UI appears earlier.
- Added minimal shared styles for tool headers, tool cards/grid, muted text utility, and consistent keyboard focus visibility.

## 2026-02-18 (Ovulation visuals: fertility calendar + probability chart)

- Added `src/components/FertilityCalendar.tsx` with month navigation, weekday/day grid rendering from `generateCalendarMonth(...)`, keyboard arrow-key navigation, focus management, and day-level descriptive `aria-label` output.
- Implemented phase and status class hooks for cycle context (`phase-menstrual`, `phase-fertile`, `phase-peak`, `phase-ovulation`) plus non-color indicators and a legend for accessibility clarity.
- Added `src/components/FertilityChart.tsx` to render an accessible SVG fertility-probability line chart by cycle day, including selected-day and ovulation markers plus explanatory captioning.
- Updated `src/pages/OvulationCalculator.tsx` to wire both components into the submitted-results view, keep selected day state, and map selected date to cycle-day chart highlighting.
- Added shared fertility-visual styles in `src/styles/global.css` for layout, chart, and calendar phase styling.


## 2026-02-18 (BlogPoster guarded action single try/catch hardening)

- Refactored `runAdminGuardedAction` in `src/pages/BlogPoster.tsx` so both `assertAdminUser()` and the supplied `action()` run inside one `try` block and return `true` only on full success.
- Added safe catch-path handling that preserves the explicit unauthorized message but maps all other failures to a generic user-facing message (`Something went wrong. Please try again.`) before returning `false`.
- Expanded `tests/blogPosterAuth.test.ts` coverage to verify unauthorized failures, action-thrown failures with graceful messaging, and successful guarded execution returning `true`.

## 2026-02-19 (Website tagline refresh)

- Updated the global website tagline text to `SageNest Health – Smart Tools for Women’s Wellness` in the shared footer brand description.
- Updated base `index.html` metadata so default page title and meta description use the new site-wide tagline before React hydration.
- Updated the README opening product description to align with the new website-wide tagline positioning.

## 2026-02-19 (Tagline applied to dynamic page titles)

- Updated `SEOHead` to apply the site-wide tagline (`SageNest Health – Smart Tools for Women’s Wellness`) to runtime page titles so browser tabs on all routed pages consistently show the new branding.
- Simplified per-page SEO title props (calculator, ovulation, weight gain, blog list/post, privacy, about, similar tools) to page-specific labels, relying on the shared tagline suffix for consistency.
- Updated calculator JSON-LD `WebPage` name string to remove the old `— SageNest` suffix and align with the new global title pattern.


## 2026-02-19 (Removed duplicate in-page Similar tools pills on tool pages)

- Removed the extra in-page `Similar tools` pill from the ovulation and pregnancy weight gain tool hero sections so only the global header nav pill remains.
- Removed the unused `src/components/SimilarToolsButton.tsx` component to prevent accidental reuse that caused duplicate pills.
- Updated `newtool.md` so future tool creation instructions explicitly forbid adding a second in-page Similar tools pill and keep a single global nav link.

## 2026-02-20 (Sitemap Fix 2 aligned to canonical pages.dev domain)

- Replaced `public/sitemap.xml` with the exact Fix 2 XML from `sagenest-seo-codex-prompt.md`.
- Ensured every `<loc>` uses `https://sagenest.pages.dev`.
- Added `/ovulation-calculator` and included all specified `<lastmod>` and `<priority>` values.
- Kept XML header and sitemap `<urlset>` namespace intact for valid sitemap parsing.

## 2026-02-22 (Similar tools: add Pregnancy Week by Week)

- Added the `Pregnancy Week by Week` entry to `src/data/tools.ts` so it appears in `/similar-tools` with the same card structure as existing tools.
- Linked the new card to `/pregnancy-week-by-week` and added concise discovery-focused copy for consistency with other tool cards.

## 2026-02-23 (Global cream token adjustment)

- Updated the global CSS root token `--cream` in `src/styles/global.css` from `#FAF9F6` to `#F3EFE0` as part of the frontend token refresh request.

## 2026-02-26 (Sitemap fetch reliability: removed self-rewrite rules)

- Removed the self-rewrite lines for `/sitemap.xml` and `/robots.txt` from `public/_redirects`.
- Kept all existing route rewrites intact, including blog/static page rewrites and SPA fallback.
- This avoids ambiguous edge behavior from rewriting a URL to itself with `200`, which can cause crawler fetch/read failures in some hosting redirect engines.

## 2026-03-01 (App-level 404 route with noindex metadata)

- Added `src/pages/NotFound.tsx` as a dedicated not-found page with clear messaging and links to `/pregnancy-due-date-calculator`, `/blog`, and `/similar-tools`.
- Registered a terminal catch-all route (`<Route path="*" ... />`) in `src/App.tsx` so unknown URLs render app-level 404 content.
- Extended `src/components/SEOHead.tsx` with optional `noIndex` support and robots meta output (`noindex,follow` when enabled).
- Kept Cloudflare SPA fallback behavior unchanged (`/* /index.html 200`) and documented that unknown routes are now handled inside React.

## 2026-03-01 (Canonical consolidation for due date calculator)

- Selected `/pregnancy-due-date-calculator` as the canonical URL for the due date tool and added a permanent redirect from `/` to that path in `public/_redirects` before the SPA catch-all rule.
- Kept `src/pages/Calculator.tsx` canonical metadata aligned to `/pregnancy-due-date-calculator` (already correct, no code-path change needed).
- Removed the duplicate root URL (`https://sagenest.pages.dev/`) from `public/sitemap.xml` so only the canonical due date calculator variant is listed.

## 2026-03-01 (Cloudflare redirect-loop hotfix)

- Fixed `ERR_TOO_MANY_REDIRECTS` by cleaning `public/_redirects` rules that were forcing trailing-slash redirects on directory-backed routes (for example `/pregnancy-due-date-calculator/ -> /pregnancy-due-date-calculator`), which can loop on Cloudflare Pages when static folder/index resolution adds slash normalization.
- Removed the broad `/pregnancy-week-by-week/* -> /pregnancy-week-by-week 301` rule so week detail URLs (`/pregnancy-week-by-week/week-1` ... `/week-40`) are no longer redirected away from their intended pages.
- Kept legacy 301 mappings from older URLs to their current canonical slugs and retained SPA/static 200 rewrite behavior for current production routes.
