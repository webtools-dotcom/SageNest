import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { extractLocsFromSitemap, getSitemapEntries } from './sitemap-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const sitemapPath = join(ROOT, 'public', 'sitemap.xml');

const expectedLocs = (await getSitemapEntries()).map((entry) => entry.loc);
const actualXml = readFileSync(sitemapPath, 'utf8');
const actualLocs = extractLocsFromSitemap(actualXml);

const expectedSet = new Set(expectedLocs);
const actualSet = new Set(actualLocs);

const missing = expectedLocs.filter((loc) => !actualSet.has(loc));
const extra = actualLocs.filter((loc) => !expectedSet.has(loc));

if (missing.length > 0 || extra.length > 0) {
  console.error('Sitemap validation failed: route list and sitemap.xml diverge.');
  if (missing.length > 0) {
    console.error(`Missing (${missing.length}):`);
    for (const loc of missing) console.error(`  - ${loc}`);
  }
  if (extra.length > 0) {
    console.error(`Extra (${extra.length}):`);
    for (const loc of extra) console.error(`  - ${loc}`);
  }
  process.exit(1);
}

console.log(`Sitemap validation passed (${actualLocs.length} URLs).`);
