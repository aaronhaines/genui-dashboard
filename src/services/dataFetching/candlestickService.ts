export const fetchCandlestickData = async (
  dataSource: string,
  timeRange?: string,
  additionalConfig?: any
): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate some mock candlestick data
      const mockData = Array.from({ length: 20 }, () => ({
        open: Math.random() * 100,
        high: Math.random() * 120,
        low: Math.random() * 80,
        close: Math.random() * 110,
        volume: Math.random() * 1000,
        timestamp: new Date(),
      }));
      resolve(mockData);
    }, 500); // Simulate a 0.5 second delay
  });
};
