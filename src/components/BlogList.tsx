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
