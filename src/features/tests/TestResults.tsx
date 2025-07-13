import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";

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

interface TestResult {
  testId: string;
  title: string;
  score: number;
  totalQuestions: number;
  userAnswers: { [key: string]: string };
  totalTime: number;
  date: string;
}

const TestResults: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { userAnswers, test, result } =
    (state as {
      userAnswers: { [key: string]: string };
      test: Test;
      result: TestResult;
    }) || {};

  if (!result || !test) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-red-600">Error</h1>
              <p className="mt-2 text-lg text-gray-600">
                Test results are not available.
              </p>
              <Button
                onClick={() => navigate("/tests")}
                variant="primary"
                size="lg"
                icon="ixon-arrow-right"
              >
                Back to Tests
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const accuracy =
    result.totalQuestions > 0
      ? (result.score / result.totalQuestions) * 100
      : 0;
  const timePerQuestion =
    result.totalQuestions > 0
      ? (result.totalTime / 1000 / result.totalQuestions).toFixed(1)
      : 0;
  const passed = accuracy >= 70; // 70% passing grade

  const incorrectAnswers = test.questions.filter(
    (q) => userAnswers[q.id] !== q.answer
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{passed ? "🎉" : "📚"}</div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Test Complete!
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              You've completed the{" "}
              <span className="font-semibold text-indigo-600">
                {result.title}
              </span>{" "}
              test.
            </p>
            <div
              className={`mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                passed
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {passed ? "✅ Passed!" : "📖 Keep studying!"}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div
              className={`border rounded-xl p-6 ${
                passed
                  ? "bg-green-50 border-green-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  passed ? "text-green-600" : "text-yellow-600"
                }`}
              >
                Score
              </p>
              <p
                className={`mt-2 text-4xl font-bold ${
                  passed ? "text-green-800" : "text-yellow-800"
                }`}
              >
                {accuracy.toFixed(0)}%
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm font-medium text-blue-600">Correct</p>
              <p className="mt-2 text-4xl font-bold text-blue-800">
                {result.score}
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-sm font-medium text-red-600">Incorrect</p>
              <p className="mt-2 text-4xl font-bold text-red-800">
                {result.totalQuestions - result.score}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-600">
            <p>Total questions: {result.totalQuestions}</p>
            <p>Time spent: {(result.totalTime / 1000).toFixed(1)} seconds</p>
            <p>Average time per question: {timePerQuestion} seconds</p>
          </div>

          {incorrectAnswers.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                Review Incorrect Answers
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 max-h-80 overflow-y-auto">
                <ul className="space-y-6">
                  {incorrectAnswers.map((question) => (
                    <li
                      key={question.id}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="space-y-2">
                        <p className="font-semibold text-gray-800">
                          {question.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-red-600 font-medium">
                              Your answer:{" "}
                            </span>
                            <span className="text-red-700">
                              {userAnswers[question.id] || "No answer"}
                            </span>
                          </div>
                          <div>
                            <span className="text-green-600 font-medium">
                              Correct answer:{" "}
                            </span>
                            <span className="text-green-700">
                              {question.answer}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate("/tests")}
              variant="primary"
              size="lg"
              icon={undefined}
            >
              Take Another Test 🧪
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="lg"
              icon={undefined}
            >
              Back to Home 🏠
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
