import { d3Link, d3Node } from "../../models/types/types";

//Dijkstra
export const djisktra = () => {};

export const setupDataForDijkstra = (
  nodes: d3Node[],
  links: d3Link[],
): Map<any, any> => {
  const dataMapped = new Map();
  nodes.forEach((l) => dataMapped.set(l.id, new Set()));
  links.forEach((link) => {
  addEdge(dataMapped, link.source, link.target)});
  return dataMapped;
};

const addEdge = (map: Map<any, any>, origin, destination) => {
  map.get(origin).push(destination);
  map.get(destination).push(origin);
};

// Dijkstra V2 without ponderation

export const setupDataForDijkstraV2 = (
  nodes: d3Node[],
  links: d3Link[],
): Map<any, any> => {
  const dataMapped = new Map();
  nodes.forEach((l) => dataMapped.set(l.id, new Set()));
  links.forEach((link) => {
  addEdgeV2(dataMapped, link.source, link.target)});
  return dataMapped;
};

const addEdgeV2 = (map: Map<any, Set<any>>, origin, destination) => {
  map.get(origin).add(destination);
  map.get(destination).add(origin);
};

export const djisktra2 = (graph : Map<any, Set<any>>) => {
  
};

export default djisktra;
