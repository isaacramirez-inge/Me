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

interface ExperienceTimelineProps {
  timelineData: {
    jobs_history: Array<{
      type: string;
      company: string;
      job_roles: Array<{
        job_role: string;
        start_date: string;
        end_date: string | null;
      }>;
    }>;
  };
}

const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ timelineData }) => {
  const labels: string[] = [];
  const data: [number, number][] = [];
  const backgroundColors: string[] = [];
  const borderColors: string[] = [];

  const colorPalette = [
    { bg: 'rgba(255, 99, 132, 0.5)', border: 'rgba(255, 99, 132, 1)' },
    { bg: 'rgba(54, 162, 235, 0.5)', border: 'rgba(54, 162, 235, 1)' },
    { bg: 'rgba(255, 206, 86, 0.5)', border: 'rgba(255, 206, 86, 1)' },
    { bg: 'rgba(75, 192, 192, 0.5)', border: 'rgba(75, 192, 192, 1)' },
    { bg: 'rgba(153, 102, 255, 0.5)', border: 'rgba(153, 102, 255, 1)' },
    { bg: 'rgba(255, 159, 64, 0.5)', border: 'rgba(255, 159, 64, 1)' },
  ];
  let colorIndex = 0;

  const jobs = timelineData.jobs_history
    .filter(job => job.type === 'empresa')
    .flatMap(job => job.job_roles.map(role => ({ ...role, company: job.company })))
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  jobs.forEach(job => {
    const startParts = job.start_date.split('-');
    let sDate;
    if (startParts[0].length === 4) { // YYYY-MM-DD
        sDate = new Date(job.start_date);
    } else { // DD-MM-YYYY
        sDate = new Date(parseInt(startParts[2]), parseInt(startParts[1]) - 1, parseInt(startParts[0]));
    }

    let eDate;
    if (job.end_date) {
        const endParts = job.end_date.split('-');
        if (endParts[0].length === 4) { // YYYY-MM-DD
            eDate = new Date(job.end_date);
        } else { // DD-MM-YYYY
            eDate = new Date(parseInt(endParts[2]), parseInt(endParts[1]) - 1, parseInt(endParts[0]));
        }
    } else {
        eDate = new Date(); // now
    }

    if(!sDate.getTime() || !eDate.getTime()) return;

    labels.push(`${job.company} - ${job.job_role}`);
    const startYear = sDate.getFullYear() + sDate.getMonth() / 12;
    const endYear = eDate.getFullYear() + eDate.getMonth() / 12;
    data.push([startYear, endYear]);

    const color = colorPalette[colorIndex % colorPalette.length];
    backgroundColors.push(color.bg);
    borderColors.push(color.border);
    colorIndex++;
  });

  const chartData = {
    labels,
    datasets: [{
      label: 'Experience',
      data,
      backgroundColor: backgroundColors,
      borderColor: borderColors,
      borderWidth: 1,
      barPercentage: 0.6,
    }]
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
        text: 'Experience Timeline (Gantt Chart)',
        color: '#ffffff',
        font: {
          size: 18,
        }
      },
    },
    scales: {
      x: {
        min: 2021,
        ticks: {
          color: '#dddddd',
          stepSize: 1,
        },
        grid: {
          color: '#444444',
        },
      },
      y: {
        ticks: {
          color: '#dddddd',
          font: {
            size: 10,
          }
        },
        grid: {
          color: '#444444',
        },
      }
    }
  };

  return (
    <div style={{ height: `${labels.length * 40}px`, position: 'relative' }}>
        <Bar data={chartData} options={options} />
    </div>
  );
};

export default ExperienceTimeline;
