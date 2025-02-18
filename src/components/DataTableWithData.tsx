import React, { useState, useMemo } from "react";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { useTheme } from "../context/ThemeContext";

interface DataTableWithDataProps {
  dataSource: string;
  title?: string;
}

const DataTableWithData: React.FC<DataTableWithDataProps> = ({
  dataSource,
  title,
}) => {
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const { isDarkTheme } = useTheme();

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 110,
    },
    {
      field: "open",
      headerName: "Open",
      width: 110,
    },
    {
      field: "high",
      headerName: "High",
      width: 110,
    },
    {
      field: "low",
      headerName: "Low",
      width: 110,
    },
    {
      field: "close",
      headerName: "Close",
      width: 110,
    },
    {
      field: "volume",
      headerName: "Volume",
      width: 130,
    },
    {
      field: "change",
      headerName: "Change %",
      width: 110,
    },
  ];

  // Generate realistic market data for the last 30 days
  const generateMarketData = () => {
    const rows = [];
    let previousClose = 185.75; // Starting price for a tech stock
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Generate realistic price movements
      const volatility = 0.015; // 1.5% daily volatility
      const dayTrend = Math.random() - 0.48; // Slight upward bias
      const change = dayTrend * volatility * previousClose;

      // Generate OHLC prices with realistic relationships
      const open = previousClose + (Math.random() - 0.5) * change;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const range = previousClose * volatility;
      const high = Math.max(open, open + direction * Math.random() * range);
      const low = Math.min(
        open,
        open - Math.abs(direction) * Math.random() * range
      );
      const close = low + Math.random() * (high - low);

      // Calculate daily change percentage
      const dailyChange = ((close - previousClose) / previousClose) * 100;

      // Generate volume with higher values on bigger price moves
      const baseVolume = 5000000;
      const volumeMultiplier = 1 + Math.abs(dailyChange) / 2;
      const volume = Math.floor(
        baseVolume * (0.7 + Math.random() * 0.6) * volumeMultiplier
      );

      rows.push({
        id: 30 - i,
        date: date,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: volume,
        change: Number(dailyChange.toFixed(2)),
      });

      previousClose = close;
    }

    return rows.sort((a, b) => b.date.getTime() - a.date.getTime()); // Most recent first
  };

  // Generate data once and memoize it
  const rows = useMemo(() => {
    const data = generateMarketData();
    console.log("Data being passed to grid:", data);
    return data;
  }, []);

  const darkThemeStyles = {
    "& .MuiDataGrid-root": {
      border: "none",
      color: "#fff",
      backgroundColor: "#121212",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      fontFamily: "monospace",
      color: "#fff",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#121212",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
      color: "#fff",
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#121212",
      color: "#fff",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      color: "#fff",
    },
    "& .MuiDataGrid-row": {
      backgroundColor: "#121212",
      "&:hover": {
        backgroundColor: "#1e1e1e",
      },
      "&.Mui-selected": {
        backgroundColor: "#2e2e2e",
        "&:hover": {
          backgroundColor: "#3e3e3e",
        },
      },
    },
    "& .MuiDataGrid-footerContainer": {
      backgroundColor: "#1e1e1e",
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    },
    "& .MuiTablePagination-root": {
      color: "#fff",
    },
    "& .negative": {
      color: "#ff6b6b",
    },
    "& .positive": {
      color: "#69f0ae",
    },
    "& .MuiDataGrid-columnSeparator": {
      color: "rgba(255, 255, 255, 0.2)",
    },
    "& .MuiDataGrid-menuIcon": {
      color: "#fff",
    },
    "& .MuiDataGrid-sortIcon": {
      color: "#fff",
    },
  };

  const lightThemeStyles = {
    "& .MuiDataGrid-cell": {
      fontFamily: "monospace",
    },
    "& .negative": {
      color: "#d32f2f",
    },
    "& .positive": {
      color: "#2e7d32",
    },
  };

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        backgroundColor: isDarkTheme ? "#121212" : "#fff",
        padding: "16px",
      }}
    >
      {title && (
        <div
          style={{
            marginBottom: "16px",
            fontSize: "18px",
            fontWeight: "bold",
            color: isDarkTheme ? "#fff" : "#000",
          }}
        >
          {title}
        </div>
      )}
      <div style={{ height: "calc(100% - 40px)", width: "100%" }}>
        <DataGrid
          rows={rows.slice(0, 10)}
          columns={columns}
          getRowId={(row) => row.id}
          autoHeight
          hideFooter={true}
          density="compact"
        />
      </div>
    </div>
  );
};

export default DataTableWithData;
