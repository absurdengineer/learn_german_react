import { DeutschMeisterDataManager } from "../../lib/parsers/DataManager";
import type { Question } from "./types";
import { shuffleArray } from "../../pages/utils";

const dataManager = DeutschMeisterDataManager.getInstance();

export function getGrammarQuestions({
  mode = "flashcard",
  count = 20,
  category,
}: {
  mode?: string;
  count?: number;
  category?: string;
}): Question[] {
  let grammarPractice = dataManager.getRandomGrammarPractice(count);
  if (category) {
    grammarPractice = grammarPractice.filter(
      (item) => item.category === category || item.tags?.includes(category)
    );
  }
  return grammarPractice.map((item) => {
    switch (mode) {
      case "mc":
      case "practice":
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
