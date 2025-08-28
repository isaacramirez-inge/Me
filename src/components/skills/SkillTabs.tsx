import React, { useState } from 'react';
import TechnologyBarChart from '../charts/TechnologyBarChart';
import RolePieChart from '../charts/RolePieChart';
import CategoryRadarChart from '../charts/CategoryRadarChart';
import ExperienceTimeline from '../charts/ExperienceTimeline';
import TechnologyCategoryDonut from '../charts/TechnologyCategoryDonut';
import RoleDurationBarChart from '../charts/RoleDurationBarChart';
import ProjectsPerYearBarChart from '../charts/ProjectsPerYearBarChart';
import ImplementationTypePieChart from '../charts/ImplementationTypePieChart';
import CompanyProjectsBarChart from '../charts/CompanyProjectsBarChart';
import TechnologiesPerProjectBarChart from '../charts/TechnologiesPerProjectBarChart';
import FrontendVsBackendPieChart from '../charts/FrontendVsBackendPieChart';
import AchievementTimeline from '../charts/AchievementTimeline';
import TechnologyTrendLineChart from '../charts/TechnologyTrendLineChart';
import TechnologyHeatmap from '../charts/TechnologyHeatmap';
import TechnologyCategoryPolarAreaChart from '../charts/TechnologyCategoryPolarAreaChart';
import type { Metrics } from '../../assets/metrics/metrics';

interface SkillsTabsProps {
  tabs: ChartData[];
  timelineData: any;
  technologiesData: any;
  m: Metrics;
}
export interface ChartData{
  id: string;
  label: string;
  show: boolean;
  order: number;
}

const SkillsTabs: React.FC<SkillsTabsProps> = ({ tabs, timelineData, technologiesData, m }) => {
  const [activeTab, setActiveTab] = useState('tech-usage');

  const renderChart = () => {
    switch (activeTab) {
      case 'tech-usage':
        return <TechnologyBarChart timelineData={timelineData} technologiesData={technologiesData} />;
      case 'role-dist':
        return <RolePieChart timelineData={timelineData} />;
      case 'category-radar':
        return <CategoryRadarChart timelineData={timelineData} technologiesData={technologiesData} />;
      case 'exp-timeline':
        return <ExperienceTimeline timelineData={timelineData} />;
      case 'category-donut':
        return <TechnologyCategoryDonut timelineData={timelineData} technologiesData={technologiesData} />;
      case 'role-duration-bar':
        return <RoleDurationBarChart timelineData={timelineData} />;
      case 'projects-per-year':
        return <ProjectsPerYearBarChart timelineData={timelineData} />;
      case 'implementation-type':
        return <ImplementationTypePieChart timelineData={timelineData} />;
      case 'company-projects':
        return <CompanyProjectsBarChart timelineData={timelineData} />;
      case 'tech-per-project':
        return <TechnologiesPerProjectBarChart timelineData={timelineData} />;
      case 'frontend-vs-backend':
        return <FrontendVsBackendPieChart timelineData={timelineData} technologiesData={technologiesData} />;
      case 'achievements':
        return <AchievementTimeline timelineData={timelineData} />;
      case 'tech-trend':
        return <TechnologyTrendLineChart timelineData={timelineData} technologiesData={technologiesData} />;
      case 'tech-heatmap':
        return <TechnologyHeatmap timelineData={timelineData} technologiesData={technologiesData} />;
      case 'tech-polar-area':
        return <TechnologyCategoryPolarAreaChart timelineData={timelineData} technologiesData={technologiesData} />;
      default:
        return <TechnologyBarChart timelineData={timelineData} technologiesData={technologiesData} />;
    }
  };

  return (
    <div className={`w-full h-full  flex flex-row xs:flex-col mx-auto text-white xs:mt-[15%]`}>
      <div className="flex flex-col xs:flex-row xs:w-full xs:flex-wrap xs:gap-[5px] xs:h-auto xs:pt-2 h-full w-1/4 items-end justify-center overflow-y-auto scrollbar-white mb-4">
        {tabs.filter(x => x.show).sort((a, b) => a.order - b.order).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`-mb-px font-semibold text-white/80 transition-colors duration-300 xs:text-xs
              ${activeTab === tab.id
                ? 'border-0 rounded-none border-b-4 border-b-purple-500 text-white'
                : 'border-2 border-transparent rounded-none hover:border-0 hover:border-b-2 hover:border-gray-500 hover:text-white'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center mb-[5%] pt-[20%] items-center xs:w-full xs:h-[100dvh] h-full max-h-full w-3/4 p-4 bg-gray-900 bg-opacity-50 rounded-lg shadow-lg">
        {renderChart()}
      </div>
    </div>
  );
};

export default SkillsTabs;
