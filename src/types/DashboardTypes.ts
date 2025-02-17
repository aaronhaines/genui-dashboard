export interface ViewModule {
  id: string;
  type: string;
  config: any;
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
