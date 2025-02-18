import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";

interface DataTableWithDataProps {
  dataSource: string; // URL to fetch data from
}

const DataTableWithData: React.FC<DataTableWithDataProps> = ({
  dataSource,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock API call
    const fetchData = async () => {
      try {
        // Simulating an API call with a timeout
        const response = await new Promise<{ columns: string[]; rows: any[] }>(
          (resolve) => {
            setTimeout(() => {
              resolve({
                columns: ["Name", "Age", "Occupation"],
                rows: [
                  { Name: "Alice", Age: 30, Occupation: "Engineer" },
                  { Name: "Bob", Age: 25, Occupation: "Designer" },
                ],
              });
            }, 1000); // Simulate a 1 second delay
          }
        );

        setData(response);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataSource]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <DataTable data={data} />;
};

export default DataTableWithData;
