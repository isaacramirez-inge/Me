import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CategoryRadarChartProps {
    technologiesData: Array<{
        id: number;
        name: string;
        category: string;
    }>;
    timelineData: {
        jobs_history: Array<{
            projects: Array<{
                technologies: number[];
            }>;
        }>;
    };
}

const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({ technologiesData, timelineData }) => {
    const categoryUsage = new Map<string, number>();

    const techIdsInProjects = new Set<number>();
    timelineData.jobs_history.forEach(job => {
        if (job.projects) {
            job.projects.forEach(project => {
                if (project.technologies) {
                    project.technologies.forEach(techId => {
                        techIdsInProjects.add(techId);
                    });
                }
            });
        }
    });

    techIdsInProjects.forEach(techId => {
        const tech = technologiesData.find(t => t.id === techId);
        if (tech) {
            categoryUsage.set(tech.category, (categoryUsage.get(tech.category) || 0) + 1);
        }
    });

  const labels = [...categoryUsage.keys()];
  const dataValues = [...categoryUsage.values()];

  const data = {
    labels,
    datasets: [
      {
        label: '# of Technologies Used in Projects',
        data: dataValues,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
            color: '#ffffff',
        }
      },
      title: {
        display: true,
        text: 'Technology Categories by Project Usage',
        color: '#ffffff',
      },
    },
    scales: {
      r: {
        angleLines: {
          color: '#444444'
        },
        grid: {
          color: '#444444'
        },
        pointLabels: {
          color: '#dddddd'
        },
        ticks: {
          color: '#dddddd',
          backdropColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  };

  return (
    <div className="relative h-96 w-full">
      <Radar data={data} options={options} />
    </div>
  );
};

export default CategoryRadarChart;
