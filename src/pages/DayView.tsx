import { Link, useParams } from 'react-router-dom';

const DayView = () => {
  const { day } = useParams<{ day: string }>();
  const dayNumber = parseInt(day || '1', 10);

  if (!dayNumber) {
    return <div>Day not found</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <Link to="/study-plan" className="text-blue-500 hover:underline">
          &larr; Back to Study Plan
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-2">
        Day {dayNumber}
      </h1>
    </div>
  );
};

export default DayView;