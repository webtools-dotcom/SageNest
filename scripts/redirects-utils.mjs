import { loadBlogSlugs } from './blog-data.mjs';

const canonicalHostRedirects = [
  'https://www.sagenesthealth.com/* https://sagenesthealth.com/:splat 301'
];

const baseRedirects = [
  '/due-date-calculator /pregnancy-due-date-calculator 301',
  '/pregnancy-calculator /pregnancy-due-date-calculator 301',
  '/pregnancy-due-date /pregnancy-due-date-calculator 301',
  '/pregnancy-weight-gain /pregnancy-weight-gain-calculator 301',
  '/week-by-week-pregnancy /pregnancy-week-by-week 301',
  '/ovulation /ovulation-calculator 301',
  '/fertility-calculator /ovulation-calculator 301',
  '/morning-sickness /morning-sickness-end-date-estimator 301',
  '/nausea-calculator /morning-sickness-end-date-estimator 301'
];

const canonicalNoTrailingSlashRoutes = [
  '/pregnancy-due-date-calculator',
  '/blog',
  '/admin/login',
  '/admin/blogposter',
  '/about',
  '/privacy',
  '/pregnancy-weight-gain-calculator',
  '/pregnancy-week-by-week',
  '/ovulation-calculator',
  '/morning-sickness-end-date-estimator',
  '/similar-tools'
];

function buildTrailingSlashRedirects() {
  return canonicalNoTrailingSlashRoutes
    .filter((path) => path !== '/')
    .map((path) => `${path}/ ${path} 301`);
}

export async function buildRedirectsContent() {
  const slugs = await loadBlogSlugs();
  const legacyBlogRedirects = slugs.map((slug) => `/${slug} /blog/${slug} 301`);
  const trailingSlashRedirects = buildTrailingSlashRedirects();

  const lines = [
    ...canonicalHostRedirects,
    ...baseRedirects,
    ...legacyBlogRedirects,
    ...trailingSlashRedirects,
    ...slugs.flatMap((slug) => {
      const staticTarget = `/blog-static/${slug}.html`;
      return [
        `/blog/${slug} ${staticTarget} 200`,
        `/blog/${slug}/ ${staticTarget} 200`
      ];
    }),
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
