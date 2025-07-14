import React, { useState, useEffect } from "react";
import { generateNounQuestions } from "../../core/question-engine-v2/nouns";
import { generateVocabularyQuestions } from "../../core/question-engine-v2/vocabularies";
import type {
  QuestionV2,
  QuestionEngineV2Config,
} from "../../core/question-engine-v2/types";
import Card from "../../components/Card";
import Button from "../../components/Button";
import MCQOptions from "../../components/MCQOptions";

const BetaTestPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionV2[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [config, setConfig] = useState<QuestionEngineV2Config>({
    resource: "nouns",
    mode: "flashcards",
    q_no: 20,
  });

  const generateQuestions = () => {
    let newQuestions: QuestionV2[] = [];

    if (config.resource === "nouns") {
      newQuestions = generateNounQuestions(config);
    } else if (config.resource === "vocabularies") {
      newQuestions = generateVocabularyQuestions(config);
    }

    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowAnswer(false);
  };

  useEffect(() => {
    generateQuestions();
  }, [config]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer("");
      setShowAnswer(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const isCorrect = selectedAnswer === currentQuestion?.answer;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Beta Test - Question Engine V2
          </h1>

          {/* Configuration Panel */}
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource
                </label>
                <select
                  value={config.resource}
                  onChange={(e) =>
                    setConfig({ ...config, resource: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="nouns">Nouns</option>
                  <option value="vocabularies">Vocabularies</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mode
                </label>
                <select
                  value={config.mode}
                  onChange={(e) =>
                    setConfig({ ...config, mode: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="flashcards">Flashcards</option>
                  <option value="mcq-de">MCQ (DE→EN)</option>
                  <option value="mcq-en">MCQ (EN→DE)</option>
                  <option value="q&a">Q&A</option>
                  <option value="fill_blank">Fill Blank</option>
                  <option value="article">Article</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Level
                </label>
                <select
                  value={config.level || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      level: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Level</option>
                  <option value="1">Level 1</option>
                  <option value="2">Level 2</option>
                  <option value="3">Level 3</option>
                  <option value="4">Level 4</option>
                  <option value="5">Level 5</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Questions Count
                </label>
                <input
                  type="number"
                  value={config.q_no}
                  onChange={(e) =>
                    setConfig({ ...config, q_no: parseInt(e.target.value) })
                  }
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <Button onClick={generateQuestions} variant="primary">
                Generate New Questions
              </Button>
            </div>
          </Card>

          {/* Question Counter */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Display */}
        {currentQuestion && (
          <Card className="mb-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {currentQuestion.type.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {currentQuestion.id}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {currentQuestion.prompt}
              </h2>

              {currentQuestion.helperText && (
                <p className="text-sm text-gray-600 mb-4 italic">
                  {currentQuestion.helperText}
                </p>
              )}
            </div>

            {/* Answer Section */}
            {currentQuestion.type === "flashcards" ||
            currentQuestion.type === "q&a" ? (
              <div className="space-y-4">
                {!showAnswer ? (
                  <Button
                    onClick={handleShowAnswer}
                    variant="primary"
                    size="lg"
                  >
                    Show Answer
                  </Button>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-lg font-medium text-green-800">
                      Answer: {currentQuestion.answer}
                    </p>
                  </div>
                )}
              </div>
            ) : currentQuestion.type === "mcq-de" ||
              currentQuestion.type === "mcq-en" ? (
              <div className="space-y-4">
                {currentQuestion.options && (
                  <MCQOptions
                    options={currentQuestion.options}
                    userAnswer={selectedAnswer}
                    onSelect={handleAnswerSelect}
                    answer={currentQuestion.answer}
                    showResult={showAnswer}
                  />
                )}
                {!showAnswer ? (
                  <Button
                    onClick={handleShowAnswer}
                    variant="primary"
                    size="lg"
                    disabled={!selectedAnswer}
                  >
                    Check Answer
                  </Button>
                ) : (
                  <div
                    className={`p-4 rounded-lg ${
                      isCorrect
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p
                      className={`text-lg font-medium ${
                        isCorrect ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {isCorrect ? "Correct!" : "Incorrect!"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Correct answer: {currentQuestion.answer}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  value={selectedAnswer}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {!showAnswer ? (
                  <Button
                    onClick={handleShowAnswer}
                    variant="primary"
                    size="lg"
                    disabled={!selectedAnswer}
                  >
                    Check Answer
                  </Button>
                ) : (
                  <div
                    className={`p-4 rounded-lg ${
                      isCorrect
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <p
                      className={`text-lg font-medium ${
                        isCorrect ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {isCorrect ? "Correct!" : "Incorrect!"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Correct answer: {currentQuestion.answer}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            variant="ghost"
            disabled={currentQuestionIndex === 0}
          >
            ← Previous
          </Button>

          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer("");
                  setShowAnswer(false);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            variant="ghost"
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next →
          </Button>
        </div>

        {/* Questions List */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            All Questions ({questions.length})
          </h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  index === currentQuestionIndex
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer("");
                  setShowAnswer(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {index + 1}. {question.prompt}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Type: {question.type} | Answer: {question.answer}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{question.id}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BetaTestPage;
