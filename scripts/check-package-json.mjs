import { readFileSync } from 'node:fs';

try {
  JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  console.log('package.json is valid JSON');
} catch (error) {
  console.error('package.json is invalid JSON');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
