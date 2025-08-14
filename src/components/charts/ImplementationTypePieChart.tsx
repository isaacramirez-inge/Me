import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ImplementationTypePieChartProps {
  timelineData: {
    jobs_history: Array<{
      projects: Array<{
        implementation_type: string;
      }>;
    }>;
  };
}

const ImplementationTypePieChart: React.FC<ImplementationTypePieChartProps> = ({ timelineData }) => {
    const implementationTypes = new Map<string, number>();

    timelineData.jobs_history.forEach(job => {
        if (job.projects) {
            job.projects.forEach(project => {
                const type = project.implementation_type;
                if (type) {
                    implementationTypes.set(type, (implementationTypes.get(type) || 0) + 1);
                }
            });
        }
    });

    const labels = [...implementationTypes.keys()];
    const dataValues = [...implementationTypes.values()];

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Number of Projects',
                data: dataValues,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
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
                position: 'right' as const,
                labels: {
                    color: '#ffffff',
                }
            },
            title: {
                display: true,
                text: 'Project Implementation Types',
                color: '#ffffff',
            },
        },
    };

    return (
        <div className="relative h-96 w-full">
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default ImplementationTypePieChart;
