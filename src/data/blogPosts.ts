export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  readingTime: string;
  content: string;
  faq?: Array<{ question: string; answer: string }>;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-due-dates-are-calculated',
    title: 'How Pregnancy Due Dates Are Calculated in Clinical Practice',
    description: 'Understand LMP, ultrasound adjustments, and what due dates really mean for care planning.',
    publishDate: '2026-01-10',
    readingTime: '7 min read',
    content: `## Why a due date is an estimate\nA due date guides timing for scans and checkups, but only a small portion of births happen on one exact day.\n\n## The LMP method\nMost offices begin with your first day of last menstrual period and apply Naegele's rule.\n\n## When ultrasound updates dating\nIf cycle timing is uncertain, first-trimester ultrasound may provide a more accurate expected delivery date.`
  },
  {
    slug: 'ivf-due-date-guide',
    title: 'IVF Due Date Guide: Transfer Day to Delivery Window',
    description: 'A practical IVF-focused due date guide including embryo age adjustments and trimester planning.',
    publishDate: '2026-01-18',
    readingTime: '6 min read',
    content: `## Why IVF dating is specific\nEmbryo age is known at transfer, so due-date estimates can be especially precise.\n\n## Formula used\nUse transfer date + (280 - embryo age days).\n\n## Practical planning\nBring your IVF dates to prenatal intake so records remain consistent across providers.`
  },
  {
    slug: 'pregnancy-week-by-week-milestones',
    title: 'Pregnancy Week-by-Week Milestones to Track with Confidence',
    description: 'A calm framework for understanding trimester milestones and discussing questions with your care team.',
    publishDate: '2026-01-24',
    readingTime: '8 min read',
    content: `## First trimester basics\nSymptoms can vary significantly, which is common and expected.\n\n## Second trimester momentum\nMany parents feel improved energy and begin anatomy-scan preparation.\n\n## Third trimester preparation\nFocus on movement awareness, birth preferences, and postpartum planning.`
  }
];
