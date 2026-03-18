import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const readmePath = path.join(repoRoot, 'README.md');
const sectionHeader = '## Exact Repository Worktree Structure';

function getTrackedFiles() {
  const output = execFileSync('git', ['ls-files'], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  return output
    .split('\n')
    .map((filePath) => filePath.trim())
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
}

function buildTree(paths) {
  const root = createNode('.', true);

  for (const filePath of paths) {
    const segments = filePath.split('/');
    let current = root;

    segments.forEach((segment, index) => {
      const isDirectory = index < segments.length - 1;
      let child = current.children.get(segment);

      if (!child) {
        child = createNode(segment, isDirectory);
        current.children.set(segment, child);
      }

      if (isDirectory) {
        child.isDirectory = true;
      }

      current = child;
    });
  }

  return ['.', ...renderChildren(root)].join('\n');
}

function createNode(name, isDirectory) {
  return {
    name,
    isDirectory,
    children: new Map(),
  };
}

function sortNodes(nodes) {
  return [...nodes].sort((left, right) => {
    if (left.isDirectory !== right.isDirectory) {
      return left.isDirectory ? -1 : 1;
    }

    return left.name.localeCompare(right.name);
  });
}

function renderChildren(node, prefix = '') {
  const children = sortNodes(node.children.values());

  return children.flatMap((child, index) => {
    const isLast = index === children.length - 1;
    const branch = isLast ? '└── ' : '├── ';
    const nextPrefix = prefix + (isLast ? '    ' : '│   ');
    const line = `${prefix}${branch}${child.name}${child.isDirectory ? '/' : ''}`;

    if (!child.isDirectory) {
      return [line];
    }

    return [line, ...renderChildren(child, nextPrefix)];
  });
}

function replaceWorktreeSection(readmeContent, treeText) {
  const sectionStart = readmeContent.indexOf(sectionHeader);

  if (sectionStart === -1) {
    throw new Error(`Could not find "${sectionHeader}" in README.md.`);
  }

  const blockStart = readmeContent.indexOf('```text', sectionStart);
  const blockEnd = readmeContent.indexOf('```', blockStart + '```text'.length);

  if (blockStart === -1 || blockEnd === -1) {
    throw new Error('Could not find the worktree code block in README.md.');
  }

  return `${readmeContent.slice(0, blockStart)}\`\`\`text\n${treeText}\n\`\`\`${readmeContent.slice(blockEnd + 3)}`;
}

function main() {
  const readmeContent = readFileSync(readmePath, 'utf8');
  const trackedFiles = getTrackedFiles();
  const treeText = buildTree(trackedFiles);
  const updatedReadme = replaceWorktreeSection(readmeContent, treeText);

  if (updatedReadme === readmeContent) {
    console.log('README.md worktree structure already matches tracked files.');
    return;
  }

  writeFileSync(readmePath, updatedReadme);
  console.log('Updated README.md worktree structure to match git ls-files.');
}

main();
