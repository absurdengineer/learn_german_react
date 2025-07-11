import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color?: string;
  progress?: number;
  badge?: string | number;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  color = 'bg-blue-500',
  progress,
  badge,
  onClick,
  disabled = false,
  className = '',
  children
}) => {
  const isClickable = onClick && !disabled;

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden
        ${isClickable ? 'cursor-pointer hover:shadow-md hover:-translate-y-1 active:scale-[0.98]' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        transition-all duration-200
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
            {icon}
          </div>
          
          <div className="flex items-center space-x-2">
            {badge && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            {isClickable && (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>

        {/* Progress Bar */}
        {typeof progress === 'number' && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-700">Progress</span>
              <span className="text-xs font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Additional Content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
