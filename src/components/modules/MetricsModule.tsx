import React, { useState, useEffect } from "react";
import { fetchMetricsData } from "../../services/dataFetching/metricsService";

interface MetricsModuleProps {
  dataSource: string; // Ticker symbol
  title: string;
  timeRange?: string;
  additionalConfig?: {
    metrics?: string[];
    showChange?: boolean;
    showPrevClose?: boolean;
    decimals?: number;
    colorCoded?: boolean;
  };
}

const MetricsModule: React.FC<MetricsModuleProps> = ({
  dataSource,
  title,
  timeRange,
  additionalConfig,
}) => {
  const [metricsData, setMetricsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchMetricsData(
          dataSource,
          timeRange,
          additionalConfig
        );
        setMetricsData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch metrics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dataSource, timeRange, additionalConfig]);

  if (isLoading) {
    return <div>Loading {title}...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!metricsData) {
    return <div>No data available for {title}.</div>;
  }

  return (
    <div>
      <h3>{title}</h3>
      {/* Display the metrics data here */}
      <pre>{JSON.stringify(metricsData, null, 2)}</pre>
    </div>
  );
};

export default MetricsModule;
