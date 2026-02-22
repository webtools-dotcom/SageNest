export interface PregnancyWeek {
  week: number;
  trimester: 'First trimester' | 'Second trimester' | 'Third trimester';
  title: string;
  summary: string;
  baby: {
    sizeComparison: string;
    development: string[];
  };
  body: {
    symptoms: {
      common: string[];
      lessCommon: string[];
      redFlags: string[];
    };
    milestones: string[];
  };
  preparation: {
    checklist: string[];
    appointmentFocus: string;
  };
  wellness: {
    nutrition: string[];
    movement: string[];
  };
  funFact: string;
  disclaimer: string;
}

const defaultDisclaimer = 'Educational guidance only. Symptoms and timelines vary by person, so contact your prenatal clinician for personalized advice or urgent concerns.';

const sizeByWeek = [
  'poppy seed', 'sesame seed', 'lentil', 'blueberry', 'apple seed', 'sweet pea', 'raspberry', 'kidney bean', 'grape', 'kumquat',
  'fig', 'lime', 'pea pod', 'lemon', 'apple', 'avocado', 'pomegranate', 'bell pepper', 'tomato', 'banana',
  'carrot', 'spaghetti squash', 'large mango', 'ear of corn', 'rutabaga', 'scallion bunch', 'cauliflower head', 'eggplant', 'butternut squash', 'cabbage',
  'coconut', 'jicama', 'pineapple', 'cantaloupe', 'honeydew melon', 'romaine heart', 'Swiss chard bunch', 'leek bunch', 'small watermelon', 'mini pumpkin'
] as const;

const weekMilestone = (week: number): string => {
  if (week <= 4) return 'Early pregnancy support starts with folic acid, medication review, and confirming prenatal care plans.';
  if (week <= 8) return 'Core organs and neural structures are developing rapidly, making routine prenatal guidance especially important.';
  if (week <= 13) return 'First-trimester screening discussions often begin, including labs, ultrasound timing, and symptom management.';
  if (week <= 20) return 'Growth and movement become easier to track, and anatomy-scan planning is usually reviewed with your care team.';
  if (week <= 27) return 'Second-trimester monitoring often includes glucose testing, blood pressure checks, and ongoing fetal growth review.';
  if (week <= 34) return 'Third-trimester visits focus on movement patterns, blood pressure trends, and delivery preference conversations.';
  return 'Final-weeks planning usually covers labor signs, postpartum support, and when to contact triage or labor and delivery.';
};

const getTrimester = (week: number): PregnancyWeek['trimester'] => {
  if (week <= 13) return 'First trimester';
  if (week <= 27) return 'Second trimester';
  return 'Third trimester';
};

const createWeek = (week: number): PregnancyWeek => ({
  week,
  trimester: getTrimester(week),
  title: `Pregnancy week ${week}`,
  summary: `Week ${week} is a checkpoint for tracking development, maternal symptoms, and practical planning with your prenatal team.`,
  baby: {
    sizeComparison: sizeByWeek[week - 1],
    development: [
      `Growth this week is often compared to a ${sizeByWeek[week - 1]} by educational references.`,
      weekMilestone(week),
      'Exact growth pace can differ from pregnancy to pregnancy and is interpreted with ultrasound and clinical context.',
    ],
  },
  body: {
    symptoms: {
      common: [
        'Fatigue or changing sleep quality.',
        'Digestive shifts such as bloating, nausea, or heartburn.',
        'Breast, pelvic, or back discomfort that can fluctuate during the week.',
      ],
      lessCommon: [
        'Headaches, nasal congestion, or skin changes.',
        'Mood variability related to hormones, stress, and sleep.',
      ],
      redFlags: [
        'Heavy bleeding, fluid leakage, or regular painful contractions before term.',
        'Persistent severe headache, vision changes, chest pain, or shortness of breath.',
        'Fever, severe abdominal pain, or noticeably reduced fetal movement in later pregnancy.',
      ],
    },
    milestones: [
      weekMilestone(week),
      'Symptom intensity may change quickly, so week-to-week tracking can improve appointment discussions.',
    ],
  },
  preparation: {
    checklist: [
      'Write down new symptoms, medication questions, and mental health check-ins for your next visit.',
      'Review hydration, protein, fiber, and iron-rich meal patterns that fit your clinician guidance.',
      'Plan practical support (work schedule, household help, and postpartum resources) early when possible.',
    ],
    appointmentFocus: week <= 13
      ? 'Confirm dating, baseline labs, and first-trimester screening options with your clinician.'
      : week <= 27
        ? 'Review anatomy and growth updates, glucose screening, and blood pressure trends.'
        : 'Discuss labor planning, fetal movement expectations, and postpartum recovery support.',
  },
  wellness: {
    nutrition: [
      'Use food safety and prenatal vitamin guidance from your care team.',
      'Maintain steady hydration and include nutrient-dense snacks if appetite fluctuates.',
    ],
    movement: [
      'Use low-impact movement as tolerated and approved by your clinician.',
      'Stop activity and seek care if you notice warning symptoms such as dizziness, bleeding, or contractions.',
    ],
  },
  funFact: `By week ${week}, pregnancy care still relies on gestational-age tracking from the first day of the last menstrual period rather than conception date alone.`,
  disclaimer: defaultDisclaimer,
});

export const pregnancyWeeks: PregnancyWeek[] = Array.from({ length: 40 }, (_, index) => createWeek(index + 1));

export const pregnancyWeekByNumber: Record<number, PregnancyWeek> = pregnancyWeeks.reduce<Record<number, PregnancyWeek>>((accumulator, weekData) => {
  accumulator[weekData.week] = weekData;
  return accumulator;
}, {});

const hasAllWeeks = pregnancyWeeks.length === 40 && pregnancyWeeks.every((weekData, index) => weekData.week === index + 1);

if (!hasAllWeeks) {
  throw new Error('pregnancyWeeks must include exactly weeks 1 through 40 in order.');
}
