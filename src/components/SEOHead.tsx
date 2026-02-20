import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const SEOHead = ({ title, description, canonicalPath, ogImage, jsonLd }: SEOHeadProps): null => {
  const siteTagline = "SageNest Health \u2013 Smart Tools for Women's Wellness";

  useEffect(() => {
    const upsertMetaTag = (selectorType: 'property' | 'name', selectorValue: string, content: string): void => {
      const tagSelector = `meta[${selectorType}="${selectorValue}"]`;
      const metaTag = document.querySelector(tagSelector) || document.createElement('meta');
      metaTag.setAttribute(selectorType, selectorValue);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    };

    document.title = title.includes(siteTagline) ? title : `${title} | ${siteTagline}`;
    const descTag = document.querySelector('meta[name="description"]') || document.createElement('meta');
    descTag.setAttribute('name', 'description');
    descTag.setAttribute('content', description);
    document.head.appendChild(descTag);

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `https://sagenest.pages.dev${canonicalPath}`);
    document.head.appendChild(canonical);

    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:site_name', 'SageNest');
    upsertMetaTag('property', 'og:title', title);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:url', `https://sagenest.pages.dev${canonicalPath}`);
    if (ogImage) {
      upsertMetaTag('property', 'og:image', ogImage);
    }

    upsertMetaTag('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary');
    upsertMetaTag('name', 'twitter:title', title);
    upsertMetaTag('name', 'twitter:description', description);
    if (ogImage) {
      upsertMetaTag('name', 'twitter:image', ogImage);
    }

    const prior = document.getElementById('jsonld-root');
    if (prior) prior.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'jsonld-root';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonicalPath, ogImage, jsonLd]);
  return null;
};
