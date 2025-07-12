import React from 'react';
import { GENDER_COLORS } from '../lib/genderColors';

interface GenderLegendProps {
  className?: string;
  showTitle?: boolean;
}

const GenderLegend: React.FC<GenderLegendProps> = ({ 
  className = '', 
  showTitle = true 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {showTitle && (
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Gender Color Guide
        </h3>
      )}
      
      <div className="flex flex-wrap gap-2">
        {Object.entries(GENDER_COLORS).map(([gender, colors]) => (
          <div
            key={gender}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}
          >
            <span className="font-bold">{gender}</span>
            <span className="opacity-75">({colors.name})</span>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        💡 Use colors to remember noun genders: 
        <span className="text-blue-600 font-medium"> blue = masculine</span>, 
        <span className="text-pink-600 font-medium"> pink = feminine</span>, 
        <span className="text-gray-600 font-medium"> gray = neuter</span>
      </p>
    </div>
  );
};

export default GenderLegend;
