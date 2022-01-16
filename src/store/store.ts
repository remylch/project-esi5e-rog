import { atom, selector } from "recoil";
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

export const dataForAlgorithm = atom<GraphType>({
  key: "dataForAlgorithm",
  default: { nodes: [], links: [] },
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

// result

export const resultAlgo = atom<string[]>({
  key: "resultAlgo",
  default: [],
});

export const isOpenModalResultState = atom<boolean>({
  key: "isOpenModalResultState",
  default: false,
});

//modal client graph

export const isOpenModalClientGraph = atom<boolean>({
  key: "isOpenModalClientGraph",
  default: false,
});

export const clientProperGraph = atom<GraphType>({
  key: "clientProperGraph",
  default: {
    links: [],
    nodes: [],
  },
});
