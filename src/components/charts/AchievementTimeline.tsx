import React from 'react';

interface AchievementTimelineProps {
  timelineData: {
    jobs_history: Array<{
      type: string;
      company: string;
      start_date: string;
      description: string;
    }>;
  };
}

const AchievementTimeline: React.FC<AchievementTimelineProps> = ({ timelineData }) => {
  const achievements = timelineData.jobs_history
    .filter(job => job.type === 'logro')
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold text-center mb-8">Achievement Milestones</h2>
      <div className="relative border-l-2 border-purple-500 ml-6">
        {achievements.map((item, index) => (
          <div key={index} className="mb-8 ml-6">
            <div className="absolute -left-1.5 mt-1.5 w-3 h-3 bg-purple-500 rounded-full"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400">
              {new Date(item.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <h3 className="text-lg font-semibold text-white">{item.company}</h3>
            <p className="text-base font-normal text-gray-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementTimeline;
