import nounsCSV from "../../data/nouns.csv?raw";
import { BaseCSVParser, DataStandardizer } from "./DataLoader";
import type { StandardizedVocabulary } from "./DataLoader";

class NounsParser extends BaseCSVParser<StandardizedVocabulary> {
  protected csvContent = nounsCSV;

  protected parseRow(
    data: Record<string, string>,
    index: number
  ): StandardizedVocabulary | null {
    if (!data.noun_id || !data.german_noun) return null;
    return {
      id: data.noun_id,
      type: "vocabulary",
      german: data.german_noun || "",
      english: data.english_translation || "",
      pronunciation: data.pronunciation_ipa || undefined,
      wordType: "noun",
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

export const nounsLoader = new NounsParser();
