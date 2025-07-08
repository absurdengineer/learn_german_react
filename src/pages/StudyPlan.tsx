
import { useState } from 'react';
import studyPlanData from '../../data/studyPlan.json';
import { Link } from 'react-router-dom';

const StudyPlan = () => {
  const [selectedWeek, setSelectedWeek] = useState(studyPlanData.weeks[0]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-4">Study Plan</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Weeks</h2>
        <div className="flex space-x-2">
          {studyPlanData.weeks.map((week) => (
            <button
              key={week.week}
              onClick={() => setSelectedWeek(week)}
              className={`px-4 py-2 rounded-md ${
                selectedWeek.week === week.week
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Week {week.week}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">{selectedWeek.title}</h2>
        <p className="mb-4">{selectedWeek.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedWeek.days.map((dayNumber) => {
            const day = studyPlanData.STUDY_PLAN.find(
              (d) => d.day === dayNumber
            );
            if (!day) return null;
            return (
              <Link
                to={`/study-plan/day/${day.day}`}
                key={day.day}
                className="p-4 border rounded-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold">
                  Day {day.day}: {day.title}
                </h3>
                <p>{day.description}</p>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    {day.estimatedTime} min | {day.difficulty}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;
