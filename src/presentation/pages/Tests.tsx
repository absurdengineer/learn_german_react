import { useNavigate } from 'react-router-dom';
import {
    generateA1Test,
    generateArticlesTest,
    generateGrammarTest,
    generateVocabularyTest,
} from '../../utils/testGenerator';
import { PageHero, PracticeModeCard, SectionHeader } from '../components/ui';

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
      <PageHero
        title="Test Your Knowledge"
        subtitle="Select a category and test length to begin"
        description="Our dynamic tests ensure you never get the same questions twice"
        icon="🧪"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-8">
        <div className="space-y-12">
          {testTypes.map((testType) => (
            <div key={testType.title} className="space-y-6">
              <SectionHeader
                title={testType.title}
                description={testType.description}
                icon={testType.icon}
                size="md"
                alignment="left"
                className="mb-6"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessionOptions.map((session) => (
                  <PracticeModeCard
                    key={session.name}
                    title={session.name}
                    description={`${session.count} questions`}
                    icon={session.icon}
                    buttonText={`Start ${session.name}`}
                    onStart={() => startTest(testType.generator, session.count)}
                    color={testType.color as 'blue' | 'green' | 'purple' | 'yellow'}
                  />
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
