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

// mode: 'perToken' | 'total'
// 기본: tradePrice 그대로 사용 (총 거래 금액)
function SalesChart({ tradeHistory, mode = "total" }) {
  const safeArray = Array.isArray(tradeHistory)
    ? tradeHistory
    : Array.isArray(tradeHistory?.data)
    ? tradeHistory.data
    : [];

  const rawPoints = safeArray.filter(
    (t) =>
      t &&
      isFinite(t.tradePrice) &&
      (mode === "total" || (isFinite(t.tokenQuantity) && Number(t.tokenQuantity) > 0))
  );

  const values =
    mode === "perToken"
      ? rawPoints.map((t) => Number(t.tradePrice) / Number(t.tokenQuantity))
      : rawPoints.map((t) => Number(t.tradePrice));

  const labels = rawPoints.map(
    (t, i) => t.tradeTime || t.time || t.createdAt || `${i + 1}`
  );

  const maxVal = values.length ? Math.max(...values) : 0;
  const stepSize = (() => {
    if (maxVal <= 10) return 1;
    if (maxVal <= 50) return 5;
    if (maxVal <= 100) return 10;
    const pow = Math.pow(10, Math.floor(Math.log10(maxVal)));
    const scaled = maxVal / pow;
    if (scaled <= 2) return pow / 5;
    if (scaled <= 5) return pow / 2;
    return pow;
  })();

  const data = {
    labels,
    datasets: [
      {
        label: mode === "perToken" ? "1토큰 가격" : "거래 금액",
        data: values,
        borderColor: "#fc0101",
        backgroundColor: "rgba(236,0,0,0.2)",
        tension: 0.25,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: "#fc0101",
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          title: () => "",
          label: (ctx) => `₩ ${ctx.parsed.y.toLocaleString()}`,
        },
      },
      legend: { display: false },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize,
          callback: (v) => `₩${v.toLocaleString()}`,
        },
        grid: { color: "#eee" },
      },
    },
  };

  if (!values.length) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-sm text-neutral-400 border rounded-lg">
        거래 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      <Line data={data} options={options} />
    </div>
  );
}

export default SalesChart;