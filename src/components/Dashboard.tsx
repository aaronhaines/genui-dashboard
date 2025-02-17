import React from "react";
import { ViewModule } from "../types/DashboardTypes";
import ViewModuleRenderer from "./ViewModuleRenderer";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface DashboardProps {
  modules: ViewModule[];
  onModulesChange: (modules: ViewModule[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ modules, onModulesChange }) => {
  const onLayoutChange = (layout: any) => {
    const updatedModules = modules.map((module) => {
      const layoutItem = layout.find((item: any) => item.i === module.id);
      if (layoutItem) {
        return {
          ...module,
          position: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          },
        };
      }
      return module;
    });

    onModulesChange(updatedModules);
  };

  return (
    <div className="dashboard" style={{ width: "100%", height: "100%" }}>
      <GridLayout
        className="layout"
        layout={modules.map((m) => ({
          i: m.id,
          x: m.position.x,
          y: m.position.y,
          w: m.position.w,
          h: m.position.h,
          minW: 3,
          minH: 2,
        }))}
        cols={12}
        rowHeight={30}
        width={1200}
        compactType="vertical"
        preventCollision={false}
        onLayoutChange={onLayoutChange}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        isResizable={true}
        isDraggable={true}
      >
        {modules.map((module) => (
          <div key={module.id} className="grid-item">
            <ViewModuleRenderer module={module} />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default Dashboard;
