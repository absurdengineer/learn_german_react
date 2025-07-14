import grammarDataCSV from "../../data/grammar_data.csv?raw";
import { BaseCSVParser } from "./DataLoader";
import type { GrammarData } from "../../types/GrammarData";

class GrammarDataParser extends BaseCSVParser<GrammarData> {
  protected csvContent = grammarDataCSV;

  protected parseRow(
    data: Record<string, string>,
    index: number
  ): GrammarData | null {
    if (!data.data_id || !data.rule_id) return null;
    return {
      id: data.data_id,
      type: "grammar_data",
      dataId: data.data_id,
      ruleId: data.rule_id,
      contextType: data.context_type || "",
      baseForm: data.base_form || "",
      transformedForm: data.transformed_form || "",
      fullContextDe: data.full_context_de || "",
      fullContextEn: data.full_context_en || "",
      focusElement: data.focus_element || "",
      transformationType: data.transformation_type || "",
      caseInvolved: data.case_involved || undefined,
      personNumber: data.person_number || undefined,
      tenseMood: data.tense_mood || undefined,
      difficulty: parseInt(data.difficulty, 10) || 1,
      tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
      culturalNote: data.cultural_note || undefined,
    };
  }
}

export const grammarDataLoader = new GrammarDataParser();
