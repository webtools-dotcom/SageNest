import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadBlogPosts, loadBlogSlugs } from './blog-data.mjs';
import { extractLocsFromSitemap } from './sitemap-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const slugs = await loadBlogSlugs();
const posts = await loadBlogPosts();
const redirects = readFileSync(join(ROOT, 'public', '_redirects'), 'utf8');
const sitemapXml = readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8');
const sitemapLocs = new Set(extractLocsFromSitemap(sitemapXml));

const errors = [];

for (const slug of slugs) {
  const staticPath = join(ROOT, 'public', 'blog-static', `${slug}.html`);
  const canonicalUrl = `https://sagenesthealth.com/blog/${slug}`;

  if (!existsSync(staticPath)) {
    errors.push(`Missing static file: public/blog-static/${slug}.html`);
    continue;
  }

  const html = readFileSync(staticPath, 'utf8');
  if (!html.includes(`<link rel="canonical" href="${canonicalUrl}" />`)) {
    errors.push(`Canonical tag mismatch in public/blog-static/${slug}.html`);
  }

  if (!redirects.includes(`/blog/${slug} /blog-static/${slug}.html 200`)) {
    errors.push(`Missing static rewrite rule for /blog/${slug} in public/_redirects`);
  }

  if (!sitemapLocs.has(canonicalUrl)) {
    errors.push(`Missing sitemap entry for ${canonicalUrl}`);
  }
}

for (const post of posts) {
  if (typeof post.updatedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(post.updatedAt)) {
    errors.push(`Post ${post.slug} must include updatedAt in YYYY-MM-DD format.`);
  }
}

if (errors.length > 0) {
  console.error('Blog static sync validation failed:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`Blog static sync validation passed (${slugs.length} slugs).`);
