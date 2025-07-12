import React from 'react';

interface SpeedOption {
  value: number;
  label: string;
}

interface SpeedControlsProps {
  currentSpeed: number;
  onSpeedChange: (speed: number) => void;
  speedOptions?: SpeedOption[];
  label?: string;
  className?: string;
}

const defaultSpeedOptions: SpeedOption[] = [
  { value: 5000, label: 'Slow' },
  { value: 3000, label: 'Normal' },
  { value: 1500, label: 'Fast' },
  { value: 800, label: 'Very Fast' }
];

const SpeedControls: React.FC<SpeedControlsProps> = ({
  currentSpeed,
  onSpeedChange,
  speedOptions = defaultSpeedOptions,
  label = 'Speed:',
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex space-x-2">
          {speedOptions.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onSpeedChange(value)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                currentSpeed === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeedControls;
