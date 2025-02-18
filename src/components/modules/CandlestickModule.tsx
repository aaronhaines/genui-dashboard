import React, { useState, useEffect } from "react";
import { fetchCandlestickData } from "../../services/dataFetching/candlestickService";

interface CandlestickModuleProps {
  dataSource: string; // Ticker symbol
  title: string;
  timeRange?: string;
  additionalConfig?: {
    showVolume?: boolean;
    showIndicators?: string[];
    timeframe?: string;
  };
}

const CandlestickModule: React.FC<CandlestickModuleProps> = ({
  dataSource,
  title,
  timeRange,
  additionalConfig,
}) => {
  const [candlestickData, setCandlestickData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchCandlestickData(
          dataSource,
          timeRange,
          additionalConfig
        );
        setCandlestickData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch candlestick data");
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

  if (!candlestickData) {
    return <div>No data available for {title}.</div>;
  }

  return (
    <div>
      <h3>{title}</h3>
      {/* Display the candlestick chart here */}
      <pre>{JSON.stringify(candlestickData, null, 2)}</pre>
    </div>
  );
};

export default CandlestickModule;
