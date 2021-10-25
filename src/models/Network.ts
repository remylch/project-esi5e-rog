import Collection from "./Collection";
import Router from "./Router";

class Network {
  constructor(
    private routers?: Collection<Router>,
    private algorithm?: string,
    private form?: string,
  ) {}

  getRouters(): Collection<Router> | null {
    return this.routers || null;
  }

  getAlgo(): string | null {
    return this.algorithm || null;
  }

  getForm(): string | null {
    return this.form || null;
  }
}

export default Network;
