import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { buildRedirectsContent } from './redirects-utils.mjs';
import { loadBlogSlugs } from './blog-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const redirectsPath = join(ROOT, 'public', '_redirects');

function parseRedirectRules(content) {
  return content
    .split('\n')
    .map((line, index) => ({
      line,
      lineNumber: index + 1,
      trimmed: line.trim()
    }))
    .filter(({ trimmed }) => trimmed && !trimmed.startsWith('#'))
    .map(({ lineNumber, trimmed }) => {
      const parts = trimmed.split(/\s+/);

      if (parts.length < 3) {
        throw new Error(`Invalid redirect rule on line ${lineNumber}: "${trimmed}"`);
      }

      const [source, target, statusToken] = parts;
      const status = Number(statusToken);

      if (!Number.isInteger(status)) {
        throw new Error(`Invalid status code on line ${lineNumber}: "${trimmed}"`);
      }

      return {
        source,
        target,
        status,
        lineNumber,
        raw: trimmed
      };
    });
}

function formatRule(rule) {
  return `line ${rule.lineNumber}: ${rule.raw}`;
}

function buildSourceRuleMap(rules) {
  const sourceToRules = new Map();

  for (const rule of rules) {
    const existing = sourceToRules.get(rule.source) ?? [];
    existing.push(rule);
    sourceToRules.set(rule.source, existing);
  }

  return sourceToRules;
}

function pickUniqueRule(rules) {
  if (!rules || rules.length === 0) {
    return null;
  }

  const unique = [];
  const seen = new Set();

  for (const rule of rules) {
    const key = `${rule.target} ${rule.status}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(rule);
  }

  return unique.length === 1 ? unique[0] : null;
}

function validateBlogRedirects(sourceToRules, slugs) {
  const errors = [];
  for (const slug of slugs) {
    const legacySource = `/${slug}`;
    const expectedTarget = `/blog/${slug}`;
    const rules = sourceToRules.get(legacySource) ?? [];
    const has301 = rules.some((r) => r.status === 301 && r.target === expectedTarget);
    if (!has301) {
      errors.push(`Missing legacy 301 redirect: /${slug} → /blog/${slug}`);
    }
  }
  return errors;
}

const expected = await buildRedirectsContent();
const current = readFileSync(redirectsPath, 'utf8');
const rules = parseRedirectRules(expected);
const sourceToRules = buildSourceRuleMap(rules);
const slugs = await loadBlogSlugs();
const blogValidationErrors = validateBlogRedirects(sourceToRules, slugs);

if (blogValidationErrors.length > 0) {
  console.error('Redirect validation failed: blog redirect/rewrite integrity errors found.');
  for (const error of blogValidationErrors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

if (current !== expected) {
  console.error('Redirect validation failed: public/_redirects is out of sync. Run "npm run generate:redirects".');
  process.exit(1);
}

console.log('Redirect validation passed.');
