import { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

interface DisclaimerBoxProps {
  variant?: 'full' | 'compact';
}

export const DisclaimerBox = ({ variant = 'compact' }: DisclaimerBoxProps) => {
  const boxStyle: CSSProperties = {
    background: 'var(--sage-softest)',
    border: '1px solid var(--sage-light)',
    borderLeft: '4px solid var(--sage-primary)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-lg)',
    marginTop: 'var(--space-2xl)',
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  };

  if (variant === 'full') {
    return (
      <div style={boxStyle} role="note" aria-label="Medical information disclaimer">
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: 'var(--charcoal)', fontSize: '0.9rem' }}>
          ⚕ Medical Information Disclaimer
        </p>
        <p style={{ margin: '0 0 0.5rem' }}>
          SageNest is a health information and tools platform. All content on this site is researched from guidelines published by the American College of Obstetricians and Gynecologists (ACOG), the World Health Organization (WHO), the Centers for Disease Control and Prevention (CDC), the National Institutes of Health (NIH), and the Institute of Medicine (IOM).
        </p>
        <p style={{ margin: 0 }}>
          This content is for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your healthcare provider before making any decisions about your pregnancy or health. Learn about our{' '}
          <Link to="/editorial-team" style={{ color: 'var(--sage-dark)' }}>editorial standards</Link>.
        </p>
      </div>
    );
  }

  return (
    <div style={boxStyle} role="note" aria-label="Medical information disclaimer">
      <p style={{ margin: 0 }}>
        <strong style={{ color: 'var(--charcoal)' }}>⚕ Medical Disclaimer:</strong>{' '}
        SageNest content is sourced from ACOG, WHO, CDC, NIH, and IOM guidelines for informational purposes only. It is not medical advice. Always consult your healthcare provider. Learn about our{' '}
        <Link to="/editorial-team" style={{ color: 'var(--sage-dark)' }}>editorial standards</Link>.
      </p>
    </div>
  );
};
