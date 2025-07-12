import React from "react";

interface SessionLayoutProps {
  title: string;
  onExit: () => void;
  children: React.ReactNode;
}

const SessionLayout: React.FC<SessionLayoutProps> = ({
  title,
  onExit,
  children,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h1>
            <button
              onClick={onExit}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SessionLayout;
