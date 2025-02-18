import React from "react";

const LineChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="line-chart">
      {/* Render your line chart here using the data */}
      <h3>Line Chart</h3>
      {/* Example rendering */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default LineChart;
