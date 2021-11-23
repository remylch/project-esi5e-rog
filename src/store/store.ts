import { atom } from "recoil";
import Network from "../models/Network";

export const networkState = atom({
  key: "networkState",
  default: {},
});

export const counterTest = atom({
  key: "counterTest",
  default: 0,
});
