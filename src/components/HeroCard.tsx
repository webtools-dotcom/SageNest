import type { ReactNode } from 'react';

export const HeroCard = ({ children }: { children: ReactNode }) => (
  <section className="hero-card" aria-label="Pregnancy due date calculator">
    {children}
  </section>
);
