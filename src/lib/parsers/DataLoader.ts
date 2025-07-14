/**
 * Standardized Data Loader for DeutschMeister
 *
 * This module provides a unified interface for loading all learning resources:
 * - Vocabulary words from CSV
 * - Articles/nouns from CSV
 * - Grammar lessons from CSV
 * - Grammar practice questions from CSV
 *
 * All data is cached for performance and can be used directly outside the application.
 */

import { parseCSVLine } from "../csvParser";

// Base interfaces for all data types
export interface BaseDataItem {
  id: string;
  category?: string;
  difficulty?: number;
  frequency?: number;
  tags?: string[];
}

export interface StandardizedVocabulary extends BaseDataItem {
  type: "vocabulary";
  german: string;
  english: string;
  pronunciation?: string;
  wordType: "noun" | "verb" | "adjective" | "adverb" | "other";
  gender?: "masculine" | "feminine" | "neuter";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  examples?: Array<{
    german: string;
    english: string;
  }>;
}

export interface StandardizedArticle extends BaseDataItem {
  type: "article";
  german: string;
  english: string;
  pronunciation?: string;
  gender: "der" | "die" | "das";
  isPlural?: boolean;
}

export interface StandardizedGrammarLesson extends BaseDataItem {
  type: "grammar_lesson";
  day: number;
  week: number;
  title: string;
  content: string;
  mission: string;
  helpfulHint?: string;
  funFact?: string;
  estimatedTime?: number;
}

export interface StandardizedGrammarPractice extends BaseDataItem {
  type: "grammar_practice";
  dayReference: number;
  questionType: "multiple_choice" | "fill_in_blank" | "true_false" | "ordering";
  prompt: string;
  correctAnswer: string;
  options: string[];
  helperText?: string;
}

export interface StandardizedGrammarData extends BaseDataItem {
  type: "grammar_data";
  dataId: string;
  ruleId: string;
  contextType: string;
  baseForm: string;
  transformedForm: string;
  fullContextDe: string;
  fullContextEn: string;
  focusElement: string;
  transformationType: string;
  caseInvolved?: string;
  personNumber?: string;
  tenseMood?: string;
  culturalNote?: string;
}

export interface StandardizedGrammarRule extends BaseDataItem {
  type: "grammar_rule";
  ruleId: string;
  ruleName: string;
  ruleCategory: string;
  explanation: string;
  simpleSummary: string;
  prerequisiteRules?: string;
  appliesTo?: string;
  exceptions?: string;
  pattern?: string;
  memoryAid?: string;
  culturalContext?: string;
}

export type StandardizedDataItem =
  | StandardizedVocabulary
  | StandardizedArticle
  | StandardizedGrammarLesson
  | StandardizedGrammarPractice
  | StandardizedGrammarData
  | StandardizedGrammarRule;

// Data cache for performance
class DataCache {
  private static instance: DataCache;
  private cache: Map<string, StandardizedDataItem[]> = new Map();
  private lastUpdate: Map<string, number> = new Map();

  static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache();
    }
    return DataCache.instance;
  }

  set(key: string, data: StandardizedDataItem[]): void {
    this.cache.set(key, data);
    this.lastUpdate.set(key, Date.now());
  }

  get(key: string): StandardizedDataItem[] | null {
    return this.cache.get(key) || null;
  }

  isExpired(key: string, maxAge: number = 5 * 60 * 1000): boolean {
    const lastUpdate = this.lastUpdate.get(key);
    if (!lastUpdate) return true;
    return Date.now() - lastUpdate > maxAge;
  }

  clear(): void {
    this.cache.clear();
    this.lastUpdate.clear();
  }
}

// Base CSV parser class
export abstract class BaseCSVParser<T extends StandardizedDataItem> {
  protected abstract csvContent: string;
  protected abstract parseRow(
    data: Record<string, string>,
    index: number
  ): T | null;

  protected parseCSV(): T[] {
    const lines = this.csvContent.trim().split("\n");
    if (lines.length < 2) return [];

    // Detect separator from the header line
    const separator = (() => {
      const commaCount = (lines[0].match(/,/g) || []).length;
      const semicolonCount = (lines[0].match(/;/g) || []).length;
      return semicolonCount > commaCount ? ";" : ",";
    })();

    const headers = parseCSVLine(lines[0], separator);
    const items: T[] = [];

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

      const item = this.parseRow(row, i);
      if (item) {
        items.push(item);
      }
    }

    return items;
  }

  public load(): T[] {
    const cache = DataCache.getInstance();
    const cacheKey = this.constructor.name;

    if (!cache.isExpired(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (cached) {
        return cached as T[];
      }
    }

    const data = this.parseCSV();
    cache.set(cacheKey, data);
    return data;
  }
}

// Utility functions for standardization
export class DataStandardizer {
  static normalizeGender(
    gender: string
  ): "masculine" | "feminine" | "neuter" | undefined {
    const normalized = gender.toLowerCase().trim();
    if (
      normalized === "der" ||
      normalized === "masculine" ||
      normalized === "m"
    )
      return "masculine";
    if (normalized === "die" || normalized === "feminine" || normalized === "f")
      return "feminine";
    if (normalized === "das" || normalized === "neuter" || normalized === "n")
      return "neuter";
    return undefined;
  }

  static normalizeWordType(
    type: string
  ): "noun" | "verb" | "adjective" | "adverb" | "other" {
    const normalized = type.toLowerCase().trim();
    if (normalized.includes("noun")) return "noun";
    if (normalized.includes("verb")) return "verb";
    if (normalized.includes("adjective") || normalized.includes("adj"))
      return "adjective";
    if (normalized.includes("adverb") || normalized.includes("adv"))
      return "adverb";
    return "other";
  }

  static parseTags(tagString: string): string[] {
    if (!tagString) return [];
    return tagString
      .split("|")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  static parseOptions(
    prompt: string,
    correctAnswer: string,
    optionB?: string,
    optionC?: string
  ): string[] {
    const options = [correctAnswer];

    if (optionB && optionB.trim()) {
      options.push(optionB.trim());
    }
    if (optionC && optionC.trim()) {
      options.push(optionC.trim());
    }

    // For certain question types, add standard options
    if (
      prompt.toLowerCase().includes("article") ||
      prompt.toLowerCase().includes("der/die/das")
    ) {
      const articles = ["der", "die", "das"];
      articles.forEach((article) => {
        if (!options.includes(article)) {
          options.push(article);
        }
      });
    }

    // Ensure we have at least 3-4 options by generating additional ones if needed
    if (options.length < 4) {
      // Generate additional options based on the question type
      const additionalOptions = this.generateAdditionalOptions(
        prompt,
        correctAnswer,
        options
      );
      options.push(...additionalOptions);
    }

    // Shuffle options and ensure exactly 4
    const shuffled = options.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }

  private static generateAdditionalOptions(
    prompt: string,
    _correctAnswer: string,
    existingOptions: string[]
  ): string[] {
    const additionalOptions: string[] = [];

    // Generate options based on question type
    if (
      prompt.toLowerCase().includes("greeting") ||
      prompt.toLowerCase().includes("hallo")
    ) {
      const greetings = [
        "Hallo",
        "Guten Tag",
        "Guten Morgen",
        "Guten Abend",
        "Tschüss",
        "Auf Wiedersehen",
      ];
      greetings.forEach((greeting) => {
        if (
          !existingOptions.includes(greeting) &&
          additionalOptions.length < 2
        ) {
          additionalOptions.push(greeting);
        }
      });
    } else if (
      prompt.toLowerCase().includes("verb") ||
      prompt.toLowerCase().includes("conjugat")
    ) {
      const verbs = [
        "mache",
        "machst",
        "macht",
        "machen",
        "bin",
        "bist",
        "ist",
        "sind",
        "habe",
        "hast",
        "hat",
        "haben",
      ];
      verbs.forEach((verb) => {
        if (!existingOptions.includes(verb) && additionalOptions.length < 2) {
          additionalOptions.push(verb);
        }
      });
    } else if (
      prompt.toLowerCase().includes("pronoun") ||
      prompt.toLowerCase().includes("ich") ||
      prompt.toLowerCase().includes("du")
    ) {
      const pronouns = ["ich", "du", "er", "sie", "es", "wir", "ihr", "Sie"];
      pronouns.forEach((pronoun) => {
        if (
          !existingOptions.includes(pronoun) &&
          additionalOptions.length < 2
        ) {
          additionalOptions.push(pronoun);
        }
      });
    } else {
      // Generic fallback options
      const genericOptions = [
        "Ja",
        "Nein",
        "Vielleicht",
        "Sicher",
        "Gerne",
        "Leider",
      ];
      genericOptions.forEach((option) => {
        if (!existingOptions.includes(option) && additionalOptions.length < 2) {
          additionalOptions.push(option);
        }
      });
    }

    return additionalOptions;
  }

  static generateId(prefix: string, index: number): string {
    return `${prefix}_${String(index).padStart(4, "0")}`;
  }

  static calculateWeek(day: number): number {
    return Math.ceil(day / 7);
  }
}
