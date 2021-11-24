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
