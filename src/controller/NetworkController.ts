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

  //INIT ROUTERS FOR PROVIDED TOPOLOGY
  switch (topology) {
    case Topology.BUS_A_DIFFUSION:
      break;
    case Topology.ETOILE_A_DIFFUSION:
      break;
    case Topology.RING:
      for (let r in routerCollection) {
        console.log("r :", r);
        const actualRouter: Router | undefined = routerCollection.find(
          (rf) => rf.getId() === parseInt(r),
        );
        console.log("actual router : ", actualRouter);
        //check if next router exists
        const routerToFind: Router | undefined = routerCollection.find(
          (rf) => rf.getName() === `Router-${parseInt(r) + 1}`,
        );
        if (routerToFind) {
          actualRouter.addConnectedRouter(routerToFind);
        } else {
          //get first router of the network
          const firstRouter = routerCollection.find(
            (fr) => fr.getName() === "Router-0",
          );
          actualRouter.addConnectedRouter(firstRouter);
        }
      }
      break;
    case Topology.TREE:
      break;
    case Topology.RANDOM:
      //set connected router randomly
      for (let r in routerCollection) {
        let actualRouter: Router | undefined = routerCollection.find(
          (rf) => rf.getId() === parseInt(r),
        );
        //create a list without actual router
        let collectionWithoutR: Router[] = routerCollection.filter(
          (rm) =>
            rm.getName() !==
            routerCollection
              .find((rf) => rf.getId() === parseInt(r))!
              .getName(),
        );

        //len of new collection
        let lenNewCollection: number = collectionWithoutR.length;
        //nb of connection the router will have
        let randomNbConnexion = Math.floor(
          Math.random() * (lenNewCollection - 0) + 0,
        );
        console.log(`Router${r} will have ${randomNbConnexion} connexions`);
        //TODO: check OTHER ROUTER CONNEXION => IF OTHER.CONNECTEDROUTER.INCLUDE THIS.R.GETNAME => ADD ROUTER TO the connexion of this.R
        for (let i = 0; i < randomNbConnexion; i++) {
          //get random element of routerCollection
          let randomRouter = Math.floor(
            Math.random() * (lenNewCollection - 0) + 0,
          );
          //setup random ponderation
          let randomPonderation = Math.floor(Math.random() * (100 - 0) + 0);

          //BUG:
          collectionWithoutR[randomRouter].setPonderation(randomPonderation);
          actualRouter.addConnectedRouter(collectionWithoutR[randomRouter]);
          //remove router added from the collection to avoid multiple connection with same router
          collectionWithoutR = collectionWithoutR.filter(
            (rf) => rf.getId() !== collectionWithoutR[randomRouter].getId(),
          );
          console.log(
            `Toutes mes connexions : ${actualRouter.getConnections()} `,
          );
          lenNewCollection = lenNewCollection - 1;
        }
      }
  }
  return new Network(routerCollection, undefined, topology); //algo undefined for now
};

export { initNetwork };
