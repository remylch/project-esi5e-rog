import { ConnectedRouterDataType } from "../models/types/types";
import { Status } from "./enum";

class Router {
  constructor(
    private id: number,
    private name: string,
    private status: Status,
    private connectedRouters: Map<string, ConnectedRouterDataType>, // connection : <RouterName,Ponderation to reach it>
  ) {}

  canCommunicate(routerToReach: Router): boolean {
    return false;
  }

  getConnections(): Map<string, ConnectedRouterDataType> | null {
    return this.connectedRouters || null;
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  ping(routerToReach: Router): string {
    const value: number = 50;
    return `${value}ms to reach ${routerToReach.getName()}`;
  }

  getStatus(): Status {
    return this.status;
  }

  addConnectedRouter(router: Router, ponderation: number): void {
    this.connectedRouters.set(router.getName(), { router, ponderation });
  }
}

export default Router;
