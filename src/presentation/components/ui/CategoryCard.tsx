import React from 'react';

interface CategoryCardProps {
  category: {
    name: string;
    icon: string;
  };
  onLearn: () => void;
  onPractice: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onLearn, onPractice }) => {
  return (
    <div className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="text-xl sm:text-2xl mb-2">{category.icon}</div>
      <div className="text-xs sm:text-sm font-medium text-gray-700 mb-3 capitalize text-center leading-tight">
        {category.name.replace(/_/g, ' ')}
      </div>
      <div className="flex flex-col gap-1.5 sm:gap-2 w-full">
        <button
          onClick={onLearn}
          className="text-xs bg-indigo-500 text-white px-2 py-1.5 rounded hover:bg-indigo-600 transition-colors font-medium touch-manipulation"
        >
          Learn
        </button>
        <button
          onClick={onPractice}
          className="text-xs bg-blue-500 text-white px-2 py-1.5 rounded hover:bg-blue-600 transition-colors font-medium touch-manipulation"
        >
          Practice
        </button>
      </div>
    </div>
  );
};
