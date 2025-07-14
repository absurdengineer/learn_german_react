import nounsCSV from "../../../data/nouns.csv?raw";
import { parseCSVLine } from "../../csvParser";

// Raw CSV data interface - exactly as it appears in the CSV but with camelCase field names
export interface NounV2 {
  nounId: string;
  germanNoun: string;
  article: string;
  pluralForm: string;
  englishTranslation: string;
  pronunciationIpa: string;
  exampleDe: string;
  exampleEn: string;
  category: string;
  subcategory: string;
  tags: string;
  frequency: string;
  level: string;
  difficulty: string;
  articlePattern: string;
  declensionNom: string;
  declensionAcc: string;
  declensionDat: string;
  declensionGen: string;
  culturalNote: string;
}

class NounsV2Parser {
  private csvContent = nounsCSV;
  private cache: NounV2[] | null = null;

  private parseRow(data: Record<string, string>): NounV2 | null {
    if (!data.noun_id || !data.german_noun) return null;

    return {
      nounId: data.noun_id,
      germanNoun: data.german_noun,
      article: data.article,
      pluralForm: data.plural_form,
      englishTranslation: data.english_translation,
      pronunciationIpa: data.pronunciation_ipa,
      exampleDe: data.example_de,
      exampleEn: data.example_en,
      category: data.category,
      subcategory: data.subcategory,
      tags: data.tags,
      frequency: data.frequency,
      level: data.level,
      difficulty: data.difficulty,
      articlePattern: data.article_pattern,
      declensionNom: data.declension_nom,
      declensionAcc: data.declension_acc,
      declensionDat: data.declension_dat,
      declensionGen: data.declension_gen,
      culturalNote: data.cultural_note,
    };
  }

  private parseCSV(): NounV2[] {
    const lines = this.csvContent.trim().split("\n");
    if (lines.length < 2) return [];

    // Detect separator from the header line
    const separator = (() => {
      const commaCount = (lines[0].match(/,/g) || []).length;
      const semicolonCount = (lines[0].match(/;/g) || []).length;
      return semicolonCount > commaCount ? ";" : ",";
    })();

    const headers = parseCSVLine(lines[0], separator);
    const items: NounV2[] = [];

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

  public load(): NounV2[] {
    if (this.cache) {
      return this.cache;
    }

    this.cache = this.parseCSV();
    return this.cache;
  }
}

export const nounsV2Loader = new NounsV2Parser();
