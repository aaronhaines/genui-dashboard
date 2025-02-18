import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";

interface LineChartWithDataProps {
  dataSource: string; // URL to fetch data from
}

const LineChartWithData: React.FC<LineChartWithDataProps> = ({
  dataSource,
}) => {
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
          borderColor: string;
          backgroundColor: string;
        }>((resolve) => {
          setTimeout(() => {
            resolve({
              labels: ["January", "February", "March", "April", "May"],
              values: [65, 59, 80, 81, 56],
              label: "Sales",
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            });
          }, 1000); // Simulate a 1 second delay
        });

        setData({
          labels: response.labels,
          datasets: [
            {
              label: response.label,
              data: response.values,
              borderColor: response.borderColor,
              backgroundColor: response.backgroundColor,
            },
          ],
        });
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

  return <LineChart data={data} />;
};

export default LineChartWithData;
