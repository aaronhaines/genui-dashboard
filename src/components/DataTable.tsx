import React from "react";

const DataTable: React.FC<{ data: any }> = ({ data }) => {
  if (!data || !data.columns || !data.rows) {
    return <div>No data available</div>; // Handle missing data gracefully
  }

  return (
    <div className="data-table">
      <h3>Data Table</h3>
      <table>
        <thead>
          <tr>
            {data.columns.map((col: string, index: number) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: any, index: number) => (
            <tr key={index}>
              {data.columns.map((col: string) => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
