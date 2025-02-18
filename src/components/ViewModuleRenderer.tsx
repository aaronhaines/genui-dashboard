import React from "react";
import LineChartWithData from "./LineChartWithData";
import BarChartWithData from "./BarChartWithData";
import DataTableWithData from "./DataTableWithData";
import MetricsModule from "./modules/MetricsModule";
import CandlestickModule from "./modules/CandlestickModule";
import HeatmapModule from "./modules/HeatmapModule";
import { ViewModule } from "../types/DashboardTypes";

interface ViewModuleRendererProps {
  module: ViewModule;
}

const ViewModuleRenderer: React.FC<ViewModuleRendererProps> = ({ module }) => {
  switch (module.type) {
    case "lineChart":
      return (
        <LineChartWithData
          dataSource={module.config.dataSource}
          title={module.config.title}
        />
      );
    case "barChart":
      return (
        <BarChartWithData
          dataSource={module.config.dataSource}
          title={module.config.title}
        />
      );
    case "dataTable":
      return (
        <DataTableWithData
          dataSource={module.config.dataSource}
          title={module.config.title} // Make sure this is being passed
        />
      );
    case "metrics":
      return (
        <MetricsModule
          dataSource={module.config.dataSource}
          title={module.config.title}
          timeRange={module.config.timeRange}
          additionalConfig={module.config.additionalConfig}
        />
      );
    case "candlestick":
      return (
        <CandlestickModule
          dataSource={module.config.dataSource}
          title={module.config.title}
          timeRange={module.config.timeRange}
          additionalConfig={module.config.additionalConfig}
        />
      );
    case "heatmap":
      return (
        <HeatmapModule
          dataSource={module.config.dataSource}
          title={module.config.title}
          timeRange={module.config.timeRange}
          additionalConfig={module.config.additionalConfig}
        />
      );
    default:
      return <div>Unknown module type: {module.type}</div>;
  }
};

export default ViewModuleRenderer;
