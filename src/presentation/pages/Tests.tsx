import { useNavigate } from 'react-router-dom';
import {
    generateA1Test,
    generateArticlesTest,
    generateGrammarTest,
    generateVocabularyTest,
} from '../../utils/testGenerator';

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

type TestGenerator = (count: number) => {
  id: string;
  title: string;
  type: string;
  questions: Question[];
};

const Tests = () => {
  const navigate = useNavigate();

  const startTest = (generator: TestGenerator, count: number) => {
    const test = generator(count);
    navigate(`/tests/session`, { state: { test } });
  };

  const testTypes = [
    {
      title: 'A1 Comprehensive Test',
      icon: '🏆',
      description: 'A mix of questions from all categories to test your overall A1 knowledge.',
      generator: generateA1Test,
      color: 'yellow',
    },
    {
      title: 'Vocabulary Tests',
      icon: '📚',
      description: 'Challenge your knowledge of German words and their English translations.',
      generator: generateVocabularyTest,
      color: 'blue',
    },
    {
      title: 'Article Tests',
      icon: '🎯',
      description: 'Test your mastery of the German articles: der, die, and das.',
      generator: generateArticlesTest,
      color: 'green',
    },
    {
      title: 'Grammar Tests',
      icon: '📝',
      description: 'Assess your understanding of German grammar rules and sentence structures.',
      generator: generateGrammarTest,
      color: 'purple',
    },
  ];

  const sessionOptions = [
    { name: 'Quick Test', count: 10, icon: '⚡' },
    { name: 'Standard Test', count: 20, icon: '💪' },
    { name: 'Intensive Test', count: 30, icon: '🚀' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">🧪 Test Your Knowledge</h1>
          <p className="text-xl text-gray-600 mb-2">
            Select a category and test length to begin
          </p>
          <p className="text-gray-500">
            Our dynamic tests ensure you never get the same questions twice
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="space-y-12">
          {testTypes.map((testType) => (
            <div key={testType.title} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`text-3xl p-3 bg-${testType.color}-100 rounded-xl`}>{testType.icon}</div>
                <div>
                  <h2 className={`text-2xl font-bold text-${testType.color}-800`}>{testType.title}</h2>
                  <p className="text-gray-600">{testType.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sessionOptions.map((session) => (
                  <button
                    key={session.name}
                    onClick={() => startTest(testType.generator, session.count)}
                    className={`w-full bg-${testType.color}-500 text-white py-3 px-6 rounded-lg hover:bg-${testType.color}-600 transition-colors font-medium flex items-center justify-center gap-2`}
                  >
                    <span>{session.icon}</span>
                    <span>{session.name} ({session.count})</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tests;
