import React from "react";
import { ViewModule } from "../types/DashboardTypes";
import ViewModuleRenderer from "./ViewModuleRenderer";
import { WidthProvider, Responsive } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDrop } from "react-dnd";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardProps {
  modules: ViewModule[];
  onModulesChange: (modules: ViewModule[]) => void;
  onModuleDrop: (moduleId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  modules,
  onModulesChange,
  onModuleDrop,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "MODULE",
    drop: (item: { id: string }) => {
      console.log("Module dropped:", item.id); // Debug log
      onModuleDrop(item.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="dashboard"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: isOver ? "rgba(0, 0, 0, 0.1)" : "transparent", // Visual feedback
      }}
    >
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: modules.map((m) => ({ ...m.position, i: m.id })) }}
        rowHeight={60}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        isResizable={true}
        isDraggable={true}
        onLayoutChange={(layout) => {
          // Update module positions when layout changes
          const updatedModules = modules.map((module) => ({
            ...module,
            position: layout.find((l) => l.i === module.id) || module.position,
          }));
          onModulesChange(updatedModules);
        }}
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
