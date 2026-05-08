import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";

// Registrar escalas y elementos
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>No hay datos para mostrar.</Typography>
      </Paper>
    );
  }

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Precio USD",
        data: data.map((d) => d.price),
        borderColor: "#00ff88",
        backgroundColor: "rgba(0,255,136,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Evolución de precios" },
    },
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Line data={chartData} options={options} />
    </Paper>
  );
};

export default PriceChart;
