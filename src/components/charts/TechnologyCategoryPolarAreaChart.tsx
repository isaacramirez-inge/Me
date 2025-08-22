import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface TechnologyCategoryPolarAreaChartProps {
    technologiesData: Array<{
        id: number;
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

const TechnologyCategoryPolarAreaChart: React.FC<TechnologyCategoryPolarAreaChartProps> = ({ technologiesData, timelineData }) => {
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

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Technologies per Category',
                data: dataValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(199, 199, 199, 0.5)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: { color: '#ffffff' }
            },
            title: {
                display: true,
                text: 'Technology Categories (Polar Area)',
                color: '#ffffff'
            },
        },
        scales: {
            r: {
                angleLines: { color: '#444' },
                grid: { color: '#444' },
                pointLabels: { color: '#ddd' },
                ticks: { color: '#ddd', backdropColor: 'rgba(0,0,0,0.5)' }
            }
        }
    };

    return (
        <PolarArea data={chartData} options={options} />
    );
};

export default TechnologyCategoryPolarAreaChart;
