import React from 'react';

interface PracticeCardProps {
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  color: string;
  onClick: () => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({ title, description, icon, buttonText, color, onClick }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-center transition-all duration-300 hover:bg-gray-100 hover:shadow-sm">
      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4 h-12">{description}</p>
      <button
        onClick={onClick}
        className={`w-full ${color} text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm sm:text-base touch-manipulation`}
      >
        {buttonText}
      </button>
    </div>
  );
};
