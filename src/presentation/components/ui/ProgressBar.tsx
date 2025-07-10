import React from 'react';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'yellow';
  gradient?: boolean;
  animated?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  showPercentage = true,
  size = 'md',
  color = 'blue',
  gradient = false,
  animated = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: gradient ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-blue-600',
    green: gradient ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-green-600',
    purple: gradient ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-purple-600',
    orange: gradient ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-orange-600',
    red: gradient ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-red-600',
    indigo: gradient ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : 'bg-indigo-600',
    yellow: gradient ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-yellow-600'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          {label && <span>{label}</span>}
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${sizeClasses[size]} rounded-full ${colorClasses[color]} ${animated ? 'transition-all duration-300' : ''}`}
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
