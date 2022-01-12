import { Status, Topology } from "../models/enum";
import Network from "../models/Network";
import Router from "../models/Router";

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

        let counterConnectionAlreadyAssigned = 0;
        //check if some router of the collection already have this router in connection
        collectionWithoutR.forEach((ro) => {
          if (ro.getConnections().includes(actualRouter)) {
            //incr counter
            counterConnectionAlreadyAssigned += 1;
          }
        });

        //len of new collection
        let lenNewCollection: number = collectionWithoutR.length;
        //nb of connection the router will have (min : 1 , max : 4)
        let randomNbConnexion: number = 0;
        //prevent length < 4
        if (lenNewCollection >= 4) {
          randomNbConnexion =
            Math.floor(Math.random() * (4 - 0) + 1) -
            counterConnectionAlreadyAssigned;
        } else {
          randomNbConnexion =
            Math.floor(Math.random() * (2 - 0) + 1) -
            counterConnectionAlreadyAssigned;
        }

        for (let i = 0; i < randomNbConnexion; i++) {
          //get random element of routerCollection
          let randomRouter = Math.floor(
            Math.random() * (lenNewCollection - 0) + 0,
          );
          actualRouter.addConnectedRouter(collectionWithoutR[randomRouter]);
          //remove router added from the collection to avoid multiple connection with same router
          collectionWithoutR = collectionWithoutR.filter(
            (rf) => rf.getId() !== collectionWithoutR[randomRouter].getId(),
          );
          lenNewCollection = lenNewCollection - 1;
        }
      }

      //enable the connexions bi-directionnaly if they are already set in one direction
      routerCollection.forEach((rcItem: Router) => {
        rcItem.getConnections().forEach((connection: Router) => {
          //console.log(`${rcItem.getConnections().includes(connection)} and  ${connection.getConnections().includes(rcItem)}`)
          if (!rcItem.getConnections().includes(connection)) {
            //console.log(`router ${connection.getName()} will be linked with ${actualRouter.getName()}`)
            rcItem.addConnectedRouter(connection);
            //randomNbConnexion -= 1;
          }
          if (!connection.getConnections().includes(rcItem)) {
            connection.addConnectedRouter(rcItem);
          }
        });
      });

      //remove connection to get nbConnexion <= 4 (max)
      routerCollection.forEach((r: Router) => {
        let lenConnexions = r.getConnections().length;
        if (lenConnexions > 4) {
          while (lenConnexions > 4) {
            let randomR =
              r.getConnections()[Math.floor(Math.random() * lenConnexions)];
            if (randomR) {
              if (randomR.getConnections().length > 1) {
                r.removeConnexion(randomR);
                randomR.removeConnexion(r);
                //decrement lenConnexion to avoid out of range
                lenConnexions -= 1;
              }
            }
          }
        }
      });
  }
  return new Network(routerCollection, undefined, topology); //algo undefined for now
};

export { initNetwork };
