import React from 'react';

interface GradientCardProps {
  children: React.ReactNode;
  gradient?: 'blue-purple' | 'purple-pink' | 'green-blue' | 'orange-red' | 'yellow-orange';
  className?: string;
}

const GradientCard: React.FC<GradientCardProps> = ({
  children,
  gradient = 'blue-purple',
  className = ''
}) => {
  const gradientClasses = {
    'blue-purple': 'bg-gradient-to-r from-blue-600 to-purple-600',
    'purple-pink': 'bg-gradient-to-r from-purple-600 to-pink-600',
    'green-blue': 'bg-gradient-to-r from-green-600 to-blue-600',
    'orange-red': 'bg-gradient-to-r from-orange-600 to-red-600',
    'yellow-orange': 'bg-gradient-to-r from-yellow-600 to-orange-600'
  };

  return (
    <div className={`${gradientClasses[gradient]} rounded-xl text-white p-6 ${className}`}>
      {children}
    </div>
  );
};

export default GradientCard;
