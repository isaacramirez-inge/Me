import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { Technology } from '../../../types/types';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  technologies: Technology[];
  timeline: { jobs_history: MainCardData[] };
}

const RadarChart: React.FC<Props> = ({ technologies, timeline }) => {
  if (technologies.length === 0) return null;

  const targetCategories = ['Cloud', 'DevOps', 'CI/CD', 'Server', 'Networking', 'Security'];

  // Process data
  const techProficiency: { [key: number]: number } = {};
  timeline.jobs_history.forEach(job => {
    job.projects.forEach(project => {
      project.technologies.forEach(techId => {
        techProficiency[techId] = (techProficiency[techId] || 0) + 1;
      });
    });
  });

  const radarData = targetCategories.map(category => {
    const techsInCategory = technologies.filter(t => t.category === category);
    const totalProficiency = techsInCategory.reduce((acc, tech) => {
      return acc + (techProficiency[tech.id] || 0);
    }, 0);
    return { name: category, max: 10, value: totalProficiency }; // 'max' can be adjusted based on expected scale
  });

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['Skills'],
      textStyle: {
        color: '#fff'
      }
    },
    radar: {
      indicator: radarData.map(d => ({ name: d.name, max: d.max })),
      shape: 'circle',
      axisName: {
        color: '#fff'
      }
    },
    series: [{
      name: 'Cloud & DevOps Skills',
      type: 'radar',
      data: [
        {
          value: radarData.map(d => d.value),
          name: 'Skills'
        }
      ]
    }]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default RadarChart;
