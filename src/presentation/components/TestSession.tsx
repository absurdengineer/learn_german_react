import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface Test {
  id: string;
  title: string;
  type: string;
  questions: Question[];
}

const TestSession = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { test } = (state as { test: Test }) || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(20);
  const [totalTime, setTotalTime] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const questionStartTime = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!test) return;

    questionStartTime.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleNextQuestion(userAnswers);
          return 20;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [test]);

  if (!test) {
    return <div>Test data is missing. Please start a new test.</div>;
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleNextQuestion(userAnswers);
          return 20;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleNextQuestion = (currentAnswers: { [key: string]: string }) => {
    const timeSpent = Date.now() - questionStartTime.current;
    setTotalTime((prev) => prev + timeSpent);

    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption('');
      questionStartTime.current = Date.now();
      resetTimer();
    } else {
      handleSubmit(currentAnswers);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    if (selectedOption) return; // Prevent changing answer

    const newAnswers = { ...userAnswers, [questionId]: answer };
    setUserAnswers(newAnswers);
    setSelectedOption(answer);

    setTimeout(() => {
      handleNextQuestion(newAnswers);
    }, 500); // Delay to show selection before moving to next question
  };

  const handleSubmit = (finalAnswers: { [key: string]: string }) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    const score = test.questions.reduce((acc, question) => {
      return finalAnswers[question.id] === question.answer ? acc + 1 : acc;
    }, 0);

    const result = {
      testId: test.id,
      title: test.title,
      score,
      totalQuestions: test.questions.length,
      userAnswers: finalAnswers,
      totalTime,
      date: new Date().toISOString(),
    };

    const pastResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    localStorage.setItem('testResults', JSON.stringify([...pastResults, result]));

    navigate(`/tests/results`, { state: { userAnswers: finalAnswers, test, result } });
  };

  const question = test.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h1 className="text-xl font-bold text-center sm:text-left">{test.title}</h1>
            <div className="text-lg font-bold text-blue-500 text-center sm:text-right">
              Question {currentQuestionIndex + 1}/{test.questions.length}
            </div>
          </div>

          <div className="relative h-8 w-full bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className="absolute top-0 left-0 h-full bg-green-400 transition-all duration-1000 linear"
              style={{ width: `${(timeLeft / 20) * 100}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700">
              {timeLeft}s
            </span>
          </div>

          <p className="text-2xl font-semibold text-center mb-6">{question.question}</p>
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option) => {
              const isSelected = selectedOption === option;
              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(question.id, option)}
                  disabled={!!selectedOption}
                  className={`w-full p-4 text-center rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSession;
