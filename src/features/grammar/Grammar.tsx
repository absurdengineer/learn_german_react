import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGrammar } from "./useGrammar";
import PageLayout from "../../components/layout/PageLayout";
import FlashcardSession from "../../components/FlashcardSession";
import MCQSession from "../../components/MCQSession";
import FreestyleInputSession from "../../components/FreestyleInputSession";
import { getGrammarQuestions } from "../../core/question-engine/questionBuilder";
import {
  questionsToFlashcardItems,
  questionsToQuizQuestions,
} from "../../lib/flashcardAdapters";
import { StatCard, LessonMap } from "../../components";
import { getAllGrammarLessons } from "./grammarLessons";
import GrammarLessonPage from "../grammar-lessons/GrammarLessonPage";

const Grammar: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    sessionMode,
    sessionQuestions,
    sessionResults,
    startPractice,
    handleQuizComplete,
    handleFlashcardSessionComplete,
    handleSessionExit,
    handleRestart,
    handleReviewMistakes,
  } = useGrammar();

  // Helper to get questions for each mode
  const getQuestionsForMode = (mode: string, count: number) => {
    // Map quiz modes to 'mc' for multiple choice
    const questionMode = ["quiz", "quick", "intensive"].includes(mode)
      ? "mc"
      : mode;
    return getGrammarQuestions({ mode: questionMode, count });
  };

  // Get all grammar lessons for the lesson browser
  const allLessons = getAllGrammarLessons();
  const currentLesson = 1; // This would come from user progress

  // Handle lesson routes
  if (day) {
    const lessonDay = parseInt(day, 10);
    const lesson = allLessons.find((l) => l.day === lessonDay);

    if (lesson) {
      const nextLesson = allLessons.find((l) => l.day === lessonDay + 1);
      const prevLesson = allLessons.find((l) => l.day === lessonDay - 1);

      return (
        <GrammarLessonPage
          lesson={lesson}
          nextLesson={nextLesson}
          prevLesson={prevLesson}
          onExit={() => window.history.back()}
        />
      );
    }
  }

  // Handle lessons browser route
  if (location.pathname === "/grammar/lessons") {
    return (
      <PageLayout
        pageData={{
          title: "Grammar Lessons",
          subtitle: "Structured learning path",
          description: "Follow our step-by-step grammar lessons",
          icon: "📚",
          gradient: "from-blue-500 to-purple-600",
        }}
      >
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <LessonMap lessons={allLessons} currentLesson={currentLesson} />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (sessionMode === "session" && sessionQuestions.length > 0) {
    if (sessionQuestions[0].mode === "flashcard") {
      const flashcardItems = questionsToFlashcardItems(sessionQuestions);
      return (
        <FlashcardSession
          items={flashcardItems}
          title="Grammar Flashcards"
          onComplete={handleFlashcardSessionComplete}
          onExit={handleSessionExit}
          showProgress={true}
          autoAdvanceDelay={0}
        />
      );
    } else if (
      sessionQuestions[0].options &&
      sessionQuestions[0].options.length > 0
    ) {
      const quizQuestions = questionsToQuizQuestions(sessionQuestions);
      return (
        <MCQSession
          questions={quizQuestions}
          title="Grammar Quiz"
          onComplete={handleQuizComplete}
          onExit={handleSessionExit}
        />
      );
    } else {
      const quizQuestions = questionsToQuizQuestions(sessionQuestions);
      return (
        <FreestyleInputSession
          questions={quizQuestions}
          title="Grammar Quiz"
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
          description: "Review your grammar practice session",
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
              Back to Grammar
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const sessionOptions = [
    { name: "Quick", count: 10, icon: "⚡", mode: "quick" },
    { name: "Normal", count: 20, icon: "💪", mode: "quiz" },
    { name: "Intensive", count: 30, icon: "🚀", mode: "intensive" },
  ];

  return (
    <PageLayout
      pageData={{
        title: "German Grammar",
        subtitle: "Master German grammar with structured lessons",
        description:
          "From basic concepts to advanced topics, learn step-by-step.",
        icon: "📝",
        gradient: "from-blue-500 to-purple-600",
      }}
    >
      <div className="space-y-8">
        {/* Flashcards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Flashcards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[20, 30, 40].map((count) => (
              <div
                key={count}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">🃏</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {count} Flashcards
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Practice with {count} grammar flashcards
                </p>
                <button
                  onClick={() =>
                    startPractice(
                      "flashcards",
                      getQuestionsForMode("flashcards", count)
                    )
                  }
                  className={`w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium`}
                >
                  Start Flashcards
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Modes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Practice Modes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessionOptions.map((session) => (
              <div
                key={session.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{session.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {session.name} Quiz
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {session.count} questions
                </p>
                <button
                  onClick={() =>
                    startPractice(
                      session.mode,
                      getQuestionsForMode(session.mode, session.count)
                    )
                  }
                  className={`w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium`}
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Grammar Lessons</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">📚</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Structured Learning Path
                  </h3>
                  <p className="text-gray-600">
                    Follow our step-by-step grammar lessons
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/grammar/lessons")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                View Lessons
              </button>
            </div>
          </div>
        </div>

        {/* Stats (placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Grammar Topics" value="12" />
          <StatCard title="Practice Sessions" value="100+" />
          <StatCard title="Mastery Level" value="A1-A2" />
        </div>
      </div>
    </PageLayout>
  );
};

export default Grammar;
