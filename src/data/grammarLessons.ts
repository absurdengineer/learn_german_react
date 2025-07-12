import { GrammarLesson } from '../types/Grammar';
import { parseCSVLine } from '../lib/csvParser';
import grammarLessonsCSV from './grammar_lessons.csv?raw';

export const parseGrammarLessonsCSV = (): GrammarLesson[] => {
  const lines = grammarLessonsCSV.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const lessons: GrammarLesson[] = [];

  for (let i = 1; i < lines.length; i++) {
    const data = parseCSVLine(lines[i]);
    if (data.length !== headers.length) {
      console.warn(`Skipping malformed CSV line ${i + 1}: ${lines[i]}`);
      continue;
    }
    
    const lessonData: { [key: string]: string } = {};
    for (let j = 0; j < headers.length; j++) {
      lessonData[headers[j].trim()] = data[j] ? data[j].trim() : '';
    }

    lessons.push(
      GrammarLesson.create({
        day: parseInt(lessonData.day, 10),
        title: lessonData.title,
        content: lessonData.content,
        mission: lessonData.mission,
        helpfulHint: lessonData.helpfulHint,
        funFact: lessonData.funFact,
      })
    );
  }

  return lessons;
};

let cachedGrammarLessons: GrammarLesson[] | null = null;

export const loadGrammarLessons = (): GrammarLesson[] => {
  if (cachedGrammarLessons) {
    return cachedGrammarLessons;
  }
  cachedGrammarLessons = parseGrammarLessonsCSV();
  return cachedGrammarLessons;
};