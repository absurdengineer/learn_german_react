/**
 * Standardized Grammar Lessons Parser
 */

import grammarLessonsCSV from "../../data/grammar_lessons.csv?raw";
import {
  BaseCSVParser,
  DataStandardizer,
  type StandardizedGrammarLesson,
} from "./DataLoader";

export class GrammarLessonsParser extends BaseCSVParser<StandardizedGrammarLesson> {
  protected csvContent = grammarLessonsCSV;

  protected parseRow(
    data: Record<string, string>,
    _index: number
  ): StandardizedGrammarLesson | null {
    if (!data.day || !data.title || !data.content) {
      return null;
    }

    const day = parseInt(data.day);
    if (isNaN(day) || day < 1) {
      console.warn(`Invalid day "${data.day}" for lesson "${data.title}"`);
      return null;
    }

    // Extract estimated time from content (basic estimation)
    const estimatedTime = this.estimateReadingTime(data.content);

    // Extract category from title or content
    const category = this.extractCategory(data.title, data.content);

    return {
      id: DataStandardizer.generateId("grammar_lesson", day),
      type: "grammar_lesson",
      day,
      week: DataStandardizer.calculateWeek(day),
      title: data.title,
      content: data.content.replace(/\\n/g, "\n"), // Convert escaped newlines
      mission: data.mission || "",
      helpfulHint: data.helpfulHint || undefined,
      funFact: data.funFact || undefined,
      category,
      estimatedTime,
      difficulty: this.calculateDifficulty(day),
      tags: this.extractTags(data.title, data.content),
    };
  }

  private estimateReadingTime(content: string): number {
    // Estimate reading time based on word count (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  }

  private extractCategory(title: string, content: string): string {
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();

    if (titleLower.includes("greeting") || contentLower.includes("grüße"))
      return "greetings";
    if (
      titleLower.includes("introduction") ||
      contentLower.includes("introduction")
    )
      return "introductions";
    if (titleLower.includes("number") || contentLower.includes("zahlen"))
      return "numbers";
    if (titleLower.includes("verb") || contentLower.includes("verb"))
      return "verbs";
    if (titleLower.includes("noun") || contentLower.includes("noun"))
      return "nouns";
    if (titleLower.includes("article") || contentLower.includes("artikel"))
      return "articles";
    if (titleLower.includes("case") || contentLower.includes("case"))
      return "cases";
    if (titleLower.includes("alphabet") || contentLower.includes("alphabet"))
      return "alphabet";

    return "general";
  }

  private calculateDifficulty(day: number): number {
    // Basic difficulty calculation: early days are easier
    if (day <= 7) return 1; // Week 1: Beginner
    if (day <= 14) return 2; // Week 2: Elementary
    if (day <= 21) return 3; // Week 3: Intermediate
    return 4; // Week 4+: Advanced
  }

  private extractTags(title: string, content: string): string[] {
    const tags = new Set<string>();

    // Add category-based tags
    const category = this.extractCategory(title, content);
    tags.add(category);

    // Add content-based tags
    const contentLower = content.toLowerCase();
    if (contentLower.includes("formal")) tags.add("formal");
    if (contentLower.includes("informal")) tags.add("informal");
    if (contentLower.includes("conjugat")) tags.add("conjugation");
    if (contentLower.includes("pronunciation")) tags.add("pronunciation");
    if (contentLower.includes("culture")) tags.add("cultural");

    return Array.from(tags);
  }
}

// Export singleton instance
export const grammarLessonsLoader = new GrammarLessonsParser();
