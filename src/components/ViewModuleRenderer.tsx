import React from "react";
import LineChartWithData from "./LineChartWithData";
import BarChartWithData from "./BarChartWithData";
import DataTableWithData from "./DataTableWithData";
import Metrics from "./Metrics";
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
      return <DataTableWithData dataSource={module.config.dataSource} />;
    case "metrics":
      return <Metrics metrics={module.config.metrics} />;
    default:
      return <div>Unknown module type</div>;
  }
};

export default ViewModuleRenderer;
