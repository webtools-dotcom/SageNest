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

  const lines = [
    ...BASE_REDIRECTS,
    ...legacyBlogRedirects,
    '',
    ...slugs.flatMap((slug) => [
      `/blog/${slug} /blog/${slug}/index.html 200`,
      `/blog/${slug}/ /blog/${slug}/index.html 200`,
      `/blog/${slug}/index.html /blog/${slug}/index.html 200`
    ]),
    '/ /pregnancy-due-date-calculator 301',
    '/* /index.html 200'
  ];

  return `${lines.join('\n')}\n`;
}
