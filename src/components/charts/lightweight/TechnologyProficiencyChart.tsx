import React, { useEffect, useRef } from 'react';
import { createChart, BarSeries } from 'lightweight-charts';
import type { Technology } from '../../../types/types';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  technologies: Technology[];
  timeline: { jobs_history: MainCardData[] };
}

const TechnologyProficiencyChart: React.FC<Props> = ({ technologies, timeline }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || technologies.length === 0) return;

    // Process data to count project usage for each technology
    const techProficiency: { [key: number]: number } = {};
    timeline.jobs_history.forEach(job => {
      job.projects.forEach(project => {
        project.technologies.forEach(techId => {
          techProficiency[techId] = (techProficiency[techId] || 0) + 1;
        });
      });
    });

    const sortedTech = Object.entries(techProficiency)
      .sort(([, a], [, b]) => b - a)
      .map(([id]) => parseInt(id));

    const data = sortedTech.map((techId, index) => {
      const techInfo = technologies.find(t => t.id === techId);
      return {
        time: index, // Use index for time
        value: techProficiency[techId],
        color: techInfo?.bg_color || `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)`,
      };
    });

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 800, // Taller chart to accommodate more bars
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
            const techId = sortedTech[time];
            const techInfo = technologies.find(t => t.id === techId);
            return techInfo?.name || '';
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
            chart.resize(chartContainerRef.current.clientWidth, 800);
        }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [technologies, timeline]);

  return <div ref={chartContainerRef} />;
};

export default TechnologyProficiencyChart;
