import React from 'react';

interface PracticeModeCardProps {
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  onStart: () => void;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'teal' | 'yellow';
  className?: string;
  disabled?: boolean;
  stats?: {
    label: string;
    value: string | number;
  };
}

const PracticeModeCard: React.FC<PracticeModeCardProps> = ({
  title,
  description,
  icon,
  buttonText,
  onStart,
  color = 'blue',
  className = '',
  disabled = false,
  stats
}) => {
  const colorClasses = {
    blue: {
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600'
    },
    green: {
      button: 'bg-green-600 hover:bg-green-700',
      icon: 'text-green-600'
    },
    purple: {
      button: 'bg-purple-600 hover:bg-purple-700',
      icon: 'text-purple-600'
    },
    orange: {
      button: 'bg-orange-600 hover:bg-orange-700',
      icon: 'text-orange-600'
    },
    red: {
      button: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-600'
    },
    indigo: {
      button: 'bg-indigo-600 hover:bg-indigo-700',
      icon: 'text-indigo-600'
    },
    teal: {
      button: 'bg-teal-600 hover:bg-teal-700',
      icon: 'text-teal-600'
    },
    yellow: {
      button: 'bg-yellow-600 hover:bg-yellow-700',
      icon: 'text-yellow-600'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 ${className} ${disabled ? 'opacity-50' : ''}`}>
      <div className="text-center">
        <div className={`text-4xl mb-4 ${colors.icon}`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        
        {stats && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">{stats.label}</div>
            <div className="text-lg font-semibold text-gray-900">{stats.value}</div>
          </div>
        )}
        
        <button
          onClick={onStart}
          disabled={disabled}
          className={`w-full text-white py-3 px-6 rounded-lg transition-colors font-medium disabled:cursor-not-allowed disabled:opacity-50 ${colors.button}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default PracticeModeCard;
