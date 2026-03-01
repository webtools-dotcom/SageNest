import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { buildSitemapXml, getSitemapEntries } from './sitemap-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const entries = await getSitemapEntries();
const xml = buildSitemapXml(entries);
const outputPath = join(ROOT, 'public', 'sitemap.xml');

writeFileSync(outputPath, xml, 'utf8');
console.log(`Generated ${outputPath} with ${entries.length} URLs.`);
