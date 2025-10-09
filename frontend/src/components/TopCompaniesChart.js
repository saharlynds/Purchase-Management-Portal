import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TopCompaniesChart({ data }) {
  const chartData = {
    labels: data.map(item => item.company_name),
    datasets: [
      {
        label: 'مجموع مبلغ خرید',
        data: data.map(item => item.total_amount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'برترین شرکت‌ها بر اساس مبلغ خرید',
        font: {
          size: 16
        }
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}

export default TopCompaniesChart;