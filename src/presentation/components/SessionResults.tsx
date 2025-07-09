import { useLocation, Link } from 'react-router-dom';

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface Test {
  title: string;
  questions: Question[];
}

interface Result {
  totalTime: number;
  totalQuestions: number;
  score: number;
}

const SessionResults = () => {
  const { state } = useLocation();
  const { userAnswers, test, result } = (state as { userAnswers: Record<string, string>; test: Test; result: Result }) || {};

  if (!userAnswers || !test || !result) {
    return <div>No results to display.</div>;
  }

  const averageTime = (result.totalTime / result.totalQuestions / 1000).toFixed(2);

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white p-6 rounded-lg shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-2">Test Complete!</h1>
          <p className="text-lg text-gray-600 mb-6">{test.title}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-sm text-blue-700">Score</p>
              <p className="text-3xl font-bold text-blue-800">
                {((result.score / result.totalQuestions) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-sm text-green-700">Points</p>
              <p className="text-3xl font-bold text-green-800">
                {result.score}/{result.totalQuestions}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <p className="text-sm text-purple-700">Avg. Time</p>
              <p className="text-3xl font-bold text-purple-800">{averageTime}s</p>
            </div>
          </div>

          <div className="space-y-4 text-left">
            {test.questions.map((question: Question) => (
              <div
                key={question.id}
                className={`p-4 rounded-md border-l-4 ${
                  userAnswers[question.id] === question.answer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <p className="font-semibold">{question.question}</p>
                <p className="text-sm">Your answer: {userAnswers[question.id] || 'Not answered'}</p>
                {userAnswers[question.id] !== question.answer && (
                  <p className="text-sm font-bold">Correct answer: {question.answer}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              to="/tests"
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Back to Tests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionResults;
