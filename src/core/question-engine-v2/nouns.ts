import { nounsV2Loader } from "../../lib/parsers/v2/NounsV2Parser";
import type { NounV2 } from "../../lib/parsers/v2/NounsV2Parser";
import type { QuestionV2, QuestionEngineV2Config } from "./types";

function filterNouns(
  nouns: NounV2[],
  config: QuestionEngineV2Config
): NounV2[] {
  return nouns.filter((n) => {
    if (config.category && n.category !== config.category) return false;
    if (config.level && n.level !== config.level.toString()) return false;
    if (config.difficulty && n.difficulty !== config.difficulty.toString())
      return false;
    return true;
  });
}

function buildFlashcardQuestionNoun(n: NounV2): QuestionV2 {
  return {
    id: n.nounId,
    type: "flashcards",
    mode: "flashcards",
    prompt: `What is the English translation for "${n.germanNoun}"?`,
    answer: n.englishTranslation,
    helperText: n.pronunciationIpa,
    data: n,
  };
}

function buildMcqDeQuestionNoun(n: NounV2, pool: NounV2[]): QuestionV2 {
  const correct = n.englishTranslation;
  const distractors = pool
    .filter((x) => x.nounId !== n.nounId)
    .map((x) => x.englishTranslation)
    .slice(0, 3);
  const options = [correct, ...distractors];
  return {
    id: n.nounId + "-mcq-de",
    type: "mcq-de",
    mode: "mcq-de",
    prompt: `What is the English translation of "${n.germanNoun}"?`,
    answer: correct,
    options,
    helperText: n.pronunciationIpa,
    data: n,
  };
}

function buildMcqEnQuestionNoun(n: NounV2, pool: NounV2[]): QuestionV2 {
  const correct = n.germanNoun;
  const distractors = pool
    .filter((x) => x.nounId !== n.nounId)
    .map((x) => x.germanNoun)
    .slice(0, 3);
  const options = [correct, ...distractors];
  return {
    id: n.nounId + "-mcq-en",
    type: "mcq-en",
    mode: "mcq-en",
    prompt: `What is the German translation of "${n.englishTranslation}"?`,
    answer: correct,
    options,
    helperText: n.pronunciationIpa,
    data: n,
  };
}

function buildQAQuestionNoun(n: NounV2): QuestionV2 {
  return Math.random() > 0.5
    ? {
        id: n.nounId + "-qa-en-de",
        type: "q&a",
        mode: "q&a",
        prompt: `What is the German word for "${n.englishTranslation}"?`,
        answer: n.germanNoun,
        helperText: n.pronunciationIpa,
        data: n,
      }
    : {
        id: n.nounId + "-qa-de-en",
        type: "q&a",
        mode: "q&a",
        prompt: `What is the English translation for "${n.germanNoun}"?`,
        answer: n.englishTranslation,
        helperText: n.pronunciationIpa,
        data: n,
      };
}

function buildFillBlankQuestionNoun(n: NounV2): QuestionV2 | null {
  if (!n.exampleDe || !n.germanNoun) return null;
  const blanked = n.exampleDe.replace(new RegExp(n.germanNoun, "gi"), "_____");
  if (blanked === n.exampleDe) return null;
  return {
    id: n.nounId + "-fill-blank",
    type: "fill_blank",
    mode: "fill_blank",
    prompt: blanked,
    answer: n.germanNoun,
    helperText: n.exampleEn,
    data: n,
  };
}

function buildArticleQuestionNoun(n: NounV2): QuestionV2 | null {
  if (!n.article) return null;
  return {
    id: n.nounId + "-article",
    type: "article",
    mode: "article",
    prompt: `Which article can be used with "${n.germanNoun}"?`,
    answer: n.article,
    helperText: n.englishTranslation,
    data: n,
  };
}

export function generateNounQuestions(
  config: QuestionEngineV2Config
): QuestionV2[] {
  let nouns = nounsV2Loader.load();
  let filtered = filterNouns(nouns, config);
  let questions: QuestionV2[];

  switch (config.mode) {
    case "mcq-de":
      questions = filtered.map((n) => buildMcqDeQuestionNoun(n, filtered));
      break;
    case "mcq-en":
      questions = filtered.map((n) => buildMcqEnQuestionNoun(n, filtered));
      break;
    case "q&a":
      questions = filtered.map((n) => buildQAQuestionNoun(n));
      break;
    case "fill_blank":
      questions = filtered
        .map(buildFillBlankQuestionNoun)
        .filter(Boolean) as QuestionV2[];
      break;
    case "article":
      questions = filtered
        .map(buildArticleQuestionNoun)
        .filter(Boolean) as QuestionV2[];
      break;
    case "flashcards":
    default:
      questions = filtered.map(buildFlashcardQuestionNoun);
      break;
  }
  return questions.slice(0, config.q_no);
}
