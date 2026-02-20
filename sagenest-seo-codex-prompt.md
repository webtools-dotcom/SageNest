# SageNest SEO Fix — Full Codex Prompt

> Paste everything below this line into Codex as your task prompt.

---

## CONTEXT

You are working on the SageNest pregnancy calculator website, a React + TypeScript + Vite SPA deployed on Cloudflare Pages at **https://sagenest.pages.dev**. The codebase uses React Router for client-side routing, with a `public/_redirects` file for Cloudflare SPA fallback. Blog posts are stored as static data in `src/data/blogPosts.ts`. There is one existing pre-rendered static HTML page at `public/pregnancy-weight-gain-calculator/index.html` — this is the gold standard pattern for the fixes below.

**The canonical domain for this site is `https://sagenest.pages.dev`.** There is no custom domain. All SEO fixes must use `https://sagenest.pages.dev` — not `sagenest.app`.

Before making any changes, read `SECURITY.md`, `codex.md`, and `frontend.md` to understand the coding rules. Follow the Anti-Mess Protocol: only touch files relevant to each fix, match existing code patterns exactly, do not add new npm dependencies.

---

## TASK LIST — Fix all 9 SEO problems in order

---

### FIX 1 — Resolve Canonical URL Conflict in `src/components/SEOHead.tsx`

**Problem:** `SEOHead.tsx` currently sets all canonical URLs to `https://sagenest.app${canonicalPath}`. But the real live domain is `https://sagenest.pages.dev`. This means Google sees a canonical pointing to a domain that may not exist or may not match the sitemap, causing index equity split.

**Exact change required:**

Open `src/components/SEOHead.tsx`. Find this line:
```
canonical.setAttribute('href', `https://sagenest.app${canonicalPath}`);
```

Change it to:
```
canonical.setAttribute('href', `https://sagenest.pages.dev${canonicalPath}`);
```

That is the only change to this file. Do not change anything else in `SEOHead.tsx`.

Also find any other hardcoded `https://sagenest.app` string elsewhere in the same file (e.g. in `jsonLd` passed in from pages) — you do not need to change those here since they come from the calling pages, which are fixed in Fix 6 below.

---

### FIX 2 — Fix `public/sitemap.xml` — All URLs must use `sagenest.pages.dev`

**Problem:** The sitemap already uses `https://sagenest.pages.dev`, which is correct. However it is missing `/ovulation-calculator` and is missing `<lastmod>` and `<priority>` signals which help Google understand page importance.

**Exact change required:**

Replace the entire contents of `public/sitemap.xml` with the following. Note the addition of `/ovulation-calculator`, `<lastmod>` dates, and `<priority>` values:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sagenest.pages.dev/</loc>
    <lastmod>2026-02-20</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/pregnancy-due-date-calculator</loc>
    <lastmod>2026-02-20</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/ovulation-calculator</loc>
    <lastmod>2026-02-20</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/pregnancy-weight-gain-calculator</loc>
    <lastmod>2026-02-20</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/blog</loc>
    <lastmod>2026-02-20</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/blog/how-due-dates-are-calculated</loc>
    <lastmod>2026-01-10</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/blog/ivf-due-date-guide</loc>
    <lastmod>2026-01-18</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/blog/pregnancy-week-by-week-milestones</loc>
    <lastmod>2026-01-24</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/blog/healthy-pregnancy-weight-gain-complete-guide</loc>
    <lastmod>2026-02-10</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/blog/pregnancy-nutrition-guide-what-to-eat-each-trimester</loc>
    <lastmod>2026-02-12</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/blog/gestational-diabetes-pregnancy-weight-gain</loc>
    <lastmod>2026-02-14</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/blog/pregnancy-weight-gain-myths-facts</loc>
    <lastmod>2026-02-16</lastmod>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/about</loc>
    <lastmod>2026-02-20</lastmod>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://sagenest.pages.dev/privacy</loc>
    <lastmod>2026-02-20</lastmod>
    <priority>0.4</priority>
  </url>
</urlset>
```

---

### FIX 3 — Fix `public/robots.txt`

**Problem:** `robots.txt` currently points to `https://sagenest.pages.dev/sitemap.xml` which is correct for the domain, but let's confirm it is exactly right.

**Exact change required:**

Replace the entire contents of `public/robots.txt` with:

```
User-agent: *
Allow: /

Sitemap: https://sagenest.pages.dev/sitemap.xml
```

This is already correct in the existing file, so only change it if it differs from the above.

---

### FIX 4 — Add OG and Twitter meta tags to `src/components/SEOHead.tsx`

**Problem:** `SEOHead.tsx` injects `<title>` and `<meta name="description">` but never adds Open Graph or Twitter Card tags. These are needed for social sharing to produce rich previews, which drives clicks and indirect backlink signals.

**Exact change required:**

Open `src/components/SEOHead.tsx`. In the `useEffect`, after the existing canonical link injection block and before the JSON-LD block, add the following code. Insert it surgically — do not restructure or rewrite the rest of the file.

The `SEOHeadProps` interface must be extended to accept two new optional props:

```typescript
interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  ogImage?: string; // optional absolute URL to a preview image
}
```

Then inside the `useEffect`, after the canonical tag block, add:

```typescript
// OG tags
const setMeta = (property: string, content: string, isName = false) => {
  const attr = isName ? 'name' : 'property';
  const selector = `meta[${attr}="${property}"]`;
  const tag = document.querySelector(selector) || document.createElement('meta');
  tag.setAttribute(attr, property);
  tag.setAttribute('content', content);
  if (!tag.parentElement) document.head.appendChild(tag);
};

const fullTitle = title.includes(siteTagline) ? title : `${title} | ${siteTagline}`;
const canonicalUrl = `https://sagenest.pages.dev${canonicalPath}`;

setMeta('og:type', 'website');
setMeta('og:site_name', 'SageNest');
setMeta('og:title', fullTitle);
setMeta('og:description', description);
setMeta('og:url', canonicalUrl);
if (ogImage) {
  setMeta('og:image', ogImage);
}
setMeta('twitter:card', 'summary_large_image', true);
setMeta('twitter:title', fullTitle, true);
setMeta('twitter:description', description, true);
if (ogImage) {
  setMeta('twitter:image', ogImage, true);
}
```

Add `ogImage` to the dependency array of the `useEffect`:
```typescript
}, [title, description, canonicalPath, jsonLd, ogImage]);
```

No other callers need to be changed — `ogImage` is optional and all existing call sites will continue to work without passing it.

---

### FIX 5 — Improve meta descriptions on tool pages for keyword targeting

**Problem:** The meta descriptions on the three main tool pages are too generic and miss high-intent long-tail keywords like "free", "no signup", "gestational age", "LMP", "cycle length". Better descriptions increase click-through rate in search results.

**Exact changes required — update the `description` prop in `SEOHead` on each page:**

**`src/pages/Calculator.tsx`** — find the `<SEOHead` element and update its `description` prop to:
```
Free pregnancy due date calculator — enter your LMP and cycle length to estimate your due date, gestational age, and trimester instantly. No signup required.
```

**`src/pages/OvulationCalculator.tsx`** — find the `<SEOHead` element and update its `description` prop to:
```
Free ovulation calculator — enter your last period date and cycle length to find your fertile window, peak fertility days, and estimated ovulation date. No signup required.
```

**`src/pages/PregnancyWeightGainCalculator.tsx`** — find the `<SEOHead` element and update its `description` prop to:
```
Free pregnancy weight gain calculator — enter your pre-pregnancy BMI to get your IOM-recommended total gain range and week-by-week targets by trimester. No signup required.
```

Only change the `description` string value. Do not change the `title`, `canonicalPath`, or any other prop.

---

### FIX 6 — Fix all hardcoded `sagenest.app` references in page-level JSON-LD data

**Problem:** Several page components pass `jsonLd` objects to `SEOHead` that hardcode `https://sagenest.app` URLs. These are the canonical URL signals embedded in structured data that Google reads. They must match the live domain.

**Files to update and exact string replacements:**

**`src/pages/Calculator.tsx`:**
- Replace `'https://sagenest.app/pregnancy-due-date-calculator'` → `'https://sagenest.pages.dev/pregnancy-due-date-calculator'`
- Replace `'https://sagenest.app/blog'` → `'https://sagenest.pages.dev/blog'`
- Replace `` `https://sagenest.app/blog/${post.slug}` `` → `` `https://sagenest.pages.dev/blog/${post.slug}` ``
- Replace `'https://sagenest.app'` (in the SearchAction target) → `'https://sagenest.pages.dev'`
- Replace `'https://sagenest.app/blog?query={search_term_string}'` → `'https://sagenest.pages.dev/blog?query={search_term_string}'`

**`src/components/BlogList.tsx`:**
- Replace `'https://sagenest.app/blog'` → `'https://sagenest.pages.dev/blog'`
- Replace `` `https://sagenest.app/blog/${post.slug}` `` → `` `https://sagenest.pages.dev/blog/${post.slug}` ``

**`src/components/BlogPost.tsx`:**
- Replace `` `https://sagenest.app/blog/${post.slug}` `` → `` `https://sagenest.pages.dev/blog/${post.slug}` ``

**`src/pages/OvulationCalculator.tsx`:**
- Replace `'https://sagenest.app/ovulation-calculator'` → `'https://sagenest.pages.dev/ovulation-calculator'`

Only change the URL strings. Do not restructure the objects or touch anything else in these files.

---

### FIX 7 — Pre-render all 7 blog posts as static HTML files

**Problem:** All 7 blog posts exist only as JavaScript-rendered content fetched from Supabase at runtime. Google's fast first-pass crawler cannot index them. The blog posts are the richest keyword content on the site. The fix is to pre-render each post as a static HTML file at `public/blog/[slug]/index.html`, exactly like the existing `public/pregnancy-weight-gain-calculator/index.html`.

**The blog post data already exists in `src/data/blogPosts.ts`.** Use it as the source of truth.

**Step 7a — Create the build script at `scripts/generate-blog-html.mjs`:**

This script must be a plain Node.js ES module (no new dependencies). It reads the blog post data, converts the Markdown content to HTML using a minimal inline converter, and writes one `index.html` file per post into `public/blog/[slug]/index.html`.

Create `scripts/generate-blog-html.mjs` with the following content:

```javascript
// scripts/generate-blog-html.mjs
// Generates static HTML for each blog post so Google can crawl them
// without JavaScript. Reads from src/data/blogPosts.ts via a compiled
// intermediary — we extract the data by importing the compiled output
// or by reading the TS file and stripping types.
//
// Because this runs at build time (Node.js, not browser), we parse
// blogPosts.ts using a regex-safe approach: we eval the data portion
// after stripping TypeScript syntax.

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ---------- Minimal Markdown → HTML converter ----------
// Must match the logic in src/lib/markdown.ts closely enough to render
// headings, paragraphs, bold, links, and lists correctly.
function markdownToHtml(markdown) {
  // Strip any raw HTML for safety
  const clean = markdown
    .replace(/<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/<[^>]+>/g, '');

  const escape = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const inline = (text) => {
    const esc = escape(text);
    return esc
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
        const safe = /^(https?:\/\/|\/)/i.test(href.trim()) ? href.trim() : '#';
        return `<a href="${escape(safe)}">${label}</a>`;
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  };

  return clean
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((l) => l.trim());
      if (lines.length === 1) {
        if (lines[0].startsWith('### ')) return `<h3>${inline(lines[0].slice(4))}</h3>`;
        if (lines[0].startsWith('## '))  return `<h2>${inline(lines[0].slice(3))}</h2>`;
        if (lines[0].startsWith('# '))   return `<h1>${inline(lines[0].slice(2))}</h1>`;
      }
      if (lines.every((l) => /^-\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^-\s+/, ''))}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${lines.map(inline).join('<br />')}</p>`;
    })
    .join('\n');
}

// ---------- Read blogPosts.ts and extract the array ----------
// We read the TypeScript source, strip the type annotations, and
// use a Function constructor to evaluate only the pure data array.
function extractBlogPosts() {
  const src = readFileSync(join(ROOT, 'src/data/blogPosts.ts'), 'utf8');

  // Remove TypeScript interface/type declarations
  let js = src
    .replace(/export\s+interface\s+\w+\s*\{[\s\S]*?\}/g, '')
    .replace(/export\s+type\s+\w+[^;]*;/g, '')
    .replace(/:\s*BlogPost\[\]/g, '')
    .replace(/:\s*Array<[^>]+>/g, '')
    .replace(/faq\?\s*:/g, 'faq:')
    .replace(/:\s*Array<\s*\{[^}]+\}\s*>/g, '')
    // Remove type annotations on variables and parameters
    .replace(/:\s*string(\s*[,)\]}\n])/g, '$1')
    .replace(/:\s*string\[\]/g, '')
    .replace(/export const blogPosts/, 'const blogPosts');

  // Evaluate in a safe context
  // eslint-disable-next-line no-new-func
  const fn = new Function(`${js}\n return blogPosts;`);
  return fn();
}

// ---------- Build FAQ JSON-LD from faq array ----------
function faqJsonLd(faqs) {
  if (!faqs || faqs.length === 0) return '';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

// ---------- Build Article JSON-LD ----------
function articleJsonLd(post) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate,
    dateModified: post.publishDate,
    mainEntityOfPage: `https://sagenest.pages.dev/blog/${post.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'SageNest',
      url: 'https://sagenest.pages.dev',
    },
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

// ---------- Generate the full HTML for one post ----------
function buildPostHtml(post) {
  const bodyHtml = markdownToHtml(post.content);
  const descEscaped = post.description.replace(/"/g, '&quot;');
  const titleEscaped = post.title.replace(/"/g, '&quot;');
  const canonicalUrl = `https://sagenest.pages.dev/blog/${post.slug}`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${post.title} | SageNest Health – Smart Tools for Women's Wellness</title>
    <meta name="description" content="${descEscaped}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="index,follow" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="SageNest" />
    <meta property="og:title" content="${titleEscaped}" />
    <meta property="og:description" content="${descEscaped}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${titleEscaped}" />
    <meta name="twitter:description" content="${descEscaped}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
    <style>
      :root {
        --sage: #9AA88D;
        --sage-dark: #7A8872;
        --sage-softest: #E8EDE3;
        --cream: #FAF9F6;
        --off-white: #FEFDFB;
        --charcoal: #2D2D2D;
        --text-secondary: #6B6B6B;
        --border-hairline: #E5E7EB;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: 'Inter', -apple-system, sans-serif;
        background: var(--cream);
        color: var(--charcoal);
        line-height: 1.7;
        -webkit-font-smoothing: antialiased;
      }
      header.site-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background: var(--off-white);
        border-bottom: 1px solid var(--border-hairline);
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .brand {
        font-family: 'Playfair Display', serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--charcoal);
        text-decoration: none;
      }
      nav a {
        margin-left: 1rem;
        color: var(--charcoal);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        padding: 0.4rem 1rem;
        border-radius: 999px;
        background: #F5F2ED;
        border: 1px solid var(--border-hairline);
      }
      nav a:hover { background: var(--sage); color: #fff; }
      main {
        max-width: 780px;
        margin: 0 auto;
        padding: 3rem 1.5rem 5rem;
      }
      h1 {
        font-family: 'Playfair Display', serif;
        font-size: clamp(1.75rem, 4vw, 2.75rem);
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.02em;
        margin-bottom: 0.75rem;
        color: var(--charcoal);
      }
      h2 {
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        margin: 2.5rem 0 0.75rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border-hairline);
        color: var(--charcoal);
      }
      h3 {
        font-family: 'Playfair Display', serif;
        font-size: 1.2rem;
        margin: 1.75rem 0 0.5rem;
        color: var(--charcoal);
      }
      p { margin: 0 0 1.25rem; color: var(--text-secondary); font-size: 1rem; }
      ul { margin: 1rem 0 1.5rem 1.5rem; }
      li { margin-bottom: 0.5rem; color: var(--text-secondary); line-height: 1.7; }
      strong { color: var(--charcoal); font-weight: 600; }
      a { color: var(--sage-dark); }
      a:hover { color: var(--charcoal); }
      .post-meta {
        font-size: 0.875rem;
        color: #9B9B9B;
        margin-bottom: 2rem;
      }
      .cta-box {
        background: var(--sage-softest);
        border: 1px solid #C5D0BA;
        border-radius: 16px;
        padding: 1.5rem;
        margin: 3rem 0;
        text-align: center;
      }
      .cta-box h3 { margin: 0 0 0.75rem; border: none; padding: 0; }
      .cta-box a {
        display: inline-block;
        padding: 0.75rem 2rem;
        background: var(--sage);
        color: #fff;
        border-radius: 999px;
        font-weight: 500;
        text-decoration: none;
      }
      .cta-box a:hover { background: var(--sage-dark); color: #fff; }
      .disclaimer {
        font-size: 0.8rem;
        color: #9B9B9B;
        border-top: 1px solid var(--border-hairline);
        padding-top: 1.5rem;
        margin-top: 3rem;
        font-style: italic;
      }
      footer {
        background: var(--off-white);
        border-top: 1px solid var(--border-hairline);
        padding: 2rem;
        text-align: center;
        font-size: 0.875rem;
        color: #9B9B9B;
        margin-top: 4rem;
      }
      footer a { color: var(--sage-dark); margin: 0 0.5rem; }
    </style>
    ${articleJsonLd(post)}
    ${faqJsonLd(post.faq)}
  </head>
  <body>
    <header class="site-header">
      <a href="/" class="brand">🌿 SageNest</a>
      <nav>
        <a href="/pregnancy-due-date-calculator">Due Date Calculator</a>
        <a href="/blog">Blog</a>
      </nav>
    </header>
    <main>
      <article>
        <h1>${post.title}</h1>
        <p class="post-meta">${post.publishDate} · ${post.readingTime}</p>
        ${bodyHtml}
        <div class="cta-box">
          <h3>Calculate Your Pregnancy Due Date</h3>
          <p>Free, private, and no signup required.</p>
          <a href="/pregnancy-due-date-calculator">Open Calculator →</a>
        </div>
        <p class="disclaimer">This article is for informational purposes only and does not replace medical advice. Consult your healthcare provider with any concerns about your pregnancy.</p>
      </article>
    </main>
    <footer>
      <a href="/">Home</a>
      <a href="/pregnancy-due-date-calculator">Due Date Calculator</a>
      <a href="/ovulation-calculator">Ovulation Calculator</a>
      <a href="/pregnancy-weight-gain-calculator">Weight Gain Calculator</a>
      <a href="/blog">Blog</a>
      <a href="/about">About</a>
      <a href="/privacy">Privacy</a>
      <br /><br />
      © 2026 SageNest. For informational purposes only.
    </footer>
  </body>
</html>`;
}

// ---------- Main ----------
const posts = extractBlogPosts();
console.log(`Generating static HTML for ${posts.length} blog posts...`);

for (const post of posts) {
  const dir = join(ROOT, 'public', 'blog', post.slug);
  mkdirSync(dir, { recursive: true });
  const html = buildPostHtml(post);
  writeFileSync(join(dir, 'index.html'), html, 'utf8');
  console.log(`  ✓ public/blog/${post.slug}/index.html`);
}

console.log('Done.');
```

**Step 7b — Add the script to `package.json` scripts and wire it into the build:**

Open `package.json`. Find the `"scripts"` block. Make the following surgical changes only:

1. Add a new script entry: `"generate:blog": "node scripts/generate-blog-html.mjs"`
2. Update the `"prebuild"` script to also run this new script. Change it from:
   ```
   "prebuild": "npm run check:package && npm run check:conflicts"
   ```
   to:
   ```
   "prebuild": "npm run check:package && npm run check:conflicts && npm run generate:blog"
   ```

Do not change any other script. Validate that `package.json` is still valid JSON after the edit.

**Step 7c — Add redirect rules to `public/_redirects`:**

Open `public/_redirects`. The current contents are:
```
/sitemap.xml /sitemap.xml 200
/robots.txt /robots.txt 200
/pregnancy-weight-gain-calculator /pregnancy-weight-gain-calculator/index.html 200
/* /index.html 200
```

Insert blog redirect rules **before** the final `/* /index.html 200` catch-all line. Add one line per blog post:

```
/blog/how-due-dates-are-calculated /blog/how-due-dates-are-calculated/index.html 200
/blog/ivf-due-date-guide /blog/ivf-due-date-guide/index.html 200
/blog/pregnancy-week-by-week-milestones /blog/pregnancy-week-by-week-milestones/index.html 200
/blog/healthy-pregnancy-weight-gain-complete-guide /blog/healthy-pregnancy-weight-gain-complete-guide/index.html 200
/blog/pregnancy-nutrition-guide-what-to-eat-each-trimester /blog/pregnancy-nutrition-guide-what-to-eat-each-trimester/index.html 200
/blog/gestational-diabetes-pregnancy-weight-gain /blog/gestational-diabetes-pregnancy-weight-gain/index.html 200
/blog/pregnancy-weight-gain-myths-facts /blog/pregnancy-weight-gain-myths-facts/index.html 200
```

The final `_redirects` file should look like:
```
/sitemap.xml /sitemap.xml 200
/robots.txt /robots.txt 200
/pregnancy-weight-gain-calculator /pregnancy-weight-gain-calculator/index.html 200
/blog/how-due-dates-are-calculated /blog/how-due-dates-are-calculated/index.html 200
/blog/ivf-due-date-guide /blog/ivf-due-date-guide/index.html 200
/blog/pregnancy-week-by-week-milestones /blog/pregnancy-week-by-week-milestones/index.html 200
/blog/healthy-pregnancy-weight-gain-complete-guide /blog/healthy-pregnancy-weight-gain-complete-guide/index.html 200
/blog/pregnancy-nutrition-guide-what-to-eat-each-trimester /blog/pregnancy-nutrition-guide-what-to-eat-each-trimester/index.html 200
/blog/gestational-diabetes-pregnancy-weight-gain /blog/gestational-diabetes-pregnancy-weight-gain/index.html 200
/blog/pregnancy-weight-gain-myths-facts /blog/pregnancy-weight-gain-myths-facts/index.html 200
/* /index.html 200
```

---

### FIX 8 — Pre-render the Pregnancy Due Date Calculator landing page as static HTML

**Problem:** The main calculator page at `/pregnancy-due-date-calculator` is SPA-only. It is one of the most important pages on the site. Google's fast crawler cannot read its title, headings, or content. The fix follows the same pattern as the weight gain calculator.

**Step 8a — Create `public/pregnancy-due-date-calculator/index.html`:**

Create the directory `public/pregnancy-due-date-calculator/` and inside it create `index.html` with the following content. This page contains complete crawlable content and loads the full React SPA after it mounts:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Free Pregnancy Due Date Calculator — SageNest Health</title>
    <meta
      name="description"
      content="Free pregnancy due date calculator — enter your LMP and cycle length to estimate your due date, gestational age, and trimester instantly. No signup required."
    />
    <link rel="canonical" href="https://sagenest.pages.dev/pregnancy-due-date-calculator" />
    <meta name="robots" content="index,follow" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="SageNest" />
    <meta property="og:title" content="Free Pregnancy Due Date Calculator — SageNest Health" />
    <meta property="og:description" content="Free pregnancy due date calculator — enter your LMP and cycle length to estimate your due date, gestational age, and trimester instantly. No signup required." />
    <meta property="og:url" content="https://sagenest.pages.dev/pregnancy-due-date-calculator" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Free Pregnancy Due Date Calculator — SageNest Health" />
    <meta name="twitter:description" content="Free pregnancy due date calculator — enter your LMP and cycle length to estimate your due date, gestational age, and trimester instantly. No signup required." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
    <style>
      :root { --sage: #9AA88D; --sage-dark: #7A8872; --cream: #FAF9F6; --off-white: #FEFDFB; --charcoal: #2D2D2D; --text-secondary: #6B6B6B; --border: #E5E7EB; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'Inter', sans-serif; background: var(--cream); color: var(--charcoal); line-height: 1.7; -webkit-font-smoothing: antialiased; }
      header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: var(--off-white); border-bottom: 1px solid var(--border); }
      .brand { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: var(--charcoal); text-decoration: none; }
      nav a { margin-left: 1rem; padding: 0.4rem 1rem; border-radius: 999px; background: #F5F2ED; border: 1px solid var(--border); color: var(--charcoal); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
      main { max-width: 900px; margin: 0 auto; padding: 3rem 1.5rem 5rem; }
      h1 { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: 1rem; letter-spacing: -0.02em; }
      h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin: 2.5rem 0 0.75rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
      h3 { font-family: 'Playfair Display', serif; font-size: 1.2rem; margin: 1.5rem 0 0.5rem; }
      p { margin-bottom: 1.25rem; color: var(--text-secondary); }
      ul { margin: 0.75rem 0 1.5rem 1.5rem; }
      li { margin-bottom: 0.4rem; color: var(--text-secondary); }
      .faq-item { margin-bottom: 1rem; }
      .faq-item h3 { margin-bottom: 0.4rem; font-size: 1rem; }
      footer { background: var(--off-white); border-top: 1px solid var(--border); padding: 2rem; text-align: center; font-size: 0.875rem; color: #9B9B9B; margin-top: 4rem; }
      footer a { color: var(--sage-dark); margin: 0 0.5rem; }
    </style>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Pregnancy Due Date Calculator",
      "url": "https://sagenest.pages.dev/pregnancy-due-date-calculator",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Any",
      "description": "Free pregnancy due date calculator using LMP, conception date, or IVF transfer date. Calculates gestational age, trimester, and conception window. No signup required."
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is a pregnancy due date calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Using Naegele's Rule: the first day of your last menstrual period plus 280 days (40 weeks). If your cycle is longer or shorter than 28 days, the due date is adjusted accordingly."
          }
        },
        {
          "@type": "Question",
          "name": "Does cycle length affect my due date?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Longer cycles mean ovulation happens later, shifting the due date forward. Shorter cycles shift it earlier. This calculator adjusts for cycle lengths between 21 and 40 days."
          }
        },
        {
          "@type": "Question",
          "name": "Is this calculator free and private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. This calculator is completely free, requires no signup, and all calculations happen in your browser. No data is collected or stored."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use this for IVF pregnancies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Select the IVF Transfer method and enter your transfer date and embryo age (day 3, 5, or 6). IVF due dates are often more accurate because the exact fertilization date is known."
          }
        },
        {
          "@type": "Question",
          "name": "What is gestational age?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gestational age is counted from the first day of your last menstrual period, not from conception. A full-term pregnancy is 40 weeks gestational age."
          }
        }
      ]
    }
    </script>
  </head>
  <body>
    <header>
      <a href="/" class="brand">🌿 SageNest</a>
      <nav>
        <a href="/similar-tools">Similar Tools</a>
        <a href="/blog">Blog</a>
      </nav>
    </header>
    <main>
      <h1>Free Pregnancy Due Date Calculator</h1>
      <p>
        Estimate your pregnancy due date instantly using your last menstrual period (LMP), cycle length, conception date, or IVF embryo transfer date. No signup required. All calculations happen privately in your browser — no data is collected or stored.
      </p>

      <section>
        <h2>How This Due Date Calculator Works</h2>
        <p>
          This calculator uses three methods to estimate your due date. The most common is the LMP method: enter the first day of your last period and your average cycle length (21–40 days). The calculator applies a modified version of Naegele's Rule, adjusting for cycle length variations to provide a personalized estimate rather than a generic 28-day assumption.
        </p>
        <p>
          For IVF pregnancies, enter your embryo transfer date and embryo age at transfer. Since the exact fertilization date is known, IVF due dates are typically more precise than LMP-based estimates. Day 5 blastocyst transfers are the most common.
        </p>
        <p>
          If you know your approximate conception date, you can also enter it directly. The calculator adds 266 days from fertilization to estimate delivery.
        </p>
      </section>

      <section>
        <h2>What You'll See in Your Results</h2>
        <ul>
          <li><strong>Estimated due date</strong> — your target delivery date based on the calculation method you choose</li>
          <li><strong>Gestational age</strong> — how many weeks and days pregnant you are today</li>
          <li><strong>Current trimester</strong> — first, second, or third trimester status</li>
          <li><strong>Conception window</strong> — estimated date of conception based on your cycle</li>
          <li><strong>Pregnancy progress</strong> — visual percentage through the 40-week journey</li>
          <li><strong>Next milestone</strong> — upcoming prenatal screening or appointment to plan for</li>
        </ul>
      </section>

      <section>
        <h2>Due Date Calculation Methods Explained</h2>
        <h3>Last Menstrual Period (LMP)</h3>
        <p>
          The standard method used in clinical practice. Enter the first day of your last period and your average cycle length. Most cycles range from 21 to 40 days. The standard 28-day assumption overstates or understates the due date for anyone with irregular or non-standard cycles. This calculator adjusts for your actual cycle length.
        </p>
        <h3>IVF Embryo Transfer</h3>
        <p>
          For in vitro fertilization pregnancies, the due date is calculated from the transfer date and embryo age. A day 5 blastocyst transfer adds 261 days; a day 3 cleavage-stage transfer adds 263 days. Day 5 transfers are now the gold standard at most fertility clinics.
        </p>
        <h3>Conception Date</h3>
        <p>
          If you know the approximate date of conception, this method adds 266 days (38 weeks from fertilization). Your provider will confirm gestational age with an early ultrasound.
        </p>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>
        <div class="faq-item">
          <h3>How accurate is a due date calculator?</h3>
          <p>It provides a clinical planning estimate. Only about 5% of babies arrive on their exact due date. First-trimester ultrasound is the most accurate dating method and may adjust your estimate by several days.</p>
        </div>
        <div class="faq-item">
          <h3>What if my cycle is irregular?</h3>
          <p>Enter your average cycle length. If your cycles vary significantly, use the conception date method if you know it, or discuss ultrasound dating with your healthcare provider at your first prenatal visit.</p>
        </div>
        <div class="faq-item">
          <h3>Is my data saved anywhere?</h3>
          <p>No. All calculations happen in your browser. Nothing is sent to a server, stored, or collected. The page works entirely offline once loaded.</p>
        </div>
        <div class="faq-item">
          <h3>What is the difference between gestational age and fetal age?</h3>
          <p>Gestational age counts from the first day of your last menstrual period — about 2 weeks before conception. Fetal age (embryonic age) counts from fertilization. All clinical milestones use gestational age.</p>
        </div>
        <div class="faq-item">
          <h3>Can I use this calculator for twins?</h3>
          <p>The due date calculation works the same way. Twin pregnancies are often delivered earlier (around 38 weeks), but the estimated due date is calculated identically to singleton pregnancies.</p>
        </div>
      </section>

      <section>
        <h2>Related Pregnancy Planning Tools</h2>
        <ul>
          <li><a href="/ovulation-calculator">Ovulation Calculator</a> — find your fertile window and peak conception days</li>
          <li><a href="/pregnancy-weight-gain-calculator">Pregnancy Weight Gain Calculator</a> — get IOM-recommended gain targets by BMI and trimester</li>
          <li><a href="/blog">Pregnancy Planning Guides</a> — evidence-based articles on due dates, IVF timelines, and week-by-week milestones</li>
        </ul>
      </section>
    </main>
    <footer>
      <a href="/">Home</a>
      <a href="/ovulation-calculator">Ovulation Calculator</a>
      <a href="/pregnancy-weight-gain-calculator">Weight Gain Calculator</a>
      <a href="/blog">Blog</a>
      <a href="/about">About</a>
      <a href="/privacy">Privacy</a>
      <br /><br />
      © 2026 SageNest. For informational purposes only. Not medical advice.
    </footer>
  </body>
</html>
```

**Step 8b — Add the redirect rule to `public/_redirects`:**

Insert this line **before** the `/* /index.html 200` catch-all in `_redirects` (you already touched this file in Fix 7c, so just add this line in the right position):

```
/pregnancy-due-date-calculator /pregnancy-due-date-calculator/index.html 200
```

---

### FIX 9 — Update `public/pregnancy-weight-gain-calculator/index.html` to fix its canonical URL

**Problem:** The existing static weight gain calculator HTML has a canonical pointing to `https://sagenest.app/pregnancy-weight-gain-calculator`. Since the live site is `sagenest.pages.dev`, this is wrong. Also its OG tags are missing.

**Exact change required:**

Open `public/pregnancy-weight-gain-calculator/index.html`. Make these targeted changes:

1. Find:
   ```html
   <link rel="canonical" href="https://sagenest.app/pregnancy-weight-gain-calculator" />
   ```
   Replace with:
   ```html
   <link rel="canonical" href="https://sagenest.pages.dev/pregnancy-weight-gain-calculator" />
   ```

2. After the `<link rel="canonical" .../>` line, add these OG and Twitter meta tags if they are not already present:
   ```html
   <meta property="og:type" content="website" />
   <meta property="og:site_name" content="SageNest" />
   <meta property="og:title" content="Pregnancy Weight Gain Calculator | SageNest" />
   <meta property="og:description" content="Free pregnancy weight gain calculator — enter your pre-pregnancy BMI to get IOM-recommended total gain range and week-by-week targets by trimester. No signup required." />
   <meta property="og:url" content="https://sagenest.pages.dev/pregnancy-weight-gain-calculator" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta name="twitter:title" content="Pregnancy Weight Gain Calculator | SageNest" />
   <meta name="twitter:description" content="Free pregnancy weight gain calculator — enter your pre-pregnancy BMI to get IOM-recommended total gain range and week-by-week targets by trimester. No signup required." />
   ```

3. Also update the existing `<meta name="description">` content to the keyword-targeted version:
   ```html
   <meta name="description" content="Free pregnancy weight gain calculator — enter your pre-pregnancy BMI to get IOM-recommended total gain range and week-by-week targets by trimester. No signup required." />
   ```

No other changes to this file.

---

## VERIFICATION CHECKLIST

After making all changes, run these checks:

```bash
# 1. Validate package.json is still valid JSON
npm run check:package

# 2. Check for merge conflict markers
npm run check:conflicts

# 3. Run the blog generator manually to confirm it works
node scripts/generate-blog-html.mjs
# Expected output: "Generating static HTML for 7 blog posts..." followed by 7 ✓ lines

# 4. Confirm the generated files exist
ls public/blog/
# Should show 7 directories: how-due-dates-are-calculated, ivf-due-date-guide, etc.

# 5. Full TypeScript build
npm run build
# Must complete with zero errors
```

---

## FILES CHANGED SUMMARY

| File | Change |
|------|--------|
| `src/components/SEOHead.tsx` | Fix canonical domain + add OG/Twitter meta injection |
| `src/pages/Calculator.tsx` | Fix hardcoded sagenest.app URLs in JSON-LD + update description |
| `src/pages/OvulationCalculator.tsx` | Fix hardcoded sagenest.app URL + update description |
| `src/pages/PregnancyWeightGainCalculator.tsx` | Update meta description |
| `src/components/BlogList.tsx` | Fix hardcoded sagenest.app URLs |
| `src/components/BlogPost.tsx` | Fix hardcoded sagenest.app URLs |
| `public/sitemap.xml` | Add ovulation-calculator, add lastmod + priority |
| `public/robots.txt` | Confirm/fix domain reference |
| `public/_redirects` | Add blog post routes + due date calculator route |
| `public/pregnancy-weight-gain-calculator/index.html` | Fix canonical URL + add OG tags |
| `public/pregnancy-due-date-calculator/index.html` | **NEW FILE** — full static pre-render |
| `public/blog/[slug]/index.html` × 7 | **NEW FILES** — generated by build script |
| `scripts/generate-blog-html.mjs` | **NEW FILE** — blog HTML generator |
| `package.json` | Add `generate:blog` script + add to prebuild |

---

## RULES TO FOLLOW

- Follow `SECURITY.md` Anti-Mess Protocol: only touch what is listed above
- Do not add any new npm dependencies
- Do not refactor any working code that is not listed in the changes above
- Do not change any test files
- Match existing code style exactly (2-space indent, single quotes for imports, semicolons present)
- After finishing, run `npm run build` and confirm it succeeds with zero TypeScript errors
