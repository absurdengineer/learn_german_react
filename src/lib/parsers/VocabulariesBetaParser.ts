import vocabulariesCSV from "../../data/vocabularies.csv?raw";
import { BaseCSVParser, DataStandardizer } from "./DataLoader";
import type { StandardizedVocabulary } from "./DataLoader";

class VocabulariesBetaParser extends BaseCSVParser<StandardizedVocabulary> {
  protected csvContent = vocabulariesCSV;

  protected parseRow(
    data: Record<string, string>,
    index: number
  ): StandardizedVocabulary | null {
    if (!data.vocab_id || !data.german_word) return null;
    return {
      id: data.vocab_id,
      type: "vocabulary",
      german: data.german_word || "",
      english: data.english_translation || "",
      pronunciation: data.pronunciation_ipa || undefined,
      wordType: DataStandardizer.normalizeWordType(data.word_type || ""),
      gender: DataStandardizer.normalizeGender(data.article || ""),
      level: `A${parseInt(data.level, 10) || 1}` as
        | "A1"
        | "A2"
        | "B1"
        | "B2"
        | "C1"
        | "C2",
      category: data.category || undefined,
      difficulty: parseInt(data.difficulty, 10) || 1,
      frequency: parseInt(data.frequency, 10) || 0,
      tags: data.tags ? DataStandardizer.parseTags(data.tags) : [],
      examples:
        data.example_de && data.example_en
          ? [
              {
                german: data.example_de,
                english: data.example_en,
              },
            ]
          : undefined,
    };
  }
}

export const vocabulariesBetaLoader = new VocabulariesBetaParser();
