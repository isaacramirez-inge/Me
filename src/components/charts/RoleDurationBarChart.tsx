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

interface RoleDurationBarChartProps {
  timelineData: {
    jobs_history: Array<{
      type: string;
      job_roles: Array<{
        job_role: string;
        start_date: string;
        end_date: string | null;
        actually: boolean;
      }>;
    }>;
  };
}

const RoleDurationBarChart: React.FC<RoleDurationBarChartProps> = ({ timelineData }) => {
    const roleDurations = new Map<string, number>();

    timelineData.jobs_history.forEach(job => {
        if (job.type === 'empresa' && job.job_roles) {
            job.job_roles.forEach(role => {
                const startParts = role.start_date.split('-');
                let sDate;
                if (startParts[0].length === 4) { // YYYY-MM-DD
                    sDate = new Date(role.start_date);
                } else { // DD-MM-YYYY
                    sDate = new Date(parseInt(startParts[2]), parseInt(startParts[1]) - 1, parseInt(startParts[0]));
                }

                let eDate;
                if (role.end_date) {
                    const endParts = role.end_date.split('-');
                    if (endParts[0].length === 4) { // YYYY-MM-DD
                        eDate = new Date(role.end_date);
                    } else { // DD-MM-YYYY
                        eDate = new Date(parseInt(endParts[2]), parseInt(endParts[1]) - 1, parseInt(endParts[0]));
                    }
                } else {
                    eDate = new Date(); // now
                }

                if(!sDate.getTime() || !eDate.getTime()) return;

                const durationInMonths = (eDate.getFullYear() - sDate.getFullYear()) * 12 + (eDate.getMonth() - sDate.getMonth());

                roleDurations.set(role.job_role, (roleDurations.get(role.job_role) || 0) + durationInMonths);
            });
        }
    });

    const sortedRoles = [...roleDurations.entries()].sort((a, b) => a[1] - b[1]);

    const labels = sortedRoles.map(role => role[0]);
    const dataValues = sortedRoles.map(role => role[1]);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Duration (months)',
                data: dataValues,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Duration of Roles (in months)',
                color: '#ffffff',
            },
        },
        scales: {
            x: {
                ticks: { color: '#dddddd' },
                grid: { color: '#444444' }
            },
            y: {
                ticks: { color: '#dddddd' },
                grid: { color: '#444444' }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default RoleDurationBarChart;
