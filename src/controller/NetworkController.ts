import { Status, Topology } from "../models/enum";
import Network from "../models/Network";
import Router from "../models/Router";
import { ConnectedRouterDataType } from "../models/types/types";

/**
 * @description Init the full network
 * @param nbRouter
 * @param topology
 */
const initNetwork = (nbRouter: number, topology: Topology) => {
  //init empty list
  let routerCollection: Router[] = [];
  //add each router for the network
  for (let i = 0; i < nbRouter; i++) {
    /*
        let valuesIp: string[] = first_IP.split(".");
        valuesIp[valuesIp.length - 1] = i.toString();
        const ipRouter = valuesIp.join(".");
        */
    const name: string = `Router-${i}`;
    const newRouter = new Router(
      i,
      name,
      Status.SERVER_UP,
      new Map<string, ConnectedRouterDataType>(),
    );
    routerCollection.push(newRouter);
  }
  //INIT ROUTERS FOR PROVIDED TOPOLOGY
  switch (topology) {
    case Topology.BUS_A_DIFFUSION:
      break;
    case Topology.ETOILE_A_DIFFUSION:
      break;
    case Topology.RING:
      break;
    case Topology.TREE:
      break;
    case Topology.RANDOM:
      //set connected router randomly

      for (var r in routerCollection) {
        var actualRouter: Router | undefined = routerCollection.find(
          (rf) => rf.getId() === parseInt(r),
        );
        //create a list without actual router
        const collectionWithoutR: Router[] = routerCollection.filter(
          (rm) =>
            rm.getName() !==
            routerCollection
              .find((rf) => rf.getId() === parseInt(r))!
              .getName(),
        );
        //len of new collection
        const lenNewCollection: number = collectionWithoutR.length;
        //nb of connection the router will have
        let randomNbConnexion = Math.random() * (lenNewCollection - 0) + 0;
        for (let i = 0; i < randomNbConnexion; i++) {
          //get random element of routerCollection
          let randomRouter = Math.floor(
            Math.random() * (lenNewCollection - 0) + 0,
          );
          let randomPonderation = Math.floor(Math.random() * (100 - 0) + 0);
          actualRouter!.addConnectedRouter(
            collectionWithoutR[randomRouter],
            randomPonderation,
          );
          //remove router added from the collection to avoid multiple connection with same router
          collectionWithoutR.filter(
            (rf) => rf.getId() !== collectionWithoutR[randomRouter].getId(),
          );
        }
      }
      console.log("final collection ", routerCollection);
      break;
  }

  return new Network(routerCollection, undefined, topology); //algo undefined for now
};

export { initNetwork };
