import { atom, selector } from "recoil";
import Network from "../models/Network";
import { GraphType } from "../models/types/types";

export const networkState = atom({
  key: "networkState",
  default: {},
});

export const counterTest = atom({
  key: "counterTest",
  default: 0,
});

export const algorithmState = atom({
  key: "algorithState",
  default: { algo: "", r1: "", r2: "" },
});

export const routersState = atom({
  key: "routersState",
  default: [],
});

export const routersAvailableInStore = selector({
  key: "routersAvailableInStore",
  get: ({ get }) => {
    const routers = get(routersState);
    return routers;
  },
});
