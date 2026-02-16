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
  }
];

export default tools;
