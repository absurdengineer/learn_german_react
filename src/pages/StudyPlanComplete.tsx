import { Link } from 'react-router-dom';

const StudyPlanComplete = () => {
  return (
    <div className="p-4 md:p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">Congratulations!</h1>
      <p className="text-lg text-gray-600 mb-6">
        You have completed this section of your study plan. Keep up the great work!
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/study-plan"
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to Study Plan
        </Link>
        <Link
          to="/"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default StudyPlanComplete;
