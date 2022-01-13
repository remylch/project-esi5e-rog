import {
  d3Link,
  d3Node,
  GraphType,
  TypeDataForDjikstra,
} from "../../models/types/types";

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
  graphToUpdate: GraphType,
): { distanceTotal: number; path: string[]; updatedGraph: GraphType } => {
  //utils.print(graph);

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
  let valueToFind: string = end;
  getRouterOfPath(valueToFind, path, finalPath, start);

  graphToUpdate.links.forEach((link: any) => {
    const { source, target } = link;
    if (finalPath.includes(source.id) && finalPath.includes(target.id)) {
      link.color = "red";
    }
  });

  //return object of graph type with link colored for the shortest path
  return {
    distanceTotal: distances[end],
    path: finalPath.reverse(),
    updatedGraph: graphToUpdate,
  };
};

function getRouterOfPath(
  valueToFind: string,
  path: {},
  finalPath: string[],
  start: string,
) {
  for (let item in path) {
    if (valueToFind === start) return;
    //loop over properties of js object
    if (Object.prototype.hasOwnProperty.call(path, item)) {
      if (valueToFind === item) {
        finalPath.push(path[valueToFind]);
        getRouterOfPath(path[valueToFind], path, finalPath, start);
      }
    }
  }
}

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
