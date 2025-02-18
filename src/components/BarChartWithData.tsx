import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";

interface BarChartWithDataProps {
  dataSource: string; // URL to fetch data from
}

const BarChartWithData: React.FC<BarChartWithDataProps> = ({ dataSource }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock API call
    const fetchData = async () => {
      try {
        // Simulating an API call with a timeout
        const response = await new Promise<{
          labels: string[];
          values: number[];
          label: string;
          backgroundColor: string[];
        }>((resolve) => {
          setTimeout(() => {
            resolve({
              labels: ["January", "February", "March", "April", "May"],
              values: [65, 59, 80, 81, 56],
              label: "Sales",
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
            });
          }, 1000); // Simulate a 1 second delay
        });

        setData(response);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <BarChart
      data={{
        labels: data.labels,
        datasets: [
          {
            label: data.label,
            data: data.values,
            backgroundColor: data.backgroundColor,
          },
        ],
      }}
    />
  );
};

export default BarChartWithData;
