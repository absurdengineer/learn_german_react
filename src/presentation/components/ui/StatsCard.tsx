import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      {subtitle && (
        <p className="text-sm text-gray-600">{subtitle}</p>
      )}
      {trend && (
        <div className={`flex items-center mt-2 text-sm ${
          trend.isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="mr-1">
            {trend.isPositive ? '↗️' : '↘️'}
          </span>
          {Math.abs(trend.value)}%
        </div>
      )}
    </div>
  );
};

export default StatsCard;
