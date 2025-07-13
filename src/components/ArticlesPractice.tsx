import React, { useEffect, useState } from "react";
import { VocabularyWord } from "../types/Vocabulary";
import { GENDER_COLORS } from "../lib/genderColors";
import GenderLegend from "./GenderLegend";
import { PronunciationButton } from ".";
import { useLocation } from "react-router-dom";
import type { Question } from "../features/question-engine/questionTypes";
import type { StandardizedArticle } from "../lib/parsers/DataLoader";

interface ArticlesPracticeProps {
  onComplete: (results: ArticlesSessionResult) => void;
  onExit: () => void;
  sessionLength?: number;
  focusCategory?: string;
  showCategoryFilter?: boolean;
  reviewWords?: VocabularyWord[];
  questions?: Question[];
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

import SessionLayout from "./layout/SessionLayout";

const ArticlesPractice: React.FC<ArticlesPracticeProps> = ({
  onComplete,
  onExit,
  sessionLength = 30,
  reviewWords: propReviewWords,
  questions: propQuestions,
}) => {
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [mistakes, setMistakes] = useState<
    Array<{
      word: VocabularyWord;
      userAnswer: string;
      correctAnswer: string;
    }>
  >([]);

  // Get reviewWords from props or navigation state
  const reviewWords = propReviewWords || location.state?.reviewWords;
  const questions = propQuestions || location.state?.questions;

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  // Initialize session questions
  useEffect(() => {
    if (questions && questions.length > 0) {
      setSessionQuestions(questions);
    } else if (reviewWords && reviewWords.length > 0) {
      // Convert review words to questions
      const reviewQuestions = reviewWords.map((word: VocabularyWord) => ({
        id: word.id.toString(),
        type: "article" as const,
        mode: "flashcard" as const,
        prompt: `What is the article for "${word.german}"?`,
        answer: word.gender as "der" | "die" | "das",
        helperText: word.english,
        color:
          word.gender === "der"
            ? "bg-blue-100"
            : word.gender === "die"
            ? "bg-pink-100"
            : word.gender === "das"
            ? "bg-gray-200"
            : undefined,
        data: word,
      }));
      setSessionQuestions(reviewQuestions.slice(0, sessionLength));
    }
  }, [questions, reviewWords, sessionLength]);

  const currentQuestion = sessionQuestions[currentQuestionIndex];
  const currentArticle = currentQuestion?.data as StandardizedArticle;

  const handleSubmit = () => {
    if (!currentQuestion || !currentArticle) return;

    const isCorrect =
      userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase();
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setMistakes([
        ...mistakes,
        {
          word: VocabularyWord.create({
            german: currentArticle.german,
            english: currentArticle.english,
            type: "noun",
            level: "A1",
            gender: currentArticle.gender,
            tags: [currentArticle.category || "general"],
            frequency: currentArticle.frequency || 1,
          }),
          userAnswer,
          correctAnswer: currentQuestion.answer,
        },
      ]);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestionIndex < sessionQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer("");
        setShowResult(false);
      } else {
        // Session complete
        const endTime = Date.now();
        const totalTime = Math.round((endTime - sessionStartTime) / 1000);

        onComplete({
          totalQuestions: sessionQuestions.length,
          correctAnswers: score + (isCorrect ? 1 : 0),
          wrongAnswers: sessionQuestions.length - score - (isCorrect ? 1 : 0),
          timeSpent: totalTime,
          wordsStudied: sessionQuestions.map((question) => {
            const article = question.data as StandardizedArticle;
            return VocabularyWord.create({
              german: article.german,
              english: article.english,
              type: "noun",
              level: "A1",
              gender: article.gender,
              tags: [article.category || "general"],
              frequency: article.frequency || 1,
            });
          }),
          mistakes: isCorrect
            ? mistakes
            : [
                ...mistakes,
                {
                  word: VocabularyWord.create({
                    german: currentArticle.german,
                    english: currentArticle.english,
                    type: "noun",
                    level: "A1",
                    gender: currentArticle.gender,
                    tags: [currentArticle.category || "general"],
                    frequency: currentArticle.frequency || 1,
                  }),
                  userAnswer,
                  correctAnswer: currentQuestion.answer,
                },
              ],
        });
      }
    }, 1500);
  };

  const getButtonColor = (gender: string) => {
    switch (gender) {
      case "der":
        return "bg-blue-500";
      case "die":
        return "bg-pink-500";
      case "das":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  if (sessionQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading articles practice...</p>
        </div>
      </div>
    );
  }

  const cardBgColor =
    showResult && currentArticle
      ? GENDER_COLORS[currentArticle.gender]?.bg
      : "bg-white";

  return (
    <SessionLayout title="Articles Practice" onExit={onExit}>
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {Math.round(
              ((currentQuestionIndex + 1) / sessionQuestions.length) * 100
            )}
            %
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / sessionQuestions.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <div className="mb-8">
        <GenderLegend />
      </div>

      <div
        className={`rounded-2xl p-6 sm:p-8 mb-6 transition-colors duration-500 border border-slate-200 shadow-sm ${cardBgColor}`}
      >
        <div className="text-center mb-8">
          <div className="text-sm text-gray-600 mb-2">
            What is the correct article for:
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            {currentArticle?.german}
          </div>
          <div className="text-lg sm:text-xl text-gray-600">
            {currentArticle?.english}
          </div>
          {currentArticle?.pronunciation && (
            <div className="flex items-center justify-center gap-2">
              <div className="text-md sm:text-lg text-gray-500">
                /{currentArticle.pronunciation}/
              </div>
              <PronunciationButton
                text={currentArticle.german}
                className="flex-shrink-0"
              />
            </div>
          )}
          <div className="text-sm text-gray-500 mt-2 capitalize">
            Category: {currentArticle?.category}
          </div>
        </div>

        <div className="flex justify-center space-x-2 sm:space-x-4 mb-8">
          {(["der", "die", "das"] as const).map((article) => (
            <button
              key={article}
              onClick={() => setUserAnswer(article)}
              className={`px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-105 ${
                userAnswer === article
                  ? getButtonColor(article)
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              disabled={showResult}
            >
              {article}
            </button>
          ))}
        </div>

        {showResult && (
          <div
            className={`text-center p-4 rounded-lg ${
              userAnswer === currentArticle?.gender ? "bg-blue-50" : "bg-red-50"
            }`}
          >
            <div
              className={`text-lg font-bold ${
                userAnswer === currentArticle?.gender
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {userAnswer === currentArticle?.gender
                ? "✓ Correct!"
                : "✗ Wrong!"}
            </div>
            <div className="text-sm text-gray-700 mt-2">
              The correct answer is:{" "}
              <span
                className={`font-bold ${
                  currentArticle && GENDER_COLORS[currentArticle.gender]?.text
                }`}
              >
                {currentArticle?.gender}
              </span>
            </div>
          </div>
        )}

        {!showResult && (
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!userAnswer}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-200 ${
                userAnswer
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </SessionLayout>
  );
};

export default ArticlesPractice;
