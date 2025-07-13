import React from "react";
import { useArticles } from "./useArticles";
import PageLayout from "../../components/layout/PageLayout";
import { GradientCard, StatCard } from "../../components";
import { getArticleQuestions } from "../../core/question-engine/questionBuilder";
import QuizSession from "../../components/QuizSession";
import { questionsToQuizQuestions } from "../../lib/flashcardAdapters";
import ArticleLearningSession from "./ArticleLearningSession";

const Articles: React.FC = () => {
  const {
    selectedCategory,
    sessionMode,
    sessionType,
    sessionQuestions,
    sessionResults,
    startPractice,
    handleQuizComplete,
    handleSessionExit,
    handleRestart,
    handleReviewMistakes,
  } = useArticles();

  // Helper to get questions for each mode
  const getQuestionsForMode = (mode: string, count: number) => {
    let category = selectedCategory !== "all" ? selectedCategory : undefined;
    return getArticleQuestions({ mode, count, category });
  };

  if (sessionMode === "session" && sessionQuestions.length > 0) {
    // If learning mode, use ArticleLearningSession; otherwise, use QuizSession for MCQ practice
    if (sessionType === "learning") {
      return (
        <ArticleLearningSession
          questions={sessionQuestions}
          title="Articles Learning"
          onExit={handleSessionExit}
        />
      );
    } else {
      // Practice mode uses QuizSession for MCQ (der/die/das selection)
      const quizQuestions = questionsToQuizQuestions(sessionQuestions);
      return (
        <QuizSession
          questions={quizQuestions}
          title="Articles Practice"
          onComplete={handleQuizComplete}
          onExit={handleSessionExit}
        />
      );
    }
  }

  if (sessionMode === "results" && sessionResults) {
    const accuracy = Math.round(
      (sessionResults.correctAnswers / sessionResults.totalQuestions) * 100
    );
    const hasMistakes = sessionResults.mistakes.length > 0;

    return (
      <PageLayout
        pageData={{
          title: "Session Results",
          subtitle: "Practice completed",
          description: "Review your articles practice session",
          icon: "📊",
          gradient: "from-green-500 to-blue-600",
        }}
      >
        <div className="max-w-4xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Session Complete!
            </h3>
            <p className="text-gray-600">
              Great job! Here's how you performed.
            </p>
          </div>

          {/* Stats Grid */}
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

          {/* Mistakes Section */}
          {hasMistakes && (
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Mistakes ({sessionResults.mistakes.length})
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {sessionResults.mistakes.map((mistake, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {mistake.word.prompt}
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

          {/* Action Buttons */}
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
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Articles
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const explanationBanner = (
    <GradientCard gradient="yellow-orange" className="border border-yellow-200">
      <div className="flex items-start space-x-4">
        <div className="text-3xl">🎯</div>
        <div>
          <h3 className="text-xl font-bold mb-2">
            80-20 Rule for German Articles
          </h3>
          <p className="mb-2">
            Research shows that <strong>20% of German nouns</strong> account for{" "}
            <strong>80% of daily usage</strong>. By mastering these essential
            words, you'll handle most A1 exam situations with confidence!
          </p>
          <p className="text-sm opacity-90">
            ✨ We've curated 200+ high-frequency nouns that appear most often in
            A1 exams and real conversations.
          </p>
        </div>
      </div>
    </GradientCard>
  );

  const practiceModes = [
    {
      title: "Quick Practice",
      description: "20 random essential words",
      icon: "🚀",
      buttonText: "Start Now",
      color: "bg-blue-600",
      onClick: () => startPractice("practice", getQuestionsForMode("mc", 20)),
    },
    {
      title: "Intensive Session",
      description: "50 words for comprehensive practice",
      icon: "💪",
      buttonText: "Start Intensive",
      color: "bg-purple-600",
      onClick: () => startPractice("intensive", getQuestionsForMode("mc", 50)),
    },
    {
      title: "Speed Round",
      description: "10 words for quick review",
      icon: "⚡",
      buttonText: "Speed Practice",
      color: "bg-green-600",
      onClick: () => startPractice("speed", getQuestionsForMode("mc", 10)),
    },
  ];

  const learningModes = [
    {
      title: "Visual Learning",
      description: "30 words with auto-advance",
      icon: "🧠",
      buttonText: "Start Learning",
      color: "bg-indigo-600",
      onClick: () =>
        startPractice("learning", getQuestionsForMode("flashcard", 30)),
    },
    {
      title: "Color Memory",
      description: "50 words for intensive association",
      icon: "🎨",
      buttonText: "Deep Learning",
      color: "bg-purple-600",
      onClick: () =>
        startPractice("learning", getQuestionsForMode("flashcard", 50)),
    },
    {
      title: "Quick Review",
      description: "20 words for fast visual review",
      icon: "⚡",
      buttonText: "Quick Learn",
      color: "bg-teal-600",
      onClick: () =>
        startPractice("learning", getQuestionsForMode("flashcard", 20)),
    },
  ];

  const stats = [
    {
      label: "DER words",
      value: "68",
      subtitle: "masculine nouns",
      color: "text-blue-600",
    },
    {
      label: "DIE words",
      value: "74",
      subtitle: "feminine nouns",
      color: "text-pink-600",
    },
    {
      label: "DAS words",
      value: "58",
      subtitle: "neuter nouns",
      color: "text-gray-700",
    },
  ];

  return (
    <PageLayout
      pageData={{
        title: "German Articles",
        subtitle: "Master der, die, das with the 80-20 rule",
        description: "Focus on the most essential nouns for A1 exam success",
        icon: "🎯",
        gradient: "from-yellow-400 to-orange-500",
      }}
      bannerContent={explanationBanner}
    >
      <div className="space-y-8">
        {/* Practice Modes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Practice Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {practiceModes.map((mode, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{mode.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {mode.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{mode.description}</p>
                <button
                  onClick={mode.onClick}
                  className={`w-full ${mode.color} text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium`}
                >
                  {mode.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Modes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Learning Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {learningModes.map((mode, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{mode.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {mode.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{mode.description}</p>
                <button
                  onClick={mode.onClick}
                  className={`w-full ${mode.color} text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium`}
                >
                  {mode.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.label}
              value={stat.value}
              subtitle={stat.subtitle}
              color={stat.color}
            />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Articles;
