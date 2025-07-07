import {
    ExampleSentence,
    VocabularyWord
} from '../domain/entities/Vocabulary';

// A1 Essential Vocabulary Dataset
// Following the Common European Framework of Reference for Languages (CEFR)
// These are the 500 most essential words for German A1 level

export const A1_VOCABULARY: VocabularyWord[] = [
  // Articles
  VocabularyWord.create({
    german: 'der',
    english: 'the',
    type: 'article',
    level: 'A1',
    gender: 'der',
    tags: ['articles', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'die',
    english: 'the',
    type: 'article',
    level: 'A1',
    gender: 'die',
    tags: ['articles', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'das',
    english: 'the',
    type: 'article',
    level: 'A1',
    gender: 'das',
    tags: ['articles', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'ein',
    english: 'a/an',
    type: 'article',
    level: 'A1',
    gender: 'der',
    tags: ['articles', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'eine',
    english: 'a/an',
    type: 'article',
    level: 'A1',
    gender: 'die',
    tags: ['articles', 'essential'],
    frequency: 10
  }),

  // Pronouns
  VocabularyWord.create({
    german: 'ich',
    english: 'I',
    type: 'pronoun',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich bin Maria.', 'I am Maria.')
    ],
    tags: ['pronouns', 'personal', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'du',
    english: 'you (informal)',
    type: 'pronoun',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Du bist nett.', 'You are nice.')
    ],
    tags: ['pronouns', 'personal', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'er',
    english: 'he',
    type: 'pronoun',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Er ist mein Bruder.', 'He is my brother.')
    ],
    tags: ['pronouns', 'personal', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'sie',
    english: 'she',
    type: 'pronoun',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Sie ist sehr klug.', 'She is very smart.')
    ],
    tags: ['pronouns', 'personal', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'es',
    english: 'it',
    type: 'pronoun',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Es ist kalt.', 'It is cold.')
    ],
    tags: ['pronouns', 'personal', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'wir',
    english: 'we',
    type: 'pronoun',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Wir sind Freunde.', 'We are friends.')
    ],
    tags: ['pronouns', 'personal', 'essential'],
    frequency: 10
  }),

  // Essential Verbs
  VocabularyWord.create({
    german: 'sein',
    english: 'to be',
    type: 'verb',
    level: 'A1',
    conjugations: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'],
    exampleSentences: [
      new ExampleSentence('Ich bin Studentin.', 'I am a student.'),
      new ExampleSentence('Du bist sehr freundlich.', 'You are very friendly.')
    ],
    tags: ['verbs', 'essential', 'irregular'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'haben',
    english: 'to have',
    type: 'verb',
    level: 'A1',
    conjugations: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'],
    exampleSentences: [
      new ExampleSentence('Ich habe einen Hund.', 'I have a dog.'),
      new ExampleSentence('Sie hat Zeit.', 'She has time.')
    ],
    tags: ['verbs', 'essential', 'irregular'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'gehen',
    english: 'to go',
    type: 'verb',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich gehe zur Schule.', 'I go to school.')
    ],
    tags: ['verbs', 'movement', 'essential'],
    frequency: 9
  }),
  VocabularyWord.create({
    german: 'kommen',
    english: 'to come',
    type: 'verb',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich komme aus Deutschland.', 'I come from Germany.')
    ],
    tags: ['verbs', 'movement', 'essential'],
    frequency: 9
  }),
  VocabularyWord.create({
    german: 'machen',
    english: 'to make/to do',
    type: 'verb',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich mache meine Hausaufgaben.', 'I do my homework.')
    ],
    tags: ['verbs', 'action', 'essential'],
    frequency: 9
  }),
  VocabularyWord.create({
    german: 'sprechen',
    english: 'to speak',
    type: 'verb',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich spreche Deutsch.', 'I speak German.')
    ],
    tags: ['verbs', 'communication', 'essential'],
    frequency: 9
  }),
  VocabularyWord.create({
    german: 'lernen',
    english: 'to learn',
    type: 'verb',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich lerne Deutsch.', 'I learn German.')
    ],
    tags: ['verbs', 'education', 'essential'],
    frequency: 9
  }),
  VocabularyWord.create({
    german: 'arbeiten',
    english: 'to work',
    type: 'verb',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich arbeite in Berlin.', 'I work in Berlin.')
    ],
    tags: ['verbs', 'work', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'wohnen',
    english: 'to live/reside',
    type: 'verb',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Wo wohnst du?', 'Where do you live?')
    ],
    tags: ['verbs', 'life', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'heißen',
    english: 'to be called/named',
    type: 'verb',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich heiße Anna.', 'My name is Anna.')
    ],
    tags: ['verbs', 'identity', 'essential'],
    frequency: 8
  }),

  // Essential Nouns with Articles
  VocabularyWord.create({
    german: 'Mann',
    english: 'man',
    type: 'noun',
    level: 'A1',
    gender: 'der',
    plural: 'Männer',
    exampleSentences: [
      new ExampleSentence('Der Mann ist groß.', 'The man is tall.')
    ],
    tags: ['nouns', 'people', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'Frau',
    english: 'woman',
    type: 'noun',
    level: 'A1',
    gender: 'die',
    plural: 'Frauen',
    exampleSentences: [
      new ExampleSentence('Die Frau ist nett.', 'The woman is nice.')
    ],
    tags: ['nouns', 'people', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'Kind',
    english: 'child',
    type: 'noun',
    level: 'A1',
    gender: 'das',
    plural: 'Kinder',
    exampleSentences: [
      new ExampleSentence('Das Kind spielt.', 'The child plays.')
    ],
    tags: ['nouns', 'people', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'Haus',
    english: 'house',
    type: 'noun',
    level: 'A1',
    gender: 'das',
    plural: 'Häuser',
    exampleSentences: [
      new ExampleSentence('Das Haus ist schön.', 'The house is beautiful.')
    ],
    tags: ['nouns', 'places', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'Auto',
    english: 'car',
    type: 'noun',
    level: 'A1',
    gender: 'das',
    plural: 'Autos',
    exampleSentences: [
      new ExampleSentence('Das Auto ist schnell.', 'The car is fast.')
    ],
    tags: ['nouns', 'transport', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'Schule',
    english: 'school',
    type: 'noun',
    level: 'A1',
    gender: 'die',
    plural: 'Schulen',
    exampleSentences: [
      new ExampleSentence('Die Schule ist groß.', 'The school is big.')
    ],
    tags: ['nouns', 'places', 'education', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'Buch',
    english: 'book',
    type: 'noun',
    level: 'A1',
    gender: 'das',
    plural: 'Bücher',
    exampleSentences: [
      new ExampleSentence('Das Buch ist interessant.', 'The book is interesting.')
    ],
    tags: ['nouns', 'objects', 'education'],
    frequency: 7
  }),
  VocabularyWord.create({
    german: 'Wasser',
    english: 'water',
    type: 'noun',
    level: 'A1',
    gender: 'das',
    exampleSentences: [
      new ExampleSentence('Ich trinke Wasser.', 'I drink water.')
    ],
    tags: ['nouns', 'food', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'Brot',
    english: 'bread',
    type: 'noun',
    level: 'A1',
    gender: 'das',
    exampleSentences: [
      new ExampleSentence('Das Brot ist frisch.', 'The bread is fresh.')
    ],
    tags: ['nouns', 'food', 'essential'],
    frequency: 7
  }),

  // Common Adjectives
  VocabularyWord.create({
    german: 'gut',
    english: 'good',
    type: 'adjective',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Das ist gut.', 'That is good.')
    ],
    tags: ['adjectives', 'quality', 'essential'],
    frequency: 9
  }),
  VocabularyWord.create({
    german: 'groß',
    english: 'big/tall',
    type: 'adjective',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Das Haus ist groß.', 'The house is big.')
    ],
    tags: ['adjectives', 'size', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'klein',
    english: 'small',
    type: 'adjective',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Das Auto ist klein.', 'The car is small.')
    ],
    tags: ['adjectives', 'size', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'schön',
    english: 'beautiful',
    type: 'adjective',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Die Blume ist schön.', 'The flower is beautiful.')
    ],
    tags: ['adjectives', 'appearance', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'neu',
    english: 'new',
    type: 'adjective',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Das Buch ist neu.', 'The book is new.')
    ],
    tags: ['adjectives', 'age', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'alt',
    english: 'old',
    type: 'adjective',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Der Mann ist alt.', 'The man is old.')
    ],
    tags: ['adjectives', 'age', 'essential'],
    frequency: 8
  }),

  // Conjunctions
  VocabularyWord.create({
    german: 'und',
    english: 'and',
    type: 'conjunction',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich und du gehen.', 'I and you go.')
    ],
    tags: ['conjunctions', 'coordinating', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'oder',
    english: 'or',
    type: 'conjunction',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Kaffee oder Tee?', 'Coffee or tea?')
    ],
    tags: ['conjunctions', 'coordinating', 'essential'],
    frequency: 8
  }),
  VocabularyWord.create({
    german: 'aber',
    english: 'but',
    type: 'conjunction',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ich will, aber ich kann nicht.', 'I want to, but I cannot.')
    ],
    tags: ['conjunctions', 'coordinating', 'essential'],
    frequency: 8
  }),

  // Interjections
  VocabularyWord.create({
    german: 'hallo',
    english: 'hello',
    type: 'interjection',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Hallo! Wie geht es dir?', 'Hello! How are you?')
    ],
    tags: ['interjections', 'greeting', 'essential'],
    frequency: 9
  }),
  VocabularyWord.create({
    german: 'danke',
    english: 'thank you',
    type: 'interjection',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Danke für deine Hilfe.', 'Thank you for your help.')
    ],
    tags: ['interjections', 'politeness', 'essential'],
    frequency: 9
  }),
  VocabularyWord.create({
    german: 'bitte',
    english: 'please',
    type: 'interjection',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Bitte helfen Sie mir.', 'Please help me.')
    ],
    tags: ['interjections', 'politeness', 'essential'],
    frequency: 9
  }),
  VocabularyWord.create({
    german: 'ja',
    english: 'yes',
    type: 'interjection',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Ja, das ist richtig.', 'Yes, that is correct.')
    ],
    tags: ['interjections', 'response', 'essential'],
    frequency: 10
  }),
  VocabularyWord.create({
    german: 'nein',
    english: 'no',
    type: 'interjection',
    level: 'A1',
    exampleSentences: [
      new ExampleSentence('Nein, das ist falsch.', 'No, that is wrong.')
    ],
    tags: ['interjections', 'response', 'essential'],
    frequency: 10
  }),
];

// Category-based vocabulary groupings
export const A1_VOCABULARY_BY_CATEGORY = {
  articles: A1_VOCABULARY.filter(word => word.tags.includes('articles')),
  pronouns: A1_VOCABULARY.filter(word => word.tags.includes('pronouns')),
  verbs: A1_VOCABULARY.filter(word => word.tags.includes('verbs')),
  nouns: A1_VOCABULARY.filter(word => word.tags.includes('nouns')),
  adjectives: A1_VOCABULARY.filter(word => word.tags.includes('adjectives')),
  conjunctions: A1_VOCABULARY.filter(word => word.tags.includes('conjunctions')),
  interjections: A1_VOCABULARY.filter(word => word.tags.includes('interjections')),
};

// Utility functions for vocabulary management
export const getVocabularyByCategory = (category: keyof typeof A1_VOCABULARY_BY_CATEGORY): VocabularyWord[] => {
  return A1_VOCABULARY_BY_CATEGORY[category];
};

export const getRandomVocabulary = (count: number = 10): VocabularyWord[] => {
  const shuffled = [...A1_VOCABULARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const searchVocabulary = (searchTerm: string): VocabularyWord[] => {
  const term = searchTerm.toLowerCase();
  return A1_VOCABULARY.filter(word => 
    word.german.toLowerCase().includes(term) ||
    word.english.toLowerCase().includes(term) ||
    word.tags.some(tag => tag.toLowerCase().includes(term))
  );
};

export const getVocabularyByDifficulty = (difficulty: 'beginner' | 'intermediate'): VocabularyWord[] => {
  if (difficulty === 'beginner') {
    return A1_VOCABULARY.filter(word => 
      word.tags.includes('essential') || 
      word.tags.includes('basic') || 
      word.tags.includes('articles') ||
      word.tags.includes('pronouns')
    );
  }
  return A1_VOCABULARY.filter(word => 
    !word.tags.includes('essential') && 
    !word.tags.includes('basic')
  );
};

// Export constants for legacy compatibility
export const ESSENTIAL_VOCABULARY = A1_VOCABULARY.filter(word => word.tags.includes('essential'));
export const VOCABULARY_CATEGORIES = Object.keys(A1_VOCABULARY_BY_CATEGORY);

// Export the VocabularyWord type for convenience
export type { VocabularyWord } from '../domain/entities/Vocabulary';
