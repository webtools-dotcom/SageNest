import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogPosts as fallbackPosts } from '../data/blogPosts';
import { markdownToHtml } from '../lib/markdown';
import { supabase } from '../supabase/client';
import { SEOHead } from './SEOHead';
import { DisclaimerBox } from './DisclaimerBox';

interface PublicBlogPost {
  id?: string;
  slug: string;
  title: string;
  description: string;
  readingTime: string;
  lastReviewed?: string;
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
        readingTime: `${Math.max(1, Math.ceil((data.content?.split(/\s+/).length ?? 0) / 200))} min read`
      });
    };

    void load();
  }, [slug]);

  const related = useMemo(() => fallbackPosts.filter((p) => p.slug !== post?.slug).slice(0, 2), [post?.slug]);
  const postHtml = useMemo(() => markdownToHtml(post?.content ?? ''), [post?.content]);

  if (!post) {
    return (
      <main id="main-content" className="container">
        <SEOHead
          title="Post not found"
          description="The blog post you requested could not be found. Browse all SageNest blog posts."
          canonicalPath="/blog"
          noIndex
        />
        <h1>Post not found</h1>
      </main>
    );
  }

  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, mainEntityOfPage: `https://sagenesthealth.com/blog/${post.slug}` },
    post.faq ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faq.map((x) => ({ '@type': 'Question', name: x.question, acceptedAnswer: { '@type': 'Answer', text: x.answer } })) } : null
  ].filter(Boolean) as Record<string, unknown>[];

  return (
    <main id="main-content" className="container article">
      <SEOHead
        title={post.title}
        description={post.description}
        canonicalPath={`/blog/${post.slug}`}
        ogImage={post.image_url ?? undefined}
        jsonLd={jsonLd}
      />
      <h1>{post.title}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '-0.25rem' }}>
        {post.readingTime}
        {post.lastReviewed && (
          <> · <span>Last reviewed: {post.lastReviewed}</span></>
        )}
      </p>
      {post.image_url ? <img src={post.image_url} alt="" className="blog-cover" loading="lazy" /> : null}
      <div dangerouslySetInnerHTML={{ __html: postHtml }} />

      {/* Author box */}
      <Link
        to="/editorial-team"
        style={{ textDecoration: 'none', display: 'block', marginTop: 'var(--space-lg)' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            background: 'var(--sage-softest)',
            border: '1px solid var(--sage-light)',
            borderRadius: 'var(--radius-md)',
            transition: 'box-shadow var(--transition-base)',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sage)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div style={{
            flexShrink: 0,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src="/sagenest-main-logo.png"
              alt=""
              width="48"
              height="48"
              loading="lazy"
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Written by
            </p>
            <p style={{ margin: '0.1rem 0 0.25rem', fontWeight: 600, color: 'var(--charcoal)', fontSize: '0.95rem' }}>
              SageNest Editorial Team
            </p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              Researched from ACOG, WHO, CDC, NIH, and IOM guidelines. Evidence-based, never anecdotal.
            </p>
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--sage-dark)', fontSize: '1rem', flexShrink: 0 }}>
            →
          </div>
        </div>
      </Link>

      <DisclaimerBox variant="full" />

      <aside className="cta-inline" style={{ marginTop: 'var(--space-lg)' }}>
        <h3>Try our Pregnancy Due Date Calculator</h3>
        <Link to="/pregnancy-due-date-calculator">Open calculator</Link>
      </aside>

      <section>
        <h2>Related posts</h2>
        {related.map((item) => <p key={item.slug}><a href={`/blog/${item.slug}`}>{item.title}</a></p>)}
      </section>
    </main>
  );
};
