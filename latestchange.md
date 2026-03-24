## 2026-03-24 (Aligned caffeine blog metadata with provided image prompt)

- Confirmed the requested blog slug `caffeine-200mg-limit-pregnancy-what-counts` is present at the top of `src/data/blogPosts.ts`, then added `imagePrompt` support to the `BlogPost` interface and attached the provided prompt text to that blog object.
- Re-ran the full blog publish pipeline and validations (`generate:blog`, `generate:redirects`, `generate:sitemap`, `check:blog-sync`, `check:redirects`, `check:sitemap`) to ensure generated artifacts remain synchronized and checks pass.
- Why: the post content was already published, so this update ensures the remaining user-provided metadata is preserved in the canonical blog source without altering unrelated posts.

## 2026-03-24 (Added new blog post: caffeine-200mg-limit-pregnancy-what-counts)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` for slug `caffeine-200mg-limit-pregnancy-what-counts`, including the provided title, description, reading time, FAQ entries, default image, and full long-form content, plus the required `lastReviewed` and `updatedAt` metadata used by the existing blog schema.
- Regenerated the derived publish/index artifacts so the new article is live and consistent across static outputs: `public/blog-static/caffeine-200mg-limit-pregnancy-what-counts.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested caffeine-in-pregnancy educational article while keeping SageNest's canonical blog source, generated blog output, redirects, and sitemap synchronized.

## 2026-03-23 (Added new blog post: fish-pregnancy-what-to-eat-avoid-mercury)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` for slug `fish-pregnancy-what-to-eat-avoid-mercury`, including the provided title, description, reading time, FAQ entries, default image, full long-form content, and the required `lastReviewed` / `updatedAt` metadata used by the existing blog schema.
- Regenerated the derived publish/index artifacts so the new article is live and consistent across static outputs: `public/blog-static/fish-pregnancy-what-to-eat-avoid-mercury.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested fish-in-pregnancy educational article while keeping SageNest's canonical blog source, static blog output, redirects, and sitemap synchronized.

## 2026-03-22 (Added new blog post: iodine-pregnancy-sea-salt-prenatal-gap)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` for slug `iodine-pregnancy-sea-salt-prenatal-gap`, including the provided title, description, reading time, FAQ entries, default image, and full long-form content, plus the required `lastReviewed` and `updatedAt` metadata used by the existing blog schema.
- Regenerated the derived publish/index artifacts so the new article is live and consistent across static outputs: `public/blog-static/iodine-pregnancy-sea-salt-prenatal-gap.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested iodine-in-pregnancy educational article while keeping SageNest's canonical blog source, generated blog output, redirects, and sitemap synchronized.

## 2026-03-21 (Added new blog post: choline-pregnancy-prenatal-vitamins-miss)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` for slug `choline-pregnancy-prenatal-vitamins-miss`, including the provided title, description, reading time, FAQ entries, default image, and full long-form content, plus the required `lastReviewed` and `updatedAt` metadata used by the existing blog schema.
- Regenerated the derived publish/index artifacts so the new article is live and consistent across static outputs: `public/blog-static/choline-pregnancy-prenatal-vitamins-miss.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested choline-in-pregnancy educational article while keeping SageNest's canonical blog source, generated blog output, redirects, and sitemap synchronized.

## 2026-03-21 (Expanded colostrum harvesting calculator guide content)

- Updated `src/pages/ColostrumHarvestingCalculator.tsx` SEO metadata, hero copy, FAQ content, structured data, and the entire educational section with the requested expanded colostrum harvesting guidance while keeping all calculator logic, validation, result rendering, checklist logic, helper functions, and disclaimer/privacy/FAQ structure unchanged.
- Removed the old standalone source citation block because the new educational section now includes the requested in-section citation list.
- Why: align this calculator page with the new search-intent-focused educational brief while preserving the existing interactive calculator behavior exactly as-is.

## 2026-03-21 (Expanded pregnancy flight calculator airline coverage + educational copy)

- Updated `src/pages/PregnancyFlightCalculator.tsx` SEO metadata, hero copy, FAQ schema, FAQ content, airline reference data, airline summary messaging, airline table copy/columns/sources, and the full educational content section to match the new multi-region airline-policy requirements without changing the calculator logic, form behavior, validation, results rendering, or helper-function behavior.
- Added the requested `HowTo` JSON-LD entry and expanded the static airline policy table to cover US, UK, Australia, Canada, Europe, and Middle Eastern carriers.
- Why: improve search intent alignment and make the pregnancy flight tool more useful as a week-by-week airline policy checker while preserving the existing calculator behavior exactly as-is.

## 2026-03-21 (Refined morning sickness estimator SEO + education copy)

- Updated `src/pages/MorningSicknessEstimator.tsx` SEO metadata, hero copy, structured data, and the full educational content section to match the new ACOG-aligned messaging and internal-link requirements without changing calculator logic, FAQ items, or milestone calculations.
- Removed the old internal blog-link paragraph from the educational section and replaced it with the requested calculator + week-by-week internal links.
- Why: improve search intent alignment and on-page educational depth for the morning sickness estimator while preserving the existing interactive behavior exactly as-is.

## 2026-03-21 (Refined copy in morning-sickness-remedies-that-actually-work)

- Updated the `morning-sickness-remedies-that-actually-work` post text in `src/data/blogPosts.ts` to soften the prevalence phrasing, remove the specific second-trimester percentage claim, align the ginger dosing wording with the requested ACOG reference, and replace the prescription-medication paragraph with more provider-directed language.
- Replaced the old article-ending block with the requested primary-sources section followed by the informational disclaimer, then regenerated the matching static blog HTML for this slug so published content stays synchronized with the source data.
- Why: reflect the requested evidence-language and sourcing adjustments for this existing morning sickness article without changing unrelated blog content.

## 2026-03-20 (Added new blog post: iron-supplements-pregnancy-side-effects)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` for slug `iron-supplements-pregnancy-side-effects`, including the provided title, description, reading time, FAQ entries, default image, full long-form content, and the required `lastReviewed` / `updatedAt` metadata used by the existing blog schema.
- Regenerated the derived publish/index artifacts so the new article is live and consistent across static outputs: `public/blog-static/iron-supplements-pregnancy-side-effects.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested iron supplement side-effects pregnancy article while keeping SageNest's canonical blog source, static blog output, redirects, and sitemap synchronized.

## 2026-03-19 (Added new blog post: pcos-ovulation-tracking-irregular-cycles)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` for slug `pcos-ovulation-tracking-irregular-cycles`, including the provided title, description, reading time, FAQ entries, default image, and full long-form content, plus the required `lastReviewed` and `updatedAt` metadata used by the existing blog schema.
- Regenerated the derived publish/index artifacts so the new article is live and consistent across static outputs: `public/blog-static/pcos-ovulation-tracking-irregular-cycles.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested PCOS ovulation tracking article while keeping SageNest's generated blog, routing, and sitemap files synchronized with the canonical blog source data.


## 2026-03-18 (Pruned changelog history before 2026-03-05)

- Removed all `latestchange.md` entries dated before `2026-03-05` and kept the entries on or after that cutoff date.
- Why: keep the changelog focused on more recent work, exactly as requested, without changing the surviving post-`2026-03-05` history.


## 2026-03-18 (Refreshed blog: braxton-hicks-vs-real-contractions)

- Replaced the existing `braxton-hicks-vs-real-contractions` post object in `src/data/blogPosts.ts` with the newly provided evidence-based rewrite, including the updated description, expanded FAQ set, reviewed date, and full long-form content while preserving the same slug and schema.
- Regenerated the derived blog publishing/indexing artifacts so the refreshed article stays synchronized across `public/blog-static/braxton-hicks-vs-real-contractions.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the latest requested Braxton Hicks vs labor guide update and keep SageNest's generated static blog, redirect, and sitemap outputs aligned with the canonical blog source data.


## 2026-03-18 (Refreshed blog: healthy-pregnancy-weight-gain-complete-guide)

- Replaced the existing `healthy-pregnancy-weight-gain-complete-guide` post object in `src/data/blogPosts.ts` with the newly provided pregnancy weight gain guide rewrite, including the updated title, description, FAQ answers, reviewed date, and full long-form content while preserving the same slug and schema.
- Regenerated the derived blog publishing/indexing artifacts so the refreshed article stays synchronized across `public/blog-static/healthy-pregnancy-weight-gain-complete-guide.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the latest requested evidence-based pregnancy weight gain guide update and keep SageNest's generated static blog, redirect, and sitemap outputs aligned with the canonical blog source data.


## 2026-03-18 (Refreshed blog: ivf-due-date-guide)

- Replaced the existing `ivf-due-date-guide` post object in `src/data/blogPosts.ts` with the newly provided IVF transfer dating rewrite, including the updated description, FAQ answers, reviewed date, and full long-form content while preserving the same slug and schema.
- Regenerated the derived blog publishing/indexing artifacts so the refreshed article stays synchronized across `public/blog-static/ivf-due-date-guide.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the latest requested IVF due-date guide update and keep SageNest's generated static blog, redirect, and sitemap outputs aligned with the canonical blog source data.


## 2026-03-18 (Automated README worktree sync + refreshed repository tree)

- Updated the `## Exact Repository Worktree Structure` section in `README.md` so it now matches the current tracked worktree exactly, including recently added tracked files such as the anovulation static blog page and the pregnancy flight calculator source/test files.
- Added `scripts/sync-readme-worktree.mjs` to regenerate that README tree directly from `git ls-files`, so the documented repository structure stays aligned with the actual tracked worktree with one command.
- Added `scripts/setup-git-hooks.mjs`, `.githooks/pre-commit`, and matching `package.json` scripts so local installs automatically point Git at the repo hook folder and each commit re-syncs/stages `README.md` only when the tracked file tree changed.
- Why: the README tree kept drifting out of date, so this makes the update process repeatable and automatic for future file additions without changing README when no worktree change happened.


## 2026-03-18 (Added new blog post: anovulation-what-it-is-causes-treatment)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` for slug `anovulation-what-it-is-causes-treatment`, including the provided title, description, reading time, FAQ entries, default image, and full long-form content, plus the required `lastReviewed` and `updatedAt` metadata used by the existing blog schema.
- Regenerated the derived publish/index artifacts so the new article is live and consistent across static outputs: `public/blog-static/anovulation-what-it-is-causes-treatment.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested anovulation education article while keeping SageNest's generated blog, routing, and sitemap files synchronized with the canonical blog source data.


## 2026-03-17 (README worktree structure re-synced with latest tracked repository files)

- Refreshed the `## Exact Repository Worktree Structure` block in `README.md` using the current `git ls-files` output so it now reflects newly tracked files like `newtoolMAIN.md`, `tool-build-prompts.md`, `src/components/DisclaimerBox.tsx`, `src/lib/morningSicknessCalc.ts`, `src/pages/MorningSicknessEstimator.tsx`, and `public/blog-static/bbt-charting-ovulation.html`.
- Why: keep contributor-facing repository documentation accurate so onboarding and file discovery match the actual state of the codebase.


## 2026-03-17 (Added Colostrum Harvesting Start Date Calculator tool)

- Added a new pure calculation module at `src/lib/colostrumHarvestingCalc.ts` with due-date validation and date outputs for recommended start (36 weeks), earliest start (34 weeks), collection window end, and days-until-start messaging support.
- Added new page `src/pages/ColostrumHarvestingCalculator.tsx` with full calculator UI, prominent pre-results safety warning, SEO metadata/schema, FAQ section, storage guidance, required internal links, NHS source citations, privacy/disclaimer blocks, and the standardized `DisclaimerBox` at the very bottom.
- Registered the new tool in routing and discovery surfaces: updated `src/App.tsx` with import + route, updated `src/data/tools.ts` with the new tool entry, and added requested aliases + trailing-slash canonical redirect in `public/_redirects`.
- Why: launch the requested NHS-aligned antenatal colostrum start-date tool while keeping SageNest’s no-backend, browser-only calculator architecture and SEO conventions consistent.


## 2026-03-17 (Added reviewed-date metadata + reusable medical disclaimer component across core pages)

- Extended blog post schema in `src/data/blogPosts.ts` with optional `lastReviewed` and populated `lastReviewed: 'March 2026'` on every existing post object (placed directly after `readingTime`) so the reviewed date is consistently available in app and generated outputs.
- Updated `src/components/BlogPost.tsx` to include `lastReviewed?: string` in `PublicBlogPost`, render `· Last reviewed: ...` inline next to reading time, and add the new full-variant disclaimer box after the author card and before related-post/CTA flow.
- Updated static blog rendering in `scripts/generate-blog-html.mjs` and regenerated `public/blog-static/*.html` so direct static blog URLs now also show the same reviewed-date metadata string for crawler and no-JS paths.
- Added new shared component `src/components/DisclaimerBox.tsx` with `full` and `compact` variants, then integrated it into all requested pages (`About`, `EditorialTeamPage`, `Calculator`, `OvulationCalculator`, `PregnancyWeightGainCalculator`, `PregnancyWeekByWeekHub`, `PregnancyWeekDetail`, `Privacy`, and `BlogPost`).
- Added explicit `Last reviewed: March 2026` subtitle metadata line beneath page intro text on `About` and `EditorialTeamPage`.
- Removed/avoided duplicate page-level mini disclaimer paragraphs where the new standardized disclaimer box now serves as the canonical disclosure pattern.
- Why: unify trust/disclosure UX across pages, expose content review recency in both React and static blog routes, and keep SEO/crawler paths consistent with client-rendered experience.


## 2026-03-17 (Added new BBT charting ovulation blog post)

- Added a new blog entry with slug `bbt-charting-ovulation` at the top of `src/data/blogPosts.ts`, including full long-form content and FAQ metadata.
- Regenerated blog artifacts and SEO routing outputs via blog/sitemap/redirect scripts so the new post is published in static output and index files.
- Why: publish the requested educational fertility article and keep generated blog + routing artifacts synchronized with source content.


## 2026-03-16 (README worktree structure refreshed to match current tracked files)

- Updated the `## Exact Repository Worktree Structure` section in `README.md` to mirror the current `git ls-files` output so it now includes all tracked files/directories (including recently added assets and generated blog pages) and removes outdated omissions.
- Why: the previous tree snapshot was stale and could mislead contributors about what is actually in the repository right now.


## 2026-03-16 (Fix static blog pages still showing old leaf logo)

- Updated the static blog HTML generator in `scripts/generate-blog-html.mjs` so blog pages render the new `/sagenest-main-logo.png` in both places that were still hardcoded to the old leaf emoji: the top brand link and the author avatar card.
- Added matching generator CSS for `.brand-logo` and the avatar image so the new logo remains circular, aligned, and does not change existing layout behavior.
- Regenerated all static blog files in `public/blog-static/*.html` via `npm run generate:blog` so deployed blog-static pages now actually include the updated logo markup.
- Why: the React `BlogPost.tsx` was updated, but production blog routes are served from generated static HTML (`public/blog-static`), which still had old emoji hardcoded by the generator.


## 2026-03-16 (Blog author logo aligned with new SageNest brand logo)

- Updated the blog post author card icon in `src/components/BlogPost.tsx` to use the same `/sagenest-main-logo.png` image asset now used in the main header, replacing the old leaf emoji avatar.
- Kept the existing author card layout and interaction behavior unchanged while making the icon container circular with `overflow: hidden` so the image fits cleanly without shifting spacing.
- Why: the homepage already used the updated logo, but blog pages still showed the old leaf symbol; this makes branding consistent across the site without affecting blog loading, routing, or Supabase content fetch behavior.


## 2026-03-16 (Navbar brand logo update: use public image asset)

- Replaced the header brand icon emoji in `src/App.tsx` with an `<img>` pointing to `/sagenest-main-logo.png` from the public assets directory, while keeping the existing `.brand-icon` wrapper so layout/spacing behavior remains stable.
- Added `aria-hidden="true"` on the icon wrapper and used decorative-image semantics (`alt=""`) to avoid duplicate screen-reader announcement next to the visible `SageNest` text label.
- Why: apply the requested real brand logo in the navbar without changing routing, navigation behavior, or header structure.


## 2026-03-16 (New blog post: cervical-mucus-ovulation-guide)

- Added a new blog object for `cervical-mucus-ovulation-guide` at the top of `blogPosts` in `src/data/blogPosts.ts` with the provided title, description, reading time, FAQ, image, and long-form content (plus `updatedAt: '2026-03-16'` to satisfy the project blog schema).
- Regenerated blog publishing/indexing artifacts so source data and generated outputs stay aligned: `public/blog-static/cervical-mucus-ovulation-guide.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the newly requested cervical mucus + ovulation educational article and keep blog, redirects, and sitemap validations passing in CI/deploy workflows.


## 2026-03-16 (Refresh blog: pregnancy-nutrition-guide-what-to-eat-each-trimester)

- Replaced the existing `pregnancy-nutrition-guide-what-to-eat-each-trimester` post object in `src/data/blogPosts.ts` with the newly provided evidence-based rewrite (updated title, description, reading time, FAQ, and full content) while preserving the slug and blog schema.
- Updated `updatedAt` to `2026-03-16` so the refreshed post remains compliant with blog sync validation.
- Regenerated derived publishing/indexing artifacts: `public/blog-static/pregnancy-nutrition-guide-what-to-eat-each-trimester.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested refreshed version of this article and keep generated blog, redirect, and sitemap outputs in sync with source data.


## 2026-03-16 (Refreshed blog: pregnancy-weight-gain-myths-facts)

- Replaced the existing `pregnancy-weight-gain-myths-facts` post object in `src/data/blogPosts.ts` with the newly provided long-form, evidence-based rewrite (updated title/description/reading time/FAQ/content) while preserving the same slug and blog schema.
- Added `updatedAt: '2026-03-16'` to keep the refreshed post compliant with the repository's blog sync validation requirements.
- Regenerated derived publishing/indexing outputs so source and generated artifacts stay aligned: `public/blog-static/pregnancy-weight-gain-myths-facts.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested refreshed version of this article and ensure all generated blog, redirect, and sitemap artifacts remain valid and in sync.


## 2026-03-16 (Refreshed blog: healthy-pregnancy-weight-gain-complete-guide)

- Replaced the existing `healthy-pregnancy-weight-gain-complete-guide` post object in `src/data/blogPosts.ts` with the newly provided evidence-based rewrite, including updated title/description/reading time, expanded FAQ coverage, and full long-form content while preserving the same slug/schema.
- Regenerated blog publishing/indexing outputs so source and generated artifacts remain synchronized: `public/blog-static/healthy-pregnancy-weight-gain-complete-guide.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested refreshed version of this guide and keep SEO/routing artifacts aligned with canonical blog source data.


## 2026-03-16 (Refreshed blog: ivf-due-date-guide)

- Replaced the existing `ivf-due-date-guide` post object in `src/data/blogPosts.ts` with the newly provided long-form version, including updated title/description/reading time, expanded FAQ content, and a full educational rewrite while preserving the same slug and schema.
- Regenerated blog publishing and indexing artifacts for consistency with source data: `public/blog-static/ivf-due-date-guide.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the latest requested IVF due-date guide update and keep static SEO/routing outputs synchronized with the canonical blog data.


## 2026-03-16 (Refreshed blog: pregnancy-week-by-week-milestones)

- Replaced the existing `pregnancy-week-by-week-milestones` post object in `src/data/blogPosts.ts` with the new long-form version, including updated title/description/reading time, refreshed FAQ items, and expanded trimester-by-trimester guidance while keeping the same slug and schema.
- Regenerated blog publishing artifacts and indexing outputs so source and generated assets stay in sync: `public/blog-static/pregnancy-week-by-week-milestones.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the latest requested rewrite for this article and keep routing/SEO artifacts consistent with canonical blog data.


## 2026-03-16 (Fix blog refresh scope: restore pregnancy nutrition guide slug)

- Restored the existing `pregnancy-nutrition-guide-what-to-eat-each-trimester` post object in `src/data/blogPosts.ts`, which was unintentionally removed during the previous `gestational-diabetes-pregnancy-weight-gain` refresh.
- Regenerated blog artifacts and indexes so the restored post is back in static output and discovery files: `public/blog-static/pregnancy-nutrition-guide-what-to-eat-each-trimester.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: keep the change strictly scoped to the requested blog refresh and avoid unrelated content regressions.


## 2026-03-16 (Refreshed blog: gestational-diabetes-pregnancy-weight-gain)

- Replaced the existing `gestational-diabetes-pregnancy-weight-gain` post object in `src/data/blogPosts.ts` with the newly provided version, including updated description text, `updatedAt`, expanded FAQ entries, and revised long-form content while preserving the same slug and schema.
- Regenerated blog publishing artifacts and index files to keep source and static outputs aligned: `public/blog-static/gestational-diabetes-pregnancy-weight-gain.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the latest medically-focused rewrite for this article and ensure SEO/routing artifacts remain synchronized with the canonical blog data.


## 2026-03-15 (Refreshed blog: how-due-dates-are-calculated)

- Replaced the existing `how-due-dates-are-calculated` post object in `src/data/blogPosts.ts` with the updated title, description, reading time, FAQ set, and full long-form content provided for this refresh.
- Regenerated blog publishing artifacts and indexes so the updated article is reflected in static output and discovery files: `public/blog-static/how-due-dates-are-calculated.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: refresh this high-intent educational article with clearer clinical explanations and updated UX-facing copy while keeping blog/redirect/sitemap outputs synchronized for SEO and routing integrity.


## 2026-03-15 (Added pelvic girdle pain in pregnancy blog post)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` for slug `pelvic-girdle-pain-pregnancy`, including SEO metadata (`title`, `description`, `readingTime`, `updatedAt`), `imageUrl`, five FAQ entries, and full long-form markdown content exactly as provided.
- Regenerated static blog publishing artifacts so the new post is fully published: `public/blog-static/pelvic-girdle-pain-pregnancy.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the newly requested pelvic girdle pain educational article and keep blog indexing, redirects, and sitemap fully in sync with the source-of-truth blog data.


## 2026-03-15 (Security hardening pass: XSS, CSP, headers, eval removal, admin gating safety)

- Hardened `scripts/generate-blog-html.mjs` against injection by adding `safeJsonStringify()` for JSON-LD script blocks, introducing `fullHtmlEscape()` for title/description meta values, escaping `<title>`, tightening image credential format validation, and sanitizing Pollinations retry error text to avoid leaking sensitive response details in logs.
- Replaced dynamic `new Function()` execution in `scripts/sitemap-utils.mjs` with TypeScript transpile + `data:` module import loading for `src/data/tools.ts`, and updated sitemap entry generation to await async tool loading.
- Improved client-side admin exposure posture by documenting allowlist risk, adding hash-based `isAdminEmailAsync()` helper in `src/supabase/client.ts`, and adding hash migration guidance in `.env.example` while keeping deprecated plaintext env examples commented for backward compatibility.
- Tightened browser security policy by externalizing GA inline bootstrap to new `public/gtag.js`, removing `unsafe-inline` from `script-src`, adding `crossorigin="anonymous"` to Google Fonts stylesheet request, and adding missing hardened headers (`COOP`, `CORP`, `X-Permitted-Cross-Domain-Policies`, `Origin-Agent-Cluster`) plus HSTS preload in `public/_headers`.
- Replaced destructive `window.confirm()` delete flow in `src/pages/BlogPoster.tsx` with a two-step in-UI confirm state, and disabled autocomplete for admin blog editor title/slug/description/content inputs.
- Why this changed: these updates close concrete XSS/code-injection/log-secrecy risks, reduce client-side admin identity disclosure, and enforce stricter browser/network security controls without removing or changing existing product features.


## 2026-03-15 (Reintroduced automated unique blog image pipeline with Cloudinary + Pollinations)

- Updated `scripts/generate-blog-html.mjs` to run a pre-render image pipeline per blog slug: keyword-to-prompt mapping, Cloudinary existence check, Pollinations generation (`flux`, `1200x630`, random seed, enhance + negative prompt), Cloudinary upload stream, and resolved Cloudinary URL injection into generated static HTML.
- Added resilient pipeline behavior: skip generation when Cloudinary already has the slug image, handle Pollinations 402 credit exhaustion without crashing, retry other Pollinations failures once after 3 seconds, continue on upload failures, enforce 2-second spacing between Pollinations calls, and print an end-of-run warning summary.
- Added `cloudinary` dependency in `package.json`/`package-lock.json` for official upload SDK support.
- Updated README blog indexing/publishing guidance to document that `generate:blog` now auto-resolves unique Cloudinary blog images and which environment variables are required for this automation.
- Why: Google Discover eligibility depends on unique, relevant images per article; this restores fully automated per-slug image generation/upload in the existing static blog build pipeline while staying idempotent for already-uploaded assets.


## 2026-03-15 (Rollback completed: static blog generation only, no auto image pipeline)

- Removed the remaining automation hook from `scripts/generate-blog-html.mjs` by deleting `.env` auto-loading import, so blog generation now depends only on static post data and template rendering.
- Removed `dotenv` from `package.json` dependencies and regenerated `package-lock.json` to keep install/build state deterministic.
- Why: fully finalize the rollback to a stable static-only blog generation path and eliminate Cloudinary/Pollinations-era dependency/config drift that could reintroduce CI/Cloudflare deploy fragility.


## 2026-03-13 (Removed Cloudinary/Pollinations blog image automation stack)

- Reverted `scripts/generate-blog-html.mjs` to the pre-image-automation behavior so blog static generation no longer performs Cloudinary checks, Pollinations generation, `.env` loading, or upload logic.
- Removed `cloudinary` from `package.json` dependencies and deleted `package-lock.json` that was introduced alongside the image automation setup.
- Kept existing static HTML generation flow unchanged for content rendering (it now uses `imageUrl` directly from blog data as before).
- Why: requested full rollback of the image-generation integration to eliminate related deployment complexity and return to a stable baseline pipeline.


## 2026-03-13 (Deploy hotfix: removed existsSync dependency from .env loader)

- Updated `scripts/generate-blog-html.mjs` `loadDotEnvFile()` to read `.env` using a guarded `readFileSync` try/catch instead of relying on `existsSync`.
- Removed `existsSync` from the Node fs import list so the loader cannot crash with `ReferenceError: existsSync is not defined` if import lines are partially altered in future merges.
- Why: Cloudflare preview builds were failing in `prebuild -> generate:blog` with an `existsSync` reference error; this makes env loading more robust while preserving all image pipeline behavior.


## 2026-03-13 (Permanent deploy fix: generator no longer hard-crashes if cloudinary package is missing)

- Refactored `scripts/generate-blog-html.mjs` to load Cloudinary lazily via dynamic import (`loadCloudinaryClient`) instead of top-level static import.
- Added a safe fallback path: if Cloudinary cannot be resolved in a build environment, the script logs a warning and continues static HTML generation with existing `imageUrl` values (no pipeline crash).
- Kept all existing image-generation logic intact when Cloudinary is available; only module-loading behavior was hardened.
- Why: Cloudflare/CI deploys were failing during `prebuild` with `ERR_MODULE_NOT_FOUND: Cannot find package 'cloudinary'`; this makes the blog generator resilient and prevents whole-build failures.


## 2026-03-13 (Stabilized blog image pipeline after merge regressions)

- Updated `scripts/generate-blog-html.mjs` to auto-load `.env` values before reading image-pipeline credentials, so local and CI runs can reliably pick up `POLLINATIONS_API_KEY` and Cloudinary keys without manual shell exports.
- Hardened prompt keyword extraction fallback so empty/stop-word-only titles still produce a valid prompt subject (`maternal wellness`) instead of an empty segment.
- Improved Cloudinary upload handling to treat race-condition "already exists" conflicts as success and continue using the deterministic Cloudinary URL.
- Why: post-merge edits had destabilized the generation path; these fixes restore seamless, idempotent image + static HTML generation behavior.


## 2026-03-13 (Automated unique Cloudinary blog images in generate-blog-html pipeline)

- Updated `scripts/generate-blog-html.mjs` to add an image pipeline before static HTML rendering: derive a prompt from each post title, check Cloudinary Admin API for existing `sagenest-blog/<slug>` assets, generate missing images via Pollinations (`model=flux`, `1200x630`, random seed), upload via Cloudinary upload stream, and inject the resolved Cloudinary URL into generated blog HTML without writing back to `src/data/blogPosts.ts`.
- Added non-blocking resilience behavior in the same script: handles Pollinations `402` credit exhaustion, retries one time after 3 seconds for other Pollinations failures, enforces a 2-second delay between Pollinations generation calls, continues on per-post failures, and prints an end-of-run error summary.
- Added `cloudinary` as the only new runtime dependency in `package.json` (and generated `package-lock.json`).
- Why: make each blog post eligible for Google Discover image requirements with a deterministic, automated, and idempotent generation/upload pipeline that does not break existing static blog publishing.


## 2026-03-13 (Added blog: Shortness of Breath in Pregnancy: Normal Causes vs Warning Signs)

- Added a new blog post object at the top of `src/data/blogPosts.ts` with slug `shortness-of-breath-pregnancy`, including full long-form content, FAQ, metadata, and default image URL.
- Regenerated blog publish artifacts so the new post is live in static outputs and indexing files: `public/blog-static/shortness-of-breath-pregnancy.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested pregnancy breathlessness educational article and keep static blog pages, redirects, and sitemap fully in sync for SEO/discoverability.


## 2026-03-13 (README worktree structure resynced to current tracked files)

- Updated the `## Exact Repository Worktree Structure` section in `README.md` to match the current `git ls-files` output exactly.
- Added missing tracked paths in the documented tree, including `public/images/blog/sagenest-blog-default.jpg`, `public/blog-static/pregnancy-insomnia-causes-safe-relief.html`, and `src/pages/EditorialTeamPage.tsx`.
- Why: the previously documented tree had drifted from the actual repository state, which can confuse contributors during navigation and onboarding.


## 2026-03-13 (Added blog: Pregnancy Insomnia: Why Sleep Gets Harder and What Actually Helps)

- Added a new blog post object at the top of `src/data/blogPosts.ts` with slug `pregnancy-insomnia-causes-safe-relief`, including full long-form content, FAQ, metadata, and default image URL.
- Regenerated blog publish artifacts so the new post is live in static outputs and indexing files: `public/blog-static/pregnancy-insomnia-causes-safe-relief.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: publish the requested pregnancy-insomnia educational article and keep static blog pages, redirects, and sitemap fully in sync for SEO/discoverability.


## 2026-03-12 (Static blog UI now renders hero image under reading time)

- Updated `scripts/generate-blog-html.mjs` so each generated static blog page now injects the post image block immediately after the reading-time line (the exact location highlighted in the report).
- Added `.post-image` styling in the static blog template CSS for consistent responsive rendering (full width, capped height, rounded corners, subtle border).
- Regenerated static blog outputs in `public/blog-static/*.html` via `npm run generate:blog` so every existing blog page now includes the image element in the published static HTML.
- Why: older blogs already had `imageUrl` in data, but the static blog template never rendered it in the article body, so users could not see any image under the reading-time section.


## 2026-03-12 (Added default blog image field to all posts + robots image preview header)

- Updated every existing blog object in `src/data/blogPosts.ts` by adding `imageUrl: '/images/blog/sagenest-blog-default.jpg'` so all posts have a consistent fallback/preview image field.
- Updated `public/_headers` by adding `X-Robots-Tag: max-image-preview:large` at the top of the global `/*` headers block.
- Why: this ensures consistent blog card/share imagery across all existing posts and allows large image previews in search/social crawlers for better CTR and visibility.


## 2026-03-12 (Updated README repository worktree structure)

- Updated the `## Exact Repository Worktree Structure` section in `README.md` so it now matches the repository’s current tracked tree exactly (including `public/blog-static`, newer script files, `design-tokens.css`, and `Blogpostsrule.md`).
- Why: the previous tree had stale paths and older filenames, which could mislead contributors during onboarding and maintenance.


## 2026-03-11 (Added luteal phase explained after ovulation blog post)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` with slug `luteal-phase-explained-after-ovulation`, including SEO metadata (`title`, `description`, `readingTime`, `updatedAt`), five FAQ entries, and the full long-form markdown content provided for publication.
- Regenerated blog publishing artifacts so this post is included in static and indexing outputs: `public/blog-static/luteal-phase-explained-after-ovulation.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: this publishes the requested luteal phase education guide while keeping newest content first in blog ordering and preserving static blog, redirect, and sitemap consistency checks.


## 2026-03-10 (Added irregular cycles ovulation conception blog post)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` with slug `irregular-cycles-ovulation-conception`, including SEO metadata (`title`, `description`, `readingTime`, `updatedAt`), five FAQ entries, and the full long-form markdown content provided for publication.
- Regenerated blog publishing artifacts so this post is included in static and indexing outputs: `public/blog-static/irregular-cycles-ovulation-conception.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: this publishes the newly requested irregular-cycle conception timing guide and keeps newest content first in feed/index ordering while maintaining static blog, redirect, and sitemap sync guarantees.


## 2026-03-09 (Added round ligament pain pregnancy blog post)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` with slug `round-ligament-pain-pregnancy`, including SEO metadata (`title`, `description`, `readingTime`, `updatedAt`), five FAQ entries, and the full long-form markdown content provided for publication.
- Regenerated blog publishing artifacts so this post is included in static and indexing outputs: `public/blog-static/round-ligament-pain-pregnancy.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: this publishes the newly requested round ligament pain education article and keeps newest content first in feed/index ordering while maintaining static blog, redirect, and sitemap sync guarantees.


## 2026-03-08 (Added pregnancy headaches causes safe relief red-flags blog post)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` with slug `pregnancy-headaches-causes-safe-relief-red-flags`, including SEO metadata (`title`, `description`, `readingTime`, `updatedAt`), five FAQ entries, and the full long-form markdown content provided for publication.
- Regenerated blog publishing artifacts so this post is included in static and indexing outputs: `public/blog-static/pregnancy-headaches-causes-safe-relief-red-flags.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: this publishes the newly requested pregnancy headache safety guide and keeps newest content first in feed/index ordering while maintaining static blog, redirect, and sitemap sync guarantees.


## 2026-03-07 (Added pregnancy swelling edema warning-sign blog post)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` with slug `pregnancy-swelling-edema-normal-vs-warning-sign`, including SEO metadata (`title`, `description`, `readingTime`, `updatedAt`), five FAQ entries, and the full long-form markdown content provided for publication.
- Regenerated blog publishing artifacts so this post is included in static and indexing outputs: `public/blog-static/pregnancy-swelling-edema-normal-vs-warning-sign.html`, `public/_redirects`, and `public/sitemap.xml`.
- Why: this publishes the newly requested pregnancy edema education article and keeps newest content first in feed/index ordering while maintaining static blog, redirect, and sitemap sync guarantees.


## 2026-03-06 (Merge-safe redirect generator hardening to prevent duplicate declaration CI failures)

- Updated `scripts/redirects-utils.mjs` to inline blog static rewrite generation directly inside the `lines` array instead of declaring a separate `blogStaticRewrites` constant.
- Preserved redirect behavior (`/blog/<slug>` and `/blog/<slug>/` still rewrite to `/blog-static/<slug>.html`), but removed the extra declaration point that caused Cloudflare/CI merge builds to fail with `Identifier 'blogStaticRewrites' has already been declared`.
- Why: merge commits can accidentally duplicate const declarations in script blocks; inlining keeps output deterministic while making this path syntactically resilient.


## 2026-03-06 (Cloudflare build hotfix: stabilize blog redirect string generation)

- Updated `scripts/redirects-utils.mjs` to build blog static rewrite lines using an explicit `staticTarget` variable per slug instead of adjacent inline template literals.
- Kept behavior unchanged (`/blog/<slug>` and `/blog/<slug>/` both rewrite to `/blog-static/<slug>.html`), but removed the string-construction pattern that was vulnerable to merge/edit corruption in CI (`TypeError: slugslug is not a function`).
- Why: Cloudflare build failed during `npm run generate:redirects` due malformed generated JavaScript in the redirect line construction block; this makes the code path more robust and easier to safely merge.


## 2026-03-06 (Permanent blog redirect loop fix v2: moved static blog serving off directory paths)

- Updated `scripts/generate-blog-html.mjs` to emit blog static files at `public/blog-static/<slug>.html` instead of directory-based `public/blog/<slug>/index.html`.
- Updated generated blog rewrite rules in `scripts/redirects-utils.mjs` so both `/blog/<slug>` and `/blog/<slug>/` rewrite to `/blog-static/<slug>.html`.
- Updated `scripts/check-redirects.mjs` to validate the new terminal target (`/blog-static/<slug>.html`) and fail if any legacy `/blog/<slug>/index.html` redirect rules are present.
- Updated `scripts/check-blog-static-sync.mjs` to validate new static output location and corresponding rewrite expectations.
- Updated README indexing section to document the new loop-safe blog-static strategy.
- Why: production was still looping between `/blog/<slug>` and `/blog/<slug>/` (308/301) due directory slash normalization interplay; serving blog HTML from non-directory targets removes that class of loop entirely.


## 2026-03-06 (Permanent blog redirect loop fix: removed self-rewrite rules)

- Updated `scripts/redirects-utils.mjs` so generated blog rewrite rules now include only `/blog/<slug>` and `/blog/<slug>/` to `/blog/<slug>/index.html` with `200`, and no longer generate `/blog/<slug>/index.html -> /blog/<slug>/index.html` self-rewrites.
- Hardened `scripts/check-redirects.mjs` to fail if any rule is generated for `/blog/<slug>/index.html`, preventing future source-equals-target rewrite regressions from being merged.
- Regenerated `public/_redirects` and confirmed blog rewrite output now has 2 rules per slug (without index self-rewrite).
- Updated `README.md` indexing/redirect documentation to reflect the loop-safe blog rewrite strategy and remove contradictory duplicate guidance.
- Why: Cloudflare can re-process self-rewrite rules and create recurring `ERR_TOO_MANY_REDIRECTS` on blog URLs after redirect updates; this change removes that trigger and adds a guardrail check.


## 2026-03-06 (Centralized canonical redirect generation for host + trailing slash)

- Updated `scripts/redirects-utils.mjs` to centrally generate canonical redirect rules instead of manual one-off edits, including a permanent host redirect from `https://www.sagenesthealth.com/*` to `https://sagenesthealth.com/:splat`.
- Added generated 301 trailing-slash canonicalization rules for non-root app routes (`/path/ -> /path`) while preserving existing blog static `200` rewrite trio behavior for `/blog/<slug>` paths.
- Regenerated `public/_redirects` via project scripts and kept rule order so canonical redirects remain above the final SPA fallback rewrite.
- Re-ran `scripts/check-redirects.mjs` and confirmed no conflict/cycle regressions before deploy.
- Why: this makes canonical normalization deterministic and maintainable in one generator source, while keeping Cloudflare blog rewrite behavior loop-safe.


## 2026-03-06 (SEOHead metadata added to Pregnancy Week-by-Week hub)

- Updated `src/pages/PregnancyWeekByWeekHub.tsx` to import and render `SEOHead` at the top of the page root with a unique hub-specific title, description, and canonical path (`/pregnancy-week-by-week`).
- Added hub-specific JSON-LD with a `CollectionPage` node and an `ItemList` node that enumerates weeks 1 through 40 using canonical week-detail URLs.
- Why: this aligns the hub with existing route-page SEO patterns and strengthens indexing clarity between the hub page and individual week detail pages.


## 2026-03-06 (Added Braxton Hicks vs real contractions blog post)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` with slug `braxton-hicks-vs-real-contractions`, including SEO metadata (`title`, `description`, `readingTime`, `updatedAt`), five FAQ entries, and the full long-form markdown content.
- Why: this publishes the newly requested labor-education article and keeps newest blog content first for feed ordering and discovery.


## 2026-03-05 (Added ovulation signs and symptoms blog post)

- Added a new top-of-list blog post object in `src/data/blogPosts.ts` with slug `ovulation-signs-symptoms`, complete SEO metadata (`title`, `description`, `readingTime`, `updatedAt`), five FAQ entries, and full long-form markdown content.
- Why: this publishes the newly requested ovulation education article and keeps the newest content first in the blog feed ordering.


## 2026-03-05 (Redirect checks hardened with per-slug cycle/conflict assertions)

- Enhanced `scripts/check-redirects.mjs` to parse generated redirect lines (ignoring blank/comment lines), build a source-to-rules map, and validate every blog slug form (`/blog/<slug>`, `/blog/<slug>/`, `/blog/<slug>/index.html`) resolves to `/blog/<slug>/index.html` via loop-safe rewrite behavior.
- Added actionable failure reporting that prints exact offending rules (with line numbers) for conflicting targets, mixed `301`/`200` statuses, missing rules, and detected redirect cycles.
- Kept and preserved the existing out-of-sync guard so CI still fails when `public/_redirects` diverges from generated output.


## 2026-03-05 (README repo-structure visibility clarification)

- Kept the `Exact Repository Worktree Structure` section in `README.md` and added a short note explaining to re-sync the branch from latest `main` if the section appears missing.
- Why: this prevents accidental manual copy-paste drift when a local branch is behind and does not yet include the merged README structure section.


## 2026-03-17 (New tool: Morning Sickness End Date Estimator)

- Added `src/lib/morningSicknessCalc.ts` with pure LMP-based calculation and validation logic for nausea start (week 6), peak (week 9), likely end (week 12), expected end (week 14), and outer bound (week 20) milestones.
- Added `src/pages/MorningSicknessEstimator.tsx` with the full tool UI, SEO metadata, ACOG source citation, required internal links, timeline-style results, and all required FAQ entries.
- Registered the tool in `src/data/tools.ts` and added the route in `src/App.tsx` at `/morning-sickness-end-date-estimator`.
- Added redirect rules in `public/_redirects` for `/morning-sickness`, `/nausea-calculator`, and trailing slash canonicalization.
- Why: to launch a dedicated, keyword-targeted morning sickness end date calculator with evidence-based guidance and consistent SageNest tool architecture.


## 2026-03-17 (New tool: Pregnancy Flight Safety Calculator)

- Added `src/lib/pregnancyFlightCalc.ts` with pure gestational-week-at-flight logic, verdict bands (`safe`/`caution`/`restricted`), and input validation for LMP and future flight constraints.
- Added `src/pages/PregnancyFlightCalculator.tsx` with full calculator UI, SEO metadata, FAQ schema, ACOG source citation, internal links, and a static major-airline policy reference table.
- Registered the new tool in `src/data/tools.ts` and wired the route in `src/App.tsx` at `/pregnancy-flight-calculator`.
- Added `_redirects` rules for `/flying-while-pregnant`, `/pregnant-flying`, and trailing-slash canonicalization.
- Added unit coverage in `tests/pregnancyFlightCalc.test.ts` for verdict thresholds and validation edge cases.
- Updated `README.md` tool/route lists to reflect the new calculator.
- Why: to launch a high-intent SEO tool that answers “can I fly while pregnant” with week-based guidance aligned with ACOG recommendations and common airline restrictions.
