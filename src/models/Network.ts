import Collection from "./Collection";
import { Topology } from "./enum";
import Router from "./Router";
import { GraphType } from "./types/types";

class Network {
  constructor(
    private routers?: Router[],
    private algorithm?: string,
    private topology?: Topology,
    private graph?: GraphType,
  ) {}

  getRouters(): Router[] {
    return this.routers || [];
  }

  getAlgo(): string | null {
    return this.algorithm || null;
  }

  getTopology(): Topology | null {
    return this.topology || null;
  }

  getGraph(): GraphType | null {
    return this.graph || null;
  }
}

export default Network;
