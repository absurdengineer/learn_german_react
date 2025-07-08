import { useState, useEffect } from 'react';

interface TestResult {
  title: string;
  score: number;
  totalQuestions: number;
  date: string;
}

const Progress = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('testResults') || '[]');
    setTestResults(results);
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-4">Progress</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Test History</h2>
        {testResults.length === 0 ? (
          <p>You haven't completed any tests yet.</p>
        ) : (
          <ul className="space-y-4">
            {testResults.map((result, index) => (
              <li key={index} className="p-4 border rounded-md">
                <h3 className="text-xl font-semibold">{result.title}</h3>
                <p>
                  Score: {result.score} / {result.totalQuestions}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(result.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Progress;
