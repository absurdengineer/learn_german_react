import React from 'react';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string | null;
  className?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  title,
  description,
  icon,
  unlocked,
  date,
  className = ''
}) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
        unlocked
          ? 'bg-green-50 border-green-200 shadow-sm'
          : 'bg-gray-50 border-gray-200 opacity-60'
      } ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`text-2xl ${unlocked ? '' : 'grayscale'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${
            unlocked ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {title}
          </h4>
          <p className={`text-sm ${
            unlocked ? 'text-gray-600' : 'text-gray-400'
          }`}>
            {description}
          </p>
          {unlocked && date && (
            <p className="text-xs text-green-600 mt-1">
              Unlocked on {date}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
