import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, description }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      <p className="text-xl text-gray-600 mb-2">
        {subtitle}
      </p>
      <p className="text-lg text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default PageHeader;
