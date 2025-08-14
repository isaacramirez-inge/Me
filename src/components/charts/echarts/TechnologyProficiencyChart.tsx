import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { Technology } from '../../../types/types';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  technologies: Technology[];
  timeline: { jobs_history: MainCardData[] };
}

const TechnologyProficiencyChart: React.FC<Props> = ({ technologies, timeline }) => {
  if (technologies.length === 0) return null;

  // Process data
  const techProficiency: { [key: number]: number } = {};
  timeline.jobs_history.forEach(job => {
    job.projects.forEach(project => {
      project.technologies.forEach(techId => {
        techProficiency[techId] = (techProficiency[techId] || 0) + 1;
      });
    });
  });

  const chartData = Object.entries(techProficiency)
    .map(([id, count]) => {
      const techInfo = technologies.find(t => t.id === parseInt(id));
      return {
        name: techInfo?.name || `Unknown (${id})`,
        value: count,
        category: techInfo?.category || 'Unknown',
      };
    })
    .sort((a, b) => a.value - b.value); // Sort for horizontal bar chart

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
        show: false
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLine: { lineStyle: { color: '#fff' } }
    },
    yAxis: {
      type: 'category',
      data: chartData.map(d => d.name),
      axisLine: { lineStyle: { color: '#fff' } }
    },
    series: [
      {
        name: 'Projects',
        type: 'bar',
        data: chartData.map(d => d.value),
        itemStyle: {
            color: '#2962FF'
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: `${chartData.length * 25}px`, minHeight: '400px', width: '100%' }} />;
};

export default TechnologyProficiencyChart;
