import { DeutschMeisterDataManager } from "../../lib/parsers/DataManager";
import type { Question } from "./types";

const dataManager = DeutschMeisterDataManager.getInstance();

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
