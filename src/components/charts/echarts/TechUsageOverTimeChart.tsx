import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { Technology } from '../../../types/types';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  technologies: Technology[];
  timeline: { jobs_history: MainCardData[] };
}

const TechUsageOverTimeChart: React.FC<Props> = ({ technologies, timeline }) => {
  if (technologies.length === 0 || timeline.jobs_history.length === 0) return null;

  // Data processing
  const yearlyCategoryUsage: { [year: string]: { [category: string]: Set<number> } } = {};
  const allYears = new Set<string>();
  const allCategories = new Set<string>();

  timeline.jobs_history.forEach(job => {
    job.projects.forEach(project => {
      const year = new Date(project.project_role_timeline[0].start_date).getFullYear().toString();
      allYears.add(year);
      if (!yearlyCategoryUsage[year]) {
        yearlyCategoryUsage[year] = {};
      }
      project.technologies.forEach(techId => {
        const techInfo = technologies.find(t => t.id === techId);
        if (techInfo) {
          allCategories.add(techInfo.category);
          if (!yearlyCategoryUsage[year][techInfo.category]) {
            yearlyCategoryUsage[year][techInfo.category] = new Set();
          }
          yearlyCategoryUsage[year][techInfo.category].add(techId);
        }
      });
    });
  });

  const sortedYears = Array.from(allYears).sort();
  const sortedCategories = Array.from(allCategories);

  const series = sortedCategories.map(category => ({
    name: category,
    type: 'line',
    stack: 'Total',
    areaStyle: {},
    emphasis: {
      focus: 'series'
    },
    data: sortedYears.map(year => {
      return yearlyCategoryUsage[year]?.[category]?.size || 0;
    })
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: sortedCategories,
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: sortedYears,
        axisLine: { lineStyle: { color: '#fff' } }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: { lineStyle: { color: '#fff' } }
      }
    ],
    series: series
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default TechUsageOverTimeChart;
