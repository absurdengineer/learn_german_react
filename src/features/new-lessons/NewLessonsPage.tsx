import React, { useState } from "react";
import { newLessonsLoader } from "../../lib/parsers/NewLessonsParser";
import type { NewLesson } from "../../types/NewLesson";
import PageLayout from "../../components/layout/PageLayout";
import MarkdownRenderer from "../../components/MarkdownRenderer";

const lessons: NewLesson[] = newLessonsLoader.load();

const NewLessonsPage: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<NewLesson | null>(null);

  return (
    <PageLayout
      pageData={{
        title: "New Lessons (Beta)",
        subtitle: "A1-A2 Learning Path (Experimental)",
        description:
          "Preview the new lesson structure. Content and features are in beta.",
        icon: "🧪",
        gradient: "from-yellow-400 to-pink-500",
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
      {selectedLesson ? (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <button
            className="mb-4 text-blue-600 hover:underline"
            onClick={() => setSelectedLesson(null)}
          >
            ← Back to all lessons
          </button>
          <h2 className="text-2xl font-bold mb-2">
            Day {selectedLesson.day}: {selectedLesson.title}
          </h2>
          <div className="text-gray-600 mb-2 font-medium">
            Theme: {selectedLesson.theme}
          </div>
          <div className="mb-4 text-gray-700">
            <MarkdownRenderer content={selectedLesson.introduction} />
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-1">Main Content</h3>
            <MarkdownRenderer content={selectedLesson.mainContent} />
          </div>
          {selectedLesson.successCriteria && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1">Success Criteria</h3>
              <MarkdownRenderer content={selectedLesson.successCriteria} />
            </div>
          )}
          {selectedLesson.culturalHighlight && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1">Cultural Highlight</h3>
              <MarkdownRenderer content={selectedLesson.culturalHighlight} />
            </div>
          )}
          {selectedLesson.motivationalNote && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1">Motivational Note</h3>
              <MarkdownRenderer content={selectedLesson.motivationalNote} />
            </div>
          )}
          {selectedLesson.hints && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1">Hints</h3>
              <MarkdownRenderer content={selectedLesson.hints} />
            </div>
          )}
          {selectedLesson.funFacts && (
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-1">Fun Facts</h3>
              <MarkdownRenderer content={selectedLesson.funFacts} />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedLesson(lesson)}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-400 text-white font-bold text-lg">
                  {lesson.day}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {lesson.title}
                  </h3>
                  <div className="text-xs text-gray-500">
                    Theme: {lesson.theme}
                  </div>
                </div>
              </div>
              <div className="prose prose-sm text-gray-600 mt-2 line-clamp-3">
                <MarkdownRenderer content={lesson.introduction} />
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Estimated time: {lesson.estimatedTime || 15} min · Difficulty:{" "}
                {lesson.difficultyLevel}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default NewLessonsPage;
