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

interface SkillsTabsProps {
  timelineData: any;
  technologiesData: any;
}

const SkillsTabs: React.FC<SkillsTabsProps> = ({ timelineData, technologiesData }) => {
  const [activeTab, setActiveTab] = useState('tech-usage');

  const tabs = [
    { id: 'tech-usage', label: 'Uso de Tecnologías' },
    { id: 'role-dist', label: 'Distribución de Roles' },
    { id: 'category-radar', label: 'Competencia por Categoría' },
    { id: 'exp-timeline', label: 'Línea de Tiempo de Experiencia' },
    { id: 'category-donut', label: 'Rosquilla de Categorías' },
    { id: 'role-duration-bar', label: 'Duración de Roles' },
    { id: 'projects-per-year', label: 'Proyectos por Año' },
    { id: 'implementation-type', label: 'Tipos de Implementación' },
    { id: 'company-projects', label: 'Proyectos por Compañía' },
    { id: 'tech-per-project', label: 'Tecnologías por Proyecto' },
    { id: 'frontend-vs-backend', label: 'Frontend vs. Backend' },
    { id: 'achievements', label: 'Hitos de Logros' },
    { id: 'tech-trend', label: 'Tendencia de Tecnologías' },
    { id: 'tech-heatmap', label: 'Mapa de Calor de Tecnologías' },
    { id: 'tech-polar-area', label: 'Categorías (Área Polar)' },
  ];

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
    <div className="w-full max-w-6xl mx-auto p-4 text-white">
      <div className="flex flex-wrap justify-center space-x-2 border-b border-gray-700 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px font-semibold text-gray-300 border-b-2 transition-colors duration-300
              ${activeTab === tab.id
                ? 'border-purple-500 text-white'
                : 'border-transparent hover:border-gray-500 hover:text-white'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-8 p-4 bg-gray-900 bg-opacity-50 rounded-lg shadow-lg">
        {renderChart()}
      </div>
    </div>
  );
};

export default SkillsTabs;
