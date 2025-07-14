import { vocabulariesV2Loader } from "../../lib/parsers/v2/VocabulariesV2Parser";
import type { VocabularyV2 } from "../../lib/parsers/v2/VocabulariesV2Parser";
import type { QuestionV2, QuestionEngineV2Config } from "./types";

function filterVocabularies(
  vocabularies: VocabularyV2[],
  config: QuestionEngineV2Config
): VocabularyV2[] {
  return vocabularies.filter((v) => {
    if (config.category && v.category !== config.category) return false;
    if (config.level && v.level !== config.level.toString()) return false;
    if (config.difficulty && v.difficulty !== config.difficulty.toString())
      return false;
    return true;
  });
}

function buildFlashcardQuestionVocab(v: VocabularyV2): QuestionV2 {
  return {
    id: v.vocabId,
    type: "flashcards",
    mode: "flashcards",
    prompt: `What is the English translation for "${v.germanWord}"?`,
    answer: v.englishTranslation,
    helperText: v.pronunciationIpa,
    data: v,
  };
}

function buildMcqDeQuestionVocab(
  v: VocabularyV2,
  pool: VocabularyV2[]
): QuestionV2 {
  const correct = v.englishTranslation;
  const distractors = pool
    .filter((x) => x.vocabId !== v.vocabId)
    .map((x) => x.englishTranslation)
    .slice(0, 3);
  const options = [correct, ...distractors];
  return {
    id: v.vocabId + "-mcq-de",
    type: "mcq-de",
    mode: "mcq-de",
    prompt: `What is the English translation of "${v.germanWord}"?`,
    answer: correct,
    options,
    helperText: v.pronunciationIpa,
    data: v,
  };
}

function buildMcqEnQuestionVocab(
  v: VocabularyV2,
  pool: VocabularyV2[]
): QuestionV2 {
  const correct = v.germanWord;
  const distractors = pool
    .filter((x) => x.vocabId !== v.vocabId)
    .map((x) => x.germanWord)
    .slice(0, 3);
  const options = [correct, ...distractors];
  return {
    id: v.vocabId + "-mcq-en",
    type: "mcq-en",
    mode: "mcq-en",
    prompt: `What is the German translation of "${v.englishTranslation}"?`,
    answer: correct,
    options,
    helperText: v.pronunciationIpa,
    data: v,
  };
}

function buildQAQuestionVocab(v: VocabularyV2): QuestionV2 {
  return Math.random() > 0.5
    ? {
        id: v.vocabId + "-qa-en-de",
        type: "q&a",
        mode: "q&a",
        prompt: `What is the German word for "${v.englishTranslation}"?`,
        answer: v.germanWord,
        helperText: v.pronunciationIpa,
        data: v,
      }
    : {
        id: v.vocabId + "-qa-de-en",
        type: "q&a",
        mode: "q&a",
        prompt: `What is the English translation for "${v.germanWord}"?`,
        answer: v.englishTranslation,
        helperText: v.pronunciationIpa,
        data: v,
      };
}

function buildFillBlankQuestionVocab(v: VocabularyV2): QuestionV2 | null {
  if (!v.exampleDe || !v.germanWord) return null;
  const blanked = v.exampleDe.replace(new RegExp(v.germanWord, "gi"), "_____");
  if (blanked === v.exampleDe) return null;
  return {
    id: v.vocabId + "-fill-blank",
    type: "fill_blank",
    mode: "fill_blank",
    prompt: blanked,
    answer: v.germanWord,
    helperText: v.exampleEn,
    data: v,
  };
}

function buildArticleQuestionVocab(v: VocabularyV2): QuestionV2 | null {
  if (v.wordType !== "noun") return null;
  let article = "";
  if (v.usageNotes && /\bder\b|\bdie\b|\bdas\b/.test(v.usageNotes)) {
    article = (v.usageNotes.match(/\bder\b|\bdie\b|\bdas\b/) || [""])[0];
  } else if (v.tags && /\bder\b|\bdie\b|\bdas\b/.test(v.tags)) {
    article = (v.tags.match(/\bder\b|\bdie\b|\bdas\b/) || [""])[0];
  }
  if (!article) return null;
  return {
    id: v.vocabId + "-article",
    type: "article",
    mode: "article",
    prompt: `Which article can be used with "${v.germanWord}"?`,
    answer: article,
    helperText: v.englishTranslation,
    data: v,
  };
}

export function generateVocabularyQuestions(
  config: QuestionEngineV2Config
): QuestionV2[] {
  let vocabularies = vocabulariesV2Loader.load();
  let filtered = filterVocabularies(vocabularies, config);
  let questions: QuestionV2[];

  switch (config.mode) {
    case "mcq-de":
      questions = filtered.map((v) => buildMcqDeQuestionVocab(v, filtered));
      break;
    case "mcq-en":
      questions = filtered.map((v) => buildMcqEnQuestionVocab(v, filtered));
      break;
    case "q&a":
      questions = filtered.map((v) => buildQAQuestionVocab(v));
      break;
    case "fill_blank":
      questions = filtered
        .map(buildFillBlankQuestionVocab)
        .filter(Boolean) as QuestionV2[];
      break;
    case "article":
      questions = filtered
        .map(buildArticleQuestionVocab)
        .filter(Boolean) as QuestionV2[];
      break;
    case "flashcards":
    default:
      questions = filtered.map(buildFlashcardQuestionVocab);
      break;
  }
  return questions.slice(0, config.q_no);
}
