import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEOHead = ({ title, description, canonicalPath, jsonLd }: SEOHeadProps): null => {
  useEffect(() => {
    document.title = title;
    const descTag = document.querySelector('meta[name="description"]') || document.createElement('meta');
    descTag.setAttribute('name', 'description');
    descTag.setAttribute('content', description);
    document.head.appendChild(descTag);

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `https://sagenest.app${canonicalPath}`);
    document.head.appendChild(canonical);

    const prior = document.getElementById('jsonld-root');
    if (prior) prior.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'jsonld-root';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, jsonLd]);
  return null;
};
