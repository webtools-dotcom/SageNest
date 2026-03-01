import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function loadTools() {
  const src = readFileSync(join(ROOT, 'src/data/tools.ts'), 'utf8');
  const js = src
    .replace(/export\s+type\s+Tool\s*=\s*\{[\s\S]*?\};\s*/g, '')
    .replace(/const\s+tools\s*:\s*Tool\[\]/g, 'const tools')
    .replace(/export\s+default\s+tools\s*;?/g, '');

  // eslint-disable-next-line no-new-func
  const fn = new Function(`${js}\n return tools;`);
  const tools = fn();

  if (!Array.isArray(tools)) return [];
  return tools.filter((tool) => typeof tool.path === 'string');
}

function loadBlogPosts() {
  const src = readFileSync(join(ROOT, 'src/data/blogPosts.ts'), 'utf8');
  const js = src
    .replace(/export\s+interface\s+BlogPost\s*\{[\s\S]*?\n\}\s*/g, '')
    .replace(/export\s+const\s+blogPosts\s*:\s*BlogPost\[\]/g, 'const blogPosts')
    .replace(/export\s+const\s+blogPosts/g, 'const blogPosts')
    .replace(/faq\?\s*:/g, 'faq:')
    .replace(/:\s*Array<[^>]+>/g, '')
    .replace(/:\s*string(\s*[,)\]}\n])/g, '$1');

  // eslint-disable-next-line no-new-func
  const fn = new Function(`${js}\n return blogPosts;`);
  const posts = fn();

  if (!Array.isArray(posts)) return [];
  return posts.filter((post) => typeof post.slug === 'string');
}

function toDateString(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString().slice(0, 10);
}

export function getSitemapEntries(options = {}) {
  const baseUrl = (options.baseUrl || process.env.SITEMAP_BASE_URL || 'https://sagenest.pages.dev').replace(/\/$/, '');
  const staticLastmod = toDateString(options.staticLastmod, new Date().toISOString().slice(0, 10));
  const includeFutureBlogPosts = options.includeFutureBlogPosts ?? process.env.INCLUDE_FUTURE_BLOG_POSTS === 'true';
  const today = new Date().toISOString().slice(0, 10);

  const fixedRoutes = [
    { path: '/blog', priority: '0.8' },
    { path: '/about', priority: '0.5' },
    { path: '/privacy', priority: '0.4' },
    { path: '/similar-tools', priority: '0.7' }
  ];

  const tools = loadTools().map((tool) => ({ path: tool.path, priority: tool.path === '/pregnancy-due-date-calculator' ? '1.0' : '0.9' }));

  const weekRoutes = Array.from({ length: 40 }, (_, index) => ({
    path: `/pregnancy-week-by-week/week-${index + 1}`,
    priority: '0.8'
  }));

  const blogPosts = loadBlogPosts()
    .filter((post) => includeFutureBlogPosts || toDateString(post.publishDate, today) <= today)
    .map((post) => ({
      path: `/blog/${post.slug}`,
      priority: '0.7',
      lastmod: toDateString(post.publishDate, staticLastmod)
    }));

  const routeMap = new Map();

  for (const route of [...tools, ...fixedRoutes, ...weekRoutes, ...blogPosts]) {
    if (!route.path?.startsWith('/')) continue;
    routeMap.set(route.path, {
      loc: `${baseUrl}${route.path}`,
      lastmod: route.lastmod || staticLastmod,
      priority: route.priority || '0.7'
    });
  }

  return [...routeMap.values()];
}

export function buildSitemapXml(entries) {
  const body = entries
    .map((entry) => `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <priority>${entry.priority}</priority>\n  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function extractLocsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}
