import vocabulariesCSV from "../../../data/vocabularies.csv?raw";
import { parseCSVLine } from "../../csvParser";

export interface VocabularyV2 {
  vocabId: string;
  wordType: string;
  germanWord: string;
  englishTranslation: string;
  pronunciationIpa: string;
  exampleDe: string;
  exampleEn: string;
  category: string;
  tags: string;
  frequency: string;
  level: string;
  difficulty: string;
  verbStem: string;
  verbType: string;
  pastParticiple: string;
  comparative: string;
  superlative: string;
  governsCase: string;
  usageNotes: string;
  culturalNote: string;
}

class VocabulariesV2Parser {
  private csvContent = vocabulariesCSV;
  private cache: VocabularyV2[] | null = null;

  private parseRow(data: Record<string, string>): VocabularyV2 | null {
    if (!data.vocab_id || !data.german_word || !data.english_translation)
      return null;

    return {
      vocabId: data.vocab_id,
      wordType: data.word_type,
      germanWord: data.german_word,
      englishTranslation: data.english_translation,
      pronunciationIpa: data.pronunciation_ipa,
      exampleDe: data.example_de,
      exampleEn: data.example_en,
      category: data.category,
      tags: data.tags,
      frequency: data.frequency,
      level: data.level,
      difficulty: data.difficulty,
      verbStem: data.verb_stem,
      verbType: data.verb_type,
      pastParticiple: data.past_participle,
      comparative: data.comparative,
      superlative: data.superlative,
      governsCase: data.governs_case,
      usageNotes: data.usage_notes,
      culturalNote: data.cultural_note,
    };
  }

  private parseCSV(): VocabularyV2[] {
    const lines = this.csvContent.trim().split("\n");
    if (lines.length < 2) return [];

    // Detect separator from the header line
    const separator = (() => {
      const commaCount = (lines[0].match(/,/g) || []).length;
      const semicolonCount = (lines[0].match(/;/g) || []).length;
      return semicolonCount > commaCount ? ";" : ",";
    })();

    const headers = parseCSVLine(lines[0], separator);
    const items: VocabularyV2[] = [];

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

  public load(): VocabularyV2[] {
    if (this.cache) {
      return this.cache;
    }

    this.cache = this.parseCSV();
    return this.cache;
  }
}

export const vocabulariesV2Loader = new VocabulariesV2Parser();
