import grammarDataCSV from "../../../data/grammar_data.csv?raw";
import { parseCSVLine } from "../../csvParser";

// Raw CSV data interface - exactly as it appears in the CSV but with camelCase field names
export interface GrammarDataV2 {
  dataId: string;
  ruleId: string;
  contextType: string;
  baseForm: string;
  transformedForm: string;
  fullContextDe: string;
  fullContextEn: string;
  focusElement: string;
  transformationType: string;
  caseInvolved: string;
  personNumber: string;
  tenseMood: string;
  difficulty: string;
  tags: string;
  culturalNote: string;
}

class GrammarDataV2Parser {
  private csvContent = grammarDataCSV;
  private cache: GrammarDataV2[] | null = null;

  private parseRow(data: Record<string, string>): GrammarDataV2 | null {
    if (!data.data_id || !data.rule_id) return null;

    return {
      dataId: data.data_id,
      ruleId: data.rule_id,
      contextType: data.context_type,
      baseForm: data.base_form,
      transformedForm: data.transformed_form,
      fullContextDe: data.full_context_de,
      fullContextEn: data.full_context_en,
      focusElement: data.focus_element,
      transformationType: data.transformation_type,
      caseInvolved: data.case_involved,
      personNumber: data.person_number,
      tenseMood: data.tense_mood,
      difficulty: data.difficulty,
      tags: data.tags,
      culturalNote: data.cultural_note,
    };
  }

  private parseCSV(): GrammarDataV2[] {
    const lines = this.csvContent.trim().split("\n");
    if (lines.length < 2) return [];

    // Detect separator from the header line
    const separator = (() => {
      const commaCount = (lines[0].match(/,/g) || []).length;
      const semicolonCount = (lines[0].match(/;/g) || []).length;
      return semicolonCount > commaCount ? ";" : ",";
    })();

    const headers = parseCSVLine(lines[0], separator);
    const items: GrammarDataV2[] = [];

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

  public load(): GrammarDataV2[] {
    if (this.cache) {
      return this.cache;
    }

    this.cache = this.parseCSV();
    return this.cache;
  }
}

export const grammarDataV2Loader = new GrammarDataV2Parser();
