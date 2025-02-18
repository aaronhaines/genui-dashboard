import React from "react";

const BarChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="bar-chart">
      {/* Render your bar chart here using the data */}
      <h3>Bar Chart</h3>
      {/* Example rendering */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default BarChart;
