import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import ts from 'typescript';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const BLOG_POSTS_PATH = join(ROOT, 'src', 'data', 'blogPosts.ts');

function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function importTsModule(tsPath) {
  const source = readFileSync(tsPath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020
    },
    fileName: tsPath
  }).outputText;

  const encoded = Buffer.from(transpiled, 'utf8').toString('base64');
  return import(`data:text/javascript;base64,${encoded}`);
}

export async function loadBlogPosts() {
  const mod = await importTsModule(BLOG_POSTS_PATH);
  const posts = mod.blogPosts;

  if (!Array.isArray(posts)) {
    throw new Error('src/data/blogPosts.ts must export blogPosts as an array.');
  }

  return posts.map((post) => ({
    ...post,
    slug: typeof post.slug === 'string' ? post.slug.trim() : '',
    title: typeof post.title === 'string' ? post.title : '',
    description: typeof post.description === 'string' ? post.description : '',
    readingTime: typeof post.readingTime === 'string' ? post.readingTime : '1 min read',
    content: typeof post.content === 'string' ? post.content : '',
    faq: Array.isArray(post.faq) ? post.faq : [],
    updatedAt: isIsoDate(post.updatedAt) ? post.updatedAt : null,
    imageUrl: typeof post.imageUrl === 'string' && post.imageUrl.trim() ? post.imageUrl.trim() : null
  }));
}

export async function loadBlogSlugs() {
  const posts = await loadBlogPosts();
  return [...new Set(posts.map((post) => post.slug).filter(Boolean))];
}
