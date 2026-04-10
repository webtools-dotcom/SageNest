# Agents2.md

## 1) DONT READ THIS FILE IF YOU ARE ADDING A NEW BLOGPOST

---

## 2) Context Discipline (Very Important)

### 2.1 Do NOT auto-scan generated/static artifacts
Treat these as generated output unless the task explicitly asks for them:
- `public/blog-static/**`
- `public/sitemap.xml`
- `public/_redirects`
- build artifacts (`dist/**`, `tsconfig.tsbuildinfo`, etc.)

Default behavior:
- Work from source files first (`src/**`, `scripts/**`, config files).
- Only open generated files to verify output after generation or when debugging generation mismatch.

### 2.2 Search strategy
- Use focused searches and file globs.
- Prefer:
  - `rg "pattern" src scripts`
  - `rg --files src scripts`
- Avoid broad scans that pull large generated HTML into context.

---

## 3) Source of Truth Map

Use this map to avoid editing the wrong layer:

- Blog source of truth: `src/data/blogPosts.ts`
- Blog static HTML generator: `scripts/generate-blog-html.mjs`
- Redirect generation/check:
  - `scripts/generate-redirects.mjs`
  - `scripts/check-redirects.mjs`
- Sitemap generation/check:
  - `scripts/generate-sitemap.mjs`
  - `scripts/check-sitemap.mjs`
- Blog sync validation:
  - `scripts/check-blog-static-sync.mjs`
- App code: `src/**`
- Security headers: `public/_headers`
- Routing behavior reference: `README.md`

Never manually patch generated blog HTML as the primary fix. Fix source/generator and regenerate.

---

## 4) If task is app feature/bugfix (non-blog)
1. Modify only relevant `src/**` / config files.
2. Run targeted tests first, then broader validation as needed
3. Update docs:
   - If behavior documented in README changed: update `README.md`.
   - Always update `latestchange.md` unless user explicitly says not to.
---
