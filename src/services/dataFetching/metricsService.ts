export const fetchMetricsData = async (
  dataSource: string,
  timeRange?: string,
  additionalConfig?: any
): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        metric1: Math.random() * 100,
        metric2: Math.random() * 50,
        metric3: Math.random() * 200,
      });
    }, 500); // Simulate a 0.5 second delay
  });
};
