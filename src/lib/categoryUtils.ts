// Helper function to format category names
export const formatCategoryName = (tag: string): string => {
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
  export const getCategoryColor = (tag: string): string => {
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
  