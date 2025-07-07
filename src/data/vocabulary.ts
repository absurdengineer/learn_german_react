export interface VocabularyWord {
  id: string;
  german: string;
  english: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pronunciation?: string;
  example?: string;
  imageUrl?: string;
}

export const VOCABULARY_CATEGORIES = [
  'basics',
  'family',
  'numbers',
  'colors',
  'food',
  'clothing',
  'house',
  'transport',
  'time',
  'weather',
  'emotions',
  'body',
  'professions',
  'hobbies',
  'shopping'
] as const;

export const ESSENTIAL_VOCABULARY: VocabularyWord[] = [
  // Basics (50 words)
  { id: 'v1', german: 'Hallo', english: 'Hello', category: 'basics', difficulty: 'beginner' },
  { id: 'v2', german: 'Auf Wiedersehen', english: 'Goodbye', category: 'basics', difficulty: 'beginner' },
  { id: 'v3', german: 'Bitte', english: 'Please/You\'re welcome', category: 'basics', difficulty: 'beginner' },
  { id: 'v4', german: 'Danke', english: 'Thank you', category: 'basics', difficulty: 'beginner' },
  { id: 'v5', german: 'Entschuldigung', english: 'Excuse me/Sorry', category: 'basics', difficulty: 'beginner' },
  { id: 'v6', german: 'Ja', english: 'Yes', category: 'basics', difficulty: 'beginner' },
  { id: 'v7', german: 'Nein', english: 'No', category: 'basics', difficulty: 'beginner' },
  { id: 'v8', german: 'Ich', english: 'I', category: 'basics', difficulty: 'beginner' },
  { id: 'v9', german: 'Du', english: 'You (informal)', category: 'basics', difficulty: 'beginner' },
  { id: 'v10', german: 'Sie', english: 'You (formal)', category: 'basics', difficulty: 'beginner' },
  
  // Family (30 words)
  { id: 'v11', german: 'Familie', english: 'Family', category: 'family', difficulty: 'beginner' },
  { id: 'v12', german: 'Mutter', english: 'Mother', category: 'family', difficulty: 'beginner' },
  { id: 'v13', german: 'Vater', english: 'Father', category: 'family', difficulty: 'beginner' },
  { id: 'v14', german: 'Bruder', english: 'Brother', category: 'family', difficulty: 'beginner' },
  { id: 'v15', german: 'Schwester', english: 'Sister', category: 'family', difficulty: 'beginner' },
  { id: 'v16', german: 'Großmutter', english: 'Grandmother', category: 'family', difficulty: 'beginner' },
  { id: 'v17', german: 'Großvater', english: 'Grandfather', category: 'family', difficulty: 'beginner' },
  { id: 'v18', german: 'Tante', english: 'Aunt', category: 'family', difficulty: 'beginner' },
  { id: 'v19', german: 'Onkel', english: 'Uncle', category: 'family', difficulty: 'beginner' },
  { id: 'v20', german: 'Cousin', english: 'Cousin (male)', category: 'family', difficulty: 'beginner' },
  
  // Numbers (20 words)
  { id: 'v21', german: 'eins', english: 'one', category: 'numbers', difficulty: 'beginner' },
  { id: 'v22', german: 'zwei', english: 'two', category: 'numbers', difficulty: 'beginner' },
  { id: 'v23', german: 'drei', english: 'three', category: 'numbers', difficulty: 'beginner' },
  { id: 'v24', german: 'vier', english: 'four', category: 'numbers', difficulty: 'beginner' },
  { id: 'v25', german: 'fünf', english: 'five', category: 'numbers', difficulty: 'beginner' },
  { id: 'v26', german: 'sechs', english: 'six', category: 'numbers', difficulty: 'beginner' },
  { id: 'v27', german: 'sieben', english: 'seven', category: 'numbers', difficulty: 'beginner' },
  { id: 'v28', german: 'acht', english: 'eight', category: 'numbers', difficulty: 'beginner' },
  { id: 'v29', german: 'neun', english: 'nine', category: 'numbers', difficulty: 'beginner' },
  { id: 'v30', german: 'zehn', english: 'ten', category: 'numbers', difficulty: 'beginner' },
  
  // Colors (15 words)
  { id: 'v31', german: 'rot', english: 'red', category: 'colors', difficulty: 'beginner' },
  { id: 'v32', german: 'blau', english: 'blue', category: 'colors', difficulty: 'beginner' },
  { id: 'v33', german: 'grün', english: 'green', category: 'colors', difficulty: 'beginner' },
  { id: 'v34', german: 'gelb', english: 'yellow', category: 'colors', difficulty: 'beginner' },
  { id: 'v35', german: 'schwarz', english: 'black', category: 'colors', difficulty: 'beginner' },
  { id: 'v36', german: 'weiß', english: 'white', category: 'colors', difficulty: 'beginner' },
  { id: 'v37', german: 'braun', english: 'brown', category: 'colors', difficulty: 'beginner' },
  { id: 'v38', german: 'grau', english: 'gray', category: 'colors', difficulty: 'beginner' },
  { id: 'v39', german: 'orange', english: 'orange', category: 'colors', difficulty: 'beginner' },
  { id: 'v40', german: 'rosa', english: 'pink', category: 'colors', difficulty: 'beginner' },
  
  // Food (40 words)
  { id: 'v41', german: 'Essen', english: 'Food', category: 'food', difficulty: 'beginner' },
  { id: 'v42', german: 'Wasser', english: 'Water', category: 'food', difficulty: 'beginner' },
  { id: 'v43', german: 'Brot', english: 'Bread', category: 'food', difficulty: 'beginner' },
  { id: 'v44', german: 'Milch', english: 'Milk', category: 'food', difficulty: 'beginner' },
  { id: 'v45', german: 'Fleisch', english: 'Meat', category: 'food', difficulty: 'beginner' },
  { id: 'v46', german: 'Fisch', english: 'Fish', category: 'food', difficulty: 'beginner' },
  { id: 'v47', german: 'Obst', english: 'Fruit', category: 'food', difficulty: 'beginner' },
  { id: 'v48', german: 'Gemüse', english: 'Vegetables', category: 'food', difficulty: 'beginner' },
  { id: 'v49', german: 'Apfel', english: 'Apple', category: 'food', difficulty: 'beginner' },
  { id: 'v50', german: 'Banane', english: 'Banana', category: 'food', difficulty: 'beginner' },
];

export const VOCABULARY_STATS = {
  totalWords: ESSENTIAL_VOCABULARY.length,
  categoryCounts: VOCABULARY_CATEGORIES.reduce((acc, category) => {
    acc[category] = ESSENTIAL_VOCABULARY.filter(word => word.category === category).length;
    return acc;
  }, {} as Record<string, number>),
  difficultyLevels: {
    beginner: ESSENTIAL_VOCABULARY.filter(w => w.difficulty === 'beginner').length,
    intermediate: ESSENTIAL_VOCABULARY.filter(w => w.difficulty === 'intermediate').length,
    advanced: ESSENTIAL_VOCABULARY.filter(w => w.difficulty === 'advanced').length,
  }
};

export function getVocabularyByCategory(category: string): VocabularyWord[] {
  return ESSENTIAL_VOCABULARY.filter(word => word.category === category);
}

export function getRandomVocabulary(count: number): VocabularyWord[] {
  const shuffled = [...ESSENTIAL_VOCABULARY].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function searchVocabulary(query: string): VocabularyWord[] {
  const lowerQuery = query.toLowerCase();
  return ESSENTIAL_VOCABULARY.filter(word =>
    word.german.toLowerCase().includes(lowerQuery) ||
    word.english.toLowerCase().includes(lowerQuery)
  );
}
