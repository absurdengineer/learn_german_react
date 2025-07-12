import React from 'react';
import Button from './Button';

interface TestTypeCardProps {
  title: string;
  description: string;
  icon: string;
  onStart: (count: number) => void;
}

export const TestTypeCard: React.FC<TestTypeCardProps> = ({ title, description, icon, onStart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
      <div className="text-center">
        <div className="text-3xl sm:text-4xl mb-3">{icon}</div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="space-y-2">
          <Button
            onClick={() => onStart(15)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            15 Questions
          </Button>
          <Button
            onClick={() => onStart(25)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            25 Questions
          </Button>
        </div>
      </div>
    </div>
  );
};
