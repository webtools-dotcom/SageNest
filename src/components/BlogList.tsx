 
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts as fallbackPosts } from '../data/blogPosts';
import { supabase } from '../supabase/client';
import { SEOHead } from './SEOHead';

interface PublicBlogPost {
  id?: string;
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  readingTime: string;
  content: string;
  image_url?: string | null;
}

export const BlogList = () => {
  const [posts, setPosts] = useState<PublicBlogPost[]>(fallbackPosts);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('blog')
        .select('id, slug, title, description, content, image_url, updated_at')
        .eq('is_published', true)
        .order('updated_at', { ascending: false });

      if (error || !data) return;

      const mapped: PublicBlogPost[] = data.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description ?? '',
        content: item.content,
        image_url: item.image_url,
        publishDate: item.updated_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        readingTime: `${Math.max(1, Math.ceil((item.content?.split(/\s+/).length ?? 0) / 200))} min read`
      }));

      setPosts(mapped);
    };

    void load();
  }, []);

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'Blog', name: 'SageNest Pregnancy Blog', url: 'https://sagenest.app/blog' },
    ...posts.map((post) => ({ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, datePublished: post.publishDate, description: post.description, url: `https://sagenest.app/blog/${post.slug}` }))

import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { SEOHead } from './SEOHead';

export const BlogList = () => {
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'Blog', name: 'SageNest Pregnancy Blog', url: 'https://sagenest.app/blog' },
    ...blogPosts.map((post) => ({ '@context': 'https://schema.org', '@type': 'Article', headline: post.title, datePublished: post.publishDate, description: post.description, url: `https://sagenest.app/blog/${post.slug}` }))

  ];

  return (
    <main id="main-content" className="container">
      <SEOHead title="Pregnancy & Due Date Guides — SageNest" description="Evidence-aware pregnancy planning guides from SageNest." canonicalPath="/blog" jsonLd={jsonLd} />
      <h1>Pregnancy & Due Date Guides — SageNest</h1>
      <div className="blog-grid">

        {posts.map((post) => (
          <article key={post.id ?? post.slug} className="blog-card">
            {post.image_url ? <img src={post.image_url} alt="" className="blog-thumb" loading="lazy" /> : null}

        {blogPosts.map((post) => (
          <article key={post.slug} className="blog-card">

            <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
            <p>{post.description}</p>
            <small>{post.publishDate} · {post.readingTime}</small>
          </article>
        ))}
      </div>
    </main>
  );
};
