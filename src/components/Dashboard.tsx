import React from "react";
import { ViewModule } from "../types/DashboardTypes";
import ViewModuleRenderer from "./ViewModuleRenderer";
import { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps {
  modules: ViewModule[];
  layout: any[]; // Ensure this is defined correctly
}

const Dashboard: React.FC<DashboardProps> = ({ modules, layout }) => {
  return (
    <div className="dashboard" style={{ width: "100%", height: "100%" }}>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        rowHeight={30}
        cols={{ lg: 12 }}
        isResizable={true}
        isDraggable={true}
      >
        {modules.map((module) => (
          <div key={module.id} data-grid={module.position}>
            <ViewModuleRenderer module={module} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
