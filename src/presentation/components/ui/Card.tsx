import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  clickable = false,
  onClick,
  padding = 'md',
  shadow = 'sm'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const baseClasses = `bg-white rounded-xl border border-gray-200 transition-all duration-200 ${paddingClasses[padding]} ${shadowClasses[shadow]}`;
  
  const hoverClasses = hover || clickable ? 'hover:shadow-md hover:-translate-y-1' : '';
  const clickableClasses = clickable ? 'cursor-pointer active:scale-95' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
