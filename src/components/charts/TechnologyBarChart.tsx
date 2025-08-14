import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TechnologyBarChartProps {
  technologiesData: Array<{
    id: number;
    name: string;
    bg_color: string;
    border_color: string;
  }>;
  timelineData: {
    jobs_history: Array<{
      projects: Array<{
        technologies: number[];
      }>;
    }>;
  };
}

const TechnologyBarChart: React.FC<TechnologyBarChartProps> = ({ technologiesData, timelineData }) => {
  const technologyUsage = new Map<number, number>();

  timelineData.jobs_history.forEach(job => {
    if (job.projects) {
      job.projects.forEach(project => {
        if (project.technologies) {
          project.technologies.forEach(techId => {
            technologyUsage.set(techId, (technologyUsage.get(techId) || 0) + 1);
          });
        }
      });
    }
  });

  const sortedTechnologies = [...technologyUsage.entries()].sort((a, b) => b[1] - a[1]);

  const labels = sortedTechnologies.map(([techId]) => {
    const tech = technologiesData.find(t => t.id === techId);
    return tech ? tech.name : 'Unknown';
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Technology Usage in Projects',
        data: sortedTechnologies.map(([, count]) => count),
        backgroundColor: sortedTechnologies.map(([techId]) => {
          const tech = technologiesData.find(t => t.id === techId);
          return tech ? tech.bg_color : '#cccccc';
        }),
        borderColor: sortedTechnologies.map(([techId]) => {
          const tech = technologiesData.find(t => t.id === techId);
          return tech ? tech.border_color : '#aaaaaa';
        }),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
            color: '#ffffff', // White text for legend
        }
      },
      title: {
        display: true,
        text: 'Technology Usage Frequency',
        color: '#ffffff', // White text for title
      },
    },
    scales: {
        x: {
            ticks: {
                color: '#dddddd', // Light grey text for x-axis labels
            },
            grid: {
                color: '#444444', // Darker grid lines for x-axis
            }
        },
        y: {
            ticks: {
                color: '#dddddd', // Light grey text for y-axis labels
            },
            grid: {
                color: '#444444', // Darker grid lines for y-axis
            }
        }
    }
  };

  return (
    <div className="relative h-96 w-full">
      <Bar options={options} data={data} />
    </div>
  );
};

export default TechnologyBarChart;
