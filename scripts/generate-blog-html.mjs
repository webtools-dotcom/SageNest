import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadBlogPosts } from './blog-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function markdownToHtml(markdown) {
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
        if (lines[0].startsWith('## ')) return `<h2>${inline(lines[0].slice(3))}</h2>`;
        if (lines[0].startsWith('# ')) return `<h1>${inline(lines[0].slice(2))}</h1>`;
      }
      if (lines.every((l) => /^-\s+/.test(l))) {
        const items = lines.map((l) => `<li>${inline(l.replace(/^-\s+/, ''))}</li>`).join('');
        return `<ul>${items}</ul>`;
      }
      return `<p>${lines.map(inline).join('<br />')}</p>`;
    })
    .join('\n');
}

function loadDesignTokens() {
  const css = readFileSync(join(ROOT, 'src', 'styles', 'design-tokens.css'), 'utf8');
  const vars = [...css.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [key, value.trim()]);
  return Object.fromEntries(vars);
}

function buildRootTokenCss(tokens) {
  const entries = Object.entries(tokens)
    .map(([name, value]) => `        --${name}: ${value};`)
    .join('\n');

  return `      :root {\n${entries}\n      }`;
}

function buildStaticStyle(tokens) {
  return `${buildRootTokenCss(tokens)}
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: var(--font-sans);
        background: var(--cream);
        color: var(--charcoal);
        line-height: 1.7;
        -webkit-font-smoothing: antialiased;
      }
      header.site-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: rgba(254, 253, 251, 0.95);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border-hairline);
        position: sticky;
        top: 0;
        z-index: 100;
      }
      .brand {
        font-family: var(--font-serif);
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--charcoal);
        text-decoration: none;
      }
      nav a {
        margin-left: 0.75rem;
        color: var(--charcoal);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        padding: 0.5rem 1.25rem;
        border-radius: var(--radius-pill);
        background: var(--sand);
        border: 1px solid var(--border-hairline);
      }
      nav a:hover { background: var(--sage-primary); color: #fff; border-color: var(--sage-primary); }
      main {
        max-width: 1000px;
        margin: 0 auto;
        padding: 4rem 1.5rem 5rem;
      }
      h1 {
        font-family: var(--font-serif);
        font-size: clamp(2.5rem, 5vw, 4.5rem);
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.03em;
        margin-bottom: 1.5rem;
        color: var(--charcoal);
      }
      h2 {
        font-family: var(--font-serif);
        font-size: clamp(2rem, 4vw, 3rem);
        margin: 3.5rem 0 1rem;
        padding-top: 2.5rem;
        border-top: 1px solid var(--border-hairline);
        color: var(--charcoal);
      }
      h3 {
        font-family: var(--font-serif);
        font-size: clamp(1.5rem, 3vw, 2rem);
        margin: 2.5rem 0 1rem;
        color: var(--charcoal);
      }
      p { margin: 0 0 1.5rem; color: var(--text-secondary); font-size: 1rem; line-height: 1.8; }
      ul { margin: 1.5rem 0 2rem 2rem; }
      li { margin-bottom: 1rem; color: var(--text-secondary); line-height: 1.7; }
      strong { color: var(--charcoal); font-weight: 600; }
      a { color: var(--sage-dark); }
      a:hover { color: var(--charcoal); }
      .post-meta {
        font-size: 0.875rem;
        color: var(--text-tertiary);
        margin-bottom: 1.5rem;
      }
      .post-image {
        width: 100%;
        max-height: 420px;
        object-fit: cover;
        border-radius: 18px;
        border: 1px solid var(--border-hairline);
        margin: 0 0 3rem;
      }
      .author-box {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.25rem 1.5rem;
        background: var(--sage-softest, #f4f8f4);
        border: 1px solid var(--sage-light, #c8dfc8);
        border-radius: 16px;
        margin: 2.5rem 0;
        text-decoration: none;
        transition: box-shadow 0.2s ease;
      }
      .author-box:hover {
        box-shadow: 0 4px 16px rgba(90, 140, 90, 0.15);
        color: inherit;
      }
      .author-avatar {
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--sage-primary, #7aab7a);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
      }
      .author-info { flex: 1; }
      .author-label {
        font-size: 0.72rem;
        color: var(--text-tertiary, #999);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin: 0 0 0.15rem;
      }
      .author-name {
        font-weight: 600;
        color: var(--charcoal, #1a1a1a);
        font-size: 0.95rem;
        margin: 0 0 0.25rem;
      }
      .author-bio {
        font-size: 0.82rem;
        color: var(--text-secondary, #555);
        line-height: 1.45;
        margin: 0;
      }
      .author-arrow {
        flex-shrink: 0;
        color: var(--sage-dark, #4a7a4a);
        font-size: 1rem;
        margin-left: auto;
      }
      .cta-box {
        background: var(--sage-softest);
        border: 1px solid var(--sage-light);
        border-radius: 16px;
        padding: 1.5rem;
        margin: 3rem 0;
        text-align: center;
      }
      .cta-box h3 { margin: 0 0 0.75rem; border: none; padding: 0; }
      .cta-box a {
        display: inline-block;
        padding: 0.75rem 2rem;
        background: var(--sage-primary);
        color: #fff;
        border-radius: var(--radius-pill);
        font-weight: 500;
        text-decoration: none;
      }
      .cta-box a:hover { background: var(--sage-dark); color: #fff; }
      .disclaimer {
        font-size: 0.8rem;
        color: var(--text-tertiary);
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
        color: var(--text-tertiary);
        margin-top: 4rem;
      }
      footer a { color: var(--sage-dark); margin: 0 0.5rem; }`;
}

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

function articleJsonLd(post) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    mainEntityOfPage: `https://sagenesthealth.com/blog/${post.slug}`,
    author: {
      '@type': 'Organization',
      name: 'SageNest Editorial Team',
      url: 'https://sagenesthealth.com/editorial-team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SageNest',
      url: 'https://sagenesthealth.com',
    },
  };

  if (post.updatedAt) {
    schema.dateModified = post.updatedAt;
    schema.datePublished = post.updatedAt;
  }

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

function buildPostHtml(post, styleBlock) {
  const bodyHtml = markdownToHtml(post.content);
  const descEscaped = post.description.replace(/"/g, '&quot;');
  const titleEscaped = post.title.replace(/"/g, '&quot;');
  const canonicalUrl = `https://sagenesthealth.com/blog/${post.slug}`;
  const ogImage = post.imageUrl
    ? `<meta property="og:image" content="${post.imageUrl}" />\n    <meta name="twitter:image" content="${post.imageUrl}" />`
    : '';

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
    ${ogImage}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
    <style>
${styleBlock}
    </style>
    ${articleJsonLd(post)}
    ${faqJsonLd(post.faq)}
  </head>
  <body>
    <header class="site-header">
      <a href="/" class="brand">🌿 SageNest</a>
      <nav>
        <a href="/similar-tools">Similar tools</a>
        <a href="/blog">Blog</a>
      </nav>
    </header>
    <main>
      <article>
        <h1>${post.title}</h1>
        <p class="post-meta">${post.readingTime}</p>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${titleEscaped}" class="post-image" loading="lazy" />` : ''}
        ${bodyHtml}
        <a href="/editorial-team" class="author-box">
          <div class="author-avatar">🌿</div>
          <div class="author-info">
            <p class="author-label">Written by</p>
            <p class="author-name">SageNest Editorial Team</p>
            <p class="author-bio">Researched from ACOG, WHO, CDC, NIH, and IOM guidelines. Evidence-based, never anecdotal.</p>
          </div>
          <span class="author-arrow">→</span>
        </a>
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
      <a href="/editorial-team">Editorial Team</a>
      <a href="/privacy">Privacy</a>
      <br /><br />
      © 2026 SageNest. For informational purposes only.
    </footer>
  </body>
</html>`;
}

const posts = await loadBlogPosts();
const tokens = loadDesignTokens();
const styleBlock = buildStaticStyle(tokens);

console.log(`Generating static HTML for ${posts.length} blog posts...`);

for (const post of posts) {
  const dir = join(ROOT, 'public', 'blog-static');
  mkdirSync(dir, { recursive: true });
  const html = buildPostHtml(post, styleBlock);
  writeFileSync(join(dir, `${post.slug}.html`), html, 'utf8');
  console.log(`  ✓ public/blog-static/${post.slug}.html`);
}

console.log('Done.');
