import Router from "../Router";

export type ConnectedRouterDataType = {
  router: Router;
  ponderation: number;
};

export type d3Node = {
  id: String;
  value: number;
};

export type d3Link = {
  source: string;
  target: string;
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
