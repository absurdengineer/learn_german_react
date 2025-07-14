import grammarRulesCSV from "../../../data/grammar_rules.csv?raw";
import { parseCSVLine } from "../../csvParser";

// Raw CSV data interface - exactly as it appears in the CSV but with camelCase field names
export interface GrammarRule {
  ruleId: string;
  ruleName: string;
  ruleCategory: string;
  explanation: string;
  simpleSummary: string;
  level: string;
  difficulty: string;
  prerequisiteRules: string;
  appliesTo: string;
  exceptions: string;
  pattern: string;
  memoryAid: string;
  culturalContext: string;
}

class GrammarRulesV2Parser {
  private csvContent = grammarRulesCSV;
  private cache: GrammarRule[] | null = null;

  private parseRow(data: Record<string, string>): GrammarRule | null {
    if (!data.rule_id || !data.rule_name) return null;

    return {
      ruleId: data.rule_id,
      ruleName: data.rule_name,
      ruleCategory: data.rule_category,
      explanation: data.explanation,
      simpleSummary: data.simple_summary,
      level: data.level,
      difficulty: data.difficulty,
      prerequisiteRules: data.prerequisite_rules,
      appliesTo: data.applies_to,
      exceptions: data.exceptions,
      pattern: data.pattern,
      memoryAid: data.memory_aid,
      culturalContext: data.cultural_context,
    };
  }

  private parseCSV(): GrammarRule[] {
    const lines = this.csvContent.trim().split("\n");
    if (lines.length < 2) return [];

    // Detect separator from the header line
    const separator = (() => {
      const commaCount = (lines[0].match(/,/g) || []).length;
      const semicolonCount = (lines[0].match(/;/g) || []).length;
      return semicolonCount > commaCount ? ";" : ",";
    })();

    const headers = parseCSVLine(lines[0], separator);
    const items: GrammarRule[] = [];

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

  public load(): GrammarRule[] {
    if (this.cache) {
      return this.cache;
    }

    this.cache = this.parseCSV();
    return this.cache;
  }
}

export const grammarRulesV2Loader = new GrammarRulesV2Parser();
