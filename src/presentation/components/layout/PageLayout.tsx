import React from 'react';
import type { PageData } from '../../../hooks/usePageData';
import { PageHero } from '../ui';

interface PageLayoutProps {
  pageData: PageData;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
  bannerContent?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  pageData,
  children,
  className = '',
  bannerContent,
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Page Header */}
      <PageHero
        title={pageData.title}
        subtitle={pageData.subtitle}
        description={pageData.description}
        icon={pageData.icon}
        bannerContent={bannerContent}
      />

      {/* Main Content */}
      <main className="max-w-8xl mx-auto py-8">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
