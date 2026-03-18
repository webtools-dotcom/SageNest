import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const hooksPath = '.githooks';

function safeRun(command, args) {
  try {
    return execFileSync(command, args, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (error) {
    return null;
  }
}

function main() {
  const insideWorkTree = safeRun('git', ['rev-parse', '--is-inside-work-tree']);

  if (insideWorkTree !== 'true') {
    console.log('Skipping git hook setup because this directory is not an active git worktree.');
    return;
  }

  const currentHooksPath = safeRun('git', ['config', '--local', '--get', 'core.hooksPath']);

  if (currentHooksPath === hooksPath) {
    console.log(`Git hooks already point to ${hooksPath}.`);
    return;
  }

  execFileSync('git', ['config', '--local', 'core.hooksPath', hooksPath], {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  console.log(`Configured git hooks to use ${hooksPath}.`);
}

main();
