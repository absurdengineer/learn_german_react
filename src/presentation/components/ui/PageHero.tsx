import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  bannerContent?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  description,
  icon,
  bannerContent
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            {icon} {title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-2">
            {subtitle}
          </p>
          <p className="text-sm sm:text-base text-gray-500">
            {description}
          </p>
        </div>
        
        {bannerContent && (
          <div className="mt-6 sm:mt-8">
            {bannerContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHero;
