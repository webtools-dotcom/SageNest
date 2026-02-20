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
    .replace(/export\s+interface\s+BlogPost\s*\{[\s\S]*?\n\}\s*/g, '')
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
