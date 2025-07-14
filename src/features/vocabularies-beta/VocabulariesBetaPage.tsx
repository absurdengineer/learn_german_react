import React, { useState } from "react";
import { vocabulariesBetaLoader } from "../../lib/parsers/VocabulariesBetaParser";
import type { VocabularyBeta } from "../../types/VocabularyBeta";
import PageLayout from "../../components/layout/PageLayout";

const vocabularies: VocabularyBeta[] = vocabulariesBetaLoader.load();

const VocabulariesBetaPage: React.FC = () => {
  const [selectedVocab, setSelectedVocab] = useState<VocabularyBeta | null>(
    null
  );

  return (
    <PageLayout
      pageData={{
        title: "Vocabularies (Beta)",
        subtitle: "Comprehensive Vocabulary Reference",
        description:
          "Preview the new vocabulary reference. Content and features are in beta.",
        icon: "🗂️",
        gradient: "from-pink-400 to-yellow-500",
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
      {selectedVocab ? (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <button
            className="mb-4 text-blue-600 hover:underline"
            onClick={() => setSelectedVocab(null)}
          >
            ← Back to all vocabularies
          </button>
          <h2 className="text-2xl font-bold mb-2">
            {selectedVocab.germanWord}{" "}
            <span className="text-lg text-gray-500">
              ({selectedVocab.wordType})
            </span>
          </h2>
          <div className="mb-2 text-gray-700">
            <strong>English:</strong> {selectedVocab.englishTranslation}
          </div>
          <div className="mb-2">
            <strong>Pronunciation:</strong> {selectedVocab.pronunciationIpa}
          </div>
          <div className="mb-2">
            <strong>Example (DE):</strong> {selectedVocab.exampleDe}
          </div>
          <div className="mb-2">
            <strong>Example (EN):</strong> {selectedVocab.exampleEn}
          </div>
          <div className="mb-2">
            <strong>Category:</strong> {selectedVocab.category}
          </div>
          <div className="mb-2">
            <strong>Tags:</strong> {selectedVocab.tags}
          </div>
          <div className="mb-2">
            <strong>Frequency:</strong> {selectedVocab.frequency} &nbsp;{" "}
            <strong>Level:</strong> {selectedVocab.level} &nbsp;{" "}
            <strong>Difficulty:</strong> {selectedVocab.difficulty}
          </div>
          {selectedVocab.verbStem && (
            <div className="mb-2">
              <strong>Verb Stem:</strong> {selectedVocab.verbStem}
            </div>
          )}
          {selectedVocab.verbType && (
            <div className="mb-2">
              <strong>Verb Type:</strong> {selectedVocab.verbType}
            </div>
          )}
          {selectedVocab.pastParticiple && (
            <div className="mb-2">
              <strong>Past Participle:</strong> {selectedVocab.pastParticiple}
            </div>
          )}
          {selectedVocab.comparative && (
            <div className="mb-2">
              <strong>Comparative:</strong> {selectedVocab.comparative}
            </div>
          )}
          {selectedVocab.superlative && (
            <div className="mb-2">
              <strong>Superlative:</strong> {selectedVocab.superlative}
            </div>
          )}
          {selectedVocab.governsCase && (
            <div className="mb-2">
              <strong>Governs Case:</strong> {selectedVocab.governsCase}
            </div>
          )}
          {selectedVocab.usageNotes && (
            <div className="mb-2">
              <strong>Usage Notes:</strong> {selectedVocab.usageNotes}
            </div>
          )}
          {selectedVocab.culturalNote && (
            <div className="mb-2">
              <strong>Cultural Note:</strong> {selectedVocab.culturalNote}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vocabularies.map((vocab) => (
            <div
              key={vocab.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedVocab(vocab)}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-pink-400 text-white font-bold text-lg">
                  {vocab.wordType.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vocab.germanWord}
                  </h3>
                  <div className="text-xs text-gray-500">
                    {vocab.englishTranslation}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2 line-clamp-3">
                {vocab.exampleDe}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Level: {vocab.level} · Difficulty: {vocab.difficulty}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default VocabulariesBetaPage;
