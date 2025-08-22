import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TechnologyTrendLineChartProps {
    technologiesData: Array<{
        id: number;
        category: string;
    }>;
    timelineData: {
        jobs_history: Array<{
            projects: Array<{
                technologies: number[];
                project_role_timeline: Array<{
                    start_date: string;
                }>;
            }>;
        }>;
    };
}

const TechnologyTrendLineChart: React.FC<TechnologyTrendLineChartProps> = ({ technologiesData, timelineData }) => {
    const yearlyCategoryUsage = new Map<number, Map<string, number>>();

    timelineData.jobs_history.forEach(job => {
        if (job.projects) {
            job.projects.forEach(project => {
                if (project.project_role_timeline && project.project_role_timeline.length > 0) {
                    const startDateStr = project.project_role_timeline[0].start_date;
                    const startParts = startDateStr.split('-');
                    let year;

                    if (startParts[0].length === 4) { year = parseInt(startParts[0]); }
                    else if (startParts.length === 3) { year = parseInt(startParts[2]); }
                    else { return; }

                    if (!isNaN(year)) {
                        if (!yearlyCategoryUsage.has(year)) {
                            yearlyCategoryUsage.set(year, new Map());
                        }
                        const categoryUsage = yearlyCategoryUsage.get(year)!;

                        project.technologies.forEach(techId => {
                            const tech = technologiesData.find(t => t.id === techId);
                            if (tech) {
                                categoryUsage.set(tech.category, (categoryUsage.get(tech.category) || 0) + 1);
                            }
                        });
                    }
                }
            });
        }
    });

    const years = [...yearlyCategoryUsage.keys()].sort();
    const categories = [...new Set(technologiesData.map(t => t.category))];

    const colorPalette = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
    ];

    const datasets = categories.map((category, index) => {
        const data = years.map(year => yearlyCategoryUsage.get(year)?.get(category) || 0);
        return {
            label: category,
            data: data,
            fill: false,
            borderColor: colorPalette[index % colorPalette.length],
            tension: 0.1
        };
    }).filter(dataset => dataset.data.some(d => d > 0)); // Only show categories that have been used

    const chartData = {
        labels: years,
        datasets: datasets,
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const, labels: { color: '#ffffff' }},
            title: { display: true, text: 'Technology Category Trends Over Years', color: '#ffffff' },
        },
        scales: {
            x: { ticks: { color: '#dddddd' }, grid: { color: '#444444' } },
            y: { ticks: { color: '#dddddd' }, grid: { color: '#444444' } }
        }
    };

    return (
            <Line data={chartData} options={options} />
    );
};

export default TechnologyTrendLineChart;
