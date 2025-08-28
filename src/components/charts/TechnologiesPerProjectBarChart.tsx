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

interface TechnologiesPerProjectBarChartProps {
  timelineData: {
    jobs_history: Array<{
      projects: Array<{
        project_name: string;
        technologies: number[];
      }>;
    }>;
  };
}

const TechnologiesPerProjectBarChart: React.FC<TechnologiesPerProjectBarChartProps> = ({ timelineData }) => {
    const projects = timelineData.jobs_history.flatMap(job => job.projects || []);

    const sortedProjects = projects.sort((a, b) => (b.technologies?.length || 0) - (a.technologies?.length || 0));

    const labels = sortedProjects.map(p => p.project_name);
    const dataValues = sortedProjects.map(p => p.technologies?.length || 0);

    const chartData = {
        labels,
        datasets: [
            {
                label: '# of Technologies',
                data: dataValues,
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Number of Technologies per Project',
                color: '#ffffff',
            },
        },
        scales: {
            x: {
                ticks: { color: '#dddddd', stepSize: 1 },
                grid: { color: '#444444' }
            },
            y: {
                ticks: { color: '#dddddd', font: { size: 8 } },
                grid: { color: '#444444' }
            }
        }
    };

    return (
        <div className="relative w-full" style={{ height: '600px', overflowY: 'auto' }}>
            <div style={{ height: `${labels.length * 25}px`, position: 'relative' }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default TechnologiesPerProjectBarChart;
