import Collection from "./Collection";
import { Topology } from "./enum";
import Router from "./Router";

class Network {
  constructor(
    private routers?: Router[],
    private algorithm?: string,
    private topology?: Topology,
  ) {}

  getRouters(): Router[] | null {
    return this.routers || null;
  }

  getAlgo(): string | null {
    return this.algorithm || null;
  }

  getTopology(): Topology | null {
    return this.topology || null;
  }
}

export default Network;
