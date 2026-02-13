import { formatDate } from '../lib/calc';

interface ResultCardProps {
  dueDate: Date;
  gestational: string;
  trimester: string;
  conceptionWindow: string;
  summary: string;
}

export const ResultCard = ({ dueDate, gestational, trimester, conceptionWindow, summary }: ResultCardProps) => (
  <section className="results-card" aria-live="polite">
    <p className="eyebrow">Estimated due date</p>
    <h2>{formatDate(dueDate)}</h2>
    <p><strong>Current gestational age:</strong> {gestational}</p>
    <p><strong>Trimester:</strong> {trimester}</p>
    <p><strong>Estimated conception window:</strong> {conceptionWindow}</p>
    <p>{summary}</p>
    <p className="privacy">No personal data collected. All calculations happen securely in your browser.</p>
    <p className="disclaimer">For informational purposes only. Not medical advice. Consult a healthcare provider.</p>
  </section>
);
