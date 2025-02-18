import React from "react";

const Metrics: React.FC<{ metrics: any }> = ({ metrics }) => {
  return (
    <div className="metrics">
      <h3>Metrics</h3>
      <ul>
        {Object.entries(metrics).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Metrics;
