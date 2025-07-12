import React from 'react';

interface MissionCardProps {
  mission: string;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission }) => {
  // Split the string by the literal characters '\n'
  const missionItems = mission.split(/\\n/g).map(item => item.trim());

  return (
    <div className="text-gray-600 text-sm">
      <ol className="list-decimal pl-5">
        {missionItems.map((item, index) => (
          <li key={index} className="mb-1">{item.replace(/^\d+\.\s*/, '')}</li>
        ))}
      </ol>
    </div>
  );
};

export default MissionCard;