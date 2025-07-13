import React from "react";
import PageLayout from "../../components/layout/PageLayout";
import { StatCard } from "../../components";
import { WordDetailModal } from "../../components/WordDetailModal";
import FlashcardSession from "../../components/FlashcardSession";
import MCQSession from "../../components/MCQSession";
import FreestyleInputSession from "../../components/FreestyleInputSession";
import Button from "../../components/Button";
import {
  questionsToFlashcardItems,
  questionsToQuizQuestions,
} from "../../lib/flashcardAdapters";
import { useVocabularySession } from "../../hooks/useVocabularySession";
import { getVocabularyQuestions } from "../../core/question-engine/questionBuilder";

// Test mode: limit number of questions for easier testing
const isTestMode = import.meta.env.VITE_TEST_MODE === "true";

const Vocabulary: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    allQuestions,
    filteredQuestions,
    sessionMode,
    sessionQuestions,
    sessionResults,
    dialogOpen,
    selectedQuestion,
    handleQuestionClick,
    handleCloseDialog,
    startPractice,
    handleSessionExit,
    handleSessionComplete,
    handleRestart,
    handleReviewMistakes,
  } = useVocabularySession();

  // Helper to get questions for each mode
  const getQuestionsForMode = (mode: string, count: number) => {
    let actualCount = isTestMode ? 3 : count;
    let category = selectedCategory !== "all" ? selectedCategory : undefined;
    let questions = getVocabularyQuestions({
      mode,
      count: actualCount,
      category,
    });
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      questions = questions.filter(
        (q: any) =>
          q.prompt.toLowerCase().includes(term) ||
          q.answer.toLowerCase().includes(term)
      );
      questions = questions.slice(0, actualCount);
    }
    return questions;
  };

  if (sessionMode === "session" && sessionQuestions.length > 0) {
    // Debug: log all questions at the start of a session
    console.log("Session questions:", sessionQuestions);
    const mode = sessionQuestions[0].mode;
    if (mode === "flashcard") {
      const flashcardItems = questionsToFlashcardItems(sessionQuestions);
      return (
        <FlashcardSession
          items={flashcardItems}
          title="Vocabulary Practice"
          onComplete={handleSessionComplete}
          onExit={handleSessionExit}
          showProgress={true}
          autoAdvanceDelay={0}
        />
      );
    } else if (mode === "translation-de-en" || mode === "translation-en-de") {
      const quizQuestions = questionsToQuizQuestions(sessionQuestions);
      const translationTitle =
        mode === "translation-de-en"
          ? "German → English"
          : mode === "translation-en-de"
          ? "English → German"
          : "Vocabulary Translation";
      return (
        <FreestyleInputSession
          questions={quizQuestions}
          title={translationTitle}
          onComplete={handleSessionComplete}
          onExit={handleSessionExit}
        />
      );
    } else {
      const quizQuestions = questionsToQuizQuestions(sessionQuestions);
      return (
        <MCQSession
          questions={quizQuestions}
          title="Vocabulary Practice"
          onComplete={handleSessionComplete}
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
          description: "Review your vocabulary practice session",
          icon: "📊",
          gradient: "from-green-500 to-blue-600",
        }}
      >
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Session Complete!
            </h3>
            <p className="text-gray-600">
              Great job! Here's how you performed.
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
              <Button
                onClick={() => handleReviewMistakes(sessionQuestions[0]?.mode)}
                variant="danger"
                size="lg"
              >
                Review Mistakes 🧐 ({sessionResults.mistakes.length})
              </Button>
            )}
            <Button onClick={handleRestart} variant="primary" size="lg">
              Try Again 🔄
            </Button>
            <Button onClick={handleSessionExit} variant="ghost" size="lg">
              Back to Vocabulary ❌
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      pageData={{
        title: "German Vocabulary",
        subtitle: "Learn essential German words for A1 level",
        description: "Browse, search, and practice with interactive exercises",
        icon: "📚",
        gradient: "from-blue-500 to-purple-600",
      }}
    >
      <div className="space-y-8">
        <div className="flex flex-wrap gap-3 mt-8">
          <Button
            onClick={() =>
              startPractice("flashcard", getQuestionsForMode("flashcard", 20))
            }
            variant="primary"
            size="md"
          >
            🃏 Flashcards
          </Button>
          <Button
            onClick={() =>
              startPractice(
                "translation-de-en",
                getQuestionsForMode("translation-de-en", 15)
              )
            }
            variant="success"
            size="md"
          >
            🇩🇪 German → English
          </Button>
          <Button
            onClick={() =>
              startPractice(
                "translation-en-de",
                getQuestionsForMode("translation-en-de", 15)
              )
            }
            variant="secondary"
            size="md"
          >
            🇬🇧 English → German
          </Button>
          <Button
            onClick={() =>
              startPractice(
                "multiple-choice-de-en",
                getQuestionsForMode("multiple-choice-de-en", 12)
              )
            }
            variant="danger"
            size="md"
          >
            📝 MC: German
          </Button>
          <Button
            onClick={() =>
              startPractice(
                "multiple-choice-en-de",
                getQuestionsForMode("multiple-choice-en-de", 12)
              )
            }
            variant="ghost"
            size="md"
          >
            📝 MC: English
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search vocabulary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="ghost"
                  size="sm"
                >
                  ✖️
                </Button>
              </div>
            )}
          </div>
          <div className="flex-shrink-0 sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Categories</option>
              <option value="noun">Nouns</option>
              <option value="verb">Verbs</option>
              <option value="adjective">Adjectives</option>
              <option value="adverb">Adverbs</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Words"
            value={allQuestions.length.toString()}
          />
          <StatCard
            title="Filtered"
            value={filteredQuestions.length.toString()}
          />
          <StatCard title="Category" value={selectedCategory} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredQuestions.map((word: any) => (
            <div
              key={word.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleQuestionClick(word)}
            >
              <div className="text-lg font-bold mb-2">{word.prompt}</div>
              <div className="text-gray-600 mb-1">{word.answer}</div>
              <div className="text-xs text-gray-400">{word.category}</div>
            </div>
          ))}
        </div>
        {filteredQuestions.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No vocabulary found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
        {dialogOpen && selectedQuestion && (
          <WordDetailModal
            word={selectedQuestion.data}
            onClose={handleCloseDialog}
          />
        )}
      </div>
    </PageLayout>
  );
};

export default Vocabulary;
