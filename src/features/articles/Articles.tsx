import React, { useState } from "react";
import { useArticles } from "../../hooks/useArticles";
import MCQSession from "../../components/MCQSession";
import PageLayout from "../../components/layout/PageLayout";
import { questionsToQuizQuestions } from "../../lib/flashcardAdapters";

const genderColors: Record<string, string> = {
  der: "bg-blue-100 text-blue-800 border-blue-300",
  die: "bg-pink-100 text-pink-800 border-pink-300",
  das: "bg-gray-100 text-gray-800 border-gray-300",
};

// ArticleDetailModal: simple modal for article details
const ArticleDetailModal = ({
  article,
  onClose,
}: {
  article: any;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        onClick={onClose}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="flex items-center gap-4 mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full border text-sm font-semibold ${
            genderColors[article.gender] ||
            "bg-gray-100 text-gray-800 border-gray-300"
          }`}
        >
          {article.gender}
        </span>
        <span className="text-2xl font-bold">{article.german}</span>
      </div>
      <div className="text-lg text-gray-700 mb-2">{article.english}</div>
      <div className="text-sm text-gray-400">ID: {article.id}</div>
    </div>
  </div>
);

const Articles: React.FC = () => {
  const {
    articles,
    sessionMode,
    sessionQuestions,
    sessionResults,
    startPractice,
    startQuiz,
    handleSessionExit,
    handleSessionComplete,
    handleRestart,
    handleReviewMistakes,
    mistakes,
  } = useArticles();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  // Filtered articles
  const filteredArticles = articles.filter((a: any) => {
    const matchesGender =
      selectedGender === "all" || a.gender === selectedGender;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      a.german.toLowerCase().includes(term) ||
      a.english.toLowerCase().includes(term);
    return matchesGender && matchesSearch;
  });

  if (
    (sessionMode === "practice" || sessionMode === "quiz") &&
    sessionQuestions.length > 0
  ) {
    const quizQuestions = questionsToQuizQuestions(sessionQuestions);
    return (
      <MCQSession
        questions={quizQuestions}
        title={sessionMode === "practice" ? "Article Practice" : "Article Quiz"}
        onComplete={handleSessionComplete}
        onExit={handleSessionExit}
      />
    );
  }

  if (sessionMode === "review" && sessionQuestions.length > 0) {
    const quizQuestions = questionsToQuizQuestions(sessionQuestions);
    return (
      <MCQSession
        questions={quizQuestions}
        title="Review Mistakes"
        onComplete={handleSessionComplete}
        onExit={handleSessionExit}
      />
    );
  }

  // Remove review complete page: just show results page after review as well
  if (sessionResults) {
    const accuracy = Math.round(
      (sessionResults.correctAnswers / sessionResults.totalQuestions) * 100
    );
    const hasMistakes = sessionResults.mistakes.length > 0;
    return (
      <PageLayout
        pageData={{
          title:
            sessionMode === "review" ? "Review Results" : "Session Results",
          subtitle:
            sessionMode === "review"
              ? "Review session completed"
              : "Practice completed",
          description:
            sessionMode === "review"
              ? "See your results for the review session."
              : "Review your article practice session",
          icon: sessionMode === "review" ? "✅" : "🏷️",
          gradient:
            sessionMode === "review"
              ? "from-green-500 to-blue-600"
              : "from-blue-500 to-purple-600",
        }}
      >
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">
              {sessionMode === "review" ? "✅" : "🎉"}
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {sessionMode === "review"
                ? "Review Complete!"
                : "Session Complete!"}
            </h3>
            <p className="text-gray-600">
              {sessionMode === "review"
                ? "Here are your results for the review session."
                : "Great job! Here's how you performed."}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {sessionResults.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-green-600">
                {sessionResults.correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-red-600">
                {sessionResults.wrongAnswers}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {accuracy}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
          {hasMistakes && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Mistakes ({sessionResults.mistakes.length})
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {sessionResults.mistakes.map((mistake: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {mistake.prompt}
                      </div>
                      <div className="text-sm text-gray-600">
                        Your answer:{" "}
                        <span className="text-red-600 font-medium">
                          {mistake.userAnswer}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Correct:{" "}
                        <span className="text-green-600 font-medium">
                          {mistake.correctAnswer}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {hasMistakes && (
              <button
                onClick={handleReviewMistakes}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Review Mistakes ({sessionResults.mistakes.length})
              </button>
            )}
            <button
              onClick={handleRestart}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={handleSessionExit}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Articles
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Idle state: match Vocabulary UI
  return (
    <PageLayout
      pageData={{
        title: "German Articles",
        subtitle: "Master der, die, das for A1 level nouns",
        description:
          "Browse, search, and practice with interactive article exercises",
        icon: "🏷️",
        gradient: "from-blue-500 to-purple-600",
      }}
    >
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3 mt-8">
          <button
            onClick={() => startPractice()}
            className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium"
          >
            Practice
          </button>
          <button
            onClick={() => startQuiz()}
            className="bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium"
          >
            Quiz
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 sm:w-48">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Genders</option>
              <option value="der">der</option>
              <option value="die">die</option>
              <option value="das">das</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {articles.length}
            </div>
            <div className="text-sm text-gray-600">Total Articles</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredArticles.length}
            </div>
            <div className="text-sm text-gray-600">Filtered</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {selectedGender}
            </div>
            <div className="text-sm text-gray-600">Gender</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArticles.map((article: any) => (
            <div
              key={article.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedArticle(article);
                setDialogOpen(true);
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full border text-sm font-semibold ${
                    genderColors[article.gender] ||
                    "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                >
                  {article.gender}
                </span>
                <span className="text-lg font-bold">{article.german}</span>
              </div>
              <div className="text-gray-600 mb-1">{article.english}</div>
            </div>
          ))}
        </div>
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
        {dialogOpen && selectedArticle && (
          <ArticleDetailModal
            article={selectedArticle}
            onClose={() => setDialogOpen(false)}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Articles;
