/**
 * Checks if a user answer is correct, handling alternative answers separated by "/"
 */
export const isAnswerCorrect = (
  userAnswer: string,
  correctAnswer: string
): boolean => {
  const normalizedUserAnswer = userAnswer.toLowerCase().trim();
  const normalizedCorrectAnswer = correctAnswer.toLowerCase().trim();

  // Check if the correct answer contains alternative answers separated by "/"
  if (normalizedCorrectAnswer.includes("/")) {
    const alternatives = normalizedCorrectAnswer
      .split("/")
      .map((alt) => alt.trim());
    return alternatives.some((alt) => alt === normalizedUserAnswer);
  }

  // Regular exact match
  return normalizedUserAnswer === normalizedCorrectAnswer;
};

/**
 * Calculates test score based on user answers
 */
export const calculateTestScore = (
  questions: Array<{ id: string; answer: string }>,
  userAnswers: { [key: string]: string }
): number => {
  return questions.reduce((acc, question) => {
    return userAnswers[question.id] === question.answer ? acc + 1 : acc;
  }, 0);
};

/**
 * Saves test results to localStorage
 */
export const saveTestResult = (result: {
  testId: string;
  title: string;
  score: number;
  totalQuestions: number;
  userAnswers: { [key: string]: string };
  totalTime: number;
  date: string;
}): void => {
  const pastResults = JSON.parse(localStorage.getItem("testResults") || "[]");
  localStorage.setItem("testResults", JSON.stringify([...pastResults, result]));
};

/**
 * Loads test results from localStorage
 */
export const loadTestResults = (): Array<{
  testId: string;
  title: string;
  score: number;
  totalQuestions: number;
  userAnswers: { [key: string]: string };
  totalTime: number;
  date: string;
}> => {
  return JSON.parse(localStorage.getItem("testResults") || "[]");
};
