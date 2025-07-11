/**
 * Standardized Articles Parser
 */

import articlesCSV from '../articles.csv?raw';
import { BaseCSVParser, DataStandardizer, type StandardizedArticle } from './DataLoader';

export class ArticlesParser extends BaseCSVParser<StandardizedArticle> {
  protected csvContent = articlesCSV;

  protected parseRow(data: Record<string, string>, index: number): StandardizedArticle | null {
    if (!data.german || !data.english || !data.gender) {
      return null;
    }

    const gender = data.gender as 'der' | 'die' | 'das';
    if (!['der', 'die', 'das'].includes(gender)) {
      console.warn(`Invalid gender "${data.gender}" for word "${data.german}"`);
      return null;
    }

    return {
      id: data.id || DataStandardizer.generateId('article', index),
      type: 'article',
      german: data.german,
      english: data.english,
      pronunciation: data.pronunciation || undefined,
      gender,
      category: data.category || 'general',
      frequency: parseInt(data.frequency) || 1,
      tags: [data.category, gender].filter(Boolean),
      isPlural: data.german.toLowerCase().includes('e') && gender === 'die' // Basic plural detection
    };
  }
}

// Export singleton instance
export const articlesLoader = new ArticlesParser();
