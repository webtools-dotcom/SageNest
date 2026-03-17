import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { loadBlogPosts } from './blog-data.mjs';

function safeJsonStringify(obj, indent) {
  return JSON.stringify(obj, null, indent)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\//g, '\\u002f');
}

function fullHtmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const PROMPT_MAP = [
  { keywords: ['morning-sickness', 'nausea'], prompt: 'soft editorial photograph, pregnant woman holding ginger tea by window, warm natural lighting, sage green tones, calm expression, no text' },
  { keywords: ['weight-gain'], prompt: 'soft editorial photograph, pregnant woman standing sideways profile, warm natural lighting, sage green tones, clean background, no text' },
  { keywords: ['nutrition', 'food', 'eat', 'diet'], prompt: 'soft editorial photograph, fresh healthy vegetables fruits nuts on wooden table, pregnancy nutrition, warm natural lighting, sage green, no text' },
  { keywords: ['headache'], prompt: 'soft editorial photograph, pregnant woman resting with eyes closed hand on temple, soft diffused light, sage green tones, calm, no text' },
  { keywords: ['swelling', 'edema'], prompt: 'soft editorial photograph, pregnant woman sitting comfortably feet elevated, warm natural lighting, sage green tones, no text' },
  { keywords: ['sleep', 'insomnia'], prompt: 'soft editorial photograph, pregnant woman sleeping peacefully on side with pillow, soft warm bedroom lighting, sage green tones, no text' },
  { keywords: ['ovulation', 'fertile', 'cycle', 'luteal', 'irregular'], prompt: 'soft editorial photograph, woman holding calendar near window, natural light, sage green tones, clean minimal, no text' },
  { keywords: ['contraction', 'braxton'], prompt: 'soft editorial photograph, pregnant woman breathing calmly hand on belly, warm natural lighting, sage green tones, no text' },
  { keywords: ['round-ligament', 'pelvic', 'pain'], prompt: 'soft editorial photograph, pregnant woman doing gentle stretching yoga pose, warm natural lighting, sage green tones, no text' },
  { keywords: ['diabetes', 'glucose', 'blood-sugar'], prompt: 'soft editorial photograph, healthy balanced meal plate with vegetables and protein, warm natural lighting, sage green tones, no text' },
  { keywords: ['due-date', 'gestational', 'ultrasound', 'ivf'], prompt: 'soft editorial photograph, pregnant woman looking at calendar smiling gently, warm natural lighting, sage green tones, no text' },
  { keywords: ['vitamin', 'supplement', 'iron', 'folate'], prompt: 'soft editorial photograph, prenatal vitamins supplements on wooden surface with greenery, warm natural lighting, sage green tones, no text' },
  { keywords: ['postpartum', 'postnatal'], prompt: 'soft editorial photograph, new mother holding newborn baby gently, soft warm lighting, sage green tones, peaceful, no text' },
  { keywords: ['shortness-of-breath', 'breathing'], prompt: 'soft editorial photograph, pregnant woman sitting calmly by open window breathing fresh air, warm natural lighting, sage green tones, no text' },
];

const FALLBACK_PROMPT = 'soft editorial photograph, pregnant woman resting hand on belly near window, warm natural lighting, sage green tones, clean minimal background, no text, no watermark';

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
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: var(--font-serif);
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--charcoal);
        text-decoration: none;
      }
      .brand-logo {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        object-fit: cover;
        display: block;
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
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .author-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
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
  return `<script type="application/ld+json">\n${safeJsonStringify(schema, 2)}\n</script>`;
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

  return `<script type="application/ld+json">\n${safeJsonStringify(schema, 2)}\n</script>`;
}

function loadDotEnvFile() {
  let raw;
  try {
    raw = readFileSync(join(ROOT, '.env'), 'utf8');
  } catch {
    return;
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex <= 0) continue;
    const key = trimmed.slice(0, equalIndex).trim();
    if (!key || process.env[key]) continue;
    let value = trimmed.slice(equalIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolvePromptFromSlug(slug) {
  const normalizedSlug = String(slug || '').toLowerCase();
  const match = PROMPT_MAP.find(({ keywords }) => keywords.some((keyword) => normalizedSlug.includes(keyword.toLowerCase())));
  return match?.prompt || FALLBACK_PROMPT;
}

function buildCloudinaryImageUrl(cloudName, slug) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,h_630,c_fill/sagenest-blog/${slug}.jpg`;
}

async function cloudinaryImageExists(cloudName, apiKey, apiSecret, slug) {
  const encodedPublicId = encodeURIComponent(`sagenest-blog/${slug}`);
  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload/${encodedPublicId}`;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { Authorization: `Basic ${auth}` },
  });

  if (response.status === 200) return true;
  if (response.status === 404) return false;

  const body = await response.text();
  throw new Error(`Cloudinary resource check failed with ${response.status}: ${body.slice(0, 250)}`);
}

async function fetchPollinationsImage(prompt, apiKey, slug, errors, isRetry = false) {
  const seed = Math.floor(Math.random() * 1000000);
  const endpoint = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?model=flux-2-dev&width=1200&height=630&seed=${seed}&enhance=true&negative_prompt=${encodeURIComponent('text,watermark,logo,words,letters,signature,nudity')}&key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint);

  if (response.status === 200) {
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  if (response.status === 402) {
    const message = `Pollinations credits exhausted for slug "${slug}" (HTTP 402). Skipping generation.`;
    errors.push(message);
    console.warn(`⚠ ${message}`);
    return null;
  }

  if (!isRetry) {
    const message = `Pollinations request failed for slug "${slug}" with status ${response.status}. Retrying once in 3 seconds.`;
    console.warn(`⚠ ${message}`);
    await wait(3000);
    return fetchPollinationsImage(prompt, apiKey, slug, errors, true);
  }

  const body = await response.text();
  const message = `Pollinations retry failed for slug "${slug}" with status ${response.status}.`;
  errors.push(message);
  console.warn(`⚠ ${message}`);
  return null;
}

function uploadImageToCloudinary(imageBuffer, slug) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'sagenest-blog',
        public_id: slug,
        resource_type: 'image',
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    stream.end(imageBuffer);
  });
}

async function resolvePostImage(post, config, errors, pollinationsState) {
  if (!config.isReady) return post.imageUrl;

  const cloudinaryUrl = buildCloudinaryImageUrl(config.cloudName, post.slug);

  try {
    const exists = await cloudinaryImageExists(config.cloudName, config.cloudinaryApiKey, config.cloudinaryApiSecret, post.slug);
    if (exists) {
      console.log(`  ↳ image exists for ${post.slug}, skipping generation`);
      return cloudinaryUrl;
    }
  } catch (error) {
    const message = `Cloudinary check failed for slug "${post.slug}": ${error.message}`;
    errors.push(message);
    console.warn(`⚠ ${message}`);
    return post.imageUrl;
  }

  if (pollinationsState.hasCalled) {
    await wait(2000);
  }
  pollinationsState.hasCalled = true;

  const prompt = resolvePromptFromSlug(post.slug);
  const imageBuffer = await fetchPollinationsImage(prompt, config.pollinationsApiKey, post.slug, errors);
  if (!imageBuffer) return post.imageUrl;

  try {
    await uploadImageToCloudinary(imageBuffer, post.slug);
    console.log(`  ↳ generated and uploaded image for ${post.slug}`);
    return cloudinaryUrl;
  } catch (error) {
    const message = `Cloudinary upload failed for slug "${post.slug}": ${error.message}`;
    errors.push(message);
    console.warn(`⚠ ${message}`);
    return post.imageUrl;
  }
}

function buildPostHtml(post, styleBlock) {
  const bodyHtml = markdownToHtml(post.content);
  const descEscaped = fullHtmlEscape(post.description);
  const titleEscaped = fullHtmlEscape(post.title);
  const canonicalUrl = `https://sagenesthealth.com/blog/${post.slug}`;
  const ogImage = post.imageUrl
    ? `<meta property="og:image" content="${post.imageUrl}" />\n    <meta name="twitter:image" content="${post.imageUrl}" />`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${titleEscaped} | SageNest Health – Smart Tools for Women's Wellness</title>
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
      <a href="/" class="brand"><img src="/sagenest-main-logo.png" alt="" class="brand-logo" loading="eager" width="34" height="34" /> SageNest</a>
      <nav>
        <a href="/similar-tools">Similar tools</a>
        <a href="/blog">Blog</a>
      </nav>
    </header>
    <main>
      <article>
        <h1>${post.title}</h1>
        <p class="post-meta">${post.readingTime}${post.lastReviewed ? ` · <span>Last reviewed: ${post.lastReviewed}</span>` : ""}</p>
        ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${titleEscaped}" class="post-image" loading="lazy" />` : ''}
        ${bodyHtml}
        <a href="/editorial-team" class="author-box">
          <div class="author-avatar"><img src="/sagenest-main-logo.png" alt="" loading="lazy" width="48" height="48" /></div>
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

loadDotEnvFile();

const posts = await loadBlogPosts();
const tokens = loadDesignTokens();
const styleBlock = buildStaticStyle(tokens);
const imageErrors = [];
const imageConfig = {
  pollinationsApiKey: process.env.POLLINATIONS_API_KEY || '',
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};
const CLOUDINARY_NAME_RE = /^[a-zA-Z0-9_-]{3,50}$/;
const CLOUDINARY_KEY_RE = /^\d{10,20}$/;

imageConfig.isReady = Boolean(
  imageConfig.pollinationsApiKey
  && imageConfig.pollinationsApiKey.length >= 10
  && imageConfig.cloudName
  && CLOUDINARY_NAME_RE.test(imageConfig.cloudName)
  && imageConfig.cloudinaryApiKey
  && CLOUDINARY_KEY_RE.test(imageConfig.cloudinaryApiKey)
  && imageConfig.cloudinaryApiSecret
  && imageConfig.cloudinaryApiSecret.length >= 20
);

if (
  (imageConfig.cloudName || imageConfig.cloudinaryApiKey || imageConfig.cloudinaryApiSecret)
  && !imageConfig.isReady
) {
  console.warn('⚠ Cloudinary credentials present but failed format validation. Image pipeline skipped. Check for extra spaces or quotes in .env values.');
}

if (imageConfig.isReady) {
  cloudinary.config({
    cloud_name: imageConfig.cloudName,
    api_key: imageConfig.cloudinaryApiKey,
    api_secret: imageConfig.cloudinaryApiSecret,
    secure: true,
  });
} else {
  console.warn('⚠ Image pipeline skipped: missing POLLINATIONS_API_KEY and/or Cloudinary credentials in environment.');
}

console.log(`Generating static HTML for ${posts.length} blog posts...`);

const pollinationsState = { hasCalled: false };

for (const post of posts) {
  const dir = join(ROOT, 'public', 'blog-static');
  mkdirSync(dir, { recursive: true });
  const resolvedImageUrl = await resolvePostImage(post, imageConfig, imageErrors, pollinationsState);
  const html = buildPostHtml({ ...post, imageUrl: resolvedImageUrl }, styleBlock);
  writeFileSync(join(dir, `${post.slug}.html`), html, 'utf8');
  console.log(`  ✓ public/blog-static/${post.slug}.html`);
}

if (imageErrors.length > 0) {
  console.log('\nImage pipeline completed with warnings:');
  for (const error of imageErrors) {
    console.log(`  - ${error}`);
  }
}

console.log('Done.');
