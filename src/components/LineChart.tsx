import React from "react";
import { Line } from "react-chartjs-2";
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

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to fill the container
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 40, // Add space at the bottom for the axis
        left: 20,
      },
    },
  };

  return (
    <div
      className="line-chart"
      style={{ position: "relative", height: "100%", width: "100%" }}
    >
      <h3>Line Chart</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
