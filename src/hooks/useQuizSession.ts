import { useEffect, useRef, useState } from "react";
import type {
  QuizQuestion,
  QuizResults,
  QuizMistake,
} from "../types/Flashcard";

export function useQuizSession({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[];
  onComplete: (results: QuizResults) => void;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [textInput, setTextInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [mistakes, setMistakes] = useState<QuizMistake[]>([]);
  const textInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!showResult && questions[currentQuestionIndex]?.options.length === 0) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  }, [currentQuestionIndex, showResult, questions]);

  const currentQuestion = questions[currentQuestionIndex];

  const isAnswerCorrect = (
    userAnswer: string,
    correctAnswer: string
  ): boolean => {
    const normalizedUserAnswer = userAnswer.toLowerCase().trim();
    const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim();
    if (normalizedCorrectAnswer.includes("/")) {
      const alternatives = normalizedCorrectAnswer
        .split("/")
        .map((alt) => alt.trim());
      return alternatives.some((alt) => alt === normalizedUserAnswer);
    }
    return normalizedUserAnswer === normalizedCorrectAnswer;
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return;
    const isCorrect = isAnswerCorrect(answer, currentQuestion.answer);
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setMistakes((prev) => [
        ...prev,
        {
          id: currentQuestion.id,
          prompt: currentQuestion.prompt,
          correctAnswer: currentQuestion.answer,
          userAnswer: answer,
          category: currentQuestion.category,
          word: currentQuestion.word,
        },
      ]);
    }
    setUserAnswer(answer);
    setShowResult(true);
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setUserAnswer("");
        setTextInput("");
        setShowResult(false);
      } else {
        const endTime = Date.now();
        onComplete({
          totalQuestions: questions.length,
          correctAnswers: score + (isCorrect ? 1 : 0),
          wrongAnswers: questions.length - (score + (isCorrect ? 1 : 0)),
          timeSpent: endTime - sessionStartTime,
          mistakes,
        });
      }
    }, 1500);
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleAnswer(textInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && textInput.trim()) {
      handleTextSubmit();
    }
  };

  return {
    currentQuestionIndex,
    score,
    userAnswer,
    textInput,
    setTextInput,
    showResult,
    mistakes,
    textInputRef,
    currentQuestion,
    handleAnswer,
    handleTextSubmit,
    handleKeyPress,
  };
}
