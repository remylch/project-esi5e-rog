import { Topology } from "../models/enum";

function convertTopology(stringTopology: string): Topology {
  switch (stringTopology) {
    case "Random":
      return Topology.RANDOM;
    case "Tree":
      return Topology.TREE;
    case "Star":
      return Topology.STAR;
    case "Ring":
      return Topology.RING;
    case "Bus à diffusion":
      return Topology.BUS_A_DIFFUSION;
    case "Etoile à diffusion":
      return Topology.ETOILE_A_DIFFUSION;
    default:
      return Topology.RANDOM;
  }
}

export { convertTopology };
