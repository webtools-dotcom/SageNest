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

  test('blocks javascript protocol encoded as html entities', () => {
    const html = markdownToHtml('[x](javascript&#58;alert(1))');

    expect(html).toContain('<a href="#">x</a>');
    expect(html).not.toContain('javascript&#58;');
  });

  test('blocks javascript protocol encoded with percent encoding', () => {
    const html = markdownToHtml('[x](javascript%3Aalert(1))');

    expect(html).toContain('<a href="#">x</a>');
    expect(html).not.toContain('javascript%3A');
  });

  test('blocks mixed-case and whitespace-obfuscated dangerous protocol variants', () => {
    const mixedCaseEntity = markdownToHtml('[x](JaVaScRiPt&#x3A;alert(1))');
    const whitespaceObfuscated = markdownToHtml('[x](java\tscript:alert(1))');

    expect(mixedCaseEntity).toContain('<a href="#">x</a>');
    expect(whitespaceObfuscated).toContain('<a href="#">x</a>');
  });

  test('keeps safe https markdown links rendering correctly', () => {
    const html = markdownToHtml('[x](https://example.com/docs?q=1)');

    expect(html).toContain('<a href="https://example.com/docs?q=1">x</a>');
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
