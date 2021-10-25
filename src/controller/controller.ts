import Collection from "../models/Collection";
import Router from "../models/Router";
import { masks, ValuesMask } from "../utils/masks";

const initNetwork = (nbRouters: number, mask: string, form: string) => {
  switch (form) {
    case "Etoile a diffusion":
      initEtoileADiffusion(nbRouters, mask);
      break;
    case "Bus a diffusion":
      initBusADiffusion(nbRouters, mask);
      break;
    default:
      console.log("No form reconized provided");
      break;
  }
};

const initRouters = (
  nbRouters: number,
  mask: string,
  form: string,
): Collection<Router> | string => {
  //check mask
  const valueOfMyMask: ValuesMask | undefined = masks.find(
    (item) => item.mask === mask,
  );
  if (typeof valueOfMyMask === "undefined") return "No valid mask provided";
  //check form
  switch (form) {
  }
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

const initEtoileADiffusion = (nbRouters: number, mask: string) => {
  const form = "EAD";
  initRouters(nbRouters, mask, form);
};

const initBusADiffusion = (nbRouters: number, mask: string) => {
  const form = "BAD";
  initRouters(nbRouters, mask, form);
};

export { initNetwork };
