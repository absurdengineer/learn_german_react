import newLessonsCSV from "../../data/new_lessons.csv?raw";
import { BaseCSVParser, DataStandardizer } from "./DataLoader";
import type { StandardizedGrammarLesson } from "./DataLoader";

class NewLessonsParser extends BaseCSVParser<StandardizedGrammarLesson> {
  protected csvContent = newLessonsCSV;

  protected parseRow(
    data: Record<string, string>,
    index: number
  ): StandardizedGrammarLesson | null {
    if (!data.day || !data.title) return null;
    const day = parseInt(data.day, 10);
    if (isNaN(day) || day < 1) return null;
    return {
      id: DataStandardizer.generateId("new_lesson", day),
      type: "grammar_lesson",
      day,
      week: DataStandardizer.calculateWeek(day),
      title: data.title || "",
      content: (data.main_content || "").replace(/\\n/g, "\n"),
      mission: data.success_criteria || "",
      helpfulHint: data.hints || undefined,
      funFact: data.fun_facts || undefined,
      estimatedTime: parseInt(data.estimated_time, 10) || 0,
      difficulty: parseInt(data.difficulty_level, 10) || 1,
      category: data.theme || undefined,
    };
  }
}

export const newLessonsLoader = new NewLessonsParser();
