import React, { useState, useEffect } from "react";
import { fetchHeatmapData } from "../../services/dataFetching/heatmapService";

interface HeatmapModuleProps {
  dataSource: string; // Ticker symbols (e.g., "AAPL,MSFT,GOOG")
  title: string;
  timeRange?: string;
  additionalConfig?: {
    colorScheme?: string;
    metric?: string;
    normalized?: boolean;
    showLegend?: boolean;
  };
}

const HeatmapModule: React.FC<HeatmapModuleProps> = ({
  dataSource,
  title,
  timeRange,
  additionalConfig,
}) => {
  const [heatmapData, setHeatmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchHeatmapData(
          dataSource,
          timeRange,
          additionalConfig
        );
        setHeatmapData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch heatmap data");
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

  if (!heatmapData) {
    return <div>No data available for {title}.</div>;
  }

  return (
    <div>
      <h3>{title}</h3>
      {/* Display the heatmap chart here */}
      <pre>{JSON.stringify(heatmapData, null, 2)}</pre>
    </div>
  );
};

export default HeatmapModule;
