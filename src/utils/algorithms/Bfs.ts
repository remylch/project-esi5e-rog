import { GraphType, TypeDataForDjikstra } from "../../models/types/types";

export const bfs = (
  graph: TypeDataForDjikstra,
  start: string,
  end: string,
  graphToUpdate: GraphType,
) => {
  let queue: string[] = [start];
  const visited: Set<string> = new Set<string>();
  visited.add(start);

  while (queue.length !== 0) {
    const node = queue.shift(); // take the first element of the array
    const destinations = graph.get(node); // get destinations from the map

    console.log("les destinations : ", destinations);
    destinations.forEach((dest) => {
      console.log("destination to check ", dest.id);
      if (dest.id === end) {
        console.log("finded");
        visited.add(end);
        queue = [];
      }

      if (!visited.has(dest.id)) {
        console.log("should push ", dest.id);
        visited.add(dest.id);
        queue.push(dest.id);
      }
    });
  }

  console.log("visited", visited);
  console.log("trace graph");
  graphToUpdate.links.forEach((link: any) => {
    const { source, target } = link;
    if (visited.has(source.id) && visited.has(target.id)) {
      link.color = "red";
    }
  });

  const path = [];

  visited.forEach((v) => {
    path.push(v);
  });

  //return object of graph type with link colored for the shortest path
  return {
    distanceTotal: visited.entries.length,
    path,
    updatedGraph: graphToUpdate,
  };
};
