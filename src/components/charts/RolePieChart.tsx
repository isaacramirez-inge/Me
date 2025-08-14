import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface RolePieChartProps {
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

const RolePieChart: React.FC<RolePieChartProps> = ({ timelineData }) => {
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

  const labels = [...roleDurations.keys()];
  const dataValues = [...roleDurations.values()];

  const data = {
    labels,
    datasets: [
      {
        label: 'Months in Role',
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
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
        ],
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
        text: 'Role Distribution (by months)',
        color: '#ffffff',
      },
    },
  };

  return (
    <div className="relative h-96 w-full">
      <Pie data={data} options={options} />
    </div>
  );
};

export default RolePieChart;
