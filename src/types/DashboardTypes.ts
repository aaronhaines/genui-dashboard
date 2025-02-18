export interface ViewModule {
  id: string;
  type: string;
  description?: string;
  config: {
    title: string;
    dataSource?: string;
    timeRange?: string;
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
