import grammarRulesCSV from "../../data/grammar_rules.csv?raw";
import { BaseCSVParser } from "./DataLoader";
import type { StandardizedGrammarRule } from "./DataLoader";

class GrammarRulesParser extends BaseCSVParser<StandardizedGrammarRule> {
  protected csvContent = grammarRulesCSV;

  protected parseRow(
    data: Record<string, string>,
    index: number
  ): StandardizedGrammarRule | null {
    if (!data.rule_id || !data.rule_name) return null;
    return {
      id: data.rule_id,
      type: "grammar_rule",
      ruleId: data.rule_id,
      ruleName: data.rule_name,
      ruleCategory: data.rule_category || "",
      explanation: data.explanation || "",
      simpleSummary: data.simple_summary || "",
      difficulty: parseInt(data.difficulty, 10) || 1,
      prerequisiteRules: data.prerequisite_rules || undefined,
      appliesTo: data.applies_to || undefined,
      exceptions: data.exceptions || undefined,
      pattern: data.pattern || undefined,
      memoryAid: data.memory_aid || undefined,
      culturalContext: data.cultural_context || undefined,
    };
  }
}

export const grammarRulesLoader = new GrammarRulesParser();
