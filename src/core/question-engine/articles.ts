import { DeutschMeisterDataManager } from "../../lib/parsers/DataManager";
import type { Question } from "./types";
import { shuffleArray } from "../../pages/utils";

const dataManager = DeutschMeisterDataManager.getInstance();

export function getArticleQuestions({
  mode = "flashcard",
  count = 20,
  category,
}: {
  mode?: string;
  count?: number;
  category?: string;
}): Question[] {
  let articles = dataManager.getRandomArticles(count);
  if (category) {
    articles = articles.filter(
      (item) => item.category === category || item.tags?.includes(category)
    );
  }
  return articles.map((item) => {
    switch (mode) {
      case "mc":
      case "practice":
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
