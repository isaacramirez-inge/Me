import React from 'react';
import { Bubble } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface TechnologyHeatmapProps {
    technologiesData: Array<{ id: number; name: string; bg_color: string }>;
    timelineData: {
        jobs_history: Array<{
            projects: Array<{
                project_name: string;
                technologies: number[];
            }>;
        }>;
    };
}

const TechnologyHeatmap: React.FC<TechnologyHeatmapProps> = ({ technologiesData, timelineData }) => {
    const projects = timelineData.jobs_history.flatMap(job => job.projects || []);
    const techMap = new Map(technologiesData.map(t => [t.id, t]));

    const dataPoints: any[] = [];
    projects.forEach((project, pIndex) => {
        project.technologies.forEach(techId => {
            const tech = techMap.get(techId);
            if (tech) {
                dataPoints.push({
                    x: pIndex,
                    y: tech.id,
                    r: 8, // radius
                    techName: tech.name,
                    projectName: project.project_name,
                    bgColor: tech.bg_color
                });
            }
        });
    });

    const chartData = {
        labels: projects.map(p => p.project_name),
        datasets: [{
            label: 'Technology Usage',
            data: dataPoints,
            backgroundColor: dataPoints.map(d => d.bgColor || 'rgba(200, 200, 200, 0.7)'),
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Technology Heatmap per Project', color: '#ffffff' },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const d = context.raw;
                        return `${d.projectName} - ${d.techName}`;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'category' as const,
                labels: projects.map(p => p.project_name),
                ticks: { color: '#dddddd', font: { size: 8 }, maxRotation: 90, minRotation: 45 },
                grid: { color: '#444444' }
            },
            y: {
                type: 'category' as const,
                labels: technologiesData.map(t => t.name),
                ticks: { color: '#dddddd', font: { size: 8 } },
                grid: { color: '#444444' }
            }
        }
    };

    return (
        <div style={{ height: '800px', position: 'relative' }}>
            <Bubble data={chartData} options={options} />
        </div>
    );
};

export default TechnologyHeatmap;
