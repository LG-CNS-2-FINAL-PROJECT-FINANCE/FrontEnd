import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const data = {
  labels: ["Jan", "Feb", "Mar", "May", "June", "Aug"],
  datasets: [
    {
      label: "sale",
      data: [10, 95, 88, 90, 65, 90],
      borderColor: "#0f766e", // teal-700
      backgroundColor: "#0f766e",
      tension: 0.3, // 곡선 형태
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.parsed.y}`;
        },
      },
    },
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 25,
      },
    },
  },
};

function SalesChart() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg ">
      <Line data={data} options={options} />
    </div>
  );
}

export default SalesChart;
