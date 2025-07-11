import React from 'react';

interface SectionGridProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SectionGrid: React.FC<SectionGridProps> = ({
  title,
  description,
  children,
  columns = 3,
  gap = 'md',
  className = ''
}) => {
  const getGridClasses = () => {
    const colClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    };

    const gapClasses = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    };

    return `grid ${colClasses[columns]} ${gapClasses[gap]}`;
  };

  return (
    <section className={`space-y-6 ${className}`}>
      {(title || description) && (
        <div className="text-center">
          {title && (
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className={getGridClasses()}>
        {children}
      </div>
    </section>
  );
};

export default SectionGrid;
