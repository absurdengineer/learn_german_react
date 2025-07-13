import { DeutschMeisterDataManager } from "../../lib/parsers/DataManager";
import type { Question } from "./questionTypes";
import { shuffleArray } from "../../lib/utils";

// Get singleton instance of data manager
const dataManager = DeutschMeisterDataManager.getInstance();

/**
 * Build vocabulary questions for the question engine.
 * Supports different modes (flashcard, translation-de-en, translation-en-de, multiple-choice-de-en, multiple-choice-en-de).
 */
export function getVocabularyQuestions({
  mode = "flashcard",
  count = 20,
  category,
}: {
  mode?: string;
  count?: number;
  category?: string;
}): Question[] {
  // Use the random method for proper shuffling
  const vocab = dataManager.getRandomVocabulary(count, { category });
  const allVocab = dataManager.getVocabulary(); // For generating options

  return vocab.map((item) => {
    switch (mode) {
      case "translation-de-en":
        return {
          id: `${item.id}-de-en`,
          type: "vocab",
          mode: "translation-de-en",
          prompt: `Translate "${item.german}" to English`,
          answer: item.english,
          helperText: item.pronunciation,
          color:
            item.gender === "masculine"
              ? "bg-blue-100"
              : item.gender === "feminine"
              ? "bg-pink-100"
              : item.gender === "neuter"
              ? "bg-gray-200"
              : undefined,
          data: item,
        };

      case "translation-en-de":
        return {
          id: `${item.id}-en-de`,
          type: "vocab",
          mode: "translation-en-de",
          prompt: `Translate "${item.english}" to German`,
          answer: item.german,
          helperText: item.pronunciation,
          color:
            item.gender === "masculine"
              ? "bg-blue-100"
              : item.gender === "feminine"
              ? "bg-pink-100"
              : item.gender === "neuter"
              ? "bg-gray-200"
              : undefined,
          data: item,
        };

      case "multiple-choice-de-en":
        // Generate multiple choice options
        const otherWords = allVocab
          .filter((v) => v.id !== item.id)
          .map((v) => v.english);
        const options = shuffleArray([...otherWords]).slice(0, 3);
        options.push(item.english);
        return {
          id: `${item.id}-mc-de-en`,
          type: "vocab",
          mode: "multiple-choice-de-en",
          prompt: `What is the English translation of "${item.german}"?`,
          answer: item.english,
          options: shuffleArray(options),
          helperText: item.pronunciation,
          color:
            item.gender === "masculine"
              ? "bg-blue-100"
              : item.gender === "feminine"
              ? "bg-pink-100"
              : item.gender === "neuter"
              ? "bg-gray-200"
              : undefined,
          data: item,
        };

      case "multiple-choice-en-de":
        // Generate multiple choice options for German words
        const allGermanWords = allVocab
          .filter((v) => v.id !== item.id)
          .map((v) => v.german);
        const germanOptions = shuffleArray([...allGermanWords]).slice(0, 3);
        germanOptions.push(item.german);
        return {
          id: `${item.id}-mc-en-de`,
          type: "vocab",
          mode: "multiple-choice-en-de",
          prompt: `What is the German translation of "${item.english}"?`,
          answer: item.german,
          options: shuffleArray(germanOptions),
          helperText: item.pronunciation,
          color:
            item.gender === "masculine"
              ? "bg-blue-100"
              : item.gender === "feminine"
              ? "bg-pink-100"
              : item.gender === "neuter"
              ? "bg-gray-200"
              : undefined,
          data: item,
        };

      case "flashcard":
      default:
        return {
          id: item.id,
          type: "vocab",
          mode: "flashcard",
          prompt: item.german,
          answer: item.english,
          helperText: item.pronunciation,
          color:
            item.gender === "masculine"
              ? "bg-blue-100"
              : item.gender === "feminine"
              ? "bg-pink-100"
              : item.gender === "neuter"
              ? "bg-gray-200"
              : undefined,
          data: item,
        };
    }
  });
}

/**
 * Build article questions for the question engine.
 * Supports different modes (flashcard, mc, etc.).
 */
export function getArticleQuestions({
  mode = "flashcard",
  count = 20,
  category,
}: {
  mode?: string;
  count?: number;
  category?: string;
}): Question[] {
  // Use the random method for proper shuffling
  let articles = dataManager.getRandomArticles(count);

  // Filter by category if specified
  if (category) {
    articles = articles.filter(
      (item) => item.category === category || item.tags?.includes(category)
    );
  }

  return articles.map((item) => {
    switch (mode) {
      case "mc":
      case "practice":
        // Multiple choice with der/die/das options
        return {
          id: item.id,
          type: "article",
          mode: "mc",
          prompt: `What is the article for "${item.german}"?`,
          answer: item.gender,
          options: shuffleArray(["der", "die", "das"]),
          helperText: item.english,
          color:
            item.gender === "der"
              ? "bg-blue-100"
              : item.gender === "die"
              ? "bg-pink-100"
              : item.gender === "das"
              ? "bg-gray-200"
              : undefined,
          data: item,
        };

      case "flashcard":
      default:
        return {
          id: item.id,
          type: "article",
          mode: "flashcard",
          prompt: item.german,
          answer: item.gender,
          helperText: item.english,
          color:
            item.gender === "der"
              ? "bg-blue-100"
              : item.gender === "die"
              ? "bg-pink-100"
              : item.gender === "das"
              ? "bg-gray-200"
              : undefined,
          data: item,
        };
    }
  });
}

/**
 * Build grammar questions for the question engine.
 * Supports different modes (flashcard, mc, etc.).
 */
export function getGrammarQuestions({
  mode = "flashcard",
  count = 20,
  category,
}: {
  mode?: string;
  count?: number;
  category?: string;
}): Question[] {
  // Use the random method for proper shuffling
  let grammarPractice = dataManager.getRandomGrammarPractice(count);

  // Filter by category if specified
  if (category) {
    grammarPractice = grammarPractice.filter(
      (item) => item.category === category || item.tags?.includes(category)
    );
  }

  return grammarPractice.map((item) => {
    switch (mode) {
      case "mc":
      case "practice":
        // Multiple choice with options
        return {
          id: item.id,
          type: "grammar",
          mode: "mc",
          prompt: item.prompt,
          answer: item.correctAnswer,
          options: shuffleArray([...item.options]),
          helperText: item.helperText,
          data: item,
        };

      case "flashcard":
      default:
        return {
          id: item.id,
          type: "grammar",
          mode: "flashcard",
          prompt: item.prompt,
          answer: item.correctAnswer,
          helperText: item.helperText,
          data: item,
        };
    }
  });
}

/**
 * Build grammar lesson questions for the question engine.
 * Returns lesson content as a 'reading' type question.
 */
export function getGrammarLessonQuestions({
  count = 1,
  day,
}: {
  count?: number;
  day?: number;
}): Question[] {
  let lessons = dataManager.getGrammarLessons();
  if (day !== undefined) {
    lessons = lessons.filter((l) => l.day === day);
  }
  lessons = lessons.slice(0, count);
  return lessons.map((lesson) => ({
    id: `lesson-${lesson.day}`,
    type: "grammar",
    mode: "reading",
    prompt: lesson.title,
    answer: lesson.content,
    helperText: lesson.helpfulHint,
    color: undefined,
    data: lesson,
  }));
}
