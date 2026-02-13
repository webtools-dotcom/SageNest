import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase/client';

interface BlogRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const BlogPosterPage = () => {
  const [id, setId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const resolvedSlug = useMemo(() => (slug.trim() ? slugify(slug) : slugify(title)), [slug, title]);

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('blog')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      setMessage(`Failed to load posts: ${error.message}`);
      return;
    }

    setPosts((data ?? []) as BlogRow[]);
  };

  useEffect(() => {
    void loadPosts();
  }, []);

  const resetForm = () => {
    setId(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setContent('');
    setImageUrl('');
  };

  const onUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop() ?? 'jpg';
    const filePath = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ''))}.${fileExt}`;

    const { error } = await supabase.storage.from('blog').upload(filePath, file, { upsert: false });
    if (error) {
      setMessage(`Image upload failed: ${error.message}`);
      return;
    }

    const { data } = supabase.storage.from('blog').getPublicUrl(filePath);
    setImageUrl(data.publicUrl);
    setMessage('Image uploaded successfully.');
  };

  const savePost = async (isPublished: boolean) => {
    if (!title.trim() || !resolvedSlug || !content.trim()) {
      setMessage('Title, slug, and content are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    const payload = {
      title: title.trim(),
      slug: resolvedSlug,
      description: description.trim(),
      content,
      image_url: imageUrl || null,
      is_published: isPublished,
      updated_at: new Date().toISOString()
    };

    const result = id
      ? await supabase.from('blog').update(payload).eq('id', id).select().single()
      : await supabase.from('blog').insert({ ...payload, created_at: new Date().toISOString() }).select().single();

    setLoading(false);

    if (result.error) {
      setMessage(`Failed to save: ${result.error.message}`);
      return;
    }

    setMessage(isPublished ? 'Post published successfully.' : 'Draft saved successfully.');
    resetForm();
    await loadPosts();
  };

  const editPost = (post: BlogRow) => {
    setId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setDescription(post.description);
    setContent(post.content);
    setImageUrl(post.image_url ?? '');
    setMessage(`Editing “${post.title}”.`);
  };

  const deletePost = async (postId: string) => {
    const confirmed = window.confirm('Delete this post? This cannot be undone.');
    if (!confirmed) return;

    const { error } = await supabase.from('blog').delete().eq('id', postId);
    if (error) {
      setMessage(`Delete failed: ${error.message}`);
      return;
    }

    setMessage('Post deleted.');
    if (id === postId) resetForm();
    await loadPosts();
  };

  return (
    <main id="main-content" className="container">
      <section className="hero-card admin-card">
        <h1>Admin BlogPoster</h1>
        <p>Create drafts, publish posts, and upload blog images to Supabase Storage.</p>

        <div className="field-row">
          <label htmlFor="admin-title">Title</label>
          <input id="admin-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="field-row">
          <label htmlFor="admin-slug">Slug (optional, auto-generated from title)</label>
          <input id="admin-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={resolvedSlug} />
          <small>Final slug: {resolvedSlug || '—'}</small>
        </div>

        <div className="field-row">
          <label htmlFor="admin-description">Description</label>
          <input id="admin-description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="field-row">
          <label htmlFor="admin-content">Content (Markdown)</label>
          <textarea id="admin-content" rows={12} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <div className="field-row">
          <label htmlFor="admin-image">Upload feature image</label>
          <input
            id="admin-image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file);
            }}
          />
          {imageUrl ? <small>Image URL: {imageUrl}</small> : null}
        </div>

        <div className="cta-row">
          <button disabled={loading} onClick={() => void savePost(false)}>Save Draft</button>
          <button className="primary" disabled={loading} onClick={() => void savePost(true)}>Publish</button>
          {id ? <button disabled={loading} onClick={resetForm}>Cancel Edit</button> : null}
        </div>

        {message ? <p aria-live="polite">{message}</p> : null}
      </section>

      <section className="hero-card admin-card">
        <h2>Existing Posts</h2>
        {posts.length === 0 ? <p>No posts yet.</p> : null}
        {posts.map((post) => (
          <article key={post.id} className="post-row">
            <div>
              <h3>{post.title}</h3>
              <p>/{post.slug} · {post.is_published ? 'Published' : 'Draft'}</p>
            </div>
            <div className="cta-row">
              <button onClick={() => editPost(post)}>Edit</button>
              <button onClick={() => void deletePost(post.id)}>Delete</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};
