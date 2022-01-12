import { d3Link, d3Node, TypeDataForDjikstra } from "../../models/types/types";

const utils = {
  print(map) {
    for (let [key, value] of map) {
      console.log(key, value);
    }
  },
};

const djisktra = (graph: TypeDataForDjikstra, start: string): any => {
  console.log("Djikstra is running...");
  //utils.print(graph);

  let distances = {};
  let visited: Set<string> = new Set();
  let total_distance: number = 0;
  let nbRouter: number = 0;

  for (let key of graph.keys()) {
    if (key !== start) {
      //set all other distances to Infinity
      distances[key] = Infinity;
      nbRouter += 1;
    } else {
      //set start distance to 0
      distances[key] = 0;
      visited.add(key); //add the started node to visited nodes
      nbRouter += 1;
    }
  }

  //TODO:
  //if node has not been visited
  /*
  pour chaque visited node on prendre les enfant, si distance[visitedNode] + child.weight < distances[child] 
  on remplace distances[child] par distances[visitedNode] + child.weight
  */

  //tant que tous les noeuds n'ont pas été visité
  //while (visited.size !== nbRouter) {

  //calculate distance between current node and its children
  //loop through visited node to get their child and loop over them to get to possible next child
  visited.forEach((visitedNode) => {
    graph.get(visitedNode).forEach((child) => {
      const { id, weight } = child; // destructure child to get his properties
      //if (!visited.has(id)) {
      // if child dont have been already visited
      /*
        if (distances[id] > weight + total_distance) {
          distances[id] = weight + total_distance;
          //total_distance += weight;
          tempListToAdd.delete(id);
          tempListToAdd.add(id);
        }
        //}
        */
      const x = distances[visitedNode] + weight;
      if (x < distances[id]) {
        distances[id] = x;
        visited.add(id);
      }
    });
    console.log(distances);
  });
};

export const setupDataForDjikstra = (
  nodes: d3Node[],
  links: d3Link[],
): TypeDataForDjikstra => {
  const dataMapped = new Map();
  nodes.forEach((node: d3Node) => dataMapped.set(node.id, []));
  links.forEach((link: d3Link) => {
    addEdge(dataMapped, link.source, link.target, link.weight);
  });
  return dataMapped;
};

const addEdge = (
  map: TypeDataForDjikstra,
  origin: string,
  destination: string,
  weight: number,
) => {
  map.get(origin).push({ weight: weight, id: destination });
  //map.get(destination).push({ weight: weight, id: origin });
};

export default djisktra;
