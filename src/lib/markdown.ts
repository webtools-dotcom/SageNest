const removeRawHtml = (markdown: string): string => {
  return markdown
    .replace(/<\s*(script|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/<[^>]+>/g, '');
};

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const decodeHtmlEntities = (value: string): string => {
  return value
    .replace(/&amp;?/gi, '&')
    .replace(/&#(\d+);?/g, (_match, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);?/gi, (_match, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&colon;?/gi, ':');
};

const decodeForProtocolCheck = (value: string): string => {
  let decoded = value;

  for (let pass = 0; pass < 5; pass += 1) {
    let next = decodeHtmlEntities(decoded);

    try {
      next = decodeURIComponent(next);
    } catch {
      // Keep the best-effort decoded value for comparison.
    }

    if (next === decoded) {
      break;
    }

    decoded = next;
  }

  return decoded;
};

const sanitizeUrl = (url: string): string => {
  const trimmed = url.trim();
  const quoteStripped = trimmed.replace(/^['"]|['"]$/g, '');
  const firstToken = quoteStripped.split(/\s+/)[0] ?? '';
  const decodedComparison = decodeForProtocolCheck(quoteStripped)
    .toLowerCase()
    .replace(/[\u0000-\u001F\u007F\s]+/g, '');

  if (
    decodedComparison.startsWith('javascript:') ||
    decodedComparison.startsWith('data:') ||
    decodedComparison.startsWith('vbscript:') ||
    decodedComparison.startsWith('file:')
  ) {
    return '#';
  }

  return firstToken;
};

const renderInlineMarkdown = (text: string): string => {
  const escaped = escapeHtml(text);

  return escaped
    .replace(/\[(.*?)\]\((.*?)\)/g, (_match, label: string, href: string) => `<a href="${escapeHtml(sanitizeUrl(href))}">${label}</a>`)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

export const markdownToHtml = (markdown: string): string => {
  const cleanMarkdown = removeRawHtml(markdown);

  return cleanMarkdown
    .split(/\n\n+/)
    .map((rawBlock) => rawBlock.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split('\n').map((line) => line.trim());

      if (lines.length === 1) {
        const line = lines[0];
        if (line.startsWith('### ')) return `<h3>${renderInlineMarkdown(line.slice(4))}</h3>`;
        if (line.startsWith('## ')) return `<h2>${renderInlineMarkdown(line.slice(3))}</h2>`;
        if (line.startsWith('# ')) return `<h1>${renderInlineMarkdown(line.slice(2))}</h1>`;
      }

      if (lines.every((line) => /^-\s+/.test(line))) {
        const items = lines.map((line) => `<li>${renderInlineMarkdown(line.replace(/^-\s+/, ''))}</li>`).join('');
        return `<ul>${items}</ul>`;
      }

      return `<p>${lines.map((line) => renderInlineMarkdown(line)).join('<br />')}</p>`;
    })
    .join('');
};
