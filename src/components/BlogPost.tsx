import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts as fallbackPosts } from '../data/blogPosts';
import { markdownToHtml } from '../lib/markdown';
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
  faq?: Array<{ question: string; answer: string }>;
}

export const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<PublicBlogPost | null>(() => fallbackPosts.find((p) => p.slug === slug) ?? null);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      const { data, error } = await supabase
        .from('blog')
        .select('id, slug, title, description, content, image_url, updated_at')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error || !data) return;

      setPost({
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description ?? '',
        content: data.content,
        image_url: data.image_url,
        publishDate: data.updated_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
        readingTime: `${Math.max(1, Math.ceil((data.content?.split(/\s+/).length ?? 0) / 200))} min read`
      });
    };

    void load();
  }, [slug]);

  const related = useMemo(() => fallbackPosts.filter((p) => p.slug !== post?.slug).slice(0, 2), [post?.slug]);
  const postHtml = useMemo(() => markdownToHtml(post?.content ?? ''), [post?.content]);

  if (!post) return <main className="container"><h1>Post not found</h1></main>;

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, datePublished: post.publishDate, mainEntityOfPage: `https://sagenest.app/blog/${post.slug}` },
    post.faq ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faq.map((x) => ({ '@type': 'Question', name: x.question, acceptedAnswer: { '@type': 'Answer', text: x.answer } })) } : null
  ].filter(Boolean) as Record<string, unknown>[];

  return (
    <main id="main-content" className="container article">
      <SEOHead title={`${post.title} — SageNest`} description={post.description} canonicalPath={`/blog/${post.slug}`} jsonLd={jsonLd} />
      <h1>{post.title}</h1>
      <p>{post.publishDate} · {post.readingTime}</p>
      {post.image_url ? <img src={post.image_url} alt="" className="blog-cover" loading="lazy" /> : null}
      <div dangerouslySetInnerHTML={{ __html: postHtml }} />
      <aside className="cta-inline"><h3>Try our Pregnancy Due Date Calculator</h3><Link to="/pregnancy-due-date-calculator">Open calculator</Link></aside>
      <section>
        <h2>Related posts</h2>
        {related.map((item) => <p key={item.slug}><Link to={`/blog/${item.slug}`}>{item.title}</Link></p>)}
      </section>
    </main>
  );
};
