import newLessonsCSV from "../../../data/new_lessons.csv?raw";
import { parseCSVLine } from "../../csvParser";

// Raw CSV data interface - exactly as it appears in the CSV but with camelCase field names
export interface Lesson {
  day: string;
  theme: string;
  title: string;
  introduction: string;
  mainContent: string;
  vocabularyFocus: string;
  nounFocus: string;
  grammarFocus: string;
  grammarDataFocus: string;
  reviewContent: string;
  estimatedTime: string;
  difficultyLevel: string;
  successCriteria: string;
  hints: string;
  funFacts: string;
  culturalHighlight: string;
  motivationalNote: string;
}

class NewLessonsV2Parser {
  private csvContent = newLessonsCSV;
  private cache: Lesson[] | null = null;

  private parseRow(data: Record<string, string>): Lesson | null {
    if (!data.day || !data.title) return null;

    return {
      day: data.day,
      theme: data.theme,
      title: data.title,
      introduction: data.introduction,
      mainContent: data.main_content,
      vocabularyFocus: data.vocabulary_focus,
      nounFocus: data.noun_focus,
      grammarFocus: data.grammar_focus,
      grammarDataFocus: data.grammar_data_focus,
      reviewContent: data.review_content,
      estimatedTime: data.estimated_time,
      difficultyLevel: data.difficulty_level,
      successCriteria: data.success_criteria,
      hints: data.hints,
      funFacts: data.fun_facts,
      culturalHighlight: data.cultural_highlight,
      motivationalNote: data.motivational_note,
    };
  }

  private parseCSV(): Lesson[] {
    const lines = this.csvContent.trim().split("\n");
    if (lines.length < 2) return [];

    // Detect separator from the header line
    const separator = (() => {
      const commaCount = (lines[0].match(/,/g) || []).length;
      const semicolonCount = (lines[0].match(/;/g) || []).length;
      return semicolonCount > commaCount ? ";" : ",";
    })();

    const headers = parseCSVLine(lines[0], separator);
    const items: Lesson[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = parseCSVLine(line, separator);
      if (columns.length !== headers.length) {
        console.warn(`Skipping malformed CSV line ${i + 1}: ${line}`);
        continue;
      }

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header.trim()] = columns[index]?.trim() || "";
      });

      const item = this.parseRow(row);
      if (item) {
        items.push(item);
      }
    }

    return items;
  }

  public load(): Lesson[] {
    if (this.cache) {
      return this.cache;
    }

    this.cache = this.parseCSV();
    return this.cache;
  }
}

export const newLessonsV2Loader = new NewLessonsV2Parser();
