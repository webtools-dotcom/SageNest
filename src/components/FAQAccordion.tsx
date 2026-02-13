interface FAQAccordionProps {
  items: Array<[string, string]>;
}

export const FAQAccordion = ({ items }: FAQAccordionProps) => (
  <section className="info-section">
    <h2>Frequently asked questions</h2>
    <div className="faq-list">
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  </section>
);
