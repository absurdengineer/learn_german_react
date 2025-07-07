export interface StudyDay {
  day: number;
  title: string;
  description: string;
  focusAreas: string[];
  vocabularyWords: string[];
  grammarTopics: string[];
  exercises: Exercise[];
  estimatedTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Exercise {
  id: string;
  type: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'writing' | 'reading';
  title: string;
  description: string;
  estimatedTime: number;
  isRequired: boolean;
}

export const STUDY_PLAN: StudyDay[] = [
  // Week 1: Foundation
  {
    day: 1,
    title: 'Welcome to German!',
    description: 'Basic greetings and introductions',
    focusAreas: ['greetings', 'personal_info', 'numbers_1-10'],
    vocabularyWords: ['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10'],
    grammarTopics: ['personal_pronouns'],
    exercises: [
      {
        id: 'e1_1',
        type: 'vocabulary',
        title: 'Learn Basic Greetings',
        description: 'Master hello, goodbye, please, thank you',
        estimatedTime: 15,
        isRequired: true
      },
      {
        id: 'e1_2',
        type: 'speaking',
        title: 'Practice Introduction',
        description: 'Record yourself saying "Hallo, ich bin..."',
        estimatedTime: 10,
        isRequired: true
      }
    ],
    estimatedTime: 30,
    difficulty: 'easy'
  },
  {
    day: 2,
    title: 'Family and Numbers',
    description: 'Learn family members and numbers 1-20',
    focusAreas: ['family', 'numbers_1-20'],
    vocabularyWords: ['v11', 'v12', 'v13', 'v14', 'v15', 'v21', 'v22', 'v23', 'v24', 'v25'],
    grammarTopics: ['definite_articles'],
    exercises: [
      {
        id: 'e2_1',
        type: 'vocabulary',
        title: 'Family Members',
        description: 'Learn mother, father, brother, sister',
        estimatedTime: 20,
        isRequired: true
      },
      {
        id: 'e2_2',
        type: 'vocabulary',
        title: 'Count to 20',
        description: 'Practice numbers 1-20',
        estimatedTime: 15,
        isRequired: true
      }
    ],
    estimatedTime: 35,
    difficulty: 'easy'
  },
  {
    day: 3,
    title: 'Colors and Objects',
    description: 'Basic colors and everyday objects',
    focusAreas: ['colors', 'objects', 'descriptions'],
    vocabularyWords: ['v31', 'v32', 'v33', 'v34', 'v35', 'v36', 'v37', 'v38', 'v39', 'v40'],
    grammarTopics: ['adjectives_basic'],
    exercises: [
      {
        id: 'e3_1',
        type: 'vocabulary',
        title: 'Learn Colors',
        description: 'Master basic colors',
        estimatedTime: 15,
        isRequired: true
      },
      {
        id: 'e3_2',
        type: 'grammar',
        title: 'Color Descriptions',
        description: 'Practice "Das ist rot" constructions',
        estimatedTime: 20,
        isRequired: true
      }
    ],
    estimatedTime: 35,
    difficulty: 'easy'
  },
  {
    day: 4,
    title: 'Food and Drinks',
    description: 'Essential food vocabulary',
    focusAreas: ['food', 'drinks', 'shopping'],
    vocabularyWords: ['v41', 'v42', 'v43', 'v44', 'v45', 'v46', 'v47', 'v48', 'v49', 'v50'],
    grammarTopics: ['indefinite_articles'],
    exercises: [
      {
        id: 'e4_1',
        type: 'vocabulary',
        title: 'Food Items',
        description: 'Learn essential food vocabulary',
        estimatedTime: 20,
        isRequired: true
      },
      {
        id: 'e4_2',
        type: 'speaking',
        title: 'Order Food',
        description: 'Practice ordering in a restaurant',
        estimatedTime: 15,
        isRequired: true
      }
    ],
    estimatedTime: 40,
    difficulty: 'easy'
  },
  {
    day: 5,
    title: 'Review Week 1',
    description: 'Review and practice everything from week 1',
    focusAreas: ['review', 'practice', 'assessment'],
    vocabularyWords: [], // Review previous words
    grammarTopics: ['week1_review'],
    exercises: [
      {
        id: 'e5_1',
        type: 'vocabulary',
        title: 'Week 1 Vocabulary Quiz',
        description: 'Test your knowledge of learned words',
        estimatedTime: 20,
        isRequired: true
      },
      {
        id: 'e5_2',
        type: 'speaking',
        title: 'Conversation Practice',
        description: 'Use all learned phrases in context',
        estimatedTime: 15,
        isRequired: true
      }
    ],
    estimatedTime: 40,
    difficulty: 'medium'
  },
  {
    day: 6,
    title: 'Weekend Practice',
    description: 'Light practice and consolidation',
    focusAreas: ['review', 'relaxed_learning'],
    vocabularyWords: [],
    grammarTopics: [],
    exercises: [
      {
        id: 'e6_1',
        type: 'reading',
        title: 'Read Simple Text',
        description: 'Read a short German text about family',
        estimatedTime: 20,
        isRequired: false
      }
    ],
    estimatedTime: 20,
    difficulty: 'easy'
  },
  {
    day: 7,
    title: 'Week 1 Assessment',
    description: 'Test your progress from week 1',
    focusAreas: ['testing', 'assessment'],
    vocabularyWords: [],
    grammarTopics: [],
    exercises: [
      {
        id: 'e7_1',
        type: 'vocabulary',
        title: 'Week 1 Final Test',
        description: 'Comprehensive test of week 1 material',
        estimatedTime: 30,
        isRequired: true
      }
    ],
    estimatedTime: 30,
    difficulty: 'medium'
  },
  // Week 2: Building Blocks
  {
    day: 8,
    title: 'Time and Days',
    description: 'Learn time expressions and days of the week',
    focusAreas: ['time', 'days', 'schedule'],
    vocabularyWords: [],
    grammarTopics: ['time_expressions'],
    exercises: [
      {
        id: 'e8_1',
        type: 'vocabulary',
        title: 'Days of the Week',
        description: 'Learn all seven days',
        estimatedTime: 15,
        isRequired: true
      },
      {
        id: 'e8_2',
        type: 'grammar',
        title: 'Telling Time',
        description: 'Practice "Es ist..." constructions',
        estimatedTime: 20,
        isRequired: true
      }
    ],
    estimatedTime: 40,
    difficulty: 'medium'
  },
  {
    day: 9,
    title: 'Clothing and Weather',
    description: 'Describe clothing and weather conditions',
    focusAreas: ['clothing', 'weather', 'seasons'],
    vocabularyWords: [],
    grammarTopics: ['weather_expressions'],
    exercises: [
      {
        id: 'e9_1',
        type: 'vocabulary',
        title: 'Clothing Items',
        description: 'Learn basic clothing vocabulary',
        estimatedTime: 20,
        isRequired: true
      },
      {
        id: 'e9_2',
        type: 'speaking',
        title: 'Weather Report',
        description: 'Practice describing weather',
        estimatedTime: 15,
        isRequired: true
      }
    ],
    estimatedTime: 40,
    difficulty: 'medium'
  },
  {
    day: 10,
    title: 'House and Home',
    description: 'Rooms, furniture, and household items',
    focusAreas: ['house', 'rooms', 'furniture'],
    vocabularyWords: [],
    grammarTopics: ['prepositions_location'],
    exercises: [
      {
        id: 'e10_1',
        type: 'vocabulary',
        title: 'Rooms and Furniture',
        description: 'Learn house vocabulary',
        estimatedTime: 25,
        isRequired: true
      },
      {
        id: 'e10_2',
        type: 'grammar',
        title: 'Location Prepositions',
        description: 'Practice "in", "auf", "unter"',
        estimatedTime: 20,
        isRequired: true
      }
    ],
    estimatedTime: 45,
    difficulty: 'medium'
  }
];

export const STUDY_PLAN_STATS = {
  totalDays: STUDY_PLAN.length,
  totalEstimatedTime: STUDY_PLAN.reduce((acc, day) => acc + day.estimatedTime, 0),
  averageDailyTime: Math.round(STUDY_PLAN.reduce((acc, day) => acc + day.estimatedTime, 0) / STUDY_PLAN.length),
  difficultyDistribution: {
    easy: STUDY_PLAN.filter(day => day.difficulty === 'easy').length,
    medium: STUDY_PLAN.filter(day => day.difficulty === 'medium').length,
    hard: STUDY_PLAN.filter(day => day.difficulty === 'hard').length,
  },
  exerciseTypes: STUDY_PLAN.reduce((acc, day) => {
    day.exercises.forEach(exercise => {
      acc[exercise.type] = (acc[exercise.type] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>)
};

export function getStudyDayById(dayNumber: number): StudyDay | undefined {
  return STUDY_PLAN.find(day => day.day === dayNumber);
}

export function getStudyDaysByWeek(weekNumber: number): StudyDay[] {
  const startDay = (weekNumber - 1) * 7 + 1;
  const endDay = weekNumber * 7;
  return STUDY_PLAN.filter(day => day.day >= startDay && day.day <= endDay);
}

export function getNextStudyDay(currentDay: number): StudyDay | undefined {
  return STUDY_PLAN.find(day => day.day === currentDay + 1);
}

export function calculateProgress(completedDays: number[]): {
  percentage: number;
  completedWeeks: number;
  currentWeek: number;
  remainingDays: number;
} {
  const totalDays = STUDY_PLAN.length;
  const completed = completedDays.length;
  const percentage = Math.round((completed / totalDays) * 100);
  const completedWeeks = Math.floor(completed / 7);
  const currentWeek = Math.floor(Math.max(...completedDays, 0) / 7) + 1;
  const remainingDays = totalDays - completed;

  return {
    percentage,
    completedWeeks,
    currentWeek,
    remainingDays
  };
}
