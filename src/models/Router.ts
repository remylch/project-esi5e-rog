import Collection from "./Collection";

class Router {
  constructor(
    private name: string,
    private ip: string,
    private connectedRouters?: Collection<Router>,
  ) {}

  canCommunicate(routerToReach: Router): boolean {
    return false;
  }

  getConnections(): Collection<Router> | null {
    return this.connectedRouters || null;
  }

  getName(): string {
    return this.name;
  }

  getIp(): string {
    return this.ip;
  }

  ping(routerToReach: Router): string {
    const value: number = 50;
    return `${value}ms to reach ${routerToReach.getName()}`;
  }
}

export default Router;
