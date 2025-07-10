import React, { useEffect, useState } from 'react';
import { loadArticleNouns, type ArticleNoun } from '../../data';
import { VocabularyWord } from '../../domain/entities/Vocabulary';
import { GENDER_COLORS } from '../../utils/genderColors';
import GenderLegend from './GenderLegend';
import { NavigationHeader } from './ui';

interface ArticlesPracticeProps {
  onComplete: (results: ArticlesSessionResult) => void;
  onExit: () => void;
  sessionLength?: number;
  focusCategory?: string;
  showCategoryFilter?: boolean;
  reviewWords?: VocabularyWord[];
}

interface ArticlesSessionResult {
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

// Load essential A1 nouns from JSON
const ESSENTIAL_A1_NOUNS: ArticleNoun[] = loadArticleNouns();

const ArticlesPractice: React.FC<ArticlesPracticeProps> = ({
  onComplete,
  onExit,
  sessionLength = 30,
  focusCategory,
  reviewWords,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [sessionWords, setSessionWords] = useState<ArticleNoun[]>([]);
  const [mistakes, setMistakes] = useState<
    Array<{
      word: VocabularyWord;
      userAnswer: string;
      correctAnswer: string;
    }>
  >([]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 100);
  }, []);

  // Initialize session words
  useEffect(() => {
    let wordsToUse: ArticleNoun[] = [];

    if (reviewWords && reviewWords.length > 0) {
      wordsToUse = reviewWords.map((word) => ({
        id: word.id.toString(),
        german: word.german,
        english: word.english,
        gender: word.gender as 'der' | 'die' | 'das',
        category: word.tags[0] || 'unknown',
        frequency: word.frequency || 0,
      }));
    } else {
      let filteredNouns = ESSENTIAL_A1_NOUNS;
      if (focusCategory) {
        filteredNouns = ESSENTIAL_A1_NOUNS.filter(
          (noun) => noun.category === focusCategory
        );
      }
      wordsToUse = filteredNouns;
    }

    const shuffled = [...wordsToUse].sort(() => Math.random() - 0.5);
    setSessionWords(shuffled.slice(0, sessionLength));
  }, [focusCategory, sessionLength, reviewWords]);

  const currentWord = sessionWords[currentQuestionIndex];

  const handleSubmit = () => {
    if (!currentWord) return;

    const isCorrect =
      userAnswer.toLowerCase() === currentWord.gender.toLowerCase();
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes([
        ...mistakes,
        {
          word: VocabularyWord.create({
            german: currentWord.german,
            english: currentWord.english,
            type: 'noun',
            level: 'A1',
            gender: currentWord.gender,
            tags: [currentWord.category],
            frequency: currentWord.frequency,
          }),
          userAnswer,
          correctAnswer: currentWord.gender,
        },
      ]);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestionIndex < sessionWords.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
        setShowResult(false);
      } else {
        // Session complete
        const endTime = Date.now();
        const totalTime = Math.round((endTime - sessionStartTime) / 1000);

        onComplete({
          totalQuestions: sessionWords.length,
          correctAnswers: score + (isCorrect ? 1 : 0),
          wrongAnswers: sessionWords.length - score - (isCorrect ? 1 : 0),
          timeSpent: totalTime,
          wordsStudied: sessionWords.map((noun) =>
            VocabularyWord.create({
              german: noun.german,
              english: noun.english,
              type: 'noun',
              level: 'A1',
              gender: noun.gender,
              tags: [noun.category],
              frequency: noun.frequency,
            })
          ),
          mistakes: isCorrect
            ? mistakes
            : [
                ...mistakes,
                {
                  word: VocabularyWord.create({
                    german: currentWord.german,
                    english: currentWord.english,
                    type: 'noun',
                    level: 'A1',
                    gender: currentWord.gender,
                    tags: [currentWord.category],
                    frequency: currentWord.frequency,
                  }),
                  userAnswer,
                  correctAnswer: currentWord.gender,
                },
              ],
        });
      }
    }, 1500);
  };

  const getButtonColor = (gender: string) => {
    switch (gender) {
      case 'der':
        return 'bg-blue-500';
      case 'die':
        return 'bg-pink-500';
      case 'das':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (sessionWords.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles practice...</p>
        </div>
      </div>
    );
  }

  const cardBgColor = showResult && currentWord
    ? GENDER_COLORS[currentWord.gender]?.bg
    : 'bg-white';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <NavigationHeader
          title="🇩🇪 Articles Practice (80-20 Rule)"
          subtitle={`Question ${currentQuestionIndex + 1} of ${sessionWords.length}`}
          onBack={onExit}
          backLabel="Exit"
          score={{
            current: score,
            total: sessionWords.length
          }}
        />

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {Math.round(
                ((currentQuestionIndex + 1) / sessionWords.length) * 100
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / sessionWords.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Gender Legend */}
        <div className="mb-8">
          <GenderLegend />
        </div>

        {/* Question Card */}
        <div
          className={`rounded-2xl shadow-lg p-6 sm:p-8 mb-6 transition-colors duration-500 ${cardBgColor}`}
        >
          <div className="text-center mb-8">
            <div className="text-sm text-gray-600 mb-2">
              What is the correct article for:
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              {currentWord?.german}
            </div>
            <div className="text-lg sm:text-xl text-gray-600">
              {currentWord?.english}
            </div>
            {currentWord?.pronunciation && (
              <div className="text-md sm:text-lg text-gray-500">
                /{currentWord.pronunciation}/
              </div>
            )}
            <div className="text-sm text-gray-500 mt-2 capitalize">
              Category: {currentWord?.category}
            </div>
          </div>

          {/* Answer Options */}
          <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
            {(['der', 'die', 'das'] as const).map((article) => (
              <button
                key={article}
                onClick={() => setUserAnswer(article)}
                className={`px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-105 ${
                  userAnswer === article
                    ? getButtonColor(article)
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                disabled={showResult}
              >
                {article}
              </button>
            ))}
          </div>

          {/* Result Display */}
          {showResult && (
            <div
              className={`text-center p-4 rounded-lg ${
                userAnswer === currentWord?.gender
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}
            >
              <div
                className={`text-lg font-bold ${
                  userAnswer === currentWord?.gender
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {userAnswer === currentWord?.gender
                  ? '✓ Correct!'
                  : '✗ Wrong!'}
              </div>
              <div className="text-sm text-gray-700 mt-2">
                The correct answer is:{' '}
                <span
                  className={`font-bold ${
                    currentWord && GENDER_COLORS[currentWord.gender]?.text
                  }`}
                >
                  {currentWord?.gender}
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {!showResult && (
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!userAnswer}
                className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 ${
                  userAnswer
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPractice;
