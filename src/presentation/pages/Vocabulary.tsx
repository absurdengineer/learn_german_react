import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getRandomVocabularyWords,
    getVocabularyWordsByCategory,
    loadVocabulary,
    loadVocabularyCategories,
    searchVocabularyWords
} from '../../data';
import { type LevelType } from '../../domain/entities/User';
import { VocabularyWord, type Gender, type WordType } from '../../domain/entities/Vocabulary';
import { shuffleArray } from '../../utils/testGenerator';
import { vocabularyFlashcardRenderer, vocabularyToFlashcardAdapter } from '../components/FlashcardAdapters';
import FlashcardSession from '../components/FlashcardSession';
import QuizSession, { type QuizResults } from '../components/QuizSession';
import SessionResults from '../components/SessionResults';
import { GradientCard, PageHero } from '../components/ui';

interface SessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  wordsStudied: VocabularyWord[];
  mistakes: Array<{
    word: VocabularyWord;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

const Vocabulary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);
  const [filteredWords, setFilteredWords] = useState<VocabularyWord[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Record<string, { name: string; description: string; color?: string }>>({});
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sessionMode, setSessionMode] = useState<'browse' | 'session' | 'results'>('browse');
  const [sessionType, setSessionType] = useState<
    'flashcards' | 'translation-de-en' | 'multiple-choice-de-en' | 'translation-en-de' | 'multiple-choice-en-de'
  >('flashcards');
  const [sessionWords, setSessionWords] = useState<VocabularyWord[]>([]);
  const [sessionLength, setSessionLength] = useState(10);
  const [sessionResults, setSessionResults] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Store generated flashcard items to prevent regeneration on re-renders
  const [flashcardItems, setFlashcardItems] = useState<import('../components/FlashcardSession').FlashcardItem[]>([]);
  
  // Store generated quiz questions to prevent regeneration on re-renders
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    id: string;
    prompt: string;
    options: string[];
    correctAnswer: string;
    data: VocabularyWord;
  }>>([]);

  // Helper function to get session title
  const getSessionTitle = (type: string): string => {
    switch (type) {
      case 'translation-de-en':
        return 'German → English Translation';
      case 'translation-en-de':
        return 'English → German Translation';
      case 'multiple-choice-de-en':
        return 'Multiple Choice: German Words';
      case 'multiple-choice-en-de':
        return 'Multiple Choice: English Words';
      default:
        return 'Vocabulary Practice';
    }
  };

  // Generate questions based on session type
  const generateSessionQuestions = (
    type: 'flashcards' | 'translation-de-en' | 'multiple-choice-de-en' | 'translation-en-de' | 'multiple-choice-en-de',
    words: VocabularyWord[]
  ) => {
    if (type === 'flashcards') {
      const generatedFlashcards = vocabularyToFlashcardAdapter(words);
      setFlashcardItems(generatedFlashcards);
      setQuizQuestions([]); // Clear quiz questions
    } else {
      // Generate quiz questions based on type
      const questions = words.map((word, index) => {
        let prompt: string;
        let correctAnswer: string;
        let wrongOptions: string[];

        switch (type) {
          case 'translation-de-en':
          case 'multiple-choice-de-en':
            prompt = `What is the English translation of "${word.german}"?`;
            correctAnswer = word.english;
            wrongOptions = getRandomVocabularyWords(3, [word.german])
              .map(w => w.english)
              .filter(option => option && option.trim() !== '' && option !== correctAnswer)
              .slice(0, 3);
            break;
          case 'translation-en-de':
          case 'multiple-choice-en-de':
            prompt = `What is the German translation of "${word.english}"?`;
            correctAnswer = word.german;
            wrongOptions = getRandomVocabularyWords(3, [word.german])
              .map(w => w.german)
              .filter(option => option && option.trim() !== '' && option !== correctAnswer)
              .slice(0, 3);
            break;
          default:
            prompt = `What is the English translation of "${word.german}"?`;
            correctAnswer = word.english;
            wrongOptions = getRandomVocabularyWords(3, [word.german])
              .map(w => w.english)
              .filter(option => option && option.trim() !== '' && option !== correctAnswer)
              .slice(0, 3);
        }

        const options = type.includes('multiple-choice') 
          ? shuffleArray([correctAnswer, ...wrongOptions]).slice(0, 4) // Ensure max 4 options
          : [];

        return {
          id: `v-q${index + 1}`,
          prompt,
          options,
          correctAnswer,
          data: word,
        };
      });

      setQuizQuestions(questions);
      setFlashcardItems([]); // Clear flashcard items
    }
  };
  
  const navigate = useNavigate();

  // Load vocabulary data and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setLoadingError(null);
        
        // Load data asynchronously to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow UI to render
        
        const vocabulary = loadVocabulary();
        const categories = loadVocabularyCategories();
        
        // Convert to VocabularyWord entities
        const convertedWords = vocabulary.map(item => 
          VocabularyWord.create({
            german: item.german,
            english: item.english,
            pronunciation: item.pronunciation,
            type: item.type as WordType,
            level: item.level as LevelType,
            gender: item.gender as Gender | undefined,
            tags: item.tags,
            frequency: item.frequency
          })
        );
        
        setAllWords(convertedWords);
        setFilteredWords(convertedWords);
        setAvailableCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error('Error loading vocabulary data:', error);
        setLoadingError('Failed to load vocabulary data. Please refresh the page.');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Load available categories on component mount
  useEffect(() => {
    const categories = loadVocabularyCategories();
    setAvailableCategories(categories);
  }, []);

  useEffect(() => {
    if (!allWords.length) return; // Don't filter until data is loaded
    
    let words: VocabularyWord[] = [];
    
    if (searchTerm.trim()) {
      words = searchVocabularyWords(searchTerm);
    } else if (selectedCategory === 'all') {
      words = allWords;
    } else {
      words = getVocabularyWordsByCategory(selectedCategory);
    }
    
    setFilteredWords(words);
  }, [searchTerm, selectedCategory, allWords]);

  const handleWordClick = (word: VocabularyWord) => {
    setSelectedWord(word);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedWord(null);
  };

  const startPractice = (
    type: 'flashcards' | 'translation-de-en' | 'multiple-choice-de-en' | 'translation-en-de' | 'multiple-choice-en-de',
    words: VocabularyWord[]
  ) => {
    setSessionType(type);
    setSessionWords(words);
    setSessionLength(words.length);
    
    // Generate all session questions once when session starts
    generateSessionQuestions(type, words);
    
    setSessionMode('session');
  };

  const handleSessionComplete = (results: SessionResult) => {
    setSessionResults(results);
    setSessionMode('results');
  };

  const handleQuizComplete = (results: QuizResults) => {
    // Transform QuizResults to SessionResult format
    const sessionResult: SessionResult = {
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      wrongAnswers: results.wrongAnswers,
      timeSpent: results.timeSpent,
      wordsStudied: sessionWords,
      mistakes: results.mistakes.map(mistake => ({
        word: mistake.word || sessionWords.find(w => w.german === mistake.correctAnswer || w.english === mistake.correctAnswer) || sessionWords[0],
        userAnswer: mistake.userAnswer,
        correctAnswer: mistake.correctAnswer,
      })),
    };
    
    handleSessionComplete(sessionResult);
  };

  const handleSessionExit = () => {
    setSessionMode('browse');
    setSessionResults(null);
    // Clear stored questions and flashcards
    setFlashcardItems([]);
    setQuizQuestions([]);
  };

  const handleRestart = () => {
    const newWords = getRandomVocabularyWords(sessionLength);
    setSessionWords(newWords);
    
    // Regenerate questions for new words
    generateSessionQuestions(sessionType, newWords);
    
    setSessionMode('session');
  };

  const handleReviewMistakes = () => {
    if (sessionResults && sessionResults.mistakes.length > 0) {
      const mistakeWords = sessionResults.mistakes.map((m) => m.word);
      const shuffledWords = shuffleArray([...mistakeWords]);
      setSessionWords(shuffledWords);
      
      // Regenerate questions for mistake words
      generateSessionQuestions(sessionType, shuffledWords);
      
      setSessionMode('session');
    }
  };

  const getWordTypeColor = (type: string) => {
    const colors = {
      'noun': 'bg-blue-100 text-blue-800',
      'verb': 'bg-green-100 text-green-800',
      'adjective': 'bg-purple-100 text-purple-800',
      'pronoun': 'bg-yellow-100 text-yellow-800',
      'article': 'bg-pink-100 text-pink-800',
      'conjunction': 'bg-orange-100 text-orange-800',
      'interjection': 'bg-red-100 text-red-800',
      'preposition': 'bg-gray-100 text-gray-800',
      'adverb': 'bg-indigo-100 text-indigo-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getGenderColor = (gender?: string) => {
    const colors = {
      'der': 'bg-blue-100 text-blue-800',
      'die': 'bg-red-100 text-red-800',
      'das': 'bg-green-100 text-green-800',
      'plural': 'bg-purple-100 text-purple-800',
    };
    return colors[gender as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Session mode rendering
  if (sessionMode === 'session' && sessionWords.length > 0) {
    if (sessionType === 'flashcards') {
      // Use the stored flashcard items instead of generating them on every render
      // If no flashcard items, generate them as fallback
      const itemsToUse = flashcardItems.length > 0 ? flashcardItems : vocabularyToFlashcardAdapter(sessionWords);
      
      return (
        <FlashcardSession
          items={itemsToUse}
          title="Vocabulary Flashcards"
          onComplete={(results) => {
            const sessionResult: SessionResult = {
              totalQuestions: results.totalQuestions,
              correctAnswers: results.correctAnswers,
              wrongAnswers: results.wrongAnswers,
              timeSpent: results.timeSpent,
              wordsStudied: sessionWords,
              mistakes: [] // Convert from flashcard mistakes if needed
            };
            handleSessionComplete(sessionResult);
          }}
          onExit={handleSessionExit}
          customRenderer={vocabularyFlashcardRenderer}
          showProgress={true}
        />
      );
    }
    
    // Other session types use QuizSession with pre-generated questions
    // Use stored questions if available, otherwise generate as fallback
    const questionsToUse = quizQuestions.length > 0 ? quizQuestions : sessionWords.map((word, index) => {
      const otherWords = getRandomVocabularyWords(3, [word.german]);
      const wrongOptions = otherWords
        .map(w => w.english)
        .filter(option => option && option.trim() !== '' && option !== word.english)
        .slice(0, 3);
      const options = shuffleArray([word.english, ...wrongOptions]).slice(0, 4);
      return {
        id: `v-q${index + 1}`,
        prompt: `What is the English translation of "${word.german}"?`,
        options,
        correctAnswer: word.english,
        data: word,
      };
    });

    return (
      <QuizSession
        questions={questionsToUse}
        title={getSessionTitle(sessionType)}
        onComplete={handleQuizComplete}
        onExit={handleSessionExit}
      />
    );
  }

  if (sessionMode === 'results' && sessionResults) {
    const adaptedResults = {
      totalQuestions: sessionResults.totalQuestions || 0,
      correctAnswers: sessionResults.correctAnswers || 0,
      wrongAnswers: sessionResults.wrongAnswers || 0,
      timeSpent: sessionResults.timeSpent || 0,
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

  // Browse mode rendering

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHero
          title="German Vocabulary"
          subtitle="Learn essential German words for A1 level"
          description="Browse, search, and practice with interactive exercises"
          icon="📚"
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Vocabulary</h3>
              <p className="text-gray-600">Please wait while we load the German vocabulary data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHero
          title="German Vocabulary"
          subtitle="Learn essential German words for A1 level"
          description="Browse, search, and practice with interactive exercises"
          icon="📚"
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-8">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="German Vocabulary"
        subtitle="Learn essential German words for A1 level"
        description="Browse, search, and practice with interactive exercises"
        icon="📚"
        bannerContent={articlesBanner}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-8">
        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
          <div className="space-y-4">
            {/* Search and Category Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
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

              {/* Category Filter */}
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

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setSelectedCategory('all'); // Reset category filter for random practice
                  const words = getRandomVocabularyWords(20);
                  startPractice('flashcards', words);
                }}
                className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="hidden sm:inline">Flashcards</span>
                <span className="sm:hidden">Flash</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('all'); // Reset category filter for random practice
                  const words = getRandomVocabularyWords(15);
                  startPractice('translation-de-en', words);
                }}
                className="bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">German → English</span>
                <span className="sm:hidden">DE→EN</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('all'); // Reset category filter for random practice
                  const words = getRandomVocabularyWords(15);
                  startPractice('translation-en-de', words);
                }}
                className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">English → German</span>
                <span className="sm:hidden">EN→DE</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('all'); // Reset category filter for random practice
                  const words = getRandomVocabularyWords(12);
                  startPractice('multiple-choice-de-en', words);
                }}
                className="bg-orange-600 text-white px-4 py-3 rounded-xl hover:bg-orange-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden sm:inline">Multiple Choice: German</span>
                <span className="sm:hidden">MC: DE</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('all'); // Reset category filter for random practice
                  const words = getRandomVocabularyWords(12);
                  startPractice('multiple-choice-en-de', words);
                }}
                className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden sm:inline">Multiple Choice: English</span>
                <span className="sm:hidden">MC: EN</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('all'); // Reset category filter for random practice
                  setFilteredWords(getRandomVocabularyWords(20));
                }}
                className="bg-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden sm:inline">Random Words</span>
                <span className="sm:hidden">Random</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Words</p>
                <p className="text-3xl font-bold text-gray-900">{allWords.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Filtered</p>
                <p className="text-3xl font-bold text-gray-900">{filteredWords.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-3xl font-bold text-gray-900 capitalize">{selectedCategory}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vocabulary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWords.map((word) => (
            <div
              key={word.id.value}
              onClick={() => handleWordClick(word)}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{word.german}</h3>
                  {word.pronunciation && (
                    <p className="text-sm text-blue-600 italic mt-1">
                      {word.pronunciation}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${getWordTypeColor(word.type)}`}>
                  {word.type}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">{word.english}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {word.gender && (
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getGenderColor(word.gender)}`}>
                    {word.gender}
                  </span>
                )}
                {word.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              
              {word.exampleSentences.length > 0 && (
                <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                  "{word.exampleSentences[0].german}"
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vocabulary found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Word Detail Modal */}
      {dialogOpen && selectedWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 pr-4">{selectedWord.german}</h2>
                  {selectedWord.pronunciation && (
                    <p className="text-lg text-blue-600 italic mt-2">
                      {selectedWord.pronunciation}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleCloseDialog}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 flex-shrink-0"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Translation</h3>
                  <p className="text-gray-700 text-lg">{selectedWord.english}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <span className={`px-3 sm:px-4 py-2 text-sm rounded-xl font-medium ${getWordTypeColor(selectedWord.type)}`}>
                    {selectedWord.type}
                  </span>
                  {selectedWord.gender && (
                    <span className={`px-3 sm:px-4 py-2 text-sm rounded-xl font-medium ${getGenderColor(selectedWord.gender)}`}>
                      {selectedWord.gender}
                    </span>
                  )}
                  <span className="px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl font-medium">
                    Level: {selectedWord.level}
                  </span>
                </div>
                
                {selectedWord.plural && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Plural</h3>
                    <p className="text-gray-700 text-lg">{selectedWord.plural}</p>
                  </div>
                )}
                
                {selectedWord.conjugations && selectedWord.conjugations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Conjugations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedWord.conjugations.map((conjugation, index) => (
                        <span key={index} className="px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium">
                          {conjugation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedWord.exampleSentences.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                    <div className="space-y-4">
                      {selectedWord.exampleSentences.map((example, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-gray-800 font-medium text-lg mb-2">{example.german}</p>
                          <p className="text-gray-600">{example.english}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedWord.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vocabulary;
