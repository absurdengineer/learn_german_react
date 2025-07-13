import { GrammarPracticeQuestion } from "../types/GrammarPractice";
import type { QuestionType } from "../types/GrammarPracticeTypes";
import { parseCSVLine } from "../lib/csvParser";
import grammarPracticeCSV from "./grammar_practice.csv?raw";

// Memoized cache for parsed grammar practice questions
let grammarPracticeCache: GrammarPracticeQuestion[] | null = null;

/**
 * Parse and normalize the grammar practice CSV into a typed array of GrammarPracticeQuestion objects.
 * Memoized for performance.
 */
export function getAllGrammarPractice(): GrammarPracticeQuestion[] {
  if (grammarPracticeCache) return grammarPracticeCache;
  const lines = grammarPracticeCSV.trim().split("\n");
  const headers = parseCSVLine(lines[0]);
  const questions: GrammarPracticeQuestion[] = [];
  for (let i = 1; i < lines.length; i++) {
    const data = parseCSVLine(lines[i]);
    if (data.length !== headers.length) {
      console.warn(`Skipping malformed CSV line ${i + 1}: ${lines[i]}`);
      continue;
    }
    const questionData: { [key: string]: string } = {};
    for (let j = 0; j < headers.length; j++) {
      questionData[headers[j].trim()] = data[j] ? data[j].trim() : "";
    }
    questions.push(
      GrammarPracticeQuestion.create({
        id: parseInt(questionData.id, 10),
        dayReference: parseInt(questionData.day_reference, 10),
        category: questionData.category,
        questionType: questionData.question_type as QuestionType,
        prompt: questionData.prompt,
        correctAnswer: questionData.correct_answer,
        optionB: questionData.option_b,
        optionC: questionData.option_c,
        helperText: questionData.helper_text,
      })
    );
  }
  grammarPracticeCache = questions;
  return grammarPracticeCache;
}

/**
 * Get grammar practice questions by day.
 */
export function getGrammarPracticeByDay(
  day: number,
  limit?: number
): GrammarPracticeQuestion[] {
  const questions = getAllGrammarPractice();
  const dayQuestions = questions.filter((q) => q.dayReference === day);
  if (limit) {
    return dayQuestions.slice(0, limit);
  }
  return dayQuestions;
}

/**
 * Get a random set of grammar practice questions.
 */
export function getRandomGrammarPractice(
  limit: number
): GrammarPracticeQuestion[] {
  const questions = getAllGrammarPractice();
  // Simple shuffle
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}
