import React from "react";
import { useTests } from "../hooks/useTests";
import TestResults from "../components/TestResults";
import PageLayout from "../components/layout/PageLayout";
import {
  GradientCard,
  QuickActionCard,
  StatsCard,
  TestTypeCard,
} from "../components";
import SectionGrid from "../components/layout/SectionGrid";
import { useLocation, useNavigate } from "react-router-dom";
import TestSession from "../components/TestSession";

const Tests: React.FC = () => {
  const {
    sessionMode,
    dataStats,
    startTest,
    generateA1Test,
    generateVocabularyTest,
    generateArticlesTest,
    generateGrammarTest,
  } = useTests();
  const location = useLocation();
  const navigate = useNavigate();

  if (sessionMode === "session") {
    const test = location.state?.test;
    if (!test) {
      // If no test data, return to menu
      navigate("/tests");
      return null;
    }
    return (
      <TestSession
        questions={test.questions}
        title={test.title}
        onComplete={(result) => {
          navigate("/tests/results", {
            state: {
              result,
              test,
              userAnswers: result.userAnswers || {},
            },
          });
        }}
        onExit={() => navigate("/tests")}
      />
    );
  }

  if (sessionMode === "results") {
    return <TestResults />;
  }

  const explanationBanner = (
    <GradientCard gradient="blue-purple" className="border border-blue-200">
      <div className="flex items-start space-x-4">
        <div className="text-3xl">🧪</div>
        <div>
          <h3 className="text-xl font-bold mb-2">
            Standardized A1 German Test System
          </h3>
          <p className="mb-2">
            Our <strong>unified test generator</strong> draws from standardized
            vocabulary, articles, and grammar data to create comprehensive
            assessments. Each test is <strong>dynamically generated</strong> for
            unique practice every time!
          </p>
          <p className="text-sm opacity-90">
            ✨ Built with {dataStats.vocabulary.total} vocabulary words,{" "}
            {dataStats.articles.total} article patterns, and{" "}
            {dataStats.grammarLessons.total + dataStats.grammarPractice.total}{" "}
            grammar exercises for complete A1 coverage.
          </p>
        </div>
      </div>
    </GradientCard>
  );

  return (
    <PageLayout
      pageData={{
        title: "German A1 Tests",
        subtitle: "Test your knowledge with dynamic, adaptive questions",
        description:
          "Comprehensive testing across vocabulary, grammar, and articles",
        icon: "🧪",
        gradient: "from-blue-500 to-purple-600",
      }}
      bannerContent={explanationBanner}
    >
      <div className="space-y-8">
        {/* A1 Comprehensive Tests */}
        <SectionGrid
          title="A1 Comprehensive Tests"
          description="Full coverage of all A1 topics"
        >
          <QuickActionCard
            title="Quick A1 Test"
            description="10 mixed questions for rapid assessment"
            icon="⚡"
            color="from-green-500 to-teal-600"
            onClick={() => startTest(generateA1Test, 10, "quick-a1")}
          />
          <QuickActionCard
            title="Standard A1 Test"
            description="20 questions covering all A1 topics"
            icon="🎯"
            color="from-blue-500 to-purple-600"
            onClick={() => startTest(generateA1Test, 20, "standard-a1")}
          />
          <QuickActionCard
            title="Comprehensive A1 Test"
            description="30 questions for thorough evaluation"
            icon="🚀"
            color="from-purple-500 to-pink-600"
            onClick={() => startTest(generateA1Test, 30, "comprehensive-a1")}
          />
        </SectionGrid>

        {/* Vocabulary Tests */}
        <SectionGrid
          title="Vocabulary Tests"
          description="Test your German-English word knowledge"
        >
          <QuickActionCard
            title="Quick Vocabulary Test"
            description="10 vocabulary questions"
            icon="📚"
            color="from-green-400 to-blue-400"
            onClick={() => startTest(generateVocabularyTest, 10, "quick-vocab")}
          />
          <QuickActionCard
            title="Standard Vocabulary Test"
            description="20 vocabulary questions"
            icon="📚"
            color="from-blue-400 to-purple-400"
            onClick={() =>
              startTest(generateVocabularyTest, 20, "standard-vocab")
            }
          />
          <QuickActionCard
            title="Comprehensive Vocabulary Test"
            description="30 vocabulary questions"
            icon="📚"
            color="from-purple-400 to-pink-400"
            onClick={() =>
              startTest(generateVocabularyTest, 30, "comprehensive-vocab")
            }
          />
        </SectionGrid>

        {/* Articles Tests */}
        <SectionGrid
          title="Articles Tests"
          description="Master der, die, das with targeted practice"
        >
          <QuickActionCard
            title="Quick Articles Test"
            description="10 articles questions"
            icon="🎯"
            color="from-green-400 to-blue-400"
            onClick={() =>
              startTest(generateArticlesTest, 10, "quick-articles")
            }
          />
          <QuickActionCard
            title="Standard Articles Test"
            description="20 articles questions"
            icon="🎯"
            color="from-blue-400 to-purple-400"
            onClick={() =>
              startTest(generateArticlesTest, 20, "standard-articles")
            }
          />
          <QuickActionCard
            title="Comprehensive Articles Test"
            description="30 articles questions"
            icon="🎯"
            color="from-purple-400 to-pink-400"
            onClick={() =>
              startTest(generateArticlesTest, 30, "comprehensive-articles")
            }
          />
        </SectionGrid>

        {/* Grammar Tests */}
        <SectionGrid
          title="Grammar Tests"
          description="Test your knowledge of German grammar rules"
        >
          <QuickActionCard
            title="Quick Grammar Test"
            description="10 grammar questions"
            icon="📝"
            color="from-green-400 to-blue-400"
            onClick={() => startTest(generateGrammarTest, 10, "quick-grammar")}
          />
          <QuickActionCard
            title="Standard Grammar Test"
            description="20 grammar questions"
            icon="📝"
            color="from-blue-400 to-purple-400"
            onClick={() =>
              startTest(generateGrammarTest, 20, "standard-grammar")
            }
          />
          <QuickActionCard
            title="Comprehensive Grammar Test"
            description="30 grammar questions"
            icon="📝"
            color="from-purple-400 to-pink-400"
            onClick={() =>
              startTest(generateGrammarTest, 30, "comprehensive-grammar")
            }
          />
        </SectionGrid>

        {/* Test Coverage Stats */}
        <SectionGrid
          title="📊 Test Coverage"
          description="Comprehensive question database"
          columns={4}
        >
          <StatsCard
            title="Vocabulary"
            value={`${dataStats.vocabulary.total}+`}
            subtitle="test questions"
            icon="📚"
          />
          <StatsCard
            title="Articles"
            value={`${dataStats.articles.total}+`}
            subtitle="test questions"
            icon="🎯"
          />
          <StatsCard
            title="Grammar"
            value={`${
              dataStats.grammarLessons.total + dataStats.grammarPractice.total
            }+`}
            subtitle="test questions"
            icon="📝"
          />
          <StatsCard
            title="Unique Tests"
            value="∞"
            subtitle="never repeat"
            icon="🔄"
          />
        </SectionGrid>
      </div>
    </PageLayout>
  );
};

export default Tests;
