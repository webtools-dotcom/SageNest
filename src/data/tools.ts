export type Tool = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  path: string;
  thumbnail?: string;
};

// Single source of truth for tool discovery.
// To add a new tool: add one object with unique id/slug + title/description + route path.
const tools: Tool[] = [
  {
    id: 'due-date',
    title: 'Pregnancy Due Date Calculator',
    slug: 'pregnancy-due-date-calculator',
    description: 'Calculate your due date using clinical standards.',
    path: '/pregnancy-due-date-calculator'
  },
  {
    id: 'weight-gain',
    title: 'Pregnancy Weight Gain Calculator',
    slug: 'pregnancy-weight-gain-calculator',
    description: 'Track safe weight gain ranges during pregnancy.',
    path: '/pregnancy-weight-gain-calculator'
  },
  {
    id: 'pregnancy-week-by-week',
    title: 'Pregnancy Week by Week',
    slug: 'pregnancy-week-by-week',
    description: 'Explore weekly baby development milestones and body changes across all 40 weeks.',
    path: '/pregnancy-week-by-week'
  },
  {
    id: 'morning-sickness-estimator',
    title: 'Morning Sickness End Date Estimator',
    slug: 'morning-sickness-end-date-estimator',
    description: 'Estimate when morning sickness may peak and improve based on your LMP.',
    path: '/morning-sickness-end-date-estimator'
  },
  {
    id: 'ovulation-calculator',
    title: 'Ovulation Calculator',
    slug: 'ovulation-calculator',
    description: 'Find your fertile window and peak conception days with an interactive calendar.',
    path: '/ovulation-calculator'
  }
];

export default tools;
