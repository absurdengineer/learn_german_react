
import { GrammarPracticeQuestion } from '../types/GrammarPractice';
import type { QuestionType } from '../types/GrammarPracticeTypes';
import { parseCSVLine } from '../lib/csvParser';
import grammarPracticeCSV from './grammar_practice.csv?raw';

let allQuestions: GrammarPracticeQuestion[] | null = null;

const parseGrammarPracticeCSV = (): GrammarPracticeQuestion[] => {
  if (allQuestions) {
    return allQuestions;
  }

  const lines = grammarPracticeCSV.trim().split('\n');
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
      questionData[headers[j].trim()] = data[j] ? data[j].trim() : '';
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
  allQuestions = questions;
  return allQuestions;
};

export const loadGrammarPracticeByDay = (day: number, limit?: number): GrammarPracticeQuestion[] => {
  const questions = parseGrammarPracticeCSV();
  const dayQuestions = questions.filter(q => q.dayReference === day);
  if (limit) {
    return dayQuestions.sort(() => Math.random() - 0.5).slice(0, limit);
  }
  return dayQuestions;
};

export const loadRandomGrammarPractice = (limit: number): GrammarPracticeQuestion[] => {
  const questions = parseGrammarPracticeCSV();
  return questions.sort(() => Math.random() - 0.5).slice(0, limit);
};
