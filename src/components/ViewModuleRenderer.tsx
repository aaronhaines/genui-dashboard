import React from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import DataTable from "./DataTable";
import Metrics from "./Metrics";
import { ViewModule } from "../types/DashboardTypes";

interface ViewModuleRendererProps {
  module: ViewModule;
}

const ViewModuleRenderer: React.FC<ViewModuleRendererProps> = ({ module }) => {
  switch (module.type) {
    case "lineChart":
      return <LineChart data={module.config.data} />;
    case "barChart":
      return <BarChart data={module.config.data} />;
    case "dataTable":
      return <DataTable data={module.config.data} />;
    case "metrics":
      return <Metrics metrics={module.config.metrics} />;
    default:
      return <div>Unknown module type</div>;
  }
};

export default ViewModuleRenderer;
