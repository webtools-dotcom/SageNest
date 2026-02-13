import { KeyboardEvent, useId, useRef, useState } from 'react';

export type FAQItem = [string, string];

interface FAQAccordionProps {
  items: FAQItem[];
}

export const getFAQJsonLD = (faqs: FAQItem[]): string =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  });

export const FAQAccordion = ({ items }: FAQAccordionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sectionId = useId();

  const focusTrigger = (nextIndex: number) => {
    const total = items.length;
    if (!total) return;
    const normalized = (nextIndex + total) % total;
    triggerRefs.current[normalized]?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusTrigger(index + 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusTrigger(index - 1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setExpandedIndex((current) => (current === index ? null : index));
    }
  };

  return (
    <section className="info-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {items.map(([question, answer], index) => {
          const panelId = `${sectionId}-panel-${index}`;
          const triggerId = `${sectionId}-trigger-${index}`;
          const isExpanded = expandedIndex === index;

          return (
            <article className="faq-item" key={question}>
              <h3 className="faq-item__heading">
                <button
                  ref={(element) => {
                    triggerRefs.current[index] = element;
                  }}
                  id={triggerId}
                  type="button"
                  className="faq-item__trigger"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => setExpandedIndex((current) => (current === index ? null : index))}
                  onKeyDown={(event) => onTriggerKeyDown(event, index)}
                >
                  {question}
                </button>
              </h3>
              <div
                id={panelId}
                className="faq-item__panel"
                role="region"
                aria-labelledby={triggerId}
                hidden={!isExpanded}
              >
                <p>{answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
