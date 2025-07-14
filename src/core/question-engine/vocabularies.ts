import { DeutschMeisterDataManager } from "../../lib/parsers/DataManager";
import type { Question } from "./types";
import { shuffleArray } from "../../pages/utils";

const dataManager = DeutschMeisterDataManager.getInstance();

export function getVocabularyQuestions({
  mode = "flashcard",
  count = 20,
  category,
}: {
  mode?: string;
  count?: number;
  category?: string;
}): Question[] {
  const vocab = dataManager.getRandomVocabulary(count, { category });
  const allVocab = dataManager.getVocabulary();
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
