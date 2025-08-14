import React, { useEffect, useRef } from 'react';
import { createChart, BarSeries } from 'lightweight-charts';
import type { Technology } from '../../../types/types';

interface Props {
  technologies: Technology[];
}

const FrontendBackendFocusChart: React.FC<Props> = ({ technologies }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || technologies.length === 0) return;

    // Process data
    const focusCounts = {
      'Frontend': 0,
      'Backend': 0,
    };

    technologies.forEach(tech => {
      if (tech.category === 'Frontend') {
        focusCounts['Frontend']++;
      } else if (tech.category === 'Backend') {
        focusCounts['Backend']++;
      }
    });

    const data = [
      { time: 0, value: focusCounts['Frontend'], color: 'rgba(41, 98, 255, 0.7)' },
      { time: 1, value: focusCounts['Backend'], color: 'rgba(255, 69, 0, 0.7)' },
    ];

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
            return time === 0 ? 'Frontend' : 'Backend';
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
  }, [technologies]);

  return <div ref={chartContainerRef} />;
};

export default FrontendBackendFocusChart;
