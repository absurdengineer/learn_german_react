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
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 text-gray-900 leading-tight">
            {icon} {title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-2 leading-relaxed">
            {subtitle}
          </p>
          <p className="text-xs sm:text-sm lg:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>
        
        {bannerContent && (
          <div className="mt-4 sm:mt-6 lg:mt-8">
            {bannerContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHero;
