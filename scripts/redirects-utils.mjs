import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const BASE_REDIRECTS = [
  '/due-date-calculator /pregnancy-due-date-calculator 301',
  '/pregnancy-calculator /pregnancy-due-date-calculator 301',
  '/pregnancy-due-date /pregnancy-due-date-calculator 301',
  '/pregnancy-weight-gain /pregnancy-weight-gain-calculator 301',
  '/week-by-week-pregnancy /pregnancy-week-by-week 301',
  '/ovulation /ovulation-calculator 301',
  '/fertility-calculator /ovulation-calculator 301'
];

function parseBlogPostsTs() {
  const src = readFileSync(join(ROOT, 'src/data/blogPosts.ts'), 'utf8');
  const js = src
    .replace(/export\s+interface\s+BlogPost\s*\{[\s\S]*?\n\}\s*/g, '')
    .replace(/export\s+const\s+blogPosts\s*:\s*BlogPost\[\]/g, 'const blogPosts')
    .replace(/export\s+const\s+blogPosts/g, 'const blogPosts')
    .replace(/faq\?\s*:/g, 'faq:')
    .replace(/:\s*Array<[^>]+>/g, '')
    .replace(/:\s*string(\s*[,)]\s*)/g, '$1')
    .replace(/:\s*string\s*\]/g, ']')
    .replace(/:\s*string\s*\}/g, '}');

  // eslint-disable-next-line no-new-func
  const fn = new Function(`${js}\n return blogPosts;`);
  const posts = fn();
  if (!Array.isArray(posts)) return [];
  return posts;
}

export function loadBlogSlugs() {
  const posts = parseBlogPostsTs();
  return [...new Set(posts
    .map((post) => post?.slug)
    .filter((slug) => typeof slug === 'string' && slug.length > 0))];
}

export function buildRedirectsContent() {
  const slugs = loadBlogSlugs();
  const legacyBlogRedirects = slugs.map((slug) => `/${slug} /blog/${slug} 301`);
  const blogStaticRewrites = slugs.map((slug) => `/blog/${slug} /blog/${slug}/index.html 200`);

  const lines = [
    ...BASE_REDIRECTS,
    ...legacyBlogRedirects,
    '',
    ...blogStaticRewrites,
    '/ /pregnancy-due-date-calculator 301',
    '/* /index.html 200'
  ];

  return `${lines.join('\n')}\n`;
}
