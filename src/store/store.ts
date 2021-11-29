import { atom } from "recoil";
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

export const dataForDijkstraState = atom({
  key: "dataForDijkstraState",
  default: {},
});

export const endpointsState = atom<{start: string, end: string}>({
  key: "endpointsState",
  default: {
    start: "",
    end: "",
  },
})

export const routersState = atom<{name: string}[]>({
  key: "routersState",
  default: [],
})
