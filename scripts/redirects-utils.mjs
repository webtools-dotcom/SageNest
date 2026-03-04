import { loadBlogSlugs } from './blog-data.mjs';

const BASE_REDIRECTS = [
  '/due-date-calculator /pregnancy-due-date-calculator 301',
  '/pregnancy-calculator /pregnancy-due-date-calculator 301',
  '/pregnancy-due-date /pregnancy-due-date-calculator 301',
  '/pregnancy-weight-gain /pregnancy-weight-gain-calculator 301',
  '/week-by-week-pregnancy /pregnancy-week-by-week 301',
  '/ovulation /ovulation-calculator 301',
  '/fertility-calculator /ovulation-calculator 301'
];

export async function buildRedirectsContent() {
  const slugs = await loadBlogSlugs();
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
