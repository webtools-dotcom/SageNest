import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loadBlogPosts } from './blog-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

async function loadTools() {
  const { readFileSync } = await import('node:fs');
  const { join, dirname } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const ts = await import('typescript');

  const toolsPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'tools.ts');
  const source = readFileSync(toolsPath, 'utf8');
  const transpiled = ts.default.transpileModule(source, {
    compilerOptions: {
      module: ts.default.ModuleKind.ESNext,
      target: ts.default.ScriptTarget.ES2020
    },
    fileName: toolsPath
  }).outputText;

  const encoded = Buffer.from(transpiled, 'utf8').toString('base64');
  const mod = await import(`data:text/javascript;base64,${encoded}`);
  const tools = mod.default;

  if (!Array.isArray(tools)) return [];
  return tools.filter((tool) => typeof tool.path === 'string');
}

async function loadLocalBlogPosts() {
  const posts = await loadBlogPosts();

  return posts
    .filter((post) => typeof post.slug === 'string' && post.slug.length > 0)
    .map((post) => ({ slug: post.slug, lastmod: post.updatedAt }));
}

function toDateString(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString().slice(0, 10);
}

function getSupabaseConfig() {
  const url = process.env.SITEMAP_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SITEMAP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

async function loadPublishedBlogPostsFromSupabase({ timeoutMs = 5000 } = {}) {
  const config = getSupabaseConfig();
  if (!config) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const endpoint = `${config.url}/rest/v1/blog?select=slug,updated_at,is_published&is_published=eq.true`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${config.key}`
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Supabase fetch failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter((post) => typeof post.slug === 'string')
      .map((post) => ({ slug: post.slug, lastmod: post.updated_at }));
  } catch (error) {
    console.warn(`Sitemap: failed to load published blog posts from Supabase, falling back to local data. (${error.message})`);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export async function getSitemapEntries(options = {}) {
  const baseUrl = (options.baseUrl || process.env.SITEMAP_BASE_URL || 'https://sagenesthealth.com').replace(/\/$/, '');
  const staticLastmod = toDateString(options.staticLastmod, new Date().toISOString().slice(0, 10));
  const blogSource = options.blogSource || process.env.SITEMAP_BLOG_SOURCE || 'hybrid';

  const fixedRoutes = [
    { path: '/blog', priority: '0.8', lastmod: '2026-01-01' },
    { path: '/about', priority: '0.5', lastmod: '2026-01-01' },
    { path: '/privacy', priority: '0.4', lastmod: '2026-01-01' },
    { path: '/similar-tools', priority: '0.7', lastmod: '2026-02-01' }
  ];

  const tools = (await loadTools()).map((tool) => ({ path: tool.path, priority: tool.path === '/pregnancy-due-date-calculator' ? '1.0' : '0.9', lastmod: '2026-02-01' }));
  
  const weekRoutes = Array.from({ length: 40 }, (_, index) => ({
    path: `/pregnancy-week-by-week/week-${index + 1}`,
    priority: '0.8',
    lastmod: '2026-02-01'
  }));

  const localBlogPosts = await loadLocalBlogPosts();
  const supabaseBlogPosts = blogSource === 'local' ? [] : await loadPublishedBlogPostsFromSupabase();

  const combinedBlogPosts = blogSource === 'supabase'
    ? supabaseBlogPosts
    : [...localBlogPosts, ...supabaseBlogPosts];

  const blogPosts = combinedBlogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    priority: '0.7',
    lastmod: toDateString(post.lastmod, staticLastmod)
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
