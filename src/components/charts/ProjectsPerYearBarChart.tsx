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

interface ProjectsPerYearBarChartProps {
  timelineData: {
    jobs_history: Array<{
      projects: Array<{
        project_role_timeline: Array<{
          start_date: string;
        }>;
      }>;
    }>;
  };
}

const ProjectsPerYearBarChart: React.FC<ProjectsPerYearBarChartProps> = ({ timelineData }) => {
    const projectsPerYear = new Map<number, number>();

    timelineData.jobs_history.forEach(job => {
        if (job.projects) {
            job.projects.forEach(project => {
                if (project.project_role_timeline && project.project_role_timeline.length > 0) {
                    const startDateStr = project.project_role_timeline[0].start_date;
                    const startParts = startDateStr.split('-');
                    let year;

                    if (startParts[0].length === 4) { // YYYY-MM-DD
                        year = parseInt(startParts[0]);
                    } else if (startParts.length === 3) { // DD-MM-YYYY
                        year = parseInt(startParts[2]);
                    } else {
                        return; // Invalid date format
                    }

                    if (!isNaN(year)) {
                        projectsPerYear.set(year, (projectsPerYear.get(year) || 0) + 1);
                    }
                }
            });
        }
    });

    const sortedYears = [...projectsPerYear.entries()].sort((a, b) => a[0] - b[0]);

    const labels = sortedYears.map(entry => entry[0]);
    const dataValues = sortedYears.map(entry => entry[1]);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Number of Projects',
                data: dataValues,
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Projects Started Per Year',
                color: '#ffffff',
            },
        },
        scales: {
            x: {
                ticks: { color: '#dddddd' },
                grid: { color: '#444444' }
            },
            y: {
                ticks: { color: '#dddddd', stepSize: 1 },
                grid: { color: '#444444' }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default ProjectsPerYearBarChart;
