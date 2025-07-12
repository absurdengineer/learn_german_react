import { formatCategoryName, getCategoryColor } from '../lib/categoryUtils';
import { parseCSVLine } from '../lib/csvParser';
import type { Category, VocabularyItem } from './index';
import vocabularyCSV from './vocabulary.csv?raw';

// CSV parser for vocabulary data
export const parseVocabularyCSV = (): VocabularyItem[] => {
  const lines = vocabularyCSV.trim().split('\n');
  
  // Parse header line using the same CSV parser
  const headers = parseCSVLine(lines[0]);
  
  // Validate headers
  const expectedHeaders = ['german', 'english', 'pronunciation', 'type', 'tags', 'frequency', 'example', 'example_translation'];
  if (!expectedHeaders.every(header => headers.includes(header))) {
    console.error('CSV headers do not match expected format:', headers);
    return [];
  }

  const vocabulary: VocabularyItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const columns = parseCSVLine(line);
    
    if (columns.length !== headers.length) {
      console.warn(`Line ${i + 1} has incorrect number of columns (expected ${headers.length}, got ${columns.length}):`, line);
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = columns[index] || '';
    });

    // Extract gender from tags if it's a noun
    let gender: string | undefined;
    const tags = row.tags.split('|').filter(tag => tag.trim());
    
    // Check if it's a noun and extract gender
    if (row.type === 'noun' || tags.includes('noun')) {
      // Look for gender markers in tags
      if (tags.includes('masculine') || tags.includes('der')) {
        gender = 'masculine';
      } else if (tags.includes('feminine') || tags.includes('die')) {
        gender = 'feminine';
      } else if (tags.includes('neuter') || tags.includes('das')) {
        gender = 'neuter';
      }
    }

    // Create examples array if example and translation exist
    const examples = [];
    if (row.example && row.example_translation) {
      examples.push({
        german: row.example,
        english: row.example_translation
      });
    }

    const vocabularyItem: VocabularyItem = {
      id: `csv_${i}`, // Generate unique ID based on line number
      german: row.german,
      english: row.english,
      pronunciation: row.pronunciation || undefined,
      type: row.type,
      level: 'A1', // Default to A1 since this is A1 vocabulary
      gender,
      tags,
      frequency: parseInt(row.frequency) || 1,
      examples: examples.length > 0 ? examples : undefined
    };

    vocabulary.push(vocabularyItem);
  }

  return vocabulary;
};

// Generate categories from the vocabulary data
export const generateVocabularyCategoriesFromCSV = (): Record<string, Category> => {
  const vocabulary = parseVocabularyCSV();
  const categoryMap: Record<string, Category> = {};

  // Extract all unique tags from vocabulary
  const allTags = new Set<string>();
  vocabulary.forEach(item => {
    item.tags.forEach(tag => allTags.add(tag));
  });

  // Create category objects for each unique tag
  allTags.forEach(tag => {
    categoryMap[tag] = {
      name: formatCategoryName(tag),
      description: `Words related to ${formatCategoryName(tag).toLowerCase()}`,
      color: getCategoryColor(tag)
    };
  });

  return categoryMap;
};

// Export statistics for CSV vocabulary
export const getCSVVocabularyStats = () => {
  const vocabulary = parseVocabularyCSV();
  const totalWords = vocabulary.length;
  const categories = generateVocabularyCategoriesFromCSV();
  
  const categoryStats = Object.keys(categories).map(key => {
    const count = vocabulary.filter(item => item.tags.includes(key)).length;
    return {
      category: key,
      name: categories[key].name,
      count,
      percentage: Math.round((count / totalWords) * 100)
    };
  }).filter(stat => stat.count > 0); // Only include categories with words

  return {
    totalWords,
    categories: categoryStats,
    metadata: {
      source: 'CSV',
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    }
  };
};
