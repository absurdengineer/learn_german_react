import React, { useEffect, useMemo, useState } from 'react';
import { grammarQuestions } from '../../data/grammarData';
import { grammarLessons, type GrammarLesson } from '../../data/grammarLessons';
import type { TestQuestion } from '../../utils/grammarCsvParser';
import { shuffleArray } from '../../utils/testGenerator';

interface SessionResult {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  mistakes: Array<{
    question: TestQuestion;
    userAnswer: string;
    correctAnswer: string;
  }>;
}

const categoryIcons: Record<string, string> = {
  articles: '📝',
  cases: '📋',
  verbs: '🔀',
  pronouns: '👤',
  'w-fragen': '❓',
  'haben-sein': '🔗',
  'modal verbs': '🎯',
  'sentence structure': '🏗️',
  default: '📚'
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800'
};

const Grammar: React.FC = () => {
  const [sessionMode, setSessionMode] = useState<'menu' | 'lesson' | 'practice' | 'flashcards' | 'results'>('menu');
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [practiceQuestions, setPracticeQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionResults, setSessionResults] = useState<SessionResult | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  // Scroll to top when session mode changes
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100);
  }, [sessionMode]);

  // Get available categories from lessons
  const availableCategories = useMemo(() => {
    const categories = new Set(grammarLessons.map(lesson => lesson.category.toLowerCase()));
    return Array.from(categories);
  }, []);

  // Filter lessons by category
  const filteredLessons = useMemo(() => {
    if (selectedCategory === 'all') {
      return grammarLessons.sort((a, b) => a.order - b.order);
    }
    return grammarLessons
      .filter(lesson => lesson.category.toLowerCase() === selectedCategory)
      .sort((a, b) => a.order - b.order);
  }, [selectedCategory]);

  const resetToMenu = () => {
    setSessionMode('menu');
    setSelectedLesson(null);
    setSessionResults(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setFlashcardIndex(0);
    setShowFlashcardAnswer(false);
    setShowResult(false);
    setCurrentAnswer('');
  };

  const startPractice = (category?: string) => {
    let questions = [...grammarQuestions];
    
    if (category) {
      questions = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    }
    
    // Shuffle and take 10 questions
    shuffleArray(questions);
    const practiceSet = questions.slice(0, 10);
    
    setPracticeQuestions(practiceSet);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSessionStartTime(Date.now());
    setSessionMode('practice');
  };

  const startFlashcards = (lesson: GrammarLesson) => {
    setSelectedLesson(lesson);
    setFlashcardIndex(0);
    setShowFlashcardAnswer(false);
    setSessionMode('flashcards');
  };

  const handleAnswerSubmit = (answer: string) => {
    setCurrentAnswer(answer);
    setShowResult(true);

    setTimeout(() => {
      const newAnswers = [...userAnswers, answer];
      setUserAnswers(newAnswers);

      if (currentQuestionIndex < practiceQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowResult(false);
        setCurrentAnswer('');
      } else {
        // Calculate results
        const correctAnswers = practiceQuestions.reduce((count, question, index) => {
          return count + (newAnswers[index] === question.answer ? 1 : 0);
        }, 0);

        const mistakes = practiceQuestions
          .map((question, index) => ({
            question,
            userAnswer: newAnswers[index],
            correctAnswer: question.answer,
          }))
          .filter(item => item.userAnswer !== item.correctAnswer);

        const results: SessionResult = {
          totalQuestions: practiceQuestions.length,
          correctAnswers,
          wrongAnswers: practiceQuestions.length - correctAnswers,
          timeSpent: Math.round((Date.now() - sessionStartTime) / 1000),
          mistakes,
        };

        setSessionResults(results);
        setSessionMode('results');
      }
    }, 1500);
  };

  if (sessionMode === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-12 text-center">
            <h1 className="text-5xl font-bold mb-4 text-gray-900">📝 German Grammar</h1>
            <p className="text-xl text-gray-600 mb-2">
              Master German grammar with structured lessons and practice
            </p>
            <p className="text-gray-500">
              Learn • Practice • Perfect your German grammar skills
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{grammarLessons.length}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{availableCategories.length}</div>
              <div className="text-sm text-gray-600">Topics</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-green-600">{grammarQuestions.length}</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-orange-600">A1</div>
              <div className="text-sm text-gray-600">Level</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Topics
              </button>
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {categoryIcons[category] || categoryIcons.default} {category}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Practice Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 mb-8 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Quick Practice</h2>
              <p className="text-green-100 mb-4">
                Jump into practice with random questions from all topics
              </p>
              <button
                onClick={() => startPractice()}
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Start Random Practice
              </button>
            </div>
          </div>

          {/* Grammar Lessons */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Grammar Lessons</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
                          {categoryIcons[lesson.category.toLowerCase()] || categoryIcons.default}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {lesson.title}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[lesson.difficulty]}`}>
                              {lesson.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {lesson.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{lesson.examples.length} examples</span>
                            <span>{lesson.flashcards.length} flashcards</span>
                            <span>{lesson.keyPoints.length} key points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedLesson(lesson);
                          setSessionMode('lesson');
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        📖 Learn
                      </button>
                      <button
                        onClick={() => startFlashcards(lesson)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        🧠 Flashcards
                      </button>
                      <button
                        onClick={() => startPractice(lesson.category.toLowerCase())}
                        className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                      >
                        🎯 Practice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionMode === 'lesson' && selectedLesson) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <button
              onClick={resetToMenu}
              className="mb-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Grammar
            </button>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{selectedLesson.title}</h1>
            <p className="text-gray-600">{selectedLesson.description}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Explanation */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Explanation</h2>
            <p className="text-gray-700 leading-relaxed">{selectedLesson.explanation}</p>
          </div>

          {/* Examples */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 Examples</h2>
            <div className="space-y-4">
              {selectedLesson.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm text-gray-500">German:</span>
                      <div className="font-medium text-gray-900">{example.german}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">English:</span>
                      <div className="text-gray-700">{example.english}</div>
                    </div>
                  </div>
                  {example.breakdown && (
                    <div className="mt-2 text-sm text-blue-600">
                      💬 {example.breakdown}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Key Points */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Key Points</h2>
            <ul className="space-y-2">
              {selectedLesson.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">⚠️ Common Mistakes</h2>
            <div className="space-y-4">
              {selectedLesson.commonMistakes.map((mistake, index) => (
                <div key={index} className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <div>
                      <span className="text-sm text-red-600">❌ Wrong:</span>
                      <div className="font-medium text-red-800">{mistake.wrong}</div>
                    </div>
                    <div>
                      <span className="text-sm text-green-600">✅ Correct:</span>
                      <div className="font-medium text-green-800">{mistake.correct}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{mistake.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => startFlashcards(selectedLesson)}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🧠 Practice with Flashcards
            </button>
            <button
              onClick={() => startPractice(selectedLesson.category.toLowerCase())}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              🎯 Practice Questions
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (sessionMode === 'practice' && practiceQuestions.length > 0) {
    const currentQuestion = practiceQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / practiceQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={resetToMenu}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Exit Practice
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {practiceQuestions.length}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentQuestion.category}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {currentQuestion.type}
                </span>
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {currentQuestion.question}
              </h2>
              
              {currentQuestion.helper_text && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Hint:</strong> {currentQuestion.helper_text}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {currentQuestion.type === 'multiple_choice' ? (
                <>
                  {currentQuestion.options.map((option: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSubmit(option)}
                      disabled={showResult}
                      className={`w-full p-4 text-left border rounded-lg transition-colors ${
                        showResult && currentAnswer === option
                          ? currentAnswer === currentQuestion.answer
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-red-100 border-red-300 text-red-800'
                          : showResult
                          ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                  
                  {/* Result Display */}
                  {showResult && (
                    <div
                      className={`text-center p-4 rounded-lg ${
                        currentAnswer === currentQuestion.answer
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      <div
                        className={`text-lg font-bold ${
                          currentAnswer === currentQuestion.answer
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {currentAnswer === currentQuestion.answer
                          ? '✓ Correct!'
                          : '✗ Wrong!'}
                      </div>
                      <div className="text-sm text-gray-700 mt-2">
                        The correct answer is:{' '}
                        <span className="font-bold text-green-600">
                          {currentQuestion.answer}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    key={currentQuestionIndex} // Force re-render to clear input
                    placeholder="Type your answer here..."
                    disabled={showResult}
                    className={`w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      showResult ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !showResult) {
                        const value = (e.target as HTMLInputElement).value;
                        if (value.trim()) {
                          handleAnswerSubmit(value);
                        }
                      }
                    }}
                  />
                  
                  {!showResult && (
                    <button
                      onClick={() => {
                        const input = document.querySelector('input') as HTMLInputElement;
                        const value = input.value;
                        if (value.trim()) {
                          handleAnswerSubmit(value);
                        }
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit Answer
                    </button>
                  )}
                  
                  {/* Result Display for Text Input */}
                  {showResult && (
                    <div
                      className={`text-center p-4 rounded-lg ${
                        currentAnswer === currentQuestion.answer
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                    >
                      <div
                        className={`text-lg font-bold ${
                          currentAnswer === currentQuestion.answer
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {currentAnswer === currentQuestion.answer
                          ? '✓ Correct!'
                          : '✗ Wrong!'}
                      </div>
                      <div className="text-sm text-gray-700 mt-2">
                        Your answer: <span className="font-medium">{currentAnswer}</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        The correct answer is:{' '}
                        <span className="font-bold text-green-600">
                          {currentQuestion.answer}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionMode === 'flashcards' && selectedLesson) {
    const flashcards = selectedLesson.flashcards;
    const currentCard = flashcards[flashcardIndex];
    const progress = ((flashcardIndex + 1) / flashcards.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={resetToMenu}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Exit Flashcards
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-600">
                  Card {flashcardIndex + 1} of {flashcards.length}
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl p-8 shadow-sm min-h-[400px] flex flex-col justify-center">
            <div className="text-center">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {showFlashcardAnswer ? currentCard.back : currentCard.front}
                </h2>
                
                {showFlashcardAnswer && currentCard.example && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <p className="text-gray-700">
                      <strong>Example:</strong> {currentCard.example}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium mb-6"
              >
                {showFlashcardAnswer ? 'Show Question' : 'Show Answer'}
              </button>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    if (flashcardIndex > 0) {
                      setFlashcardIndex(flashcardIndex - 1);
                      setShowFlashcardAnswer(false);
                    }
                  }}
                  disabled={flashcardIndex === 0}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => {
                    if (flashcardIndex < flashcards.length - 1) {
                      setFlashcardIndex(flashcardIndex + 1);
                      setShowFlashcardAnswer(false);
                    }
                  }}
                  disabled={flashcardIndex === flashcards.length - 1}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionMode === 'results' && sessionResults) {
    const percentage = Math.round((sessionResults.correctAnswers / sessionResults.totalQuestions) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Practice Complete!</h1>
            <p className="text-gray-600">Great job working through those grammar questions!</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-green-600 mb-2">{percentage}%</div>
              <p className="text-gray-600">Accuracy</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sessionResults.totalQuestions}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{sessionResults.correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{sessionResults.wrongAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{sessionResults.timeSpent}s</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
            </div>
          </div>

          {/* Mistakes Review */}
          {sessionResults.mistakes.length > 0 && (
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Mistakes</h2>
              <div className="space-y-4">
                {sessionResults.mistakes.map((mistake, index) => (
                  <div key={index} className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                    <div className="mb-2">
                      <p className="font-medium text-gray-900">{mistake.question.question}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                      <div>
                        <span className="text-sm text-red-600">Your answer:</span>
                        <div className="font-medium text-red-800">{mistake.userAnswer}</div>
                      </div>
                      <div>
                        <span className="text-sm text-green-600">Correct answer:</span>
                        <div className="font-medium text-green-800">{mistake.correctAnswer}</div>
                      </div>
                    </div>
                    {mistake.question.helper_text && (
                      <p className="text-sm text-blue-700">
                        <strong>Hint:</strong> {mistake.question.helper_text}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => startPractice()}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Practice Again
            </button>
            <button
              onClick={resetToMenu}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Grammar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Grammar;
