import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface FrontendVsBackendPieChartProps {
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

const FrontendVsBackendPieChart: React.FC<FrontendVsBackendPieChartProps> = ({ technologiesData, timelineData }) => {
    let frontendCount = 0;
    let backendCount = 0;

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
            if (tech.category === 'Frontend') {
                frontendCount++;
            } else if (tech.category === 'Backend') {
                backendCount++;
            }
        }
    });

    const chartData = {
        labels: ['Frontend', 'Backend'],
        datasets: [
            {
                label: '# of Technologies',
                data: [frontendCount, backendCount],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                ],
                borderColor: '#ffffff',
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
                text: 'Frontend vs. Backend Technologies Used in Projects',
                color: '#ffffff',
            },
        },
    };

    return <Pie data={chartData} options={options} />;
};

export default FrontendVsBackendPieChart;
