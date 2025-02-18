export interface ViewModule {
  id: string;
  type: string;
  description?: string;
  config: {
    title: string;
    dataSource: string;
    timeRange?: string;
    additionalConfig?: any;
  };
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface DashboardState {
  modules: ViewModule[];
  layout: any;
}

export function createViewModule(module: Omit<ViewModule, "id">): ViewModule {
  return {
    ...module,
    id: crypto.randomUUID(),
  };
}

export interface LLMResponse {
  addModules: ViewModule[];
  removeModules: string[];
  updateModules: {
    id: string;
    config?: Partial<ViewModule["config"]>;
    position?: ViewModule["position"];
  }[];
}
