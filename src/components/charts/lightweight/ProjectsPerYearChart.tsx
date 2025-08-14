import React, { useEffect, useRef } from 'react';
import { createChart, BarSeries } from 'lightweight-charts';
import type { MainCardData } from '../../../components/_react/timeline/TimelineTypes';

interface Props {
  timeline: { jobs_history: MainCardData[] };
}

const ProjectsPerYearChart: React.FC<Props> = ({ timeline }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || timeline.jobs_history.length === 0) return;

    // Process data
    const projectsPerYear: { [year: number]: number } = {};
    timeline.jobs_history.forEach(job => {
      job.projects.forEach(project => {
        const year = new Date(project.project_role_timeline[0].start_date).getFullYear();
        projectsPerYear[year] = (projectsPerYear[year] || 0) + 1;
      });
    });

    const data = Object.entries(projectsPerYear)
      .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB))
      .map(([year, count]) => ({
        time: `${year}-01-01`,
        value: count,
        color: 'rgba(0, 150, 136, 0.7)',
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
        borderColor: 'rgba(197, 203, 206, 0.8)',
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

export default ProjectsPerYearChart;
