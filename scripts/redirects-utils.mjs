import { loadBlogSlugs } from './blog-data.mjs';

const baseRedirects = [
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
  const blogStaticRewrites = slugs.flatMap((slug) => [
    `/blog/${slug} /blog/${slug}/index.html 200`,
    `/blog/${slug}/ /blog/${slug}/index.html 200`,
    `/blog/${slug}/index.html /blog/${slug}/index.html 200`
  ]);

  const lines = [
    ...baseRedirects,
    ...legacyBlogRedirects,
    ...blogStaticRewrites,
    '',
    '/ /pregnancy-due-date-calculator 301',
    '/* /index.html 200'
  ];

  const dedupedLines = [];
  const seenLines = new Set();

  for (const line of lines) {
    if (seenLines.has(line)) {
      continue;
    }

    seenLines.add(line);
    dedupedLines.push(line);
  }

  return `${dedupedLines.join('\n')}\n`;
}
