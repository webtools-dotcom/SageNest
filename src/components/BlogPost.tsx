import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { markdownToHtml } from '../lib/markdown';
import { SEOHead } from './SEOHead';

export const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return <main className="container"><h1>Post not found</h1></main>;

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const jsonLd = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.description, datePublished: post.publishDate, mainEntityOfPage: `https://sagenest.app/blog/${post.slug}` },
    post.faq ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faq.map((x) => ({ '@type': 'Question', name: x.question, acceptedAnswer: { '@type': 'Answer', text: x.answer } })) } : null
  ].filter(Boolean) as Record<string, unknown>[];

  return (
    <main id="main-content" className="container article">
      <SEOHead title={`${post.title} — SageNest`} description={post.description} canonicalPath={`/blog/${post.slug}`} jsonLd={jsonLd} />
      <h1>{post.title}</h1>
      <p>{post.publishDate} · {post.readingTime}</p>
      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
      <aside className="cta-inline"><h3>Try our Pregnancy Due Date Calculator</h3><Link to="/pregnancy-due-date-calculator">Open calculator</Link></aside>
      <section>
        <h2>Related posts</h2>
        {related.map((item) => <p key={item.slug}><Link to={`/blog/${item.slug}`}>{item.title}</Link></p>)}
      </section>
    </main>
  );
};
