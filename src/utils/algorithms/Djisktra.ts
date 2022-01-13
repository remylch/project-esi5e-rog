import { d3Link, d3Node, TypeDataForDjikstra } from "../../models/types/types";

const utils = {
  print(map) {
    for (let [key, value] of map) {
      console.log(key, value);
    }
  },
};

const djisktra = (
  graph: TypeDataForDjikstra,
  start: string,
  end: string,
): any => {
  console.log("Djikstra is running...");
  utils.print(graph);

  let distances = {};
  let visited: Set<string> = new Set();
  let path = {};

  for (let key of graph.keys()) {
    if (key !== start) {
      //set all other distances to Infinity
      distances[key] = Infinity;
      path[key] = null;
    } else {
      //set start distance to 0
      distances[key] = 0;
      visited.add(key); //add the started node to visited nodes
      path[key] = "Starting point";
    }
  }

  /*
  pour chaque visited node on prendre les enfant, si distance[visitedNode] + child.weight < distances[child] 
  on remplace distances[child] par distances[visitedNode] + child.weight
  */
  visited.forEach((visitedNode) => {
    graph.get(visitedNode).forEach((child) => {
      const { id, weight } = child; // destructure child to get his properties
      const x = distances[visitedNode] + weight;
      if (x < distances[id]) {
        distances[id] = x;
        path[id] = visitedNode;
        visited.add(id);
      }
    });
  });

  //get the shortest path
  const finalPath: string[] = [end];
  let valueToFind = end;
  while (valueToFind !== start) {
    for (let item in path) {
      //loop over properties of js object
      if (Object.prototype.hasOwnProperty.call(path, item)) {
        if (valueToFind === item) {
          console.log("value to find", valueToFind);
          finalPath.push(path[valueToFind]);
          valueToFind = path[valueToFind];
        }
      }
    }
  }

  console.log(finalPath);
  console.log(finalPath.reverse());
  //return object of graph type with link colored for the shortest path
  return {
    distanceTotal: distances[end],
    path,
  };
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
