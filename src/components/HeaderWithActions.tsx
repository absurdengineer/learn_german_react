import React from 'react';

interface HeaderWithActionsProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  backButton?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const HeaderWithActions: React.FC<HeaderWithActionsProps> = ({
  title,
  subtitle,
  description,
  actions,
  backButton,
  className = ''
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      {backButton && (
        <button
          onClick={backButton.onClick}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{backButton.label}</span>
        </button>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-gray-600 mb-1">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-gray-500">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderWithActions;
