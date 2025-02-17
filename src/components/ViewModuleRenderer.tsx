import React from "react";
import { ViewModule } from "../types/DashboardTypes";

interface ViewModuleRendererProps {
  module: ViewModule;
}

const ViewModuleRenderer: React.FC<ViewModuleRendererProps> = ({ module }) => {
  // This is a placeholder - you'll want to implement different visualizations
  // based on module.type
  return (
    <div className="view-module">
      <h3>{module.config.title}</h3>
      <div>Module Type: {module.type}</div>
    </div>
  );
};

export default ViewModuleRenderer;
