import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function ChartCard({ type, labels, data, title }) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        backgroundColor: [
          "#1d2671",
          "#4e54c8",
          "#f5f7ff",
          "#fde2f3",
          "#ff6b6b"
        ],
        borderRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: "top" } }
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: "15px" }}>{title}</h3>
      {type === "bar" ? <Bar data={chartData} options={options} /> : <Doughnut data={chartData} options={options} />}
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  margin: "20px 0"
};