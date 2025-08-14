import React, { useEffect, useRef } from 'react';
import { createChart, AreaSeries, LineStyle } from 'lightweight-charts';
import type { Technology } from '../../../types/types';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  technologies: Technology[];
  timeline: { jobs_history: MainCardData[] };
}

const TechUsageOverTimeChart: React.FC<Props> = ({ technologies, timeline }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || technologies.length === 0 || timeline.jobs_history.length === 0) return;

    // Data processing
    const yearlyCategoryUsage: { [year: number]: { [category: string]: Set<number> } } = {};

    timeline.jobs_history.forEach(job => {
      job.projects.forEach(project => {
        const projectYear = new Date(project.project_role_timeline[0].start_date).getFullYear();
        if (!yearlyCategoryUsage[projectYear]) {
          yearlyCategoryUsage[projectYear] = {};
        }
        project.technologies.forEach(techId => {
          const techInfo = technologies.find(t => t.id === techId);
          if (techInfo) {
            if (!yearlyCategoryUsage[projectYear][techInfo.category]) {
              yearlyCategoryUsage[projectYear][techInfo.category] = new Set();
            }
            yearlyCategoryUsage[projectYear][techInfo.category].add(techId);
          }
        });
      });
    });

    const categories = [...new Set(technologies.map(t => t.category))];
    const seriesData: { [category: string]: { time: string; value: number }[] } = {};
    categories.forEach(cat => seriesData[cat] = []);

    Object.keys(yearlyCategoryUsage).sort().forEach(yearStr => {
        const year = parseInt(yearStr);
        categories.forEach(cat => {
            const count = yearlyCategoryUsage[year][cat] ? yearlyCategoryUsage[year][cat].size : 0;
            seriesData[cat].push({ time: `${year}-01-01`, value: count });
        });
    });

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: 'transparent' },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
        horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
      },
    });

    const colors = ['#2962FF', '#FF6D00', '#2E7D32', '#D50000', '#6200EA', '#0091EA', '#FFAB00'];
    let colorIndex = 0;

    categories.forEach(cat => {
      if (seriesData[cat].length > 0) {
        const color = colors[colorIndex % colors.length];
        colorIndex++;
        const areaSeries = chart.addAreaSeries({
          topColor: `${color}B3`, // 70% opacity
          bottomColor: `${color}00`, // 0% opacity
          lineColor: color,
          lineWidth: 2,
        });
        areaSeries.setData(seriesData[cat]);
      }
    });

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.resize(chartContainerRef.current.clientWidth, 400);
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

export default TechUsageOverTimeChart;
