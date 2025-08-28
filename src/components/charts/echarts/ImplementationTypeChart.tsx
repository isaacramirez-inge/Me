import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  timeline: { jobs_history: MainCardData[] };
}

const ImplementationTypeChart: React.FC<Props> = ({ timeline }) => {
  if (timeline.jobs_history.length === 0) return null;

  // Process data
  const implementationTypes: { [type: string]: number } = {};
  timeline.jobs_history.forEach(job => {
    job.projects.forEach(project => {
      const type = project.implementation_type;
      implementationTypes[type] = (implementationTypes[type] || 0) + 1;
    });
  });

  const data = Object.entries(implementationTypes).map(([name, value]) => ({
    name,
    value,
  }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: data.map(d => d.name),
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: 'Implementation Type',
        type: 'pie',
        radius: '70%',
        center: ['50%', '60%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default ImplementationTypeChart;
