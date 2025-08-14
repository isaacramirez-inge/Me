import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  timeline: { jobs_history: MainCardData[] };
}

const ProjectsPerYearChart: React.FC<Props> = ({ timeline }) => {
  if (timeline.jobs_history.length === 0) return null;

  // Process data
  const projectsPerYear: { [year: string]: number } = {};
  timeline.jobs_history.forEach(job => {
    job.projects.forEach(project => {
      const year = new Date(project.project_role_timeline[0].start_date).getFullYear().toString();
      projectsPerYear[year] = (projectsPerYear[year] || 0) + 1;
    });
  });

  const chartData = Object.entries(projectsPerYear)
    .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(([year]) => year),
      axisLine: { lineStyle: { color: '#fff' } }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#fff' } }
    },
    series: [{
      name: 'Projects',
      type: 'bar',
      data: chartData.map(([, count]) => count),
      itemStyle: {
        color: '#009688'
      }
    }]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default ProjectsPerYearChart;
