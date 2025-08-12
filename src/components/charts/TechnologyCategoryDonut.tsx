import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TechnologyCategoryDonutProps {
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

const TechnologyCategoryDonut: React.FC<TechnologyCategoryDonutProps> = ({ technologiesData, timelineData }) => {
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
                label: '# of Technologies Used',
                data: dataValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(199, 199, 199, 0.8)',
                    'rgba(83, 102, 255, 0.8)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    '#ffffff'
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: '#ffffff',
                    boxWidth: 20,
                    padding: 20,
                }
            },
            title: {
                display: true,
                text: 'Technology Categories by Project Usage',
                color: '#ffffff',
                font: {
                    size: 18,
                }
            },
        },
    };

    return <Doughnut data={chartData} options={options} />;
};

export default TechnologyCategoryDonut;
