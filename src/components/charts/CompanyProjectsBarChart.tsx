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

interface CompanyProjectsBarChartProps {
  timelineData: {
    jobs_history: Array<{
        type: string;
        company: string;
        projects: Array<{
            company: string;
        }>;
    }>;
  };
}

const CompanyProjectsBarChart: React.FC<CompanyProjectsBarChartProps> = ({ timelineData }) => {
    const companyProjects = new Map<string, number>();

    timelineData.jobs_history.forEach(job => {
        if (job.projects) {
            job.projects.forEach(project => {
                const company = project.company;
                if (company) {
                    companyProjects.set(company, (companyProjects.get(company) || 0) + 1);
                }
            });
        }
    });

    const sortedCompanies = [...companyProjects.entries()].sort((a, b) => b[1] - a[1]);

    const labels = sortedCompanies.map(entry => entry[0]);
    const dataValues = sortedCompanies.map(entry => entry[1]);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Number of Projects',
                data: dataValues,
                backgroundColor: 'rgba(153, 102, 255, 0.8)',
                borderColor: 'rgba(153, 102, 255, 1)',
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
                text: 'Projects per Company',
                color: '#ffffff',
            },
        },
        scales: {
            x: {
                ticks: { color: '#dddddd', stepSize: 1 },
                grid: { color: '#444444' }
            },
            y: {
                ticks: { color: '#dddddd', font: { size: 10 } },
                grid: { color: '#444444' }
            }
        }
    };

  return (
    <div className="relative h-96 w-full">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default CompanyProjectsBarChart;
