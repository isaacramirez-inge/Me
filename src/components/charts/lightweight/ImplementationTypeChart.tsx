import React, { useEffect, useRef } from 'react';
import { createChart, BarSeries } from 'lightweight-charts';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  timeline: { jobs_history: MainCardData[] };
}

const ImplementationTypeChart: React.FC<Props> = ({ timeline }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || timeline.jobs_history.length === 0) return;

    // Process data
    const implementationTypes: { [type: string]: number } = {};
    timeline.jobs_history.forEach(job => {
      job.projects.forEach(project => {
        const type = project.implementation_type;
        implementationTypes[type] = (implementationTypes[type] || 0) + 1;
      });
    });

    const data = Object.entries(implementationTypes).map(([type, count], index) => ({
      time: index,
      value: count,
      color: `rgba(${Math.random() * 150 + 50}, ${Math.random() * 150 + 50}, ${Math.random() * 150 + 50}, 0.7)`,
    }));

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
        horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
      },
      timeScale: {
        tickMarkFormatter: (time: number) => {
            return Object.keys(implementationTypes)[time] || '';
        },
      },
    });

    const barSeries = chart.addBarSeries({
      thinBars: false,
    });

    barSeries.setData(data);

    chart.timeScale().fitContent();

    const handleResize = () => {
        if (chartContainerRef.current) {
            chart.resize(chartContainerRef.current.clientWidth, 300);
        }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [timeline]);

  return <div ref={chartContainerRef} />;
};

export default ImplementationTypeChart;
