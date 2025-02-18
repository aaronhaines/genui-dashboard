import React from "react";

interface DataTableProps {
  data: {
    columns: string[];
    rows: any[];
  };
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (!data || !data.columns || !data.rows) {
    return <div>No data available</div>; // Handle missing data gracefully
  }

  return (
    <div className="data-table" style={{ overflowX: "auto" }}>
      <h3>Data Table</h3>
      <table>
        <thead>
          <tr>
            {data.columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, index) => (
            <tr key={index}>
              {data.columns.map((col) => (
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
