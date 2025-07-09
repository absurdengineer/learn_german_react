import { Link, useParams } from 'react-router-dom';
import { loadVocabulary } from '../../data';
import studyPlanData from '../../data/studyPlan.json';
import type { LevelType } from '../../domain/entities/User';
import { VocabularyWord, type WordType } from '../../domain/entities/Vocabulary';
import type { Gender } from '../../types';
import { getGenderColor } from '../../utils/genderColors';

interface Exercise {
  id: string;
  type: string;
  title: string;
  description: string;
  estimatedTime: number;
}

interface DayData {
  day: number;
  title: string;
  description: string;
  focusAreas: string[];
  vocabularyWords: string[];
  grammarTopics: string[];
  exercises: Exercise[];
  estimatedTime: number;
  difficulty: string;
}

interface ExerciseType {
  icon: string;
  name: string;
}

interface StudyPlanData {
  STUDY_PLAN: DayData[];
  exerciseTypes: Record<string, ExerciseType>;
}

const DayView = () => {
  const { day } = useParams<{ day: string }>();
  const dayNumber = parseInt(day || '1', 10);
  const typedStudyPlanData = studyPlanData as StudyPlanData;
  
  const dayData = typedStudyPlanData.STUDY_PLAN.find(
    (d: DayData): d is DayData => d.day === dayNumber
  );

  if (!dayData) {
    return <div>Day not found</div>;
  }

  const vocabulary = loadVocabulary();
  
  const vocabularyList: VocabularyWord[] = dayData.vocabularyWords
    .map((wordId) => {
      const wordData = vocabulary.find((v) => v.id === wordId);
      if (wordData) {
        return VocabularyWord.create({
          german: wordData.german,
          english: wordData.english,
          type: wordData.type as WordType,
          level: wordData.level as LevelType,
          gender: wordData.gender as Gender,
          pronunciation: wordData.pronunciation,
          tags: wordData.tags,
          frequency: wordData.frequency,
          exampleSentences: wordData.examples?.map(ex => ({
            german: ex.german,
            english: ex.english,
            audioUrl: undefined
          })) || []
        });
      }
      return null;
    })
    .filter((word): word is VocabularyWord => !!word);
    
  const lastDayInPlan = Math.max(...typedStudyPlanData.STUDY_PLAN.map((d: DayData) => d.day));
  const isLastAvailableDay = dayNumber === lastDayInPlan;

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <Link to="/study-plan" className="text-blue-500 hover:underline">
          &larr; Back to Study Plan
        </Link>
        {isLastAvailableDay ? (
          <Link
            to="/study-plan/complete"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Finish &rarr;
          </Link>
        ) : (
          <Link
            to={`/study-plan/day/${dayNumber + 1}`}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Next Day &rarr;
          </Link>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-2">
        Day {dayData.day}: {dayData.title}
      </h1>
      <p className="text-lg text-gray-600 mb-6">{dayData.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Focus Areas</h3>
          <ul className="space-y-1">
            {dayData.focusAreas.map((area: string) => (
              <li key={area} className="text-gray-700">
                {area.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Grammar Topics</h3>
          <ul className="space-y-1">
            {dayData.grammarTopics.map((topic: string) => (
              <li key={topic} className="text-gray-700">
                {topic.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg mb-2">Estimated Time</h3>
          <p className="text-3xl font-bold text-blue-500">
            {dayData.estimatedTime}
            <span className="text-lg ml-1">min</span>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Vocabulary to Learn</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {vocabularyList.map((vocab) => (
            <div
              key={vocab.id.toString()}
              className="p-3 border rounded-md text-center"
              style={{
                borderLeft: `4px solid ${getGenderColor(vocab.gender as Gender)}`,
              }}
            >
              <p className="font-bold">{vocab.german}</p>
              <p className="text-sm text-gray-500">{vocab.english}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Exercises</h2>
        <ul className="space-y-4">
          {dayData.exercises.map((exercise) => {
            const exerciseType = typedStudyPlanData.exerciseTypes[exercise.type];
            return (
              <li
                key={exercise.id}
                className="p-4 border rounded-md flex items-start bg-white shadow-sm"
              >
                <span className="text-3xl mr-4">{exerciseType.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold">{exercise.title}</h3>
                  <p className="text-gray-600">{exercise.description}</p>
                  <span className="text-sm text-gray-500 mt-1 inline-block">
                    {exercise.estimatedTime} min
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DayView;