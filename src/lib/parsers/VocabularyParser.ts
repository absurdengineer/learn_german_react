/**
 * Standardized Vocabulary Parser
 */

import vocabularyCSV from '../../data/vocabulary.csv?raw';
import { BaseCSVParser, DataStandardizer, type StandardizedVocabulary } from './DataLoader';

export class VocabularyParser extends BaseCSVParser<StandardizedVocabulary> {
  protected csvContent = vocabularyCSV;

  protected parseRow(data: Record<string, string>, index: number): StandardizedVocabulary | null {
    if (!data.german || !data.english) {
      return null;
    }

    const tags = DataStandardizer.parseTags(data.tags);
    const wordType = DataStandardizer.normalizeWordType(data.type);
    const gender = DataStandardizer.normalizeGender(data.type === 'noun' ? this.extractGenderFromTags(tags) || '' : '');

    const examples: Array<{ german: string; english: string }> = [];
    if (data.example && data.example_translation) {
      examples.push({
        german: data.example,
        english: data.example_translation
      });
    }

    return {
      id: DataStandardizer.generateId('vocab', index),
      type: 'vocabulary',
      german: data.german,
      english: data.english,
      pronunciation: data.pronunciation || undefined,
      wordType,
      gender,
      level: 'A1',
      category: this.extractCategoryFromTags(tags),
      frequency: parseInt(data.frequency) || 1,
      tags,
      examples: examples.length > 0 ? examples : undefined
    };
  }

  private extractGenderFromTags(tags: string[]): 'masculine' | 'feminine' | 'neuter' | undefined {
    for (const tag of tags) {
      const gender = DataStandardizer.normalizeGender(tag);
      if (gender) return gender;
    }
    return undefined;
  }

  private extractCategoryFromTags(tags: string[]): string {
    // Find the most specific category tag (avoid generic ones like 'noun', 'verb')
    const genericTags = ['noun', 'verb', 'adjective', 'adverb', 'essential', 'basic', 'irregular', 'modal'];
    const specificTags = tags.filter(tag => !genericTags.includes(tag.toLowerCase()));
    return specificTags[0] || tags[0] || 'general';
  }
}

// Export singleton instance
export const vocabularyLoader = new VocabularyParser();
