import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useApp";

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: "Home", icon: "🏠", path: "/" },
  { text: "Vocabulary", icon: "📚", path: "/vocabulary" },
  { text: "Vocabularies (Beta)", icon: "🗂️", path: "/vocabularies-beta" },
  { text: "Articles", icon: "🎯", path: "/articles" },
  { text: "Grammar", icon: "📝", path: "/grammar" },
  { text: "Grammar Rules (Beta)", icon: "📏", path: "/grammar-rules" },
  { text: "New Lessons (Beta)", icon: "🧪", path: "/new-lessons" },
  { text: "Tests", icon: "🧪", path: "/tests" },
  { text: "Study Plan", icon: "", path: "/study-plan" },
  { text: "Speaking", icon: "🗣️", path: "/speaking" },
  { text: "Writing", icon: "✍️", path: "/writing" },
  { text: "Progress", icon: "📊", path: "/progress" },
  { text: "Settings", icon: "⚙️", path: "/settings" },
  { text: "Beta Test", icon: "🔬", path: "/beta-test" },
];

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUser();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }, [location.pathname]);

  const isActiveRoute = (path: string) => {
    // Exact match for home route
    if (path === "/") {
      return location.pathname === path;
    }

    // For other routes, check if current path starts with the menu item path
    // This ensures subroutes stay highlighted (e.g., /grammar/flashcards highlights Grammar)
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false); // Close mobile sidebar after navigation
  };

  // Get current page name
  const getCurrentPageName = () => {
    // For home route, exact match
    if (location.pathname === "/") {
      return "Home";
    }

    // For other routes, find the menu item whose path the current path starts with
    const currentItem = menuItems.find((item) => {
      if (item.path === "/") return false; // Skip home for this logic
      return location.pathname.startsWith(item.path);
    });

    return currentItem ? currentItem.text : "Home";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">DE</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                DeutschMeister
              </h1>
              <p className="text-xs text-gray-500">A1 German Mastery</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActiveRoute(item.path)
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.text}</span>
                {isActiveRoute(item.path) && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Progress indicator at bottom */}
        <div className="absolute bottom-6 left-3 right-3">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm font-bold text-blue-600">
                {user ? Math.round((user.currentDay / 30) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${user ? (user.currentDay / 30) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Mobile header - sticky at top */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page name in center */}
            <h1 className="text-lg font-semibold text-gray-900">
              {getCurrentPageName()}
            </h1>

            {/* Right side spacer for balance */}
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page content */}
        <main ref={mainRef} className="flex-1 overflow-auto bg-gray-50">
          <div className="p-3 sm:p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
