import React, { useState } from "react";
import { grammarRulesLoader } from "../../lib/parsers/GrammarRulesParser";
import type { GrammarRule } from "../../types/GrammarRule";
import PageLayout from "../../components/layout/PageLayout";

const rules: GrammarRule[] = grammarRulesLoader.load();

const GrammarRulesPage: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null);

  return (
    <PageLayout
      pageData={{
        title: "Grammar Rules (Beta)",
        subtitle: "Reference for Key German Grammar Rules",
        description:
          "Preview the new grammar rules reference. Content and features are in beta.",
        icon: "📏",
        gradient: "from-green-400 to-blue-500",
      }}
    >
      <div className="mb-6">
        <span className="inline-block bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Beta
        </span>
        <span className="ml-2 text-sm text-gray-500">
          This feature is experimental and may change.
        </span>
      </div>
      {selectedRule ? (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <button
            className="mb-4 text-blue-600 hover:underline"
            onClick={() => setSelectedRule(null)}
          >
            ← Back to all rules
          </button>
          <h2 className="text-2xl font-bold mb-2">{selectedRule.ruleName}</h2>
          <div className="text-gray-600 mb-2 font-medium">
            Category: {selectedRule.ruleCategory}
          </div>
          <div className="mb-2 text-gray-700">
            <strong>Explanation:</strong> {selectedRule.explanation}
          </div>
          <div className="mb-2">
            <strong>Summary:</strong> {selectedRule.simpleSummary}
          </div>
          <div className="mb-2">
            <strong>Level:</strong> {selectedRule.level} &nbsp;{" "}
            <strong>Difficulty:</strong> {selectedRule.difficulty}
          </div>
          {selectedRule.prerequisiteRules && (
            <div className="mb-2">
              <strong>Prerequisites:</strong> {selectedRule.prerequisiteRules}
            </div>
          )}
          {selectedRule.appliesTo && (
            <div className="mb-2">
              <strong>Applies To:</strong> {selectedRule.appliesTo}
            </div>
          )}
          {selectedRule.exceptions && (
            <div className="mb-2">
              <strong>Exceptions:</strong> {selectedRule.exceptions}
            </div>
          )}
          {selectedRule.pattern && (
            <div className="mb-2">
              <strong>Pattern:</strong> {selectedRule.pattern}
            </div>
          )}
          {selectedRule.memoryAid && (
            <div className="mb-2">
              <strong>Memory Aid:</strong> {selectedRule.memoryAid}
            </div>
          )}
          {selectedRule.culturalContext && (
            <div className="mb-2">
              <strong>Cultural Context:</strong> {selectedRule.culturalContext}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedRule(rule)}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-400 text-white font-bold text-lg">
                  {rule.ruleId}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {rule.ruleName}
                  </h3>
                  <div className="text-xs text-gray-500">
                    Category: {rule.ruleCategory}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2 line-clamp-3">
                {rule.simpleSummary}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Level: {rule.level} · Difficulty: {rule.difficulty}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default GrammarRulesPage;
