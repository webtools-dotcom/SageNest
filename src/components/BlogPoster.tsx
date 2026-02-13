import { useMemo, useState } from 'react';

export const BlogPoster = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('## Heading\nWrite your post here.');

  const snippet = useMemo(() => {
    return `{
  slug: '${slug}',
  title: '${title}',
  description: '${description}',
  publishDate: '${new Date().toISOString().slice(0, 10)}',
  readingTime: '6 min read',
  content: \`${content.replace(/`/g, '\\`')}\`
},`;
  }, [title, slug, description, content]);

  return (
    <main id="main-content" className="container">
      <h1>BlogPoster</h1>
      <p>Static internal publishing helper.</p>
      <div className="field-row"><label htmlFor="bp-title">Title</label><input id="bp-title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div className="field-row"><label htmlFor="bp-slug">Slug</label><input id="bp-slug" value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
      <div className="field-row"><label htmlFor="bp-desc">Description</label><input id="bp-desc" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div className="field-row"><label htmlFor="bp-content">Content (Markdown)</label><textarea id="bp-content" rows={12} value={content} onChange={(e) => setContent(e.target.value)} /></div>
      <h2>Generated object snippet</h2>
      <pre>{snippet}</pre>
      <button onClick={() => navigator.clipboard.writeText(snippet)}>Copy to clipboard</button>
      <h2>Preview</h2>
      <article className="blog-card"><h3>{title || 'Untitled post'}</h3><p>{description || 'Description preview.'}</p></article>
    </main>
  );
};
