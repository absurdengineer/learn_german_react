import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'text-blue-600',
  size = 'md',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          value: 'text-2xl',
          title: 'text-sm',
          subtitle: 'text-xs'
        };
      case 'lg':
        return {
          container: 'p-8',
          value: 'text-4xl sm:text-5xl',
          title: 'text-lg',
          subtitle: 'text-base'
        };
      default:
        return {
          container: 'p-6',
          value: 'text-3xl sm:text-4xl',
          title: 'text-base',
          subtitle: 'text-sm'
        };
    }
  };

  const getTrendIcon = () => {
    switch (trend?.direction) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7v10" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-10-10M7 7v10" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${sizeClasses.container} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${sizeClasses.title} font-medium text-gray-600 mb-1`}>
            {title}
          </p>
          
          <div className="flex items-baseline space-x-2">
            <p className={`${sizeClasses.value} font-bold ${color}`}>
              {value}
            </p>
            {icon && (
              <span className="text-xl">
                {icon}
              </span>
            )}
          </div>

          {subtitle && (
            <p className={`${sizeClasses.subtitle} text-gray-500 mt-1`}>
              {subtitle}
            </p>
          )}

          {trend && (
            <div className="flex items-center space-x-1 mt-2">
              {getTrendIcon()}
              <span className={`text-xs font-medium ${
                trend.direction === 'up' ? 'text-green-600' :
                trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
