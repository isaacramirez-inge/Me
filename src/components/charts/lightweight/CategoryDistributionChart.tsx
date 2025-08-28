import React, { useEffect, useRef } from 'react';
import { createChart, HistogramSeries, LineStyle } from 'lightweight-charts';
import type { Technology } from '../../../types/types';

interface Props {
  technologies: Technology[];
}

const CategoryDistributionChart: React.FC<Props> = ({ technologies }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || technologies.length === 0) return;

    // Process data
    const categoryCounts: { [key: string]: number } = technologies.reduce((acc, tech) => {
      acc[tech.category] = (acc[tech.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const data = Object.entries(categoryCounts).map(([category, count], index) => ({
      time: index, // lightweight-charts requires a 'time' field
      value: count,
      color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
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
        // We are using index as time, so we need to format the tick marks
        tickMarkFormatter: (time: number) => {
            return Object.keys(categoryCounts)[time] || '';
        },
      },
    });

    const histogramSeries = chart.addHistogramSeries({
        base: 0,
    });

    histogramSeries.setData(data);

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

export default CategoryDistributionChart;
