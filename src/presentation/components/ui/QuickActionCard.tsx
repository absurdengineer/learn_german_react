import React from 'react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
  className?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick,
  className = ''
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-100 ${className}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
            {icon}
          </div>
          <div className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
};

export default QuickActionCard;
