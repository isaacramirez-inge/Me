import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { Technology } from '../../../types/types';

interface Props {
  technologies: Technology[];
}

const CategoryDistributionChart: React.FC<Props> = ({ technologies }) => {
  if (technologies.length === 0) return null;

  // Process data
  const categoryCounts: { [key: string]: number } = technologies.reduce((acc, tech) => {
    acc[tech.category] = (acc[tech.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const data = Object.entries(categoryCounts).map(([name, value]) => ({
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
        name: 'Technology Category',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default CategoryDistributionChart;
