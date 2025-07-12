import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  actions?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'center' | 'right';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  icon,
  actions,
  className = '',
  size = 'md',
  alignment = 'center'
}) => {
  const sizeClasses = {
    sm: {
      title: 'text-2xl',
      subtitle: 'text-lg',
      description: 'text-sm',
      spacing: 'mb-4'
    },
    md: {
      title: 'text-3xl',
      subtitle: 'text-xl',
      description: 'text-base',
      spacing: 'mb-6'
    },
    lg: {
      title: 'text-4xl',
      subtitle: 'text-2xl',
      description: 'text-lg',
      spacing: 'mb-8'
    }
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const sizes = sizeClasses[size];
  const alignClass = alignmentClasses[alignment];

  return (
    <div className={`${sizes.spacing} ${className}`}>
      <div className={`${alignClass} ${actions ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between sm:text-left' : ''}`}>
        <div className={actions ? '' : alignClass}>
          {icon && (
            <div className={`text-4xl ${alignment === 'center' ? 'mb-4' : 'mb-2'}`}>
              {icon}
            </div>
          )}
          
          <h2 className={`${sizes.title} font-bold text-gray-900 mb-2`}>
            {title}
          </h2>
          
          {subtitle && (
            <p className={`${sizes.subtitle} text-gray-600 mb-2`}>
              {subtitle}
            </p>
          )}
          
          {description && (
            <p className={`${sizes.description} text-gray-500`}>
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className={`${alignment === 'center' ? 'mt-4 sm:mt-0' : ''} flex-shrink-0`}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
