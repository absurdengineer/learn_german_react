import React from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import FlashcardSession from '../components/FlashcardSession';
import QuizSession from '../components/QuizSession';
import SessionResults from '../components/SessionResults';
import PageLayout from '../components/layout/PageLayout';
import { GradientCard, StatCard, VocabularyCard, WordDetailModal } from '../components';
import { vocabularyFlashcardRenderer } from '../components/FlashcardAdapters';
import { getRandomVocabularyWords } from '../data';

const Vocabulary: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    allWords,
    filteredWords,
    availableCategories,
    selectedWord,
    dialogOpen,
    sessionMode,
    sessionType,
    sessionWords,
    sessionResults,
    loading,
    loadingError,
    flashcardItems,
    quizQuestions,
    handleWordClick,
    handleCloseDialog,
    startPractice,
    handleQuizComplete,
    handleFlashcardSessionComplete,
    handleSessionExit,
    handleRestart,
    handleReviewMistakes,
    handleRandomWords,
    getSessionTitle,
    navigate,
  } = useVocabulary();

  if (loading) {
    return (
      <PageLayout pageData={{
        title: 'German Vocabulary',
        subtitle: 'Learn essential German words for A1 level',
        description: 'Browse, search, and practice with interactive exercises',
        icon: '📚',
        gradient: 'from-blue-500 to-purple-600',
      }}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Vocabulary</h3>
            <p className="text-gray-600">Please wait while we load the German vocabulary data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (loadingError) {
    return (
      <PageLayout pageData={{
        title: 'German Vocabulary',
        subtitle: 'Learn essential German words for A1 level',
        description: 'Browse, search, and practice with interactive exercises',
        icon: '📚',
        gradient: 'from-blue-500 to-purple-600',
      }}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Error</h3>
            <p className="text-gray-600 mb-4">{loadingError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (sessionMode === 'session' && sessionWords.length > 0) {
    if (sessionType === 'flashcards') {
      return (
        <FlashcardSession
          items={flashcardItems}
          title="Vocabulary Flashcards"
          onComplete={handleFlashcardSessionComplete}
          onExit={handleSessionExit}
          customRenderer={vocabularyFlashcardRenderer}
          showProgress={true}
        />
      );
    }
    
    return (
      <QuizSession
        questions={quizQuestions}
        title={getSessionTitle(sessionType)}
        onComplete={handleQuizComplete}
        onExit={handleSessionExit}
      />
    );
  }

  if (sessionMode === 'results' && sessionResults) {
    const adaptedResults = {
      ...sessionResults,
      mistakes: (sessionResults.mistakes || []).map(mistake => ({
        question: `What is "${mistake.word?.german || 'unknown'}"?`,
        userAnswer: mistake.userAnswer || '',
        correctAnswer: mistake.correctAnswer || '',
        data: mistake.word
      }))
    };

    return (
      <SessionResults
        results={adaptedResults}
        sessionType={getSessionTitle(sessionType)}
        onRestart={handleRestart}
        onReviewMistakes={handleReviewMistakes}
        onExit={handleSessionExit}
      />
    );
  }

  const articlesBanner = (
    <GradientCard gradient="blue-purple">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold mb-2">🎯 Master German Articles</h3>
          <p className="opacity-90 text-sm sm:text-base">
            Practice der, die, das with 200+ essential A1 words using the 80-20 rule
          </p>
        </div>
        <button
          onClick={() => navigate('/articles')}
          className="w-full sm:w-auto bg-white text-blue-600 px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <span>Start Articles Practice</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </GradientCard>
  );

  return (
    <PageLayout
      pageData={{
        title: 'German Vocabulary',
        subtitle: 'Learn essential German words for A1 level',
        description: 'Learn essential German words for A1 level',
        icon: '📚',
        gradient: 'from-blue-500 to-purple-600',
      }}
      bannerContent={articlesBanner}
    >

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {Object.entries(availableCategories)
                  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                  .map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button
              onClick={() => startPractice('flashcards', getRandomVocabularyWords(20))}
              className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="hidden sm:inline">Flashcards</span>
              <span className="sm:hidden">Flash</span>
            </button>
            <button
              onClick={() => startPractice('translation-de-en', getRandomVocabularyWords(15))}
              className="bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="hidden sm:inline">German → English</span>
              <span className="sm:hidden">DE→EN</span>
            </button>
            <button
              onClick={() => startPractice('translation-en-de', getRandomVocabularyWords(15))}
              className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="hidden sm:inline">English → German</span>
              <span className="sm:hidden">EN→DE</span>
            </button>
            <button
              onClick={() => startPractice('multiple-choice-de-en', getRandomVocabularyWords(12))}
              className="bg-orange-600 text-white px-4 py-3 rounded-xl hover:bg-orange-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="hidden sm:inline">Multiple Choice: German</span>
              <span className="sm:hidden">MC: DE</span>
            </button>
            <button
              onClick={() => startPractice('multiple-choice-en-de', getRandomVocabularyWords(12))}
              className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="hidden sm:inline">Multiple Choice: English</span>
              <span className="sm:hidden">MC: EN</span>
            </button>
            <button
              onClick={handleRandomWords}
              className="bg-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="hidden sm:inline">Random Words</span>
              <span className="sm:hidden">Random</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Words" value={allWords.length.toString()} />
          <StatCard title="Filtered" value={filteredWords.length.toString()} />
          <StatCard title="Category" value={selectedCategory} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWords.map((word) => (
            <VocabularyCard
              key={word.id.value}
              word={word}
              onClick={() => handleWordClick(word)}
            />
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vocabulary found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {dialogOpen && selectedWord && (
        <WordDetailModal word={selectedWord} onClose={handleCloseDialog} />
      )}
    </PageLayout>
  );
};

export default Vocabulary;