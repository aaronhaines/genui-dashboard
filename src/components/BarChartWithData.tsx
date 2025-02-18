import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";

interface BarChartWithDataProps {
  dataSource: string[] | string; // Array of tickers or single ticker
  title: string;
}

const BarChartWithData: React.FC<BarChartWithDataProps> = ({
  dataSource,
  title,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Convert single dataSource to array for consistent handling
        const dataSources = Array.isArray(dataSource)
          ? dataSource
          : [dataSource];

        // Mock fetching data for each ticker
        const responses = await Promise.all(
          dataSources.map(async (source, index) => {
            return new Promise<{
              labels: string[];
              values: number[];
              label: string;
              backgroundColor: string;
            }>((resolve) => {
              setTimeout(() => {
                resolve({
                  labels: ["January", "February", "March", "April", "May"],
                  values: [
                    65 + index * 10,
                    59 + index * 5,
                    80 + index * 8,
                    81 + index * 3,
                    56 + index * 7,
                  ],
                  label: source, // Use ticker as label
                  backgroundColor: `hsla(${index * 137.5}, 70%, 50%, 0.2)`,
                });
              }, 1000);
            });
          })
        );

        // Combine all responses
        setData({
          labels: responses[0].labels,
          datasets: responses.map((response) => ({
            label: response.label,
            data: response.values,
            backgroundColor: response.backgroundColor,
          })),
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

  return (
    <BarChart
      data={{
        labels: data.labels,
        datasets: data.datasets,
      }}
      title={title}
    />
  );
};

export default BarChartWithData;
