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

// Helper function to parse CSV line considering quoted fields and commas
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote within quoted field
        current += '"';
        i += 2;
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // Add the last field
  result.push(current.trim());
  return result;
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

// Helper function to format category names
const formatCategoryName = (tag: string): string => {
  // Handle special cases
  const specialCases: Record<string, string> = {
    'personal': 'Personal Pronouns',
    'nominative': 'Nominative Case',
    'accusative': 'Accusative Case',
    'dative': 'Dative Case',
    'genitive': 'Genitive Case',
    'modal': 'Modal Verbs',
    'separable': 'Separable Verbs',
    'irregular': 'Irregular Verbs',
    'essential': 'Essential Words',
    'basic': 'Basic Vocabulary',
    'masculine': 'Masculine',
    'feminine': 'Feminine',
    'neuter': 'Neuter'
  };

  if (specialCases[tag]) {
    return specialCases[tag];
  }

  // Capitalize first letter and replace underscores with spaces
  return tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, ' ');
};

// Helper function to assign colors to categories
const getCategoryColor = (tag: string): string => {
  const colorMap: Record<string, string> = {
    'verb': '#3B82F6',
    'noun': '#EF4444',
    'adjective': '#10B981',
    'pronoun': '#8B5CF6',
    'article': '#F59E0B',
    'preposition': '#EC4899',
    'adverb': '#06B6D4',
    'essential': '#DC2626',
    'basic': '#059669',
    'modal': '#7C3AED',
    'separable': '#DB2777',
    'irregular': '#DC2626'
  };

  return colorMap[tag] || '#6B7280';
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
