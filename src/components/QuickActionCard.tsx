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
      className={`bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform active:scale-95 sm:hover:-translate-y-1 border border-gray-100 min-h-[120px] sm:min-h-[140px] ${className}`}
    >
      <div className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className={`${color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl`}>
            {icon}
          </div>
          <div className="text-gray-400">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 flex-1 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default QuickActionCard;
