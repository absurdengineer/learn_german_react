import React from 'react';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  showPercentage?: boolean;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  current,
  total,
  color = 'blue',
  showPercentage = true,
  className = ''
}) => {
  const percentage = Math.round((current / total) * 100);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      progress: 'bg-blue-600',
      progressBg: 'bg-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      progress: 'bg-green-600',
      progressBg: 'bg-green-200'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      progress: 'bg-purple-600',
      progressBg: 'bg-purple-200'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      progress: 'bg-orange-600',
      progressBg: 'bg-orange-200'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      progress: 'bg-red-600',
      progressBg: 'bg-red-200'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      progress: 'bg-indigo-600',
      progressBg: 'bg-indigo-200'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${colors.text}`}>
          {title}
        </span>
        <span className={`text-sm ${colors.text}`}>
          {current}/{total}
        </span>
      </div>
      <div className={`w-full ${colors.progressBg} rounded-full h-2`}>
        <div
          className={`${colors.progress} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className={`text-xs ${colors.text} mt-1 text-center`}>
          {percentage}%
        </div>
      )}
    </div>
  );
};

export default ProgressCard;
