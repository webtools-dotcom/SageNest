import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { buildRedirectsContent } from './redirects-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const redirectsPath = join(ROOT, 'public', '_redirects');

const expected = buildRedirectsContent();
const current = readFileSync(redirectsPath, 'utf8');

if (current !== expected) {
  console.error('Redirect validation failed: public/_redirects is out of sync. Run "npm run generate:redirects".');
  process.exit(1);
}

console.log('Redirect validation passed.');
