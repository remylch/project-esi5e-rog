import Router from "../Router";

export type TypeDataForDjikstra = Map<string, { id: string; weight: number }[]>;

export type ConnectedRouterDataType = {
  router: Router;
  ponderation: number;
};

export type d3Node = {
  id: string;
  //for client graph
  /**
   * Node’s zero-based index into nodes array. This property is set during the initialization process of a simulation.
   */
  index?: number | undefined;
  /**
   * Node’s current x-position
   */
  x?: number | undefined;
  /**
   * Node’s current y-position
   */
  y?: number | undefined;
  /**
   * Node’s current x-velocity
   */
  vx?: number | undefined;
  /**
   * Node’s current y-velocity
   */
  vy?: number | undefined;
  /**
   * Node’s fixed x-position (if position was fixed)
   */
  fx?: number | null | undefined;
  /**
   * Node’s fixed y-position (if position was fixed)
   */
  fy?: number | null | undefined;
};

export type d3Link = {
  source: string;
  target: string;
  weight?: number;
  color?: string;
  //for client graph
  /**
   * Node’s zero-based index into nodes array. This property is set during the initialization process of a simulation.
   */
  index?: number | undefined;
  /**
   * Node’s current x-position
   */
  x?: number | undefined;
  /**
   * Node’s current y-position
   */
  y?: number | undefined;
  /**
   * Node’s current x-velocity
   */
  vx?: number | undefined;
  /**
   * Node’s current y-velocity
   */
  vy?: number | undefined;
  /**
   * Node’s fixed x-position (if position was fixed)
   */
  fx?: number | null | undefined;
  /**
   * Node’s fixed y-position (if position was fixed)
   */
  fy?: number | null | undefined;
};

export type GraphType = {
  nodes: d3Node[];
  links: d3Link[];
};

export type point = {
  x: number;
  y: number;
};

export type datum = {
  x: number;
  y: number;
  fx: number | null;
  fy: number | null;
};
