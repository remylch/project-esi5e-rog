import { d3Link, d3Node } from "../../models/types/types";

//without ponderation
const djisktra = () => {};

const setupDataForDijkstra = (
  nodes: d3Node[],
  links: d3Link[],
): Map<any, any> => {
  const dataMapped = new Map();
  nodes.forEach((l) => dataMapped.set(l.id, []));
  links.forEach((link) => addEdge(dataMapped, link.source, link.target));
  return dataMapped;
};

const addEdge = (map: Map<any, any>, origin, destination) => {
  map.get(origin).push(destination);
  map.get(destination).push(origin);
};

const djisktra2 = () => {};

export default djisktra;
