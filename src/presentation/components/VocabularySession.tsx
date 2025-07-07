import React, { useCallback, useEffect, useState } from 'react';
import { getRandomVocabularyWords } from '../../data';
import { VocabularyWord } from '../../domain/entities/Vocabulary';
import { getGenderColor, getGenderDisplayName } from '../../utils/genderColors';

interface VocabularySessionProps {
  words: VocabularyWord[];
  sessionType: 'flashcards' | 'translation' | 'multiple-choice';
  onComplete: (results: SessionResult) => void;
  onExit: () => void;
}

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

const VocabularySession: React.FC<VocabularySessionProps> = ({
  words,
  sessionType,
  onComplete,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [sessionResults, setSessionResults] = useState<SessionResult>({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timeSpent: 0,
    wordsStudied: [],
    mistakes: [],
  });
  const [startTime] = useState(Date.now());
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<string[]>([]);

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;
  const genderColor = getGenderColor(currentWord?.gender);

  const generateMultipleChoiceOptions = useCallback(() => {
    if (!currentWord) return;
    
    const correctAnswer = currentWord.english;
    const otherWords = getRandomVocabularyWords(3).filter((w: VocabularyWord) => w.english !== correctAnswer);
    const options = [correctAnswer, ...otherWords.map((w: VocabularyWord) => w.english)];
    setMultipleChoiceOptions(options.sort(() => Math.random() - 0.5));
  }, [currentWord]);

  useEffect(() => {
    if (sessionType === 'multiple-choice' && currentWord) {
      generateMultipleChoiceOptions();
    }
  }, [currentIndex, sessionType, currentWord, generateMultipleChoiceOptions]);

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    const updatedResults = {
      ...sessionResults,
      totalQuestions: sessionResults.totalQuestions + 1,
      correctAnswers: sessionResults.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: sessionResults.wrongAnswers + (isCorrect ? 0 : 1),
      wordsStudied: [...sessionResults.wordsStudied, currentWord],
      mistakes: isCorrect ? sessionResults.mistakes : [
        ...sessionResults.mistakes,
        {
          word: currentWord,
          userAnswer: answer,
          correctAnswer: currentWord.english,
        },
      ],
    };

    setSessionResults(updatedResults);
    
    // Only set feedback for quiz modes, not flashcards
    if (sessionType !== 'flashcards') {
      setFeedback(isCorrect ? 'correct' : 'incorrect');
    }

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        setUserAnswer('');
        setSelectedOption('');
        setFeedback(null);
      } else {
        // Session complete
        const finalResults = {
          ...updatedResults,
          timeSpent: Math.round((Date.now() - startTime) / 1000),
        };
        onComplete(finalResults);
      }
    }, sessionType === 'flashcards' ? 0 : 2000); // No delay for flashcards, 2s for quiz modes
  };

  const handleFlashcardNext = () => {
    if (showAnswer) {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Session complete - just mark as completed without scoring
        const finalResults = {
          ...sessionResults,
          totalQuestions: words.length,
          correctAnswers: words.length, // Mark all as completed for learning mode
          timeSpent: Math.round((Date.now() - startTime) / 1000),
          wordsStudied: words,
          mistakes: [],
        };
        onComplete(finalResults);
      }
    } else {
      setShowAnswer(true);
    }
  };

  const handleTranslationSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentWord.english.toLowerCase().trim();
    handleAnswer(userAnswer, isCorrect);
  };

  const handleMultipleChoiceSelect = (option: string) => {
    const isCorrect = option === currentWord.english;
    setSelectedOption(option);
    handleAnswer(option, isCorrect);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && sessionType === 'translation') {
      handleTranslationSubmit();
    }
  };

  if (!currentWord) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="text-gray-700">Exit</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {currentIndex + 1} / {words.length}
            </div>
            <div className="w-48 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className={`rounded-xl shadow-lg p-8 mb-6 transition-all duration-300 ${
          currentWord.hasGender() ? `${genderColor.bg} ${genderColor.border} border-2` : 'bg-white'
        }`}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h1 className={`text-4xl font-bold ${currentWord.hasGender() ? genderColor.text : 'text-gray-800'}`}>
                {currentWord.german}
              </h1>
              {currentWord.hasGender() && (
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${genderColor.bg} ${genderColor.text} border-2 ${genderColor.border}`}>
                  {currentWord.gender}
                </span>
              )}
            </div>
            {currentWord.isNoun() && currentWord.hasGender() && (
              <p className={`text-lg mb-2 ${currentWord.hasGender() ? genderColor.text : 'text-gray-600'}`}>
                {currentWord.getFullNoun()}
                {currentWord.hasGender() && (
                  <span className={`ml-2 text-sm ${genderColor.text} opacity-75`}>
                    ({getGenderDisplayName(currentWord.gender)})
                  </span>
                )}
              </p>
            )}
            {currentWord.pronunciation && (
              <p className={`text-sm italic ${currentWord.hasGender() ? genderColor.text + ' opacity-75' : 'text-gray-500'}`}>
                /{currentWord.pronunciation}/
              </p>
            )}
          </div>

          {/* Content based on session type */}
          {sessionType === 'flashcards' && (
            <div className="text-center">
              {!showAnswer ? (
                <div className="space-y-6">
                  <p className="text-lg text-gray-600">
                    What does this word mean?
                  </p>
                  <button
                    onClick={handleFlashcardNext}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Show Answer
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-2xl font-semibold text-green-600">
                    {currentWord.english}
                  </div>
                  {currentWord.exampleSentences && currentWord.exampleSentences.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Example:</strong> {currentWord.exampleSentences[0].german}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {currentWord.exampleSentences[0].english}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleFlashcardNext}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {currentIndex < words.length - 1 ? 'Next Word' : 'Complete Session'}
                  </button>
                </div>
              )}
            </div>
          )}

          {sessionType === 'translation' && (
            <div className="space-y-6">
              <p className="text-lg text-gray-600 text-center">
                Translate this word to English:
              </p>
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter English translation..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={feedback !== null}
                />
                <button
                  onClick={handleTranslationSubmit}
                  disabled={!userAnswer.trim() || feedback !== null}
                  className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {sessionType === 'multiple-choice' && (
            <div className="space-y-6">
              <p className="text-lg text-gray-600 text-center">
                Choose the correct English translation:
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {multipleChoiceOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleMultipleChoiceSelect(option)}
                    disabled={feedback !== null}
                    className={`p-4 rounded-lg border transition-all ${
                      feedback !== null && option === currentWord.english
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : feedback !== null && option === selectedOption && option !== currentWord.english
                        ? 'bg-red-100 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback - Only for quiz modes, not flashcards */}
          {feedback && sessionType !== 'flashcards' && (
            <div className={`mt-6 p-4 rounded-lg text-center ${
              feedback === 'correct' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {feedback === 'correct' ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Correct!</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Incorrect</span>
                  </div>
                  <p className="text-sm">
                    The correct answer is: <strong>{currentWord.english}</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats - Only for quiz modes, not flashcards */}
        {sessionType !== 'flashcards' && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="text-center">
                <div className="font-semibold text-green-600">{sessionResults.correctAnswers}</div>
                <div>Correct</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{sessionResults.wrongAnswers}</div>
                <div>Wrong</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-700">{Math.round((Date.now() - startTime) / 1000)}s</div>
                <div>Time</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularySession;
