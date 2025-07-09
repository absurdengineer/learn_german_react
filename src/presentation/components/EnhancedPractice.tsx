import React, { useEffect, useState } from 'react';
import { generatePracticeSession, parseEnhancedGrammarCSV, type EnhancedGrammarQuestion } from '../../utils/enhancedGrammarParser';

interface EnhancedPracticeProps {
  category?: string;
  onBack: () => void;
}

const EnhancedPractice: React.FC<EnhancedPracticeProps> = ({ category, onBack }) => {
  const [questions, setQuestions] = useState<EnhancedGrammarQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGrammarData = async () => {
      try {
        // Load the enhanced grammar CSV
        const response = await fetch('/src/data/enhanced_grammar.csv');
        const csvContent = await response.text();
        const allQuestions = parseEnhancedGrammarCSV(csvContent);
        
        // Generate practice session for the selected category
        const practiceQuestions = generatePracticeSession(
          allQuestions,
          category,
          'beginner', // Focus on beginner level
          10 // Limit to 10 questions
        );
        
        setQuestions(practiceQuestions);
        setLoading(false);
      } catch (error) {
        console.error('Error loading grammar data:', error);
        setLoading(false);
      }
    };

    loadGrammarData();
  }, [category]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Practice session complete
      const finalScore = score.correct + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0);
      const percentage = Math.round((finalScore / (score.total + 1)) * 100);
      alert(`🎉 Practice complete!\n\nScore: ${finalScore}/${score.total + 1} (${percentage}%)\n\nKeep practicing to improve!`);
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading practice questions...</h2>
        </div>
      </div>
    );
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No practice questions available</h2>
          <p className="text-gray-600 mb-6">Try selecting a different category or check back later.</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="text-white hover:text-purple-200 transition-colors"
            >
              ← Back
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Enhanced Practice Mode</h1>
              <p className="text-purple-100">Question {currentQuestionIndex + 1} of {questions.length}</p>
            </div>
            <div className="text-white text-right">
              <div className="text-sm">Score</div>
              <div className="font-bold">{score.correct}/{score.total}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress: {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
              <span>{currentQuestion.category} • {currentQuestion.subcategory}</span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentQuestion.difficulty}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {currentQuestion.germanSentence}
            </h2>
            
            <p className="text-lg text-gray-600 mb-4">
              {currentQuestion.englishTranslation}
            </p>

            {currentQuestion.exampleContext && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Context:</strong> {currentQuestion.exampleContext}
                </p>
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  showResult
                    ? option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : selectedAnswer === option
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                    : selectedAnswer === option
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-lg">{option}</span>
                  {showResult && option === currentQuestion.correctAnswer && (
                    <span className="text-green-600 text-xl">✅</span>
                  )}
                  {showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                    <span className="text-red-600 text-xl">❌</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Result and Explanation */}
          {showResult && (
            <div className="space-y-4">
              <div className="border-t pt-6">
                <div className={`text-lg font-semibold mb-4 ${
                  selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? '🎉 Correct!' : '😅 Not quite right'}
                </div>
                
                {/* Grammar Explanation */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">📚 Explanation:</h3>
                  <p className="text-gray-700 mb-2">{currentQuestion.explanation}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Grammar Point:</strong> {currentQuestion.grammarPoint}
                  </p>
                </div>

                {/* Common Mistake */}
                {currentQuestion.commonMistake && selectedAnswer !== currentQuestion.correctAnswer && (
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                    <h3 className="font-semibold text-orange-800 mb-1">⚠️ Common Mistake:</h3>
                    <p className="text-orange-700 text-sm">{currentQuestion.commonMistake}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {currentQuestionIndex + 1} of {questions.length} questions
                  </div>
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Practice 🎯'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPractice;
