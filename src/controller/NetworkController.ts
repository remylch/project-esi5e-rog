import { Status, Topology } from "../models/enum";
import Network from "../models/Network";
import Router from "../models/Router";
//import { GraphType } from "../models/types/types";

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
    const name: string = `Router-${i}`;
    const newRouter = new Router(i, name, Status.SERVER_UP, []);
    routerCollection.push(newRouter);
  }
  //set connected router randomly
  for (var r in routerCollection) {
    var actualRouter: Router | undefined = routerCollection.find(
      (rf) => rf.getId() === parseInt(r),
    );
    //create a list without actual router
    const collectionWithoutR: Router[] = routerCollection.filter(
      (rm) =>
        rm.getName() !==
        routerCollection.find((rf) => rf.getId() === parseInt(r))!.getName(),
    );
    //len of new collection
    const lenNewCollection: number = collectionWithoutR.length;
    //nb of connection the router will have
    let randomNbConnexion = Math.random() * (lenNewCollection - 0) + 0;
    for (let i = 0; i < randomNbConnexion; i++) {
      //get random element of routerCollection
      let randomRouter = Math.floor(Math.random() * (lenNewCollection - 0) + 0);
      let randomPonderation = Math.floor(Math.random() * (100 - 0) + 0);
      collectionWithoutR[randomRouter].setPonderation(randomPonderation);
      actualRouter!.addConnectedRouter(collectionWithoutR[randomRouter]);
      //remove router added from the collection to avoid multiple connection with same router
      collectionWithoutR.filter(
        (rf) => rf.getId() !== collectionWithoutR[randomRouter].getId(),
      );
    }
  }
  console.log("final collection ", routerCollection);
  return new Network(routerCollection, undefined, topology); //algo undefined for now
};

export { initNetwork };
