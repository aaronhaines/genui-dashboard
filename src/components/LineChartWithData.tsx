import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";

interface LineChartWithDataProps {
  dataSource: string[] | string; // Array of tickers or single ticker
  title: string;
}

const LineChartWithData: React.FC<LineChartWithDataProps> = ({
  dataSource,
  title,
}) => {
  console.log("LineChartWithData rendering with dataSource:", dataSource);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      //console.log("fetchData called with dataSource:", dataSource);

      try {
        // Handle both array and comma-separated string formats
        const dataSources = Array.isArray(dataSource)
          ? dataSource
          : dataSource.split(",").map((s) => s.trim());

        //console.log("Processing dataSources:", dataSources); // Debug log

        // Generate more realistic mock data
        const responses = await Promise.all(
          dataSources.map(async (source, index) => {
            return new Promise<{
              labels: string[];
              values: number[];
              label: string;
              borderColor: string;
              backgroundColor: string;
            }>((resolve) => {
              // Generate 30 data points with some randomness but following a trend
              const dataPoints = 30;
              const baseValue = 100 + index * 20; // Different starting point for each ticker
              const labels = Array.from({ length: dataPoints }, (_, i) =>
                new Date(
                  Date.now() - (dataPoints - i) * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              );

              const values = Array.from({ length: dataPoints }, (_, i) => {
                // Create a significantly different trend for each ticker
                const trend = Math.sin(i * 0.2 + index) * 20; // Increased amplitude
                const noise = Math.random() * 5;
                return baseValue + trend + noise;
              });

              resolve({
                labels,
                values,
                label: source,
                borderColor: `hsla(${index * 137.5}, 70%, 50%, 1)`,
                backgroundColor: `hsla(${index * 137.5}, 70%, 50%, 0.2)`,
              });
            });
          })
        );

        //console.log("Responses:", responses);
        const chartData = {
          labels: responses[0].labels,
          datasets: responses.map((response) => ({
            label: response.label,
            data: response.values,
            borderColor: response.borderColor,
            backgroundColor: response.backgroundColor,
            fill: false,
            tension: 0.1,
            borderWidth: 2,
          })),
        };
        //console.log("Chart Data:", chartData);
        setData(chartData);
      } catch (err) {
        console.error("Error in fetchData:", err);
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

  return <LineChart data={data} title={title} />;
};

export default LineChartWithData;
