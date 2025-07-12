import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  categoryIcons?: Record<string, string>;
  showAllOption?: boolean;
  allOptionLabel?: string;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  categoryIcons = {},
  showAllOption = true,
  allOptionLabel = 'All',
  className = '',
  orientation = 'horizontal'
}) => {
  const getButtonStyles = (category: string) => {
    const isSelected = selectedCategory === category;
    return `px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
      isSelected
        ? 'bg-blue-600 text-white'
        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
    }`;
  };

  const containerClasses = orientation === 'horizontal' 
    ? 'flex flex-wrap gap-2' 
    : 'flex flex-col space-y-2';

  return (
    <div className={`${className}`}>
      <div className={containerClasses}>
        {showAllOption && (
          <button
            onClick={() => onCategorySelect('all')}
            className={getButtonStyles('all')}
          >
            {allOptionLabel}
          </button>
        )}
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={getButtonStyles(category)}
          >
            {categoryIcons[category] && (
              <span className="mr-2">{categoryIcons[category]}</span>
            )}
            {category.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
