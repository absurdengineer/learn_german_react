import type { QuestionV2, QuestionEngineV2Config } from "./types";

import { generateVocabularyQuestions } from "./vocabularies";
import { generateNounQuestions } from "./nouns";

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

export function generateQuestionsV2(
  config: QuestionEngineV2Config
): QuestionV2[] {
  if (config.resource === "nouns") {
    let questions = generateNounQuestions(config);
    questions = shuffle(questions);
    return questions;
  }
  if (config.resource === "vocabularies") {
    let questions = generateVocabularyQuestions(config);
    questions = shuffle(questions);
    return questions;
  }
  // If no source, get from all, shuffle, and limit to q_no
  const vocabQuestions = generateVocabularyQuestions(config);
  const nounQuestions = generateNounQuestions(config);
  let allQuestions = [...vocabQuestions, ...nounQuestions];
  allQuestions = shuffle(allQuestions).slice(0, config.q_no);
  return allQuestions;
}
