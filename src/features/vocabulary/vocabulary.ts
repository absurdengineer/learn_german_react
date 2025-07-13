import { formatCategoryName, getCategoryColor } from "../../lib/categoryUtils";
import { parseCSVLine } from "../../lib/csvParser";
import { VocabularyWord, VocabularyId } from "../../types/Vocabulary";
import type { WordType, Gender } from "../../types/Vocabulary";
import vocabularyCSV from "../../data/vocabulary.csv?raw";

// Memoized cache for parsed vocabulary
let vocabularyCache: VocabularyWord[] | null = null;

/**
 * Parse and normalize the vocabulary CSV into a typed array of VocabularyWord objects.
 * Memoized for performance.
 */
export function getAllVocabulary(): VocabularyWord[] {
  if (vocabularyCache) return vocabularyCache;
  const lines = vocabularyCSV.trim().split("\n");
  const headers = parseCSVLine(lines[0]);
  const expectedHeaders = [
    "german",
    "english",
    "pronunciation",
    "type",
    "tags",
    "frequency",
    "example",
    "example_translation",
  ];
  if (!expectedHeaders.every((header) => headers.includes(header))) {
    console.error("CSV headers do not match expected format:", headers);
    return [];
  }
  const vocabulary: VocabularyWord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const columns = parseCSVLine(line);
    if (columns.length !== headers.length) {
      console.warn(
        `Line ${i + 1} has incorrect number of columns (expected ${
          headers.length
        }, got ${columns.length}):`,
        line
      );
      continue;
    }
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = columns[index] || "";
    });
    // Extract gender from tags if it's a noun
    let gender: Gender | undefined;
    const tags = row.tags.split("|").filter((tag) => tag.trim());
    if (row.type === "noun" || tags.includes("noun")) {
      if (tags.includes("masculine") || tags.includes("der")) {
        gender = "der";
      } else if (tags.includes("feminine") || tags.includes("die")) {
        gender = "die";
      } else if (tags.includes("neuter") || tags.includes("das")) {
        gender = "das";
      } else if (tags.includes("plural")) {
        gender = "plural";
      }
    }
    // Create examples array if example and translation exist
    const examples = [];
    if (row.example && row.example_translation) {
      examples.push({
        german: row.example,
        english: row.example_translation,
      });
    }
    const vocabularyItem = new VocabularyWord(
      new VocabularyId(`csv_${i}`),
      row.german.trim(),
      row.english.trim(),
      row.type as WordType,
      "A1",
      {
        gender,
        pronunciation: row.pronunciation || undefined,
        tags,
        frequency: parseInt(row.frequency) || 1,
        exampleSentences: examples.length > 0 ? examples : [],
      }
    );
    vocabulary.push(vocabularyItem);
  }
  vocabularyCache = vocabulary;
  return vocabularyCache;
}

/**
 * Get a vocabulary item by its ID.
 */
export function getVocabularyById(id: string): VocabularyWord | undefined {
  return getAllVocabulary().find((item) => item.id.value === id);
}

/**
 * Generate categories from the vocabulary data.
 */
export function generateVocabularyCategories(): Record<string, any> {
  const vocabulary = getAllVocabulary();
  const categoryMap: Record<string, any> = {};
  const allTags = new Set<string>();
  vocabulary.forEach((item) => {
    item.tags.forEach((tag) => allTags.add(tag));
  });
  allTags.forEach((tag) => {
    categoryMap[tag] = {
      name: formatCategoryName(tag),
      description: `Words related to ${formatCategoryName(tag).toLowerCase()}`,
      color: getCategoryColor(tag),
    };
  });
  return categoryMap;
}

/**
 * Export statistics for vocabulary.
 */
export function getVocabularyStats() {
  const vocabulary = getAllVocabulary();
  const totalWords = vocabulary.length;
  const categories = generateVocabularyCategories();
  const categoryStats = Object.keys(categories)
    .map((key) => {
      const count = vocabulary.filter((item) => item.tags.includes(key)).length;
      return {
        category: key,
        name: categories[key].name,
        count,
        percentage: Math.round((count / totalWords) * 100),
      };
    })
    .filter((stat) => stat.count > 0);
  return {
    totalWords,
    categories: categoryStats,
    metadata: {
      source: "CSV",
      lastUpdated: new Date().toISOString(),
      version: "1.0.0",
    },
  };
}
