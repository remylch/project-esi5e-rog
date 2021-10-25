import Collection from "../models/Collection";
import Router from "../models/Router";
import { masks, ValuesMask } from "../utils/masks";

/**
 * @description init the routers for a certain mask and topology
 * @param nbRouters
 * @param mask
 * @param topology
 */
const initRouters = (
  nbRouters: number,
  mask: string,
  topology: string,
): Collection<Router> | string => {
  //check mask
  const valueOfMyMask: ValuesMask | undefined = masks.find(
    (item) => item.mask === mask,
  );
  if (typeof valueOfMyMask === "undefined") return "No valid mask provided";
  //check topology and assign ip
  /*
  switch (topology) {
    
  }
  */
  //convert mask and get first value to assign to routers
  const ipPlage = "192.168.0.1";
  //init empty list
  let collection = new Collection<Router>([]);
  //add each router for the network
  for (let i = 1; i < nbRouters; i++) {
    let valuesIp: string[] = ipPlage.split(".");
    valuesIp[valuesIp.length - 1] = i.toString();
    const ipRouter = valuesIp.join(".");
    const name: string = `Router-${i}`;
    const newRouter = new Router(name, ipRouter);
    collection.add(newRouter);
  }

  //return collection of router
  return collection;
};

// Init every topology

const initEtoileADiffusion = (nbRouters: number, mask: string) => {
  const form = "EAD";
  initRouters(nbRouters, mask, form);
};

const initBusADiffusion = (nbRouters: number, mask: string) => {
  const form = "BAD";
  initRouters(nbRouters, mask, form);
};

const initTree = (nbRouters: number, mask: string) => {
  const form = "TREE";
  initRouters(nbRouters, mask, form);
};

const initStar = (nbRouters: number, mask: string) => {
  const form = "STAR";
  initRouters(nbRouters, mask, form);
};

const initRing = (nbRouters: number, mask: string) => {
  const form = "RING";
  initRouters(nbRouters, mask, form);
};

export {
  initRing,
  initStar,
  initTree,
  initBusADiffusion,
  initEtoileADiffusion,
};
