import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fill the container
  };

  return (
    <div
      className="bar-chart"
      style={{ position: "relative", height: "400px", width: "100%" }}
    >
      <h3>Bar Chart</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
