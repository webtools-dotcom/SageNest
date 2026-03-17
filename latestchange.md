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

## 2026-03-04 (Redirect generator follow-up: keep rewrites loop-safe)

- Updated `scripts/redirects-utils.mjs` follow-up logic so `blogStaticRewrites` contains only `200` static rewrite rules for `/blog/<slug>`, `/blog/<slug>/`, and `/blog/<slug>/index.html`.
- Removed accidental inclusion of blog canonical `301` entries in the rewrites array to preserve the project’s loop-safe Cloudflare behavior while retaining the single-source array + dedupe structure.
- Regenerated `public/_redirects` and revalidated with `check:redirects` for deterministic CI output.

## 2026-03-04 (Redirect generator cleanup: single-source arrays + stable dedupe)

- Updated `scripts/redirects-utils.mjs` to build redirect output from three clearly named arrays declared once: `baseRedirects`, `legacyBlogRedirects`, and `blogStaticRewrites`.
- Removed dead/duplicate redirect assembly paths and now construct the `lines` list from those arrays only once.
- Added an order-preserving exact-line dedupe pass before output join to keep generated redirects deterministic and CI-stable for `check:redirects`.
## 2026-03-04 (Hotfix 4: blog redirects now generate only loop-safe rewrite trio)

- Updated `scripts/redirects-utils.mjs` `buildRedirectsContent()` to keep only legacy `/<slug> -> /blog/<slug> 301` redirects and remove generated blog canonical `301` variants for `/blog/<slug>/` and `/blog/<slug>/index.html`.
- Kept exactly one generated rewrite trio per blog slug (`/blog/<slug>`, `/blog/<slug>/`, and `/blog/<slug>/index.html` all rewriting to `/blog/<slug>/index.html` with `200`) above the global SPA catch-all.
- Regenerated `public/_redirects` and verified there are no duplicate blog source lines mapped to conflicting status codes.

## 2026-03-04 (Hotfix 3: make redirects generator merge-safe against duplicate declarations)

- Refactored `scripts/redirects-utils.mjs` to inline blog rewrite expansion directly into the `lines` array instead of using a separate `blogStaticRewrites` variable declaration.
- This avoids the exact `Identifier 'blogStaticRewrites' has already been declared` failure seen in Cloudflare/CI when merge resolution accidentally duplicated that declaration.

## 2026-03-04 (Hotfix 2: slash + index blog URLs now rewrite directly to static file)

- Updated `scripts/redirects-utils.mjs` to generate loop-proof `200` rewrites for `/blog/<slug>`, `/blog/<slug>/`, and `/blog/<slug>/index.html` so Cloudflare edge normalization cannot bounce between URL forms.
- Regenerated `public/_redirects` to include the new slash/index rewrites for every blog slug.
- Updated README indexing docs to explain the three-form rewrite strategy used to prevent `ERR_TOO_MANY_REDIRECTS` on blog URLs.

## 2026-03-04 (Hotfix: removed blog slash canonical redirects causing Cloudflare loop)

- Removed generated blog `301` canonical redirect rules for `/blog/<slug>/` and `/blog/<slug>/index.html` from `scripts/redirects-utils.mjs` because Cloudflare Pages directory slash normalization can bounce back to `/blog/<slug>/`, causing `ERR_TOO_MANY_REDIRECTS`.
- Kept canonical blog serving on `/blog/<slug> -> /blog/<slug>/index.html 200` so both users and crawlers resolve to the correct static blog file without redirect loops.
- Updated README indexing notes to reflect the loop-safe redirect strategy and corrected generator documentation to reference the TypeScript loader approach.

## 2026-03-04 (Unified static blog SEO pipeline + drift guardrails)

- Switched blog data loading in generation scripts to direct TypeScript imports from `src/data/blogPosts.ts` via a TypeScript-to-ESM loader, removing regex/eval parsing drift in blog HTML, redirects, and sitemap utilities.
- Extracted root design tokens into `src/styles/design-tokens.css` and updated both `src/styles/global.css` and `scripts/generate-blog-html.mjs` to consume the same token source so static blog pages stay visually aligned with app styling.
- Updated static blog generator to build its inline `<style>` block programmatically from shared design tokens and to include optional `og:image`/`twitter:image` plus `datePublished`/`dateModified` JSON-LD when `updatedAt` exists.
- Added `updatedAt` metadata to every `src/data/blogPosts.ts` entry and wired sitemap local blog `lastmod` to that field for fresher crawl signals.
- Hardened indexing behavior: added `noindex` on blog not-found and invalid pregnancy-week fallback states, switched blog internal links to canonical href navigation, and added canonical redirects for `/blog/<slug>/` + `/blog/<slug>/index.html`.
- Added `scripts/check-blog-static-sync.mjs` and `npm run check:blog-sync` to fail build/CI when blog source, redirects, sitemap, and static HTML files go out of sync; documented the publish checklist in `README.md`.

## 2026-03-04 (Static blog HTML refreshed to match current cream editorial UI)

- Updated `scripts/generate-blog-html.mjs` style tokens, typography scale, spacing, and nav pill styling so generated `public/blog/*/index.html` pages match the current live React UI (cream background, larger headline text, refined header treatment).
- Swapped static blog header CTA from `Due Date Calculator` to `Similar tools` to align with the current top-nav experience users see on the SPA routes.
- Regenerated all static blog files under `public/blog/` so crawlers (Google/social bots) fetch the updated design instead of stale pre-refresh markup.

## 2026-03-02 (CSP updated for Google Analytics + Tag Manager)

- Updated `public/_headers` Content Security Policy to allow Google Tag Manager and Google Analytics script loading by adding `https://www.googletagmanager.com` and `https://www.google-analytics.com` to `script-src`.
- Updated `public/_headers` Content Security Policy `connect-src` to allow analytics beacons to `https://www.google-analytics.com` and `https://analytics.google.com` while preserving existing Supabase HTTP/WebSocket endpoints.

## 2026-03-02 (Automated blog redirects to prevent Cloudflare rule drift)

- Added redirect automation scripts: `scripts/redirects-utils.mjs`, `scripts/generate-redirects.mjs`, and `scripts/check-redirects.mjs` to build and validate `public/_redirects` blog rules directly from `src/data/blogPosts.ts` slugs.
- Updated npm scripts in `package.json` to include `generate:redirects` and `check:redirects`, and wired both into `prebuild`/`ci:validate` so redirect mismatches fail fast before deployment.
- Replaced manual blog-specific entries in `public/_redirects` with generated rules covering every current blog slug, including the new `morning-sickness-remedies-that-actually-work` route.
- Updated `README.md` route/indexing and deployment guardrail sections to document redirect generation + validation workflow.

## 2026-03-02 (Removed publish date dependency across blog UI/build)

- Removed `publishDate` from public blog post typing/rendering in `src/components/BlogList.tsx` and `src/components/BlogPost.tsx`, eliminating the TypeScript mismatch with `src/data/blogPosts.ts` and removing date labels from blog cards/details.
- Updated static blog generation in `scripts/generate-blog-html.mjs` to stop emitting `datePublished`/`dateModified` and to show only reading time in post metadata.
- Updated `scripts/sitemap-utils.mjs` so local static blog entries no longer expect `publishDate`; sitemap `lastmod` now uses Supabase `updated_at` when available and otherwise falls back to the static last-mod date.
- Updated `src/components/BlogPoster.tsx` snippet generator to stop outputting `publishDate` in new static post objects.

## 2026-03-02 (README tool inventory corrected to include week-by-week milestones)

- Updated `README.md` Core Features list to explicitly include the Pregnancy Week by Week milestone tool, so the documented tool inventory now matches the four-tool set shown in Similar Tools.

## 2026-03-01 (Route navigation now resets scroll to top)

- Added `src/components/ScrollToTop.tsx` with a pathname-based `useEffect` that calls `window.scrollTo(0, 0)` on every client-side route transition.
- Mounted `ScrollToTop` at the app shell level in `src/App.tsx` so all internal page navigations open at the top instead of preserving previous scroll position.

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

## 2026-03-01 (Removed legacy static tool pages causing old UI duplicates)

- Removed legacy static HTML tool files `public/pregnancy-due-date-calculator/index.html` and `public/pregnancy-weight-gain-calculator/index.html` so Cloudflare Pages cannot serve outdated pre-React versions.
- Updated `public/_redirects` by deleting direct `200` rewrites for those two tool routes, forcing both paths to resolve through the SPA (`/* /index.html 200`) and render the latest React UI.
- Kept blog static rewrites and existing legacy `301` mappings unchanged.

## 2026-03-02 (Domain migration SEO canonical + metadata updates)

- Added a default canonical tag in `index.html` pointing to `https://sagenesthealth.com/`.
- Replaced old `sagenest.pages.dev` hardcoded URLs with `sagenesthealth.com` across runtime SEO/meta components, JSON-LD schema definitions, static blog HTML metadata, robots sitemap reference, sitemap loc entries, and build scripts that generate SEO artifacts.
- Updated the README domain reference for admin login to the new production domain.
- Verified no `sagenest.pages.dev` references remain outside changelog history entries.


## 2026-03-02 (SEO hotfix: remove SPA shell root canonical)

- Removed the hardcoded root canonical tag from `index.html` to avoid mis-canonicalizing all SPA-fallback routes for non-JS crawlers and social bots.
- Kept per-route canonical + `og:url` generation in `SEOHead` as the authoritative source for route-specific metadata.

## 2026-03-04 (README updated with exact repository worktree structure)

- Replaced `README.md` content with an exact, generated tree of all tracked repository files and directories.
- Ensured the structure is presented in a single `text` code block for copy/paste reference.

## 2026-03-04 (README restoration + appended repo structure section)

- Restored all previous README content that was unintentionally replaced in the prior docs-only update.
- Added a new `Exact Repository Worktree Structure` section at the end of README without removing existing sections.
- Listed tracked repository files as absolute-style paths (for example `/src/...`) to match the requested format.

## 2026-03-04 (README repo structure format switched to organized tree view)

- Updated the `Exact Repository Worktree Structure` section in README to use an organized tree layout (├── / └──) instead of flat absolute path lines.
- Kept all existing README content unchanged and only reformatted the repo-structure section for readability.

## 2026-03-05 (README repo-structure visibility clarification)

- Kept the `Exact Repository Worktree Structure` section in `README.md` and added a short note explaining to re-sync the branch from latest `main` if the section appears missing.
- Why: this prevents accidental manual copy-paste drift when a local branch is behind and does not yet include the merged README structure section.
