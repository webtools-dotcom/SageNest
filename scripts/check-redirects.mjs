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
    const forms = [`/blog/${slug}`, `/blog/${slug}/`];
    const expectedTerminalTarget = `/blog-static/${slug}.html`;

    for (const source of forms) {
      const sourceRules = sourceToRules.get(source) ?? [];
      const uniqueSourceRules = [];
      const seen = new Set();

      for (const rule of sourceRules) {
        const key = `${rule.target} ${rule.status}`;
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        uniqueSourceRules.push(rule);
      }

      if (uniqueSourceRules.length > 1) {
        errors.push(
          `Conflicting redirect targets for ${source}. Found multiple non-identical rules: ${uniqueSourceRules.map(formatRule).join(' | ')}`
        );
      }

      const has301 = uniqueSourceRules.some((rule) => rule.status === 301);
      const has200 = uniqueSourceRules.some((rule) => rule.status === 200);
      if (has301 && has200) {
        errors.push(
          `Potential 301→200 chain for ${source}. Remove mixed statuses for the same source: ${uniqueSourceRules.map(formatRule).join(' | ')}`
        );
      }
    }

    for (const source of forms) {
      const visited = new Set();
      let current = source;
      let resolved = false;
      let depth = 0;

      while (depth < 20) {
        depth += 1;

        if (visited.has(current)) {
          errors.push(`Redirect cycle detected for slug "${slug}" while resolving ${source}. Cycle includes ${current}.`);
          break;
        }

        visited.add(current);
        const currentRules = sourceToRules.get(current) ?? [];
        const rule = pickUniqueRule(currentRules);

        if (!rule) {
          if (currentRules.length === 0) {
            errors.push(`Missing redirect/rewrite rule for slug "${slug}": ${current} should resolve to ${expectedTerminalTarget}.`);
          }
          break;
        }

        if (rule.status === 200) {
          if (rule.target !== expectedTerminalTarget) {
            errors.push(
              `Unexpected 200 rewrite while resolving slug "${slug}" from ${source}. Expected target ${expectedTerminalTarget}, found ${formatRule(rule)}.`
            );
          }
          resolved = true;
          break;
        }

        if (rule.status === 301) {
          current = rule.target;
          continue;
        }

        errors.push(`Unsupported status while resolving slug "${slug}" from ${source}: ${formatRule(rule)}.`);
        break;
      }

      if (!resolved && depth >= 20) {
        errors.push(`Redirect resolution exceeded depth limit for slug "${slug}" from ${source}.`);
      }
    }

    const legacyIndexPath = `/blog/${slug}/index.html`;
    const legacyIndexRules = sourceToRules.get(legacyIndexPath) ?? [];
    if (legacyIndexRules.length > 0) {
      errors.push(
        `Unexpected legacy rule for ${legacyIndexPath}. Blog rewrites must target /blog-static/<slug>.html only. Found: ${legacyIndexRules.map(formatRule).join(' | ')}`
      );
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
