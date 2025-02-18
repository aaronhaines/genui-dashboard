export const fetchHeatmapData = async (
  dataSource: string,
  timeRange?: string,
  additionalConfig?: any
): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate some mock heatmap data
      const mockData = Array.from({ length: 5 }, () =>
        Array.from({ length: 5 }, () => Math.random())
      );
      resolve(mockData);
    }, 500); // Simulate a 0.5 second delay
  });
};
