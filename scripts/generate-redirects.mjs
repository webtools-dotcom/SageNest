import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { buildRedirectsContent, loadBlogSlugs } from './redirects-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const outputPath = join(ROOT, 'public', '_redirects');

const redirects = buildRedirectsContent();
writeFileSync(outputPath, redirects, 'utf8');

const count = loadBlogSlugs().length;
console.log(`Generated ${outputPath} with ${count} blog redirect/rewrite pairs.`);
