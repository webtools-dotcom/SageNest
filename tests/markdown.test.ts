import { describe, expect, test } from 'vitest';
import { blogPosts } from '../src/data/blogPosts';
import { markdownToHtml } from '../src/lib/markdown';

describe('markdownToHtml sanitization', () => {
  test('strips raw script tags and content', () => {
    const html = markdownToHtml('# Hello\n\n<script>alert("xss")</script>Safe text');

    expect(html).toContain('<h1>Hello</h1>');
    expect(html).toContain('<p>Safe text</p>');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('alert("xss")');
  });

  test('removes inline event handler payloads from raw html', () => {
    const html = markdownToHtml('<img src="x" onerror="alert(1)">\n\n<a href="https://example.com" onclick="steal()">bad</a>');

    expect(html).not.toContain('onerror');
    expect(html).not.toContain('onclick');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<a href=');
  });

  test('blocks javascript protocol in markdown links', () => {
    const html = markdownToHtml('[Run this](javascript:alert(1))');

    expect(html).toContain('<a href="#">Run this</a>');
    expect(html).not.toContain('javascript:');
  });

  test('keeps safe markdown rendering for fallback and Supabase-like posts', () => {
    const fallbackContent = blogPosts[0].content;
    const supabaseLikeContent = '# Title\n\nA **bold** line and [safe link](https://example.com).\n\n- Item one\n- Item two';

    const fallbackHtml = markdownToHtml(fallbackContent);
    const supabaseHtml = markdownToHtml(supabaseLikeContent);

    expect(fallbackHtml).toContain('<h2>');
    expect(fallbackHtml).toContain('<p>');

    expect(supabaseHtml).toContain('<h1>Title</h1>');
    expect(supabaseHtml).toContain('<strong>bold</strong>');
    expect(supabaseHtml).toContain('<a href="https://example.com">safe link</a>');
    expect(supabaseHtml).toContain('<ul><li>Item one</li><li>Item two</li></ul>');
  });
});
