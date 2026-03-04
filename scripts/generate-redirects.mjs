import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { buildRedirectsContent } from './redirects-utils.mjs';
import { loadBlogSlugs } from './blog-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const outputPath = join(ROOT, 'public', '_redirects');

const redirects = await buildRedirectsContent();
writeFileSync(outputPath, redirects, 'utf8');

const count = (await loadBlogSlugs()).length;
console.log(`Generated ${outputPath} with ${count} blog redirect/rewrite pairs.`);
