import React, { RefObject, useEffect } from "react";
import * as d3 from "d3";
import Router from "../models/Router";
import Network from "../models/Network";

type GraphType = {
  data: Network | undefined;
};

type GraphObjectType = {
  nodes: Router[] | undefined; //list of router
  links: { source: Router; target: Router }[];
};

function Graph({ data }: GraphType) {
  const d3Chart: any = React.useRef();

  useEffect(() => {
    //with data create a graph js object
    if (data) {
      const graphObj: GraphObjectType = {
        nodes: data.getRouters(),
        links: [],
      };

      //create every links and push them into our graph object
      data.getRouters().forEach((r) => {
        r.getConnections().forEach((connexion) => {
          //check if the link already exist in a direction or in an other.
          //If not , create the link and add it
          if (
            graphObj.links.includes({ source: r, target: connexion }) ||
            graphObj.links.includes({ source: connexion, target: r })
          )
            return;
          if (
            r.getStatus() === "SERVER_DOWN" ||
            connexion.getStatus() === "SERVER_DOWN"
          )
            return;

          const link = { source: r, target: connexion };
          graphObj.links.push(link);
        });
      });

      console.log("graph obj ", graphObj);
    }
  });

  return (
    <div className="flex flex-1 w-full bg-green-400" id="d3">
      <svg ref={d3Chart}></svg>
    </div>
  );
}

export default Graph;
