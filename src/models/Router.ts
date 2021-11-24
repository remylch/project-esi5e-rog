import { Status } from "./enum";

class Router {
  constructor(
    private id: number,
    private name: string,
    private status: Status,
    private connectedRouters: Router[], // connection : <RouterName,Ponderation to reach it>
  ) {}

  canCommunicate(routerToReach: Router): boolean {
    return this.connectedRouters.includes(routerToReach);
  }

  getConnections(): Router[] {
    return this.connectedRouters;
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

  getStatus(): String {
    return this.status.toString();
  }

  changeStatus(): void {
    switch (this.status) {
      case Status.SERVER_UP:
        this.status = Status.SERVER_DOWN;
        break;
      case Status.SERVER_DOWN:
        this.status = Status.SERVER_UP;
        break;
    }
  }

  getNbConnectedRouters(): number {
    return this.connectedRouters.length;
  }

  addConnectedRouter(router: Router): void {
    this.connectedRouters.push(router);
  }
  /*
  //Ponderation
  setPonderation(ponderation: number): void {
    this.ponderation = ponderation;
  }

  getPonderation(): number {
    if (this.ponderation === undefined) return 0;
    else return this.ponderation;
  }
  */
}

export default Router;
